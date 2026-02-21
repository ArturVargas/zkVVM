# E2E Testing Guide - zkVVM EVVM-Integration

**Status:** Ready for Manual Testing
**Prerequisites:** Fisher + Frontend running
**Network:** Sepolia EVVM

---

## Pre-Flight Checklist

Before starting, ensure:

- [x] Fisher running on http://localhost:8787
- [x] Frontend running on http://localhost:5173
- [ ] MetaMask installed and configured
- [ ] Sepolia testnet added to MetaMask
- [ ] Test ETH in wallet (for signatures, not gas)
- [ ] Browser console open (F12) for debugging

---

## Test 1: Deposit Flow (Gasless)

### Step 1: Connect Wallet

1. Open browser to http://localhost:5173
2. You should see zkVVM landing page
3. Look for "Connect Wallet" button
4. Click and select MetaMask
5. Approve connection in MetaMask popup
6. **Verify:** Your address shows in navbar/header

**Expected:** Wallet connected without errors

**Console Check:**
```javascript
// Should see no errors
// May see: "Wallet connected: 0x..."
```

---

### Step 2: Navigate to Dashboard

1. Click "Dashboard" or "Deposit" in navigation
2. You should see the deposit interface
3. Look for "Mint Bearer Token" section

**Expected:** Dashboard page loads, shows deposit form

---

### Step 3: Mint Bearer Token

1. In "Amount" field, enter: `1000000` (1 USDC in wei)
   - Or use the UI to select amount
2. Click "Mint Bearer Token" or "Generate Note"
3. **Wait:** Browser executes `note_generator.nr` circuit in WASM
   - This takes ~500ms to 2 seconds
4. Browser generates:
   - Secret (random 32 bytes)
   - Salt (random 32 bytes)
   - Nullifier (poseidon2 hash)
   - Commitment (poseidon2 hash)
   - Entry (merkle leaf)
   - Root (merkle root)

**Expected Output:**
```
Note Generated:
zk-1000000-0xabc123...-0xdef456...
```

**Console Check:**
```javascript
// Look for:
{
  value: 1000000n,
  secret: 0xabc123...,
  salt: 0xdef456...,
  nullifier: 0x789abc...,
  commitment: 0xdef012...,
  entry: 0x345678...,
  root: 0x901234...
}
```

**Action:** **Copy the note string** and save it somewhere safe!

---

### Step 4: Create Deposit SignedActions

1. After note generation, UI should show "Deposit to Pool" button
2. Click the button
3. **First Signature Request (Core.pay):**
   - MetaMask popup appears
   - Message to sign (EIP-191):
     ```
     EVVM Action: pay
     Nonce: <nonce>
     Amount: 1000000
     To: 0x37b4879e0a06323cc429307883d1d73e08c78059 (zkVVM)
     ```
   - Click "Sign" (NO gas fee)
4. **Second Signature Request (zkVVM.deposit):**
   - Another MetaMask popup
   - Message to sign:
     ```
     EVVM Action: deposit
     Nonce: <nonce>
     Commitment: 0xdef012...
     Expected Root: 0x901234...
     ```
   - Click "Sign" (NO gas fee)

**Expected:** Two signatures created, no gas paid

**Console Check:**
```javascript
// Look for:
"SignedAction created: deposit"
"SignedAction created: pay"
```

---

### Step 5: Submit to Fisher

1. After signing, frontend sends HTTP POST to Fisher:
   ```
   POST http://localhost:8787/execute
   {
     signedAction: {
       user: "0x...",
       data: "0x...",
       signature: "0x..."
     }
   }
   ```
2. Fisher receives request
3. Fisher executes transaction on-chain
4. **Wait:** 10-15 seconds for transaction confirmation

**Expected:** Fisher returns txHash

**Frontend Shows:**
```
Transaction Submitted!
TxHash: 0xabc123...
Status: Pending...
```

**Fisher Logs (check terminal):**
```
POST /execute
Executing SignedAction...
TxHash: 0xabc123...
Confirmed in block 12345
```

---

### Step 6: Verify On-Chain

1. Copy txHash from frontend
2. Open Etherscan Sepolia: https://sepolia.etherscan.io/tx/0x...
3. **Verify Transaction:**
   - Status: Success ✅
   - To: `0x37b4879e0a06323cc429307883d1d73e08c78059` (zkVVM)
   - Function: `deposit()`
   - Events: `Deposited(commitment=0xdef012...)`

4. **Check zkVVM Contract State:**
   - Go to: https://sepolia.etherscan.io/address/0x37b4879e0a06323cc429307883d1d73e08c78059#readContract
   - Call `commitments(0xdef012...)` → Should return `true`
   - Call `currentRoot()` → Should return your computed root

**Expected:** Transaction confirmed, commitment stored

---

### Step 7: Verify Note in LocalStorage

1. Open browser DevTools → Application → LocalStorage
2. Look for key: `zk-notes` or similar
3. Should contain JSON with your note:
   ```json
   [
     {
       "amount": "1000000",
       "secret": "0xabc123...",
       "salt": "0xdef456...",
       "date": "2026-02-21T...",
       "noteStr": "zk-1000000-0xabc123...-0xdef456...",
       "status": "ONCHAIN"
     }
   ]
   ```

**Expected:** Note saved with status "ONCHAIN"

---

## Test 2: Withdraw Flow (Gasless + ZK Proof)

### Prerequisites

- Completed Test 1 (have a note deposited)
- Have the note string saved
- Have a recipient address (can be different wallet)

---

### Step 1: Navigate to Withdraw Page

1. Click "Withdraw" in navigation
2. You should see withdraw form

**Expected:** Withdraw page loads

---

### Step 2: Enter Note String

1. Paste your note string into "Note" field:
   ```
   zk-1000000-0xabc123...-0xdef456...
   ```
2. UI parses the note:
   - Extracts value: `1000000`
   - Extracts secret: `0xabc123...`
   - Extracts salt: `0xdef456...`

**Console Check:**
```javascript
// Look for:
"Note parsed: value=1000000, secret=0xabc..., salt=0xdef..."
```

---

### Step 3: Enter Recipient Address

1. In "Recipient" field, enter an Ethereum address
   - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7`
   - Can be same wallet or different one

**Expected:** Address validates (checksum format)

---

### Step 4: Generate ZK Proof

1. Click "Generate Proof" or "Withdraw" button
2. **This is computationally intensive!**
   - Browser executes `withdraw.nr` circuit in WASM
   - Uses UltraPlonk proving system
   - **Time:** 5-15 seconds (depends on device)
3. Circuit inputs:
   - **Public:** nullifier, merkle_proof_length=10, merkle_root, recipient, commitment
   - **Private:** value, secret, salt, merkle_proof (indices + siblings)
4. Circuit constraints verified:
   - `nullifier == poseidon2([secret, salt])`
   - `commitment == poseidon2([value, nullifier])`
   - `merkle_root(entry, proof) == expected_root`
   - Recipient matches

**Frontend Shows:**
```
Generating proof... (this may take 10-15 seconds)
Progress: [████████░░] 80%
```

**Expected Output:**
```javascript
{
  proof: "0x1a2b3c...", // ~2KB hex string
  publicInputs: [
    "0x789abc...", // nullifier
    "10",          // merkle_proof_length
    "0x901234...", // expected_merkle_root
    "0x742d35...", // recipient
    "0xdef012..."  // commitment
  ]
}
```

**Console Check:**
```javascript
// Look for:
"ZK proof generated successfully"
"Proof size: 2048 bytes"
"Public inputs: [5 fields]"
```

---

### Step 5: Encrypt Amount (Ciphertext)

1. Frontend computes ciphertext:
   ```javascript
   key = keccak256(nullifier || recipient || POOL_SALT)
   keystream = expand(key)  // Generate keystream from key
   ciphertext = amount XOR keystream
   ```
2. **POOL_SALT:** `keccak256("ShieldedPool.v2b")`

**Expected:** Ciphertext generated (32 bytes hex)

**Console Check:**
```javascript
// Look for:
"Ciphertext: 0xaabbcc..."
```

---

### Step 6: Create Withdraw SignedAction

1. Frontend creates `zkVVM.withdraw()` SignedAction with:
   - proof
   - publicInputs (5 fields)
   - ciphertext
   - recipient
   - expectedRoot
2. **MetaMask Popup Appears:**
   - Message to sign (EIP-191):
     ```
     EVVM Action: withdraw
     Nonce: <nonce>
     Recipient: 0x742d35...
     Expected Root: 0x901234...
     ```
   - Click "Sign" (NO gas fee)

**Expected:** Signature created

---

### Step 7: Submit to Fisher

1. Frontend sends POST to http://localhost:8787/execute
2. Fisher receives withdraw SignedAction
3. Fisher executes `zkVVM.withdraw()` on-chain with:
   - ZK proof
   - Public inputs
   - Ciphertext
   - Recipient
   - User signature
4. **Wait:** 10-20 seconds (proof verification on-chain is slower)

**Frontend Shows:**
```
Withdrawing...
TxHash: 0xdef456...
Status: Pending...
```

**Fisher Logs:**
```
POST /execute
Executing withdraw...
Calling MockVerifier.verify()... (or UltraVerifier if deployed)
TxHash: 0xdef456...
Confirmed in block 12346
```

---

### Step 8: Verify On-Chain

1. Copy txHash
2. Open Etherscan: https://sepolia.etherscan.io/tx/0x...
3. **Verify Transaction:**
   - Status: Success ✅
   - To: `0x37b4879e0a06323cc429307883d1d73e08c78059` (zkVVM)
   - Function: `withdraw()`
   - Events: `Withdrawn(nullifier=0x789abc..., recipient=0x742d35..., amount=1000000)`
4. **Check Contract State:**
   - Call `nullifiers(0x789abc...)` → Should return `true` (marked as spent)
5. **Check Recipient Balance:**
   - Go to recipient address on Etherscan
   - **If using real USDC:** Balance should increase by 1 USDC
   - **If simulated (MVP):** Check events only

**Expected:** Transaction confirmed, nullifier marked spent, funds transferred

---

### Step 9: Verify Note Cannot Be Reused

1. Try to withdraw the SAME note again
2. Go through steps 1-6
3. Fisher attempts to execute
4. **Transaction SHOULD FAIL:**
   ```
   Error: Nullifier already spent
   ```

**Expected:** Revert with "Nullifier already spent" or similar

**Console Check:**
```javascript
// Look for:
"Error: execution reverted: Nullifier already spent"
```

---

## Test 3: Edge Cases & Error Handling

### Test 3A: Insufficient Balance

1. Try to deposit 1000000000000 (huge amount)
2. **Expected:** Transaction fails with "Insufficient balance" or similar

### Test 3B: Invalid Proof

1. Generate withdraw proof
2. Manually modify one byte of the proof (in console):
   ```javascript
   proof = proof.slice(0, 10) + 'ff' + proof.slice(12);
   ```
3. Submit
4. **Expected:** MockVerifier might still pass (accepts anything)
5. **With UltraVerifier:** Should fail with "Invalid proof"

### Test 3C: Wrong Recipient

1. Generate proof for recipient A
2. Change recipient to B in SignedAction
3. Submit
4. **Expected:** Proof verification fails (recipient is bound in proof)

### Test 3D: Fisher Offline

1. Stop Fisher (Ctrl+C in terminal)
2. Try to deposit
3. **Expected:** Frontend shows "Fisher offline" or connection error
4. Restart Fisher, retry
5. **Expected:** Works

---

## Expected Results Summary

| Test | Expected Outcome |
|------|------------------|
| **Deposit** | Note created, deposited on-chain via Fisher, commitment stored |
| **Withdraw** | ZK proof generated, verified on-chain, nullifier marked spent, funds transferred |
| **Double-Spend** | Reverts with "Nullifier already spent" |
| **Invalid Proof** | Reverts with "Invalid proof" (only with UltraVerifier) |
| **Fisher Offline** | Connection error, retry succeeds when online |

---

## Debugging Tips

### Frontend Errors

**"Failed to initialize WASM"**
- Check that Noir circuits are compiled
- Verify `packages/noir/target/noirstarter.json` exists
- Clear browser cache and reload

**"Cannot read property 'execute' of undefined"**
- Circuit artifact not loaded
- Check import paths in frontend code

**"Wallet not connected"**
- Ensure MetaMask is installed
- Check that Sepolia testnet is added
- Try disconnect/reconnect

### Fisher Errors

**"EVVM revert: ..."**
- Check Fisher logs for detailed error
- Verify contract addresses in .env
- Ensure Fisher wallet has ETH for gas

**"Nonce already used"**
- Nonce collision (rare)
- Wait a few seconds and retry
- Check that user didn't submit duplicate tx

### On-Chain Errors

**"Commitment already used"**
- Trying to deposit same commitment twice
- Generate new note

**"Root not registered"**
- Merkle root not in `merkleRoots` mapping
- Run `scripts/register-default-root.js`

**"Verifier failed"**
- Invalid ZK proof
- With MockVerifier: Should never happen
- With UltraVerifier: Proof is actually invalid

---

## Performance Benchmarks

Record actual times:

| Operation | Expected Time | Your Time |
|-----------|---------------|-----------|
| Note Generation | ~500ms | _____ |
| Deposit (total) | ~10-15s | _____ |
| Proof Generation | 5-15s | _____ |
| Withdraw (total) | ~15-20s | _____ |
| Fisher Response | ~500ms | _____ |

---

## Test Completion Checklist

- [ ] Deposit flow completed successfully
- [ ] Note saved in localStorage
- [ ] Transaction confirmed on Etherscan
- [ ] Commitment visible on-chain
- [ ] Withdraw flow completed successfully
- [ ] ZK proof generated (5-15 seconds)
- [ ] Funds transferred to recipient
- [ ] Nullifier marked as spent
- [ ] Double-spend attempt reverted
- [ ] All console errors resolved

---

## Next Steps After Manual Testing

Once manual testing passes:

1. **Document Results:**
   - Take screenshots
   - Record txHashes
   - Note any issues

2. **Automated Tests:**
   - Create Playwright scripts
   - Integrate into CI/CD

3. **Production Readiness:**
   - Deploy UltraVerifier (replace MockVerifier)
   - Test with real verifier
   - Deploy Fisher to public server

4. **Security Review:**
   - Code audit
   - Penetration testing
   - Bug bounty program

---

## Appendix: Manual Commands

If frontend has issues, you can test Fisher directly via curl:

### Deposit via curl

```bash
# 1. Generate note (manually or via frontend)
# 2. Create deposit SignedAction JSON
# 3. Send to Fisher:

curl -X POST http://localhost:8787/execute \
  -H "Content-Type: application/json" \
  -d '{
    "signedAction": {
      "user": "0x...",
      "data": "0x...",
      "signature": "0x..."
    }
  }'
```

### Check Fisher Health

```bash
curl http://localhost:8787/health
# Should return: {"status":"ok",...}
# If not, add health endpoint to fisher/index.ts
```

### Check Contract State

```bash
# Using cast (Foundry):
cast call 0x37b4879e0a06323cc429307883d1d73e08c78059 \
  "commitments(bytes)(bool)" \
  0xdef012... \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
```

---

**Testing Status:** Ready to begin
**Last Updated:** February 21, 2026
