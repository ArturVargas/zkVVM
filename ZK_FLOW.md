# zkVVM: Bearer Note Architecture (Digital Cash)

## 1. Overview

This document outlines the **Bearer Note** flow for zkVVM. Unlike traditional account-based privacy
systems (e.g., private balances), this architecture treats assets as **Digital Cash**.

- **No "Accounts":** There is no on-chain mapping of User -> Balance.
- **The "Note":** Funds are locked in a **Commitment** (hash).
- **Ownership:** Whoever holds the **Secret Pre-image** of that hash owns the funds.
- **Transfer:** Physical or encrypted digital handoff of the Secret (off-chain).
- **Withdrawal:** The holder generates a ZK proof to spend the Note to a fresh address.

---

## 2. The Data Structure (The "Note")

A "Note" consists of three components that exist **only** on the client side (User's browser/local
storage).

| Variable        | Type              | Description                                    | Visibility                                          |
| :-------------- | :---------------- | :--------------------------------------------- | :-------------------------------------------------- |
| **`Secret`**    | `Field` (256-bit) | The password to spend the funds.               | **Strictly Private**                                |
| **`Nullifier`** | `Field` (256-bit) | A unique random ID to prevent double-spending. | **Private** (Hash is Public)                        |
| **`Value`**     | `Field` (256-bit) | The amount (e.g., `1000000` for 1 USDC).       | **Public** (in Deposit) / **Private** (in Withdraw) |

### The Commitment (On-Chain Storage)

To deposit funds, we mathematically "wrap" the Note into a Commitment using the Poseidon hash
function.

$$Commitment = Poseidon([Secret, Nullifier, Value])$$

- **Why Poseidon?** It is a ZK-friendly hash function, making proof generation cheap and fast
  (unlike SHA-256).

---

## 3. The Workflow

### Step 1: Deposit (Minting)

**Actor:** Depositor **Goal:** Lock funds into a secret code.

1.  **Generate Randomness:**
    - Client generates a random `Secret` and `Random Nullifier`.
2.  **Calculate Commitment:**
    - `const commitment = poseidon([secret, nullifier, value]);`
3.  **Submit to Blockchain:**
    - Call `Vault.deposit(commitment)` and send the `Value` (ETH/ERC20).
4.  **Store Secret:**
    - **CRITICAL:** The browser must save the `Secret` and `Nullifier`. If these are lost, the funds
      are burned forever.
5.  **Chain State:**
    - The Contract adds `Commitment` to the **Merkle Tree**.

### Step 2: The Transfer (Off-Chain)

**Actor:** Depositor -> Receiver **Goal:** Hand over the cash.

1.  **Mechanism:** The Depositor sends the `Secret` and `Nullifier` to the Receiver.
2.  **Medium:**
    - Encrypted Chat (Signal/WhatsApp/Telegram).
    - QR Code (In person).
    - Physical Paper ("Check").
3.  **Privacy:** The blockchain sees **zero activity** during this step.

### Step 3: Withdrawal (Spending)

**Actor:** Receiver **Goal:** Cash out the Note to a clean wallet.

1.  **Input:** Receiver enters `Secret` + `Nullifier` + `Recipient Address`.
2.  **Generate ZK Proof (Noir):**
    - **Private Inputs:** `Secret`, `Nullifier`, `Value`, `Merkle Path`.
    - **Public Inputs:** `Merkle Root`, `Nullifier Hash`, `Recipient Address`.
3.  **The Circuit Proves:**
    - "I know a `Secret` that hashes to a `Commitment` inside the Merkle Tree Root."
    - "The `Nullifier Hash` matches the `Nullifier` in the Commitment."
    - "I am authorizing the withdrawal **ONLY** to this `Recipient Address`."
4.  **Submit to Blockchain:**
    - Relayer (Fisher) submits the proof.
    - Contract verifies proof.
    - Contract checks `Nullifier Hash` is unused.
    - Contract transfers funds to `Recipient`.
    - Contract marks `Nullifier Hash` as **Spent**.

---

## 4. Noir Circuit Logic (`main.nr`)

The circuit ensures the integrity of the withdrawal without revealing the secret.

```rust
use dep::std;

fn main(
    // PUBLIC INPUTS (Visible to Verifier/Contract)
    root: pub Field,             // The current Merkle Root of the tree
    nullifierHash: pub Field,    // The public identifier of the spent note
    recipient: pub Field,        // The address receiving the funds (prevents front-running)
    value: pub Field,            // The amount being withdrawn (must match deposit)

    // PRIVATE INPUTS (Hidden Witness)
    secret: Field,               // The secret key
    nullifier: Field,            // The unique nonce
    path_indices: [Field; 20],   // Merkle path directions (0=Left, 1=Right)
    path_siblings: [Field; 20]   // Merkle path sibling hashes
) {
    // 1. Reconstruct the Commitment
    // We hash the private inputs to see if they match the commitment in the tree.
    let commitment = std::hash::poseidon::bn254::hash_3([secret, nullifier, value]);

    // 2. Verify Merkle Membership
    // We calculate the root from our commitment up the tree path.
    let calculated_root = std::merkle::compute_merkle_root(commitment, path_indices, path_siblings);

    // CONSTRAINT: The calculated root must match the public root.
    assert(calculated_root == root);

    // 3. Verify Nullifier Validity
    // We hash the private nullifier to check against the public nullifierHash.
    let calculated_nullifier_hash = std::hash::poseidon::bn254::hash_1([nullifier]);

    // CONSTRAINT: The hash must match.
    assert(calculated_nullifier_hash == nullifierHash);

    // 4. Recipient Binding (Implicit)
    // The 'recipient' is a Public Input.
    // The Smart Contract will ensure msg.sender (or target) == recipient.
    // If someone changes the recipient, the proof is invalid because inputs changed.
}
```
