# Noir Circuits and ZK Flow

## Overview of Noir Circuits
The repository contains several Noir circuits (`main.nr`, `withdraw.nr`, `note_generator.nr`, etc.) designed to manage private deposits, note ownership, and withdrawals.

### Core Logic
The system relies on computing a generic structured `entry` (or note commitment) to be inserted into a Poseidon Merkle tree.
The entry calculation is consistent across circuits:
```rust
fn compute_entry(value: Field, holder: Field, random: Field, nullifier: Field) -> Field {
    poseidon2([poseidon2([value, holder]), poseidon2([random, nullifier])])
}
```
Where:
- `value`: The amount of tokens deposited.
- `holder` (or `pk_b`): The wallet address of the recipient receiving the note.
- `random`: A secret entropy source.
- `nullifier`: A deterministic, unique identifier for the note, computed as `poseidon2([random, pk_b])`.

### Circuit: `withdraw.nr` / `main.nr`
This is the primary circuit to prove ownership of a note and bind a withdrawal to a recipient.
**Public Inputs:**
- `nullifier`: Ensures a note cannot be spent twice.
- `merkle_proof_length`: The length of the Merkle path.
- `expected_merkle_root`: The recorded on-chain state root of the tree.
- `recipient`: The destination address to withdraw funds to (protects against front-running).
- `commitment`: Evaluated as `poseidon2([value, nullifier])`, allowing the contract to check the value decrypted from a ciphertext without revealing it to the public in the proof.

**Private Inputs:**
- `value`: The amount of the withdrawal.
- `pk_b`: The owner's public identifier (wallet address).
- `random`: The secret entropy.
- `merkle_proof_indices`, `merkle_proof_siblings`: Allow the circuit to verify that `entry` is included in the state root.

---

## Potential Pitfalls & Vulnerabilities
There are a few **critical** pitfalls and security considerations with the current approach:

1. **Weak Entropy (`random`)**:
   In `note_generator.nr`, the `random` value is documented as `timestamp (seconds)`. This provides virtually zero entropy. Since both `value` and the recipient's wallet address (`pk_b`) are likely known or easily guessable public information from standard blockchain transactions, an attacker or blockchain observer could trivially brute-force the deposit's timestamp to find the `random` value. This means an attacker can construct a valid `nullifier`, create a proof, and steal the funds.
   *Fix*: `random` should be a cryptographically secure random 256-bit scalar, ideally derived from a strong local source, not a timestamp.

2. **Depositor Keeping Entropy**: 
   Because `random` and `pk_b` determine the `nullifier` and essentially establish complete mathematical ownership over the note, the party that creates the note (the depositor) inherently knows all the secrets required to withdraw it. Without standard asymmetric cryptography (i.e., using the recipient's public key to encrypt the note payload in a way that strictly requires their private key to spend), a malicious depositor can front-run the recipient and withdraw the funds they just sent. 
   *Fix*: Standardize a flow where the note's nullifier and entropy are bound to a public key (or secret derived via a shared DH key) exclusively manageable by the recipient. Alternatively, ensure the depositor guarantees securely sharing the secret off-chain and destroying their copy (though less trustless).

---

## Deposit & Withdrawal Creation

### 1. Creating the Commitment for a Deposit
To create a deposit, you do not need to generate a zero-knowledge proof. You only need to calculate the note elements off-chain (typically in the frontend/SDK via `noir_js` or a native poseidon hash implementation).

```javascript
// Example computation flow off-chain
const pk_b = recipient_wallet_address_as_field;
const value = token_amount_as_field;

// CRITICAL: use a secure random field here, ideally NOT Date.now() / 1000.
const random = secure_random_256bit_field;

// Compute Nullifier
const nullifier = poseidon2([random, pk_b]);

// Compute Commitment used for ciphertext verification
const commitment = poseidon2([value, nullifier]);

// Compute Entry (The leaf commitment to insert into the Merkle Tree on-chain)
const entry = poseidon2([
   poseidon2([value, pk_b]),
   poseidon2([random, nullifier])
]);
```
The contract consumes `entry` and inserts it as a new leaf in the Merkle Tree. You would supply `entry`, along with encrypted data containing `random` and `value` for the recipient.

### 2. Creating the Proof & Public Inputs for a Withdrawal
To withdraw, the actual owner must construct the Merkle inclusion proof for their `entry` up to the current `expected_merkle_root` and supply this to the `withdraw.nr` circuit.

**Setup Inputs for the Prover:**
```javascript
// Public inputs required by the contract
const publicInputs = {
    nullifier: nullifier,
    merkle_proof_length: treeDepth, // e.g. 10
    expected_merkle_root: currentOnchainRoot,
    recipient: withdrawal_destination_address,
    commitment: commitment, // poseidon2([value, nullifier])
};

// Private inputs kept hidden by zk-SNARK
const privateInputs = {
    value: token_amount,
    pk_b: your_wallet_address,
    random: secret_entropy_used_in_deposit,
    merkle_proof_indices: treeProof.indices, // array of 0s and 1s
    merkle_proof_siblings: treeProof.siblings, // array of sibling hashes
};

// Combine for Noir witness generation
const input = { ...publicInputs, ...privateInputs };
```

**Generate Proof:**
Use `@noir-lang/noir_js` (or Native Barretenberg) to evaluate the `input` against the compiled `withdraw` circuit. 
This yields a byte-array `proof`. Submit both this `proof` and the formatted `publicInputs` array directly to the smart contract's withdrawal function. Wait for successful L1 verification.
