// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ICore, CoreStructs, ProposalStructs} from '@evvm/testnet-contracts/interfaces/ICore.sol';

/**
 * @title MockCore
 * @notice Mock implementation of ICore for testing zkVVM contract
 * @dev Provides configurable success/failure modes for nonce validation and payments
 */
contract MockCore is ICore {
    // Test configuration flags
    bool public shouldFailNonceValidation;
    bool public shouldFailPayment;
    bytes public failureReason;

    // State tracking
    mapping(address => mapping(uint256 => bool)) public usedNonces;
    mapping(address => uint256) public nextSyncNonce;
    address public principalTokenAddress;
    uint256 public evvmID;

    // Events for test verification
    event NonceValidated(address indexed user, bytes32 hashPayload, uint256 nonce);
    event PaymentProcessed(address indexed from, address indexed to, address token, uint256 amount);
    event CaPayProcessed(address indexed to, address token, uint256 amount);

    constructor(address _principalTokenAddress) {
        principalTokenAddress = _principalTokenAddress;
        evvmID = 1; // Default test EVVM ID
    }

    // Configuration methods for tests
    function setFailNonceValidation(bool shouldFail, bytes memory reason) external {
        shouldFailNonceValidation = shouldFail;
        failureReason = reason;
    }

    function setFailPayment(bool shouldFail, bytes memory reason) external {
        shouldFailPayment = shouldFail;
        failureReason = reason;
    }

    function setPrincipalTokenAddress(address _token) external {
        principalTokenAddress = _token;
    }

    function setEvvmID(uint256 _id) external override {
        evvmID = _id;
    }

    // ICore implementations used by zkVVM

    function validateAndConsumeNonce(
        address user,
        bytes32 hashPayload,
        address originExecutor,
        uint256 nonce,
        bool isAsyncExec,
        bytes memory signature
    ) external override {
        if (shouldFailNonceValidation) {
            revert(string(failureReason));
        }

        // Simple nonce validation - mark as used
        require(!usedNonces[user][nonce], "Nonce already used");
        usedNonces[user][nonce] = true;

        emit NonceValidated(user, hashPayload, nonce);
    }

    function pay(
        address from,
        address to_address,
        string memory to_identity,
        address token,
        uint256 amount,
        uint256 priorityFee,
        address senderExecutor,
        uint256 nonce,
        bool isAsyncExec,
        bytes memory signature
    ) external override {
        if (shouldFailPayment) {
            revert(string(failureReason));
        }

        emit PaymentProcessed(from, to_address, token, amount);
    }

    function caPay(address to, address token, uint256 amount) external override {
        emit CaPayProcessed(to, token, amount);
    }

    function getPrincipalTokenAddress() external view override returns (address) {
        return principalTokenAddress;
    }

    function getEvvmID() external view override returns (uint256) {
        return evvmID;
    }

    function getNextCurrentSyncNonce(address user) external view override returns (uint256) {
        return nextSyncNonce[user];
    }

    function getIfUsedAsyncNonce(address user, uint256 nonce) external view override returns (bool) {
        return usedNonces[user][nonce];
    }

    // Minimal implementations of other ICore methods (not used by zkVVM but required by interface)
    fallback() external override {}
    function acceptAdmin() external override {}
    function acceptImplementation() external override {}
    function acceptUserValidatorProposal() external override {}
    function addAmountToUser(address, address, uint256) external override {}
    function addBalance(address, address, uint256) external override {}
    function asyncNonceStatus(address, uint256) external view override returns (bytes1) { return 0x00; }
    function batchPay(CoreStructs.BatchData[] memory) external override returns (uint256, bool[] memory) { return (0, new bool[](0)); }
    function cancelUserValidatorProposal() external override {}
    function disperseCaPay(CoreStructs.DisperseCaPayMetadata[] memory, address, uint256) external override {}
    function dispersePay(address, CoreStructs.DispersePayMetadata[] memory, address, uint256, uint256, address, uint256, bool, bytes memory) external override {}
    function getAsyncNonceReservation(address, uint256) external view override returns (address) { return address(0); }
    function getBalance(address, address) external view override returns (uint256) { return 0; }
    function getChainHostCoinAddress() external pure override returns (address) { return address(0); }
    function getCurrentAdmin() external view override returns (address) { return address(0); }
    function getCurrentImplementation() external view override returns (address) { return address(0); }
    function getEraPrincipalToken() external view override returns (uint256) { return 0; }
    function getEvvmMetadata() external view override returns (CoreStructs.EvvmMetadata memory) { CoreStructs.EvvmMetadata memory m; return m; }
    function getNameServiceAddress() external view override returns (address) { return address(0); }
    function getNextFisherDepositNonce(address) external view override returns (uint256) { return 0; }
    function getPrincipalTokenTotalSupply() external view override returns (uint256) { return 0; }
    function getProposalAdmin() external view override returns (address) { return address(0); }
    function getProposalImplementation() external view override returns (address) { return address(0); }
    function getRewardAmount() external view override returns (uint256) { return 0; }
    function getStakingContractAddress() external view override returns (address) { return address(0); }
    function getTimeToAcceptAdmin() external view override returns (uint256) { return 0; }
    function getTimeToAcceptImplementation() external view override returns (uint256) { return 0; }
    function getUserValidatorAddress() external view override returns (address) { return address(0); }
    function getUserValidatorAddressDetails() external view override returns (ProposalStructs.AddressTypeProposal memory) { ProposalStructs.AddressTypeProposal memory p; return p; }
    function getWhitelistTokenToBeAdded() external view override returns (address) { return address(0); }
    function getWhitelistTokenToBeAddedDateToSet() external view override returns (uint256) { return 0; }
    function initializeSystemContracts(address, address) external override {}
    function isAddressStaker(address) external view override returns (bool) { return false; }
    function pointStaker(address, bytes1) external override {}
    function proposeAdmin(address) external override {}
    function proposeImplementation(address) external override {}
    function proposeUserValidator(address) external override {}
    function recalculateReward() external override {}
    function rejectProposalAdmin() external override {}
    function rejectUpgrade() external override {}
    function removeAmountFromUser(address, address, uint256) external override {}
    function reserveAsyncNonce(uint256, address) external override {}
    function revokeAsyncNonce(uint256) external override {}
    function setPointStaker(address, bytes1) external override {}
}
