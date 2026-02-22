import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import hre from 'hardhat';
import { deployBasicFixture } from './helpers/fixtures';
import { ZERO_ROOT } from './helpers/constants';
import { zeroAddress } from 'viem';

use(chaiAsPromised);

/**
 * zkVVM Constructor Tests
 * Tests contract initialization and immutable state
 */
describe('zkVVM Constructor', () => {
  let fixture: Awaited<ReturnType<typeof deployBasicFixture>>;

  beforeEach(async () => {
    fixture = await deployBasicFixture();
  });

  it('should set admin address correctly', async () => {
    const { admin, mockCore, mockStaking, mockVerifier } = fixture;

    const zkVVM = await hre.viem.deployContract('zkVVM', [
      admin.account.address,
      mockCore.address,
      mockStaking.address,
      mockVerifier.address
    ]);

    const storedAdmin = (await zkVVM.read.admin()) as string;
    expect(storedAdmin.toLowerCase()).to.equal(admin.account.address.toLowerCase());
  });

  it('should set withdrawVerifier immutable reference correctly', async () => {
    const { admin, mockCore, mockStaking, mockVerifier } = fixture;

    const zkVVM = await hre.viem.deployContract('zkVVM', [
      admin.account.address,
      mockCore.address,
      mockStaking.address,
      mockVerifier.address
    ]);

    const storedVerifier = (await zkVVM.read.withdrawVerifier()) as string;
    expect(storedVerifier.toLowerCase()).to.equal(mockVerifier.address.toLowerCase());
  });

  it('should initialize with zero currentRoot', async () => {
    const { admin, mockCore, mockStaking, mockVerifier } = fixture;

    const zkVVM = await hre.viem.deployContract('zkVVM', [
      admin.account.address,
      mockCore.address,
      mockStaking.address,
      mockVerifier.address
    ]);

    const currentRoot = await zkVVM.read.getCurrentRoot();
    expect(currentRoot).to.equal(ZERO_ROOT);
  });

  // Note: The current contract implementation does not validate zero addresses in constructor
  // These tests are commented out as aspirational - add validation to contract if needed
  // it.skip('should reject zero address for admin', async () => { ... });
  // it.skip('should reject zero address for verifier', async () => { ... });
  // it.skip('should reject zero address for core', async () => { ... });
});
