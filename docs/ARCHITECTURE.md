# zkVVM Architecture - EVVM Integration

**Last Updated:** February 21, 2026
**Version:** feat/evvm-integration

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Bearer Note Model](#bearer-note-model)
3. [Gasless Transaction Flow](#gasless-transaction-flow)
4. [Components](#components)
5. [Deposit Flow](#deposit-flow)
6. [Withdraw Flow](#withdraw-flow)
7. [Security Model](#security-model)
8. [Network Topology](#network-topology)

---

## System Overview

zkVVM is a **privacy-preserving payment protocol** that combines:

- **Zero-Knowledge Proofs** (Noir circuits) for privacy
- **EVVM Protocol** for gasless user experience
- **Merkle Trees** for efficient state commitment
- **Bearer Notes** for digital cash semantics

```
┌─────────────┐
│   User      │
│ (Browser)   │
└──────┬──────┘
       │ Signs EIP-191 messages (no gas)
       │
       ▼
┌─────────────────┐
│    Frontend     │
│ (React + WASM)  │
│  - Generates ZK │
│  - Creates      │
│    SignedActions│
└──────┬──────────┘
       │ HTTP POST /execute
       │
       ▼
┌─────────────────┐
│     Fisher      │
│   (Relayer)     │
│  - Executes txs │
│  - Pays gas     │
└──────┬──────────┘
       │ Blockchain transaction
       │
       ▼
┌─────────────────────────┐
│  zkVVM.sol + EVVM Core  │
│  - Validates signatures │
│  - Verifies ZK proofs   │
│  - Updates Merkle tree  │
└─────────────────────────┘
```

---

## Bearer Note Model

### What is a Bearer Note?

A **bearer note** is a cryptographic representation of value that grants ownership to whoever holds the secret.

**Properties:**
- 🔑 **Secret Ownership:** Knowing `secret` + `salt` = control of funds
- 💸 **No On-Chain Identity:** No addresses, no accounts
- 🎭 **Full Privacy:** No transaction graph
- 📝 **Transferable:** Share the note string = transfer value

### Note Generation

**Input (User):**
- `value`: Amount in wei (e.g., 1000000 = 1 USDC)
- `secret`: 32-byte random secret (generated in browser)
- `salt`: 32-byte random salt (generated in browser)

**Circuit: `note_generator.nr`**

```noir
fn main(value: Field, pk_b: Field, random: Field) -> (Field, Field, Field, Field) {
    let nullifier = poseidon2([pk_b, random]);
    let commitment = poseidon2([value, nullifier]);
    let entry = poseidon2([
        poseidon2([value, pk_b]),
        poseidon2([random, nullifier])
    ]);
    let root = compute_merkle_root(entry);

    return (nullifier, commitment, entry, root);
}
```

**Output:**
- `nullifier`: Unique identifier for spending (keccak256 in some variants)
- `commitment`: Public commitment to value (stored on-chain)
- `entry`: Merkle tree leaf
- `root`: Merkle tree root (for single-leaf tree)

**Note String Format:**
```
zk-<value>-<secret_hex>-<salt_hex>
```

Example:
```
zk-1000000-0xabc123...-0xdef456...
```

### Privacy Guarantees

**What is Hidden:**
- ✅ Depositor address
- ✅ Withdrawal recipient
- ✅ Amount (encrypted in ciphertext)
- ✅ Timing correlation (via Fisher batching - future)

**What is Public:**
- ⚠️ Commitment (but doesn't reveal value/owner)
- ⚠️ Nullifier (but doesn't link to commitment)
- ⚠️ Merkle root updates (but doesn't reveal which commitment)

---

## Gasless Transaction Flow

### Traditional Flow (Main Branch)

```
User → Wallet → Blockchain (pays gas) → Contract
```

**Problems:**
- User needs ETH for gas
- Each tx costs ~$2-5 on mainnet
- Poor UX for newcomers

### EVVM Gasless Flow

```
User → Signs message → Fisher → Executes on-chain (pays gas) → Contract
```

**Benefits:**
- ✅ User pays 0 gas
- ✅ Only needs to sign messages (EIP-191)
- ✅ Fisher gets MATE rewards (EVVM incentive token)
- ✅ Better onboarding UX

**Trade-off:**
- Requires trusted Fisher (can censor)
- Fisher downtime = no transactions
- Additional latency (~500ms HTTP roundtrip)

---

## Components

### 1. zkVVM.sol (Smart Contract)

**Location:** `packages/contracts/zkVVM.sol`

**Inherits:** `EvvmService` (from `@evvm/testnet-contracts`)

**State:**

```solidity
mapping(bytes => bool) public commitments;        // Prevent reuse
mapping(bytes32 => bool) public merkleRoots;      // Valid Merkle roots
mapping(bytes32 => bool) public nullifiers;       // Spent nullifiers
bytes32 public currentRoot;                       // Latest Merkle root
```

**Key Functions:**

#### `deposit()`

```solidity
function deposit(
    address user,
    bytes memory commitment,
    uint256 amount,
    address originExecutor,        // Fisher address
    uint256 nonce,                 // zkVVM nonce
    bytes calldata signature,      // User signature
    uint256 priorityFeePay,        // EVVM pay priority fee
    uint256 noncePay,              // EVVM pay nonce
    bytes calldata signaturePay,   // User signature for pay
    bytes32 expectedNextRoot       // Expected root after deposit
) external payable returns (bytes32)
```

**Logic:**
1. Validate zkVVM signature (user authorized deposit)
2. Validate EVVM pay signature (user authorized payment)
3. Check commitment not already used
4. Process payment via `Core.pay()`
5. Store commitment
6. Update Merkle root (if provided)
7. Emit `Deposited` event

#### `withdraw()`

```solidity
function withdraw(
    address user,
    address recipient,
    bytes calldata proof,              // ZK proof
    bytes32 expectedRoot,              // Root used in proof
    bytes32[] calldata publicInputs,   // [nullifier, proof_len, root, recipient, commitment]
    bytes calldata ciphertext,         // Encrypted amount
    address originExecutor,            // Fisher
    uint256 nonce,                     // zkVVM nonce
    bytes calldata signature           // User signature
) external payable returns (bool)
```

**Logic:**
1. Validate zkVVM signature
2. Validate Merkle root is registered
3. Extract public inputs
4. Verify ZK proof via `withdrawVerifier.verify(proof, publicInputs)`
5. Check nullifier not already spent
6. Decrypt amount from ciphertext:
   ```solidity
   key = keccak256(abi.encodePacked(nullifier, recipient, POOL_SALT));
   amount = decryptAmount(ciphertext, key);
   ```
7. Mark nullifier as spent
8. Transfer funds to recipient via `Core.makeCaPay()`
9. Emit `Withdrawn` event

### 2. Fisher Relayer

**Location:** `fisher/index.ts`

**Tech Stack:** Bun HTTP server

**Purpose:** Execute SignedActions on behalf of users

**Endpoints:**

#### `POST /execute`

**Request:**
```json
{
  "signedAction": {
    "user": "0x...",
    "data": "0x...",
    "signature": "0x..."
  }
}
```

**Process:**
1. Validate SignedAction format
2. Create EVVM-compatible signer
3. Execute transaction via `evvmSigner.executeAction(signedAction)`
4. Wait for confirmation
5. Return txHash

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "blockNumber": 12345
}
```

**Error Handling:**
- Decodes EVVM revert data
- Extracts internal error messages
- Returns human-readable errors

### 3. Frontend (React + Vite)

**Location:** `packages/vite/`

**Tech Stack:**
- React 18
- Vite 5
- Wagmi 2.x (wallet connection)
- Viem 2.x (blockchain interaction)
- @noir-lang/noir_js (circuit execution in WASM)

**Key Hooks:**

#### `useEvvm()`

Creates EVVM-compatible signer from Wagmi wallet:

```typescript
const { address, walletClient, publicClient } = useAccount();
const evvmSigner = await createSignerWithViem(walletClient);
```

#### `useZK()`

ZK proof generation utilities:

```typescript
const {
  mintBearerToken,           // Generate note
  generateWithdrawalProof,   // Create ZK proof
  getStoredNotes,            // Read from localStorage
  getOnchainStatus           // Check commitment/nullifier
} = useZK();
```

**Services:**

#### `zkVVM.ts`

Extends `BaseService` from `@evvm/evvm-js`:

```typescript
class zkVVM extends BaseService {
  @SignMethod
  async deposit({...}): Promise<SignedAction<IDepositData>>

  @SignMethod
  async withdraw({...}): Promise<SignedAction<IWithdrawData>>

  async getCurrentRoot(): Promise<bytes32>
  async computeNextRoot(commitment): Promise<bytes32>
}
```

#### `ZKService.ts`

Circuit execution wrapper:

```typescript
class ZKService {
  async generateNote(artifact, value, secret, salt): Promise<Note>
  async generateWithdrawProof(artifact, inputs): Promise<{proof, publicInputs}>
}
```

### 4. Noir Circuits

**Location:** `packages/noir/src/`

**Version:** Noir 1.0.0-beta.18

#### `withdraw.nr` (Main Circuit)

**Public Inputs (5):**
```noir
nullifier: pub Field,              // Prevent double-spend
merkle_proof_length: pub u32,      // Proof depth (10)
expected_merkle_root: pub Field,   // Root from on-chain
recipient: pub Field,              // Bind to recipient
commitment: pub Field              // Public commitment
```

**Private Inputs:**
```noir
value: Field,                      // Amount (private!)
pk_b: Field,                       // Secret
random: Field,                     // Salt
merkle_proof_indices: [u1; 10],    // Path in tree
merkle_proof_siblings: [Field; 10] // Sibling hashes
```

**Constraints:**
1. `nullifier == poseidon2([pk_b, random])`
2. `commitment == poseidon2([value, nullifier])`
3. `entry == compute_entry(value, pk_b, random, nullifier)`
4. `merkle_root(entry, proof) == expected_merkle_root`

**Output:** Proof that prover knows secret/salt for a commitment in the Merkle tree.

---

## Deposit Flow

### Step-by-Step

```
┌──────────┐
│ 1. User  │ Opens DashboardPage, clicks "Mint Bearer Token"
└────┬─────┘
     │
     ▼
┌──────────────────┐
│ 2. Generate Note │ Browser generates random secret + salt
│                  │ Executes note_generator circuit in WASM
│                  │ Outputs: nullifier, commitment, entry, root
└────┬─────────────┘
     │
     ▼
┌──────────────────────┐
│ 3. Save to LocalStorage│ Note string stored as "zk-{value}-{secret}-{salt}"
└────┬─────────────────┘
     │
     ▼
┌──────────────────────────┐
│ 4. Create Pay SignedAction│ zkVVM service creates Core.pay() SignedAction
│                          │ User signs EIP-191 message (no gas)
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ 5. Create Deposit SignedAction│ zkVVM service creates zkVVM.deposit() SignedAction
│                              │ User signs second EIP-191 message
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────┐
│ 6. Send to Fisher│ HTTP POST to http://localhost:8787/execute
│                  │ Payload: { signedAction: {...} }
└────┬─────────────┘
     │
     ▼
┌──────────────────────┐
│ 7. Fisher Executes   │ Fisher creates tx with both signatures
│                      │ Calls zkVVM.deposit() on-chain
│                      │ Pays gas from Fisher wallet
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ 8. On-Chain Validation│ zkVVM.sol validates both signatures
│                      │ Processes payment via EVVM Core
│                      │ Stores commitment
│                      │ Updates Merkle root
│                      │ Emits Deposited event
└────┬─────────────────┘
     │
     ▼
┌──────────────────┐
│ 9. Confirm       │ Fisher returns txHash to frontend
│                  │ Frontend polls for confirmation
│                  │ Marks note as "ONCHAIN" in localStorage
└──────────────────┘
```

### Deposit Security

**Dual Signature Validation:**
- First signature: Authorizes `Core.pay()` (EVVM payment)
- Second signature: Authorizes `zkVVM.deposit()` (privacy pool deposit)

**Why Two Signatures?**
- Prevents Fisher from stealing funds (can't forge payment signature)
- Prevents replay attacks (each has own nonce)
- Separates concerns (payment vs deposit logic)

---

## Withdraw Flow

### Step-by-Step

```
┌──────────┐
│ 1. User  │ Opens WithdrawPage
│          │ Pastes note string: "zk-1000000-0xabc...-0xdef..."
│          │ Enters recipient address
└────┬─────┘
     │
     ▼
┌──────────────────┐
│ 2. Parse Note    │ Extract value, secret, salt from note string
└────┬─────────────┘
     │
     ▼
┌──────────────────────┐
│ 3. Recompute Nullifier│ nullifier = poseidon2([secret, salt])
│                      │ commitment = poseidon2([value, nullifier])
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ 4. Fetch Merkle Proof│ Call zkVVM.getCurrentRoot()
│                      │ Build Merkle proof for commitment
│                      │ (In v1: assume leaf at index 0, zero siblings)
└────┬─────────────────┘
     │
     ▼
┌──────────────────────────┐
│ 5. Generate ZK Proof     │ Execute withdraw.nr circuit in WASM
│                          │ Private inputs: value, secret, salt, merkle_proof
│                          │ Public inputs: nullifier, proof_len, root, recipient, commitment
│                          │ Output: proof (bytes) + publicInputs (5 fields)
└────┬─────────────────────┘
     │ (Takes 5-15 seconds in browser)
     │
     ▼
┌──────────────────────────┐
│ 6. Encrypt Amount        │ key = keccak256(nullifier || recipient || POOL_SALT)
│                          │ ciphertext = amount XOR keystream(key)
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ 7. Create Withdraw SignedAction│ zkVVM.withdraw() with proof, publicInputs, ciphertext
│                              │ User signs EIP-191 message
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────┐
│ 8. Send to Fisher│ HTTP POST /execute
└────┬─────────────┘
     │
     ▼
┌──────────────────────┐
│ 9. Fisher Executes   │ Calls zkVVM.withdraw() on-chain
│                      │ Passes proof + publicInputs + ciphertext
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ 10. On-Chain Verify  │ zkVVM.sol validates signature
│                      │ Verifies ZK proof via MockVerifier (dev) or UltraVerifier (prod)
│                      │ Checks nullifier not spent
│                      │ Decrypts amount from ciphertext
│                      │ Marks nullifier as spent
│                      │ Transfers funds to recipient
└────┬─────────────────┘
     │
     ▼
┌──────────────────┐
│ 11. Confirm      │ Fisher returns txHash
│                  │ User receives funds
│                  │ Note is now spent (cannot reuse)
└──────────────────┘
```

### Withdraw Security

**ZK Proof Constraints:**
- Proves knowledge of secret/salt without revealing them
- Proves commitment is in Merkle tree
- Binds proof to specific recipient (prevents front-running)
- Prevents nullifier reuse (double-spend protection)

**Ciphertext Privacy:**
- Amount encrypted so observer can't see withdrawal value
- Only contract (with nullifier + recipient) can decrypt
- Adds layer of privacy beyond ZK proof

---

## Security Model

### Threat Model

**Trusted:**
- ✅ User's browser (generates secrets)
- ✅ Noir compiler (circuit correctness)
- ✅ EVVM Core contract (signature validation)

**Untrusted:**
- ❌ Fisher (can censor but not steal)
- ❌ Blockchain observers (can see encrypted data)
- ❌ Contract deployer (can upgrade if admin)

**Adversary Capabilities:**
- Observe all on-chain data
- Control Fisher (can censor txs)
- Front-run transactions
- Replay old signatures

### Attack Vectors & Mitigations

| Attack | Mitigation |
|--------|------------|
| **Double-spend** | Nullifier tracking on-chain |
| **Replay attack** | Dual nonce system (zkVVM + EVVM) |
| **Front-running withdrawal** | Recipient bound in ZK proof |
| **Fisher censorship** | Fallback: User can execute directly (costs gas) |
| **Fisher steals funds** | Requires user signature (Fisher can't forge) |
| **Merkle tree poisoning** | Only admin can register roots |
| **Proof forgery** | UltraVerifier validates all proofs |
| **Commitment reuse** | On-chain mapping prevents duplicates |

### Privacy Leaks

**What Can Be Observed:**
- Timing: Deposit and withdraw in same block → likely same user
- Amount correlation: If only one deposit of X, withdraw of X links them
- IP addresses: Fisher sees user IPs (can use VPN)

**Improvements (Future):**
- Batching: Fisher batches multiple txs
- Mixing: Multiple users deposit/withdraw similar amounts
- Decoy transactions: Random noise txs
- Tor integration: Hide IP from Fisher

---

## Network Topology

### Development Environment

```
┌─────────────────┐
│  User Browser   │
│  localhost:5173 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐         ┌──────────────────┐
│  Fisher Relay   │◄────────│  Fisher Wallet   │
│  localhost:8787 │         │  (Test ETH)      │
└────────┬────────┘         └──────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Sepolia EVVM Testnet       │
│  RPC: publicnode.com        │
│                             │
│  ┌─────────────────────┐    │
│  │ EVVM Core           │    │
│  │ 0xFA56B6992c880... │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ zkVVM.sol           │    │
│  │ 0x37b4879e0a063... │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ MockVerifier        │    │
│  │ 0x7f211f541ff66... │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### Production Environment (Planned)

```
Internet Users
      │
      ▼
┌──────────────────┐
│   Cloudflare     │ (DDoS protection + CDN)
│   HTTPS          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Load Balancer   │
└────────┬─────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│Fisher 1││Fisher 2││Fisher 3││Fisher N│
└───┬────┘└───┬────┘└───┬────┘└───┬────┘
    │         │         │         │
    └─────────┴─────────┴─────────┘
              │
              ▼
    ┌──────────────────┐
    │  RPC Provider    │
    │  (Infura/Alchemy)│
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────┐
    │  Mainnet or L2       │
    │  (Sepolia/Arbitrum)  │
    │                      │
    │  ┌────────────────┐  │
    │  │ EVVM Core      │  │
    │  └────────────────┘  │
    │                      │
    │  ┌────────────────┐  │
    │  │ zkVVM.sol      │  │
    │  │ + UltraVerifier│  │
    │  └────────────────┘  │
    └──────────────────────┘
```

**Production Requirements:**
- Multiple Fisher instances (HA)
- Healthcheck + auto-restart
- Rate limiting (10 req/min/IP)
- Monitoring (Datadog, Sentry)
- Private keys in Secrets Manager
- HTTPS endpoint with valid cert

---

## Appendix: Technical Specifications

### Cryptographic Primitives

- **Hash Function:** Poseidon2 (ZK-friendly)
- **Merkle Tree:** Binary Merkle Tree (depth 10, max 1024 leaves)
- **Signature Scheme:** EIP-191 (Ethereum signed messages)
- **Proof System:** UltraPlonk (via Noir/Barretenberg)
- **Encryption:** XOR with keccak256 keystream (ciphertext)

### Gas Costs (Estimated)

| Operation | Gas (with UltraVerifier) | Gas (with MockVerifier) |
|-----------|--------------------------|-------------------------|
| Deposit | ~250k | ~150k |
| Withdraw | ~500k | ~200k |
| Register Root | ~50k | ~50k |

**Note:** MockVerifier is insecure, for development only.

### Storage Costs

| Item | Size | Cost |
|------|------|------|
| Commitment | 32 bytes | 20k gas (SSTORE) |
| Nullifier | 32 bytes | 20k gas |
| Merkle Root | 32 bytes | 20k gas |

### Performance Benchmarks

| Task | Time (Browser) |
|------|----------------|
| Note Generation | ~500ms |
| Withdraw Proof Generation | 5-15s |
| Deposit TX (via Fisher) | ~10s |
| Withdraw TX (via Fisher) | ~15s |

---

## Further Reading

- **EVVM Documentation:** https://docs.evvm.network/
- **Noir Language:** https://noir-lang.org/docs/
- **ZK_FLOW.md:** Detailed cryptography explanation
- **PRODUCTION_GAPS.md:** What's needed for mainnet
- **COMPARISON.md:** Main vs EVVM-Integration comparison

**Questions?** Open an issue on GitHub or join our Discord.
