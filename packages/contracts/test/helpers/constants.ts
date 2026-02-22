import { keccak256, toBytes } from 'viem';

/**
 * Test constants for zkVVM contract testing
 */

// Pool salt used for ciphertext encryption (must match contract)
export const POOL_SALT = keccak256(toBytes('ShieldedPool.v2b'));

// Merkle tree configuration
export const MERKLE_DEPTH = 10;
export const ZERO_ROOT = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;

// Sample test values
export const TEST_AMOUNT = BigInt(1000000); // 1 USDC (6 decimals)
export const TEST_NULLIFIER = keccak256(toBytes('test-nullifier-1'));
export const TEST_COMMITMENT = keccak256(toBytes('test-commitment-1'));
export const TEST_RECIPIENT_FIELD = BigInt('0x1234567890abcdef1234567890abcdef12345678');

// Sample merkle root for testing
export const TEST_MERKLE_ROOT = keccak256(toBytes('test-merkle-root-1'));
export const TEST_MERKLE_ROOT_2 = keccak256(toBytes('test-merkle-root-2'));

// Mock proof data (MockVerifier accepts anything)
export const MOCK_PROOF = '0x1234567890abcdef' as `0x${string}`;
