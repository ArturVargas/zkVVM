import hre from 'hardhat';
import type { Address } from 'viem';
import { TEST_AMOUNT } from './constants';

/**
 * Deployment fixture for zkVVM contract testing
 * Sets up full test environment with mock contracts
 */
export async function deployZkVVMFixture() {
  // Get test accounts
  const [deployer, admin, user1, user2, user3] = await hre.viem.getWalletClients();

  // Deploy MockToken (USDC mock)
  const mockToken = await hre.viem.deployContract('MockToken', [
    'Mock USDC',
    'USDC',
    6  // decimals
  ]);

  // Deploy MockCore
  const mockCore = await hre.viem.deployContract('MockCore', [
    mockToken.address
  ]);

  // Deploy MockStaking
  const mockStaking = await hre.viem.deployContract('MockStaking', []);

  // Deploy MockVerifier
  const mockVerifier = await hre.viem.deployContract('MockVerifier', []);

  // Deploy zkVVM contract
  const zkVVM = await hre.viem.deployContract('zkVVM', [
    admin.account.address,      // admin
    mockCore.address,            // core
    mockStaking.address,         // staking
    mockVerifier.address         // withdrawVerifier
  ]);

  // Setup: Mint tokens to test users
  const publicClient = await hre.viem.getPublicClient();

  await mockToken.write.mint([user1.account.address, TEST_AMOUNT * BigInt(100)]);
  await mockToken.write.mint([user2.account.address, TEST_AMOUNT * BigInt(100)]);
  await mockToken.write.mint([user3.account.address, TEST_AMOUNT * BigInt(100)]);

  // Setup: Mint tokens to zkVVM contract (for withdrawals)
  await mockToken.write.mint([zkVVM.address, TEST_AMOUNT * BigInt(1000)]);

  return {
    // Contracts
    zkVVM,
    mockCore,
    mockStaking,
    mockToken,
    mockVerifier,
    // Accounts
    deployer,
    admin,
    user1,
    user2,
    user3,
    // Client
    publicClient
  };
}

/**
 * Simplified fixture without token setup (for constructor tests)
 */
export async function deployBasicFixture() {
  const [deployer, admin] = await hre.viem.getWalletClients();

  const mockToken = await hre.viem.deployContract('MockToken', ['Mock USDC', 'USDC', 6]);
  const mockCore = await hre.viem.deployContract('MockCore', [mockToken.address]);
  const mockStaking = await hre.viem.deployContract('MockStaking', []);
  const mockVerifier = await hre.viem.deployContract('MockVerifier', []);

  return {
    deployer,
    admin,
    mockCore,
    mockStaking,
    mockToken,
    mockVerifier
  };
}
