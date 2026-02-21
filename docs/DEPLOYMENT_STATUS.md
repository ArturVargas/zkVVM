# Deployment Status - zkVVM EVVM-Integration

**Last Updated:** February 21, 2026
**Network:** Sepolia EVVM (ChainID: 11155111)
**Branch:** feat/evvm-integration

---

## 🚀 Deployed Contracts

### Core EVVM Infrastructure (Pre-deployed)

```
EVVM Core:      0xFA56B6992c880393e3bef99e41e15D0C07803BC1
EVVM Staking:   0x805F35c5144FeBb5AA49Dbc785634060341A0a5D
```

### zkVVM Contracts

| Contract | Address | Status | Notes |
|----------|---------|--------|-------|
| **UltraVerifier (Real)** | `0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77` | ✅ Deployed | Production-grade ZK verifier |
| **MockVerifier (Dev)** | `0x7f211f541ff66a37b51d48c96edbb2a54a109b23` | ⚠️ Deprecated | INSECURE - Dev only |
| **zkVVM (with UltraVerifier)** | `0xd03204956969f5bd734e842aaf8bd2a0929bd4f1` | ✅ Deployed | **CURRENT PRODUCTION CONTRACT** |
| **zkVVM (old, with Mock)** | `0x37b4879e0a06323cc429307883d1d73e08c78059` | ⚠️ Deprecated | Old deployment with MockVerifier |

---

## 📝 Contract Configuration

### zkVVM Contract Details

**Address:** `0xd03204956969f5bd734e842aaf8bd2a0929bd4f1`

**Constructor Parameters:**
```solidity
admin: 0x15FF236ecD89b34a527112F7f51d6215609df409
coreAddress: 0xFA56B6992c880393e3bef99e41e15D0C07803BC1
stakingAddress: 0x805F35c5144FeBb5AA49Dbc785634060341A0a5D
withdrawVerifierAddress: 0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77 (UltraVerifier)
```

**Key Features:**
- ✅ Uses UltraVerifier for ZK proof verification (SECURE)
- ✅ EVVM integration (gasless transactions)
- ✅ Merkle tree state management
- ✅ Dual nonce validation (zkVVM + EVVM)

**Current State:**
- `currentRoot`: TBD (needs admin to register default root)
- `admin`: 0x15FF236ecD89b34a527112F7f51d6215609df409
- `withdrawVerifier`: 0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77 (immutable)

---

## ⚙️ Environment Configuration

### Updated .env Variables

```bash
# EVVM Sepolia Configuration
EVVM_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
EVVM_SEPOLIA_KEY=0xeb9585...  # Deployer wallet
EVVM_SEPOLIA_CHAIN_ID=11155111
EVVM_CORE_ADDRESS=0xFA56B6992c880393e3bef99e41e15D0C07803BC1
EVVM_STAKING_ADDRESS=0x805F35c5144FeBb5AA49Dbc785634060341A0a5D

# zkVVM Admin & Verifier
ZKVVM_ADMIN_ADDRESS=0x15FF236ecD89b34a527112F7f51d6215609df409
WITHDRAW_VERIFIER_ADDRESS=0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77  # ✅ UltraVerifier

# Fisher Configuration
FISHER_PRIVATE_KEY=0xeb9585...
FISHER_PORT=8787

# Frontend Configuration
VITE_ZKVVM_ADDRESS=0xd03204956969f5bd734e842aaf8bd2a0929bd4f1  # ✅ Updated
VITE_CORE_ADDRESS=0xFA56B6992c880393e3bef99e41e15D0C07803BC1
VITE_FISHER_URL=http://localhost:8787
```

---

## 🔒 Security Status

### Critical Improvements

| Aspect | Before | After | Impact |
|--------|--------|-------|--------|
| **ZK Verifier** | MockVerifier (accepts any proof) | UltraVerifier (validates proofs) | 🔴 → 🟢 **CRITICAL FIX** |
| **Production Ready** | ❌ No | ⚠️ Partial | Verifier fixed, tests still broken |
| **Proof Validation** | Disabled (mock) | Enabled (UltraPlonk) | Actual ZK security |

### Remaining Risks

- ⚠️ **Merkle Root Not Registered:** Admin needs to call `registerRoot()` to enable withdrawals
- ⚠️ **Fisher in Localhost:** Not accessible from internet (dev only)
- ⚠️ **Tests Broken:** Cannot validate contract logic automatically

---

## 📋 Deployment Checklist

### Completed ✅

- [x] Compile Noir circuits (beta.18)
- [x] Compile Solidity contracts
- [x] Deploy UltraVerifier to Sepolia EVVM
- [x] Deploy zkVVM with UltraVerifier
- [x] Update .env with new addresses
- [x] Verify contracts compile without errors

### Pending ⏳

- [ ] Register default Merkle root (requires admin wallet)
- [ ] Test deposit flow with UltraVerifier
- [ ] Test withdraw flow with real proof verification
- [ ] Deploy Fisher to public server
- [ ] Fix unit tests (Nargo workspaces)
- [ ] E2E testing on Sepolia

### Blocked 🔴

- **Register Merkle Root:** Requires admin private key (0x15FF236...)
  - **Workaround:** Re-deploy zkVVM with current wallet as admin
  - **Or:** Get admin key from original deployer

---

## 🛠️ How to Use New Deployment

### For Developers

1. **Update local .env:**
   ```bash
   cp .env.example .env
   # Update VITE_ZKVVM_ADDRESS to: 0xd03204956969f5bd734e842aaf8bd2a0929bd4f1
   ```

2. **Restart services:**
   ```bash
   # Fisher
   bun run start:fisher

   # Frontend
   cd packages/vite && bun run dev
   ```

3. **Connect to new zkVVM:**
   - Open http://localhost:5173
   - Contract calls will use new address automatically

### For Admin (Root Registration)

**Option A: Use Admin Wallet**
```bash
# If you have admin private key:
export ZKVVM_ADMIN_KEY=<admin_private_key>
REGISTER_DEFAULT_ROOT=true bunx hardhat run scripts/register-default-root.js --network sepoliaEvvm
```

**Option B: Re-deploy with Your Wallet as Admin**
```bash
# Update .env:
ZKVVM_ADMIN_ADDRESS=0xc696DDC31486D5D8b87254d3AA2985f6D0906b3a  # Your wallet

# Re-deploy:
bunx hardhat run scripts/deploy-zkvvm.js --config hardhat.config.cts --network sepoliaEvvm
```

### For Testing

**Manual E2E Test:**
1. Follow [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md)
2. Use addresses from this document
3. **Important:** Withdrawals will fail until default root is registered

**Expected Behaviors:**
- ✅ Deposit works (creates commitment)
- ⚠️ Withdraw may fail if root not registered
- ✅ UltraVerifier validates proofs (no more mock)

---

## 📊 Deployment History

### Deployment Timeline

```
2026-02-21 14:10 UTC - UltraVerifier deployed
                       Address: 0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77

2026-02-21 14:15 UTC - zkVVM re-deployed with UltraVerifier
                       Address: 0xd03204956969f5bd734e842aaf8bd2a0929bd4f1
                       Old zkVVM (with Mock) deprecated
```

### Previous Deployments (Deprecated)

| Contract | Address | Status |
|----------|---------|--------|
| zkVVM (with Mock) | 0x37b4879e0a06323cc429307883d1d73e08c78059 | ⚠️ Deprecated |
| MockVerifier | 0x7f211f541ff66a37b51d48c96edbb2a54a109b23 | ⚠️ Insecure |

**Migration Path:** All new deposits/withdrawals should use the new zkVVM address.

---

## 🔍 Verification

### Verify on Etherscan

**UltraVerifier:**
https://sepolia.etherscan.io/address/0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77

**zkVVM (Current):**
https://sepolia.etherscan.io/address/0xd03204956969f5bd734e842aaf8bd2a0929bd4f1

### Verify Contract Source

```bash
# Verify UltraVerifier
bunx hardhat verify --network sepoliaEvvm 0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77

# Verify zkVVM
bunx hardhat verify --network sepoliaEvvm \
  0xd03204956969f5bd734e842aaf8bd2a0929bd4f1 \
  "0x15FF236ecD89b34a527112F7f51d6215609df409" \
  "0xFA56B6992c880393e3bef99e41e15D0C07803BC1" \
  "0x805F35c5144FeBb5AA49Dbc785634060341A0a5D" \
  "0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77"
```

### On-Chain State Queries

```bash
# Check current root
cast call 0xd03204956969f5bd734e842aaf8bd2a0929bd4f1 \
  "getCurrentRoot()(bytes32)" \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com

# Check verifier address
cast call 0xd03204956969f5bd734e842aaf8bd2a0929bd4f1 \
  "withdrawVerifier()(address)" \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
# Expected: 0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77

# Check admin
cast call 0xd03204956969f5bd734e842aaf8bd2a0929bd4f1 \
  "admin()(address)" \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
# Expected: 0x15FF236ecD89b34a527112F7f51d6215609df409
```

---

## 🚨 Known Issues

### Issue 1: Merkle Root Not Registered

**Symptom:** Withdrawals fail with "Root not registered"

**Cause:** Default root (0x0000...0000) not registered by admin

**Fix:** Admin must call:
```solidity
zkVVM.registerRoot(0x0000000000000000000000000000000000000000000000000000000000000000)
```

**Workaround:** Use frontend to deposit first (automatically registers root)

### Issue 2: Admin Wallet Mismatch

**Symptom:** Cannot register root with current wallet

**Cause:** Admin is 0x15FF236... but current wallet is 0xc696DDC...

**Fix:** Either get admin key or re-deploy with your address as admin

### Issue 3: Old zkVVM Address in Docs

**Symptom:** Some docs still reference 0x37b4879e...

**Fix:** Update all references to new address: 0xd03204956969f5bd734e842aaf8bd2a0929bd4f1

---

## 📚 Related Documentation

- [PRODUCTION_GAPS.md](./PRODUCTION_GAPS.md) - What's needed for mainnet
- [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md) - Manual testing steps
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [COMPARISON.md](./COMPARISON.md) - Main vs EVVM-Integration

---

## 🎯 Next Steps

### Immediate (Next 1-2 days)

1. **Resolve Admin Issue:**
   - Get admin private key, or
   - Re-deploy zkVVM with your wallet as admin

2. **Register Merkle Root:**
   - Call `registerRoot(0x0000...0000)`
   - Enables withdrawals

3. **E2E Testing:**
   - Follow [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md)
   - Test deposit + withdraw with real UltraVerifier
   - Document any issues

### Short Term (Next 1-2 weeks)

4. **Fix Unit Tests:**
   - Implement Nargo workspaces
   - Or refactor tests for single artifact

5. **Deploy Fisher Publicly:**
   - Setup server (Railway/DigitalOcean)
   - HTTPS endpoint
   - Update VITE_FISHER_URL

### Medium Term (Next Month)

6. **Security Audit:**
   - External review of zkVVM.sol
   - Verify UltraVerifier matches circuit
   - Penetration testing

7. **Production Deployment:**
   - Deploy to mainnet or production L2
   - Only after all gaps closed

---

## 📞 Contact

**Deployment Engineer:** [Your Name]
**Date:** February 21, 2026
**Questions:** Open issue on GitHub

---

**Status:** ⚠️ Partial Production-Ready (Verifier ✅, Tests ❌, Fisher ❌, Root ❌)
