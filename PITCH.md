# zkVVM — Privacy for users, transparency for institutions

> *"Transparency of the wires and the gates, privacy of what goes on the wires"*
> — Vitalik Buterin, Feb 2026

## The Problem

Financial institutions moving on-chain face an impossible choice:

1. **Full transparency** — every transaction visible to competitors, bad actors, and the public. No institution will adopt this.
2. **Full privacy** — protocols like Tornado Cash. Regulators can't audit. Institutions can't comply. Blocked everywhere.

Neither extreme works. The industry needs **selective disclosure**: institutions auditable, users protected.

## The Insight

Three principles that converge on the same design:

- **Privacy for the weak, transparency for the powerful**
- **Privacy for individuals, transparency for organizations**
- **Transparency of the wires and the gates, privacy of what goes on the wires**

Applied to finance: the movement of funds *between* institutions should be visible (the wires). The transactions of individual users *within* an institution should be private (what goes on the wires).

## The Solution: zkVVM

Each institution deploys its own **zkVVM** — a privacy-preserving virtual machine built on EVVM (Ethereum Virtual Virtual Machine) with zero-knowledge proofs.

```
┌──────────────────────────────────────────────────────────────┐
│                TRANSPARENT LAYER (auditable)                  │
│                                                              │
│     Bank A              Exchange B            Fund C         │
│    (zkVVM-A)            (zkVVM-B)           (zkVVM-C)        │
│        │                    │                   │            │
│        └──── EVVM transfers (visible on-chain) ─┘            │
│              Treasury flows, settlement, compliance          │
└──────┬──────────────┬───────────────────┬────────────────────┘
       │              │                   │
┌──────▼──────┐ ┌─────▼──────┐  ┌────────▼────────┐
│ PRIVATE     │ │ PRIVATE    │  │ PRIVATE          │
│ (ZK proofs) │ │ (ZK proofs)│  │ (ZK proofs)      │
│             │ │            │  │                  │
│ Alice → Bob │ │ Carol →Dan │  │ Eve → Frank      │
│ $500 USDC   │ │ $1200 USDC │  │ $80K USDC        │
│ (nobody     │ │ (nobody    │  │ (nobody           │
│  knows)     │ │  knows)    │  │  knows)           │
└─────────────┘ └────────────┘  └──────────────────┘
```

### How it works

1. **One EVVM per institution** — Each institution deploys a `zkVVM` contract that extends `EvvmService`. This gives them their own namespace, their own executor network, and their own compliance boundary.

2. **Composability between institutions** — EVVM handles cross-institution settlement. These transfers are on-chain, visible, and auditable. Regulators and treasuries can see the flow: "Bank A sent $2M to Exchange B." This is the transparent layer.

3. **Privacy for customers** — Within each institution, users deposit into a **shielded pool**. Their transactions use Poseidon2 hash commitments, nullifiers, and ZK proofs (Noir circuits verified on-chain via UltraPlonk). No one — not even the institution — can link depositor to recipient.

### The two-layer model

| Layer | Visibility | Mechanism | Who sees it |
|-------|-----------|-----------|-------------|
| **Inter-institutional** | Transparent | EVVM meta-transactions | Regulators, auditors, treasuries, public |
| **Intra-institutional** | Private | ZK proofs (Noir) + shielded pool | Only the sender and recipient |

## Why This Matters

### For institutions
- **Compliance-ready**: inter-institutional flows are fully auditable on-chain
- **Customer protection**: user transactions are shielded — no data leaks to competitors or attackers
- **Gasless UX**: users sign off-chain; executors submit transactions. Feels like a fintech app, not a blockchain wallet
- **Sovereignty**: each institution controls their own zkVVM instance, their own rules, their own executor network

### For users
- **Real privacy**: deposits and withdrawals are unlinkable via nullifiers and ZK proofs
- **No gas fees**: EVVM meta-transactions mean users never pay gas directly
- **Interoperable**: move between institutions through the transparent settlement layer

### For regulators
- **Auditability where it matters**: institution-level flows are visible and traceable
- **Not a mixer**: this is institutional infrastructure with compliance boundaries, not an anonymity tool
- **Provable solvency**: institutions can prove reserves without exposing individual user balances

## What's Built

| Component | Status | Description |
|-----------|--------|-------------|
| ZK Circuits (Noir) | Done | Withdraw v2b, note generation, commitment/nullifier helpers |
| ShieldedPool contract | Done | Deposit, transfer, withdraw, withdrawV2b (ciphertext) |
| zkVVM contract | Done | EVVM-integrated pool with meta-tx deposit and withdraw |
| Frontend service | Done | `@evvm/evvm-js` integration — signed actions for deposit/withdraw |
| Note generation | Done | Client-side note creation via `noir_js.execute()` |
| Proving system | Done | UltraPlonk + UltraHonk verification |
| Tests | Done | Full coverage: proofs, nullifiers, commitments, ciphertext |

## Technical Design

### Privacy guarantees

- **Unlinkability**: deposits and withdrawals cannot be correlated — different commitments, nullifiers derived from private randomness
- **Value privacy** (v2b): withdrawal amounts are encrypted via ciphertext, decrypted on-chain only during verification
- **Double-spend prevention**: nullifiers are marked spent on-chain; reuse is rejected
- **Front-running resistance**: recipient address is bound inside the ZK proof

### Cryptographic primitives

| Primitive | Usage |
|-----------|-------|
| Poseidon2 | Commitments, nullifiers, entries (ZK-friendly hash) |
| Keccak256 | Ciphertext key derivation (on-chain) |
| Binary Merkle Tree | Inclusion proofs for note membership |
| UltraPlonk | ZK proof generation and verification |

### Architecture per institution

```
User (browser)
  │
  ├─ noir_js.execute() → generate note (nullifier, commitment, entry, root)
  ├─ noir_js.prove()   → generate ZK proof for withdrawal
  │
  ▼
zkVVM Service (@evvm/evvm-js)
  │
  ├─ sign deposit action   (commitment + amount + EVVM payment signature)
  ├─ sign withdraw action  (proof + publicInputs + signature)
  │
  ▼
Executor (submits to chain)
  │
  ▼
zkVVM Contract (EvvmService)
  │
  ├─ validates nonce + signature via EVVM core
  ├─ stores commitment / verifies proof via UltraVerifier
  ├─ processes payment via EVVM requestPay / makeCaPay
  │
  ▼
On-chain state (commitments, nullifiers, merkle roots)
```

## Roadmap

- [ ] Multi-institution demo (two zkVVM instances with cross-settlement)
- [ ] On-chain Merkle tree management (replace off-chain root registration)
- [ ] Compliance module (selective disclosure proofs for auditors)
- [ ] Executor network incentives (fee market for meta-tx submission)
- [ ] Production verifier deployment (testnet → mainnet)
