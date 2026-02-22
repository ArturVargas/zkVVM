// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title MockStaking
 * @notice Minimal mock implementation of staking contract for testing zkVVM
 * @dev zkVVM inherits from EvvmService which takes staking address, but doesn't directly use it
 */
contract MockStaking {
    // Minimal mock - just needs to exist for constructor
    // zkVVM doesn't directly interact with staking functionality

    constructor() {}
}
