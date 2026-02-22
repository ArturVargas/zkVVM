import { keccak256, toHex, encodeAbiParameters, parseAbiParameters, type Address, type Hex } from 'viem';
import { POOL_SALT, MERKLE_DEPTH, MOCK_PROOF } from './constants';

/**
 * Utility functions for zkVVM contract testing
 */

/**
 * Generates a commitment from value and secret
 */
export function generateCommitment(value: bigint, secret: bigint): Hex {
  return keccak256(encodeAbiParameters(
    parseAbiParameters('uint256, uint256'),
    [value, secret]
  ));
}

/**
 * Generates a nullifier from commitment and secret
 */
export function generateNullifier(commitment: Hex, secret: bigint): Hex {
  return keccak256(encodeAbiParameters(
    parseAbiParameters('bytes32, uint256'),
    [commitment, secret]
  ));
}

/**
 * Generates public inputs array for withdraw v2b
 * Order: [nullifier, merkle_proof_length, expected_merkle_root, recipient, commitment]
 */
export function generatePublicInputs(
  nullifier: Hex,
  merkleRoot: Hex,
  recipient: Address,
  commitment: Hex
): Hex[] {
  // Convert recipient address to field element
  const recipientField = toHex(BigInt(recipient), { size: 32 });

  return [
    nullifier,
    toHex(BigInt(MERKLE_DEPTH), { size: 32 }), // merkle_proof_length
    merkleRoot,
    recipientField,
    commitment
  ];
}

/**
 * Computes ciphertext for amount encryption
 * Matches on-chain implementation: keccak256(nullifier || recipient || POOL_SALT) -> XOR with amount
 */
export function computeCiphertext(
  amount: bigint,
  nullifier: Hex,
  recipient: Address
): Hex {
  // Convert recipient to field element (32 bytes)
  const recipientField = toHex(BigInt(recipient), { size: 32 });

  // key = keccak256(nullifier || recipientField || POOL_SALT)
  const key = keccak256(encodeAbiParameters(
    parseAbiParameters('bytes32, bytes32, bytes32'),
    [nullifier, recipientField, POOL_SALT]
  ));

  // stream = keccak256(key || 0)
  const stream = keccak256(encodeAbiParameters(
    parseAbiParameters('bytes32, uint256'),
    [key, BigInt(0)]
  ));

  // ciphertext = amount XOR stream
  const ciphertext = BigInt(stream) ^ amount;

  return toHex(ciphertext, { size: 32 });
}

/**
 * Decrypts ciphertext to recover amount
 */
export function decryptCiphertext(
  ciphertext: Hex,
  nullifier: Hex,
  recipient: Address
): bigint {
  // Convert recipient to field element
  const recipientField = toHex(BigInt(recipient), { size: 32 });

  // Recompute key and stream
  const key = keccak256(encodeAbiParameters(
    parseAbiParameters('bytes32, bytes32, bytes32'),
    [nullifier, recipientField, POOL_SALT]
  ));

  const stream = keccak256(encodeAbiParameters(
    parseAbiParameters('bytes32, uint256'),
    [key, BigInt(0)]
  ));

  // Decrypt: amount = ciphertext XOR stream
  const amount = BigInt(ciphertext) ^ BigInt(stream);

  return amount;
}

/**
 * Generates mock proof bytes (MockVerifier accepts anything)
 */
export function generateMockProof(): Hex {
  return MOCK_PROOF;
}

/**
 * Hashes deposit payload for nonce validation
 * Must match contract: keccak256(abi.encode('deposit', commitment, amount, expectedNextRoot))
 */
export function hashDepositPayload(
  commitment: Hex,
  amount: bigint,
  expectedNextRoot: Hex
): Hex {
  return keccak256(encodeAbiParameters(
    parseAbiParameters('string, bytes, uint256, bytes32'),
    ['deposit', commitment, amount, expectedNextRoot]
  ));
}

/**
 * Hashes withdraw payload for nonce validation
 * Must match contract: keccak256(abi.encode('withdraw', recipient, proof, publicInputs, ciphertext))
 */
export function hashWithdrawPayload(
  recipient: Address,
  proof: Hex,
  publicInputs: Hex[],
  ciphertext: Hex
): Hex {
  return keccak256(encodeAbiParameters(
    parseAbiParameters('string, address, bytes, bytes32[], bytes32'),
    ['withdraw', recipient, proof, publicInputs, ciphertext]
  ));
}

/**
 * Generates a test signature (for mock - not cryptographically valid)
 */
export function generateMockSignature(): Hex {
  return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b' as Hex;
}

/**
 * Helper to convert recipient address to field element (for public inputs)
 */
export function addressToField(address: Address): Hex {
  return toHex(BigInt(address), { size: 32 });
}

/**
 * Helper to convert field element to address
 */
export function fieldToAddress(field: Hex): Address {
  const bigIntValue = BigInt(field);
  return toHex(bigIntValue, { size: 20 }) as Address;
}
