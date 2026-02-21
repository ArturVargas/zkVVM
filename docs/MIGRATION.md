# Migration Guide: Main → EVVM-Integration

**Target Audience:** Users with notes in main branch (`ShieldedPool.sol`)
**Deadline:** TBD (to be announced)
**Status:** ⚠️ Migration path not yet available

---

## Executive Summary

If you have deposited funds into zkVVM on the **main** branch (using `ShieldedPool.sol` at `0x0f86796c3f3254442debd0705a56bdd82c69f4a6`), you will need to migrate to the new **EVVM-integration** architecture before the main branch is deprecated.

**Key Changes:**
- ❌ Old contract: `ShieldedPool.sol` (direct gas payments)
- ✅ New contract: `zkVVM.sol` (gasless via Fisher)
- ❌ Old circuits: Noir beta.0
- ✅ New circuits: Noir beta.18
- ❌ Old notes: Incompatible with new system
- ✅ New notes: EVVM-compatible bearer notes

---

## Why Migrate?

### Benefits of EVVM-Integration

1. **Gasless Transactions**
   - No need for ETH to pay gas
   - Just sign messages with your wallet
   - Fisher relayers execute transactions for you

2. **EVVM Incentives**
   - Fishers earn MATE rewards
   - More sustainable economic model
   - Better long-term protocol health

3. **Modern ZK Stack**
   - Noir beta.18 (latest features)
   - Better proving performance
   - Smaller proof sizes

4. **Improved Privacy**
   - Ciphertext encryption
   - Better Merkle tree management
   - Dual-signature security

### What You Lose

- ❌ Direct contract execution (now via Fisher)
- ❌ Beta.0 circuit compatibility
- ❌ Existing note format

---

## Migration Timeline

**⚠️ IMPORTANT:** This timeline is tentative and will be updated once migration tooling is ready.

### Phase 1: Announcement (Week 0)

- [ ] Official announcement on Discord/Twitter
- [ ] Email notification to known users
- [ ] Documentation published
- [ ] Migration deadline set (e.g., 30 days)

### Phase 2: Parallel Operation (Week 1-4)

- [ ] Both systems operational
- [ ] Legacy UI available at `/legacy`
- [ ] Users can withdraw from ShieldedPool at any time
- [ ] Support available for migration questions

### Phase 3: Final Withdrawal Period (Week 5-6)

- [ ] Reminders sent to users with remaining balances
- [ ] Legacy system marked as "deprecated"
- [ ] Last chance to withdraw

### Phase 4: Legacy Shutdown (Week 7+)

- [ ] ShieldedPool.sol deposits disabled
- [ ] Withdrawals still available (for safety)
- [ ] Frontend switches to EVVM-integration only

---

## Migration Methods

### Option A: Manual Withdraw + Re-Deposit (RECOMMENDED)

**Best for:** All users
**Time Required:** 10-15 minutes
**Cost:** 1-2 transactions worth of gas (for withdraw from old contract)

**Steps:**

1. **Withdraw from ShieldedPool (Main)**

   a. Switch to `main` branch frontend:
   ```
   git checkout main
   cd apps/frontend
   bun run dev
   ```

   b. Navigate to http://localhost:5173

   c. Connect your wallet (same one used for deposit)

   d. Go to Withdraw page

   e. Paste your old note string (format: `zk-{value}-{secret}-{salt}`)

   f. Enter recipient address (can be same wallet)

   g. Generate ZK proof (takes ~10-30 seconds)

   h. Sign transaction and pay gas

   i. Wait for confirmation

   j. Verify funds received

2. **Deposit to zkVVM (EVVM-Integration)**

   a. Switch to `feat/evvm-integration` branch:
   ```
   git checkout feat/evvm-integration
   ```

   b. Start Fisher:
   ```
   bun run start:fisher
   ```

   c. Start frontend:
   ```
   cd packages/vite
   bun run dev
   ```

   d. Navigate to http://localhost:5173

   e. Connect wallet

   f. Go to Dashboard

   g. Click "Mint Bearer Token"

   h. Enter amount

   i. Sign **two** messages (Core.pay + zkVVM.deposit)

   j. Wait for Fisher to execute (~10 seconds)

   k. Verify note marked as "ONCHAIN"

   l. **Save your new note string** (different format than old!)

**⚠️ CRITICAL:** Do NOT lose your new note string. Store it securely.

---

### Option B: Automated Migration Tool (NOT YET AVAILABLE)

**Status:** 🔴 Not implemented yet

**Concept:**
- Script that reads old note, withdraws, and re-deposits
- Requires signing multiple transactions
- More convenient but higher gas cost

**If this tool is developed, instructions will be published here.**

---

## Note Format Changes

### Old Format (Main Branch)

```
zk-1000000-0xabc123...-0xdef456...
```

**Components:**
- `zk-`: Prefix
- `1000000`: Amount in wei
- `0xabc123...`: Secret (32 bytes hex)
- `0xdef456...`: Salt (32 bytes hex)

**Circuit:** Noir beta.0 (`note_generator.nr`)

### New Format (EVVM-Integration)

```
zk-1000000-0xabc123...-0xdef456...
```

**Components:** Same structure, but:
- Generated with Noir beta.18
- Incompatible with beta.0 circuits
- Different nullifier derivation (in some cases)

**⚠️ WARNING:** Old notes WILL NOT WORK in new system, even if format looks similar.

---

## FAQs

### Q: Can I still withdraw my old notes after migration deadline?

**A:** Yes! For safety, we will keep the ShieldedPool.sol withdraw function active indefinitely. However, you will NOT be able to make new deposits after the deadline.

### Q: Do I have to migrate?

**A:** No, but if you don't withdraw before the deadline, you won't be able to deposit new notes into the old pool. Your existing notes can always be withdrawn.

### Q: Will my old notes work in the new system?

**A:** No. You must withdraw from the old system and create new notes in the new system.

### Q: What happens if I lose my old note before migrating?

**A:** Unfortunately, bearer notes are like cash - if you lose the note string, the funds are permanently lost. There is no recovery mechanism.

### Q: Can I use the same secret/salt in both systems?

**A:** Technically yes, but NOT RECOMMENDED. Generate fresh secrets for new notes to avoid any cryptographic issues.

### Q: How do I know if I have notes in the old system?

**A:** Check your browser's localStorage for keys starting with `zk-notes`. Also check your personal records/backups.

### Q: What if Fisher is offline when I try to migrate?

**A:** During the migration period, we will ensure Fisher uptime. If Fisher is down, wait a few minutes and try again.

### Q: Are there any fees for migration?

**A:** You will pay gas fees to withdraw from the old contract (standard Ethereum tx cost). The new deposit via Fisher is gasless.

### Q: Can I migrate in batches (e.g., withdraw half now, half later)?

**A:** Yes! Each note is independent. Withdraw and re-deposit at your own pace.

### Q: Will the UI support both systems during migration?

**A:** Yes. We will provide a toggle or separate routes for legacy vs new system.

---

## Checklist Before Migrating

- [ ] I have backed up all my old note strings
- [ ] I understand old notes won't work in new system
- [ ] I have ETH for gas to withdraw from old contract
- [ ] I have tested the new frontend with a small deposit first
- [ ] I have secured my new note strings
- [ ] I understand the risks of bearer notes (if lost, funds are gone)

---

## Support

If you encounter issues during migration:

1. **Check Documentation:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
   - [COMPARISON.md](./COMPARISON.md) - Differences between systems
   - [README.md](../README.md) - Quick start guide

2. **Community Support:**
   - Discord: [Link TBD]
   - Telegram: [Link TBD]
   - GitHub Issues: https://github.com/0xj4an/zkVVM/issues

3. **Technical Issues:**
   - Open a GitHub issue with:
     - Browser console errors (screenshots)
     - Transaction hashes (if applicable)
     - Steps to reproduce

---

## Developer Migration Guide

If you're running a local instance of zkVVM and want to migrate:

### 1. Update Dependencies

```bash
git fetch --all
git checkout feat/evvm-integration
bun install
cd fisher && bun install && cd ..
```

### 2. Compile New Circuits

```bash
cd packages/noir
nargo compile
cd ../..
```

### 3. Compile New Contracts

```bash
bunx hardhat compile --config hardhat.config.cts
```

### 4. Update Environment Variables

Copy new `.env.example` and fill in values:

```bash
cp .env.example .env
# Edit .env with your keys
```

**New variables required:**
```
EVVM_CORE_ADDRESS=0xFA56B6992c880393e3bef99e41e15D0C07803BC1
EVVM_STAKING_ADDRESS=0x805F35c5144FeBb5AA49Dbc785634060341A0a5D
VITE_CORE_ADDRESS=0xFA56B6992c880393e3bef99e41e15D0C07803BC1
VITE_FISHER_URL=http://localhost:8787
FISHER_PRIVATE_KEY=<your_fisher_key>
```

### 5. Deploy New Contracts (Testnet)

```bash
# Deploy UltraVerifier (production) or use MockVerifier (dev)
bun run scripts/deploy-mock-verifier.js --network sepoliaEvvm

# Deploy zkVVM
bun run scripts/deploy-zkvvm.js --network sepoliaEvvm

# Register default root
bun run scripts/register-default-root.js --network sepoliaEvvm
```

### 6. Update Frontend Config

Update deployment addresses in `deployments/sepolia_evvm/addresses.json`.

### 7. Test End-to-End

```bash
# Terminal 1: Fisher
bun run start:fisher

# Terminal 2: Frontend
cd packages/vite && bun run dev
```

Navigate to http://localhost:5173 and test deposit/withdraw.

---

## Security Considerations

### During Migration

1. **Old Notes Still Valuable:**
   - Don't delete old notes until after withdrawing
   - Keep backups in multiple secure locations

2. **Fisher Trust:**
   - During migration, Fisher may see higher volume
   - Use official Fisher endpoint only
   - Verify transactions on Etherscan

3. **Phishing Risk:**
   - Beware of fake migration tools
   - Only use official GitHub repositories
   - Verify contract addresses on Etherscan

### After Migration

1. **New Note Storage:**
   - localStorage can be cleared by browser
   - Export and backup notes to encrypted file
   - Consider hardware wallet for large amounts

2. **Fisher Censorship:**
   - Fisher can censor but not steal funds
   - If censored, contact support
   - Future: fallback direct execution

---

## Rollback Plan

If critical issues are discovered during migration:

1. **Immediate Actions:**
   - Halt new deposits to zkVVM.sol
   - Announce rollback
   - Ensure ShieldedPool.sol remains operational

2. **User Protection:**
   - All funds in both contracts remain withdrawable
   - No loss of user funds
   - Extended migration deadline

3. **Technical Response:**
   - Fix critical issues
   - Re-deploy if necessary
   - Comprehensive testing before re-enabling

---

## Appendix: Contract Addresses

### Main Branch (Legacy)

**Network:** Sepolia (ChainID: 11155111)

```
ShieldedPool:   0x0f86796c3f3254442debd0705a56bdd82c69f4a6
USDC (Test):    0xd9aee9351f7685b05a6b7bd8c1ca509d24be1e57
UltraVerifier:  0xf62e5a932a832c8ea990dedd87a05162c8905224
```

**Frontend:** `apps/frontend/` (main branch)

### EVVM-Integration (New)

**Network:** Sepolia EVVM (ChainID: 11155111)

```
EVVM Core:      0xFA56B6992c880393e3bef99e41e15D0C07803BC1
EVVM Staking:   0x805F35c5144FeBb5AA49Dbc785634060341A0a5D
zkVVM:          0x37b4879e0a06323cc429307883d1d73e08c78059
MockVerifier:   0x7f211f541ff66a37b51d48c96edbb2a54a109b23 (⚠️ Dev only)
```

**Frontend:** `packages/vite/` (feat/evvm-integration branch)

**Fisher:** http://localhost:8787 (dev) | TBD (production)

---

## Contact & Updates

**Last Updated:** February 21, 2026
**Next Review:** TBD

For latest migration status, check:
- GitHub: https://github.com/0xj4an/zkVVM
- Discord: [TBD]
- Twitter: [TBD]

**Emergency Contact:** [TBD]
