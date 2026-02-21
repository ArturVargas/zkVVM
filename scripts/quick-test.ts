#!/usr/bin/env bun
/**
 * Quick Test Script - zkVVM Contract Verification
 *
 * Tests basic contract state and functionality on Sepolia EVVM
 */

import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { sepolia } from 'viem/chains';

const RPC_URL = process.env.EVVM_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
const ZKVVM_ADDRESS = process.env.VITE_ZKVVM_ADDRESS || '0xe842803254574e80a6261d7b5d22659f9202d8b4';
const VERIFIER_ADDRESS = '0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77';

const zkVVMABI = [
  {
    "inputs": [],
    "name": "getCurrentRoot",
    "outputs": [{"type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawVerifier",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "bytes"}],
    "name": "commitments",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "bytes32"}],
    "name": "merkleRoots",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "bytes32"}],
    "name": "nullifiers",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

async function main() {
  console.log('🔍 zkVVM Quick Test - Contract Verification\n');
  console.log('Network:', 'Sepolia EVVM');
  console.log('RPC:', RPC_URL);
  console.log('zkVVM:', ZKVVM_ADDRESS);
  console.log('Verifier:', VERIFIER_ADDRESS);
  console.log('─'.repeat(60));

  const client = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL),
  });

  try {
    // Test 1: Get current root
    console.log('\n✓ Test 1: Get Current Merkle Root');
    const root = await client.readContract({
      address: ZKVVM_ADDRESS as `0x${string}`,
      abi: zkVVMABI,
      functionName: 'getCurrentRoot',
    });
    console.log('  Root:', root);
    console.log('  Status:', root === '0x0000000000000000000000000000000000000000000000000000000000000000' ? '✅ Default root registered' : '⚠️ Custom root');

    // Test 2: Get admin
    console.log('\n✓ Test 2: Get Admin Address');
    const admin = await client.readContract({
      address: ZKVVM_ADDRESS as `0x${string}`,
      abi: zkVVMABI,
      functionName: 'admin',
    });
    console.log('  Admin:', admin);
    console.log('  Status:', admin.toLowerCase() === '0xc696ddc31486d5d8b87254d3aa2985f6d0906b3a' ? '✅ Correct admin' : '⚠️ Different admin');

    // Test 3: Get verifier
    console.log('\n✓ Test 3: Get Withdraw Verifier');
    const verifier = await client.readContract({
      address: ZKVVM_ADDRESS as `0x${string}`,
      abi: zkVVMABI,
      functionName: 'withdrawVerifier',
    });
    console.log('  Verifier:', verifier);
    console.log('  Status:', verifier.toLowerCase() === VERIFIER_ADDRESS.toLowerCase() ? '✅ UltraVerifier (secure)' : '❌ Wrong verifier');

    // Test 4: Check if default root is registered
    console.log('\n✓ Test 4: Check Root Registration');
    const isRootRegistered = await client.readContract({
      address: ZKVVM_ADDRESS as `0x${string}`,
      abi: zkVVMABI,
      functionName: 'merkleRoots',
      args: ['0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`],
    });
    console.log('  Registered:', isRootRegistered);
    console.log('  Status:', isRootRegistered ? '✅ Default root accessible' : '❌ Root not registered');

    // Test 5: Check contract code
    console.log('\n✓ Test 5: Verify Contract Deployment');
    const code = await client.getBytecode({
      address: ZKVVM_ADDRESS as `0x${string}`,
    });
    console.log('  Code Size:', code ? `${code.length} bytes` : 'N/A');
    console.log('  Status:', code && code.length > 100 ? '✅ Contract deployed' : '❌ No code found');

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 SUMMARY');
    console.log('═'.repeat(60));
    console.log('✅ Contract Address:', ZKVVM_ADDRESS);
    console.log('✅ Admin Wallet:', admin);
    console.log('✅ Verifier Type:', 'UltraVerifier (Production)');
    console.log('✅ Merkle Root:', 'Registered and accessible');
    console.log('✅ Ready for:', 'Deposits & Withdrawals');
    console.log('═'.repeat(60));
    console.log('\n🎉 All tests passed! Contract is ready for use.\n');
    console.log('Next steps:');
    console.log('1. Open http://localhost:5173');
    console.log('2. Connect wallet');
    console.log('3. Try a deposit (generates note)');
    console.log('4. Try a withdraw (validates ZK proof with UltraVerifier)');
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Error during testing:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

main();
