---
name: EVVM
description: Context about how to use the EVVM (evvm.org)
---

# EVVM Documentation

> Complete technical documentation for EVVM (Ethereum Virtual Virtual Machine) - Infraless EVM Virtualization solving Scalability and Chain Fragmentation

This document contains the complete EVVM technical documentation optimized for AI agents and LLMs.

EVVM (Ethereum Virtual Virtual Machine) enables virtual blockchains on top of host blockchains without physical infrastructure management.

## Key Concepts

- **Virtual Blockchain**: Blockchain logic decoupled from physical infrastructure
- **Fishers**: Network operators who execute signed transactions and earn MATE rewards
- **Gasless UX**: Users never pay gas fees - they sign messages, Fishers execute on-chain
- **EIP-191 Signatures**: All operations are authorized via cryptographic signatures
- **MATE Token**: Native principal token for payments and staking rewards
- **Staking System**: Era-based rewards with golden, presale, public, and service staking tiers

## Documentation Structure

1. **QuickStart** - Deploy your own EVVM in minutes
2. **Transaction Process** - How transactions flow through EVVM
3. **Contracts** - Core smart contract documentation (EVVM, NameService, Staking, Treasury, P2PSwap)
4. **Signature Structures** - EIP-191 signature formats for all operations
5. **Libraries** - TypeScript and Solidity libraries for EVVM development
6. **Registry** - EVVM registration and governance
7. **CLI** - Command-line deployment tools

Production URL: https://www.evvm.info

## EVVM Core Contract Overview


The EVVM (*E*thereum *V*irtual *V*irtual *M*achine) Core Contract (`Core.sol`) is the central infrastructure component of the EVVM ecosystem, providing unified payment processing, signature verification, centralized nonce management, and treasury operations.

## Core Features

### Payment System
- **`pay`**: Single payment function with automatic staker detection and reward distribution
- **`batchPay`**: Process multiple independent payments in a single transaction with individual success tracking
- **`dispersePay`**: Distribute tokens from one sender to multiple recipients with a single signature
- **Contract Payments**: `caPay` and `disperseCaPay` for smart contract integrations

### Centralized Nonce Management
- **Unified Nonce System**: Core.sol manages all nonces for the entire EVVM ecosystem (NameService, Staking, P2PSwap, Treasury)
- **Replay Attack Prevention**: Centralized nonce tracking prevents replay attacks across multi-service transactions
- **Dual Nonce Types**: Supports both synchronous (sequential) and asynchronous (parallel) execution modes
- **Service Integration**: All EVVM services use Core.sol for nonce validation and signature verification

### Token Management
- **Token Abstractions**: Internal token representation system using EIP-191 signatures
- **Balance Types**: Principal balances, reward balances, and cross-chain reserves
- **Transfer Authorization**: Signature-based validation for all operations

### System Integration
- **Name Service**: Username-based identity resolution for payments
- **Staking System**: MATE token staking and reward coordination
- **Treasury Operations**: Manages deposits, withdrawals, and cross-chain asset transfers
- **Service Integration**: Provides signature verification and nonce management for all EVVM services
- **Proxy Architecture**: Upgradeable contract with time-delayed governance

## Security Architecture

### Centralized Signature Verification
- **EIP-191 Standard**: All transactions require cryptographic signatures validated by Core.sol
- **Unified Verification**: Single point of signature validation for the entire ecosystem
- **Service-Specific Hashing**: Each service uses dedicated hash functions (e.g., `CoreHashUtils`, `NameServiceHashUtils`) for payload construction
- **Signature Payload Format**: `{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}`

### Replay Protection
- **Centralized Nonce Tracking**: Core.sol manages all nonces to prevent replay attacks across services
- **Multi-Service Security**: Single nonce system prevents cross-service transaction replay
- **Dual Nonce Support**: Both sync (sequential) and async (parallel) nonce modes available

### Governance System
- **Time-Delayed Changes**: 30-day delay for proxy implementation changes, 1-day for administrative updates
- **Community Protection**: All changes visible before execution
- **Emergency Controls**: Admin can reject problematic proposals

## Token Architecture

### Token Abstraction System
EVVM implements internal token abstractions instead of traditional ERC-20 contracts:

- **Internal Representations**: Tokens exist as abstractions within EVVM
- **Signature-Based Authorization**: All transfers authorized through EIP-191 signatures
- **Input Validation**: Signatures validated against exact function parameters

### Balance Management
- **Principal Balances**: Direct token holdings managed by core contract
- **Reward Balances**: Accumulated principal token rewards from staking and system participation
- **Cross-Chain Reserves**: Tokens locked for Fisher Bridge operations
- **Pending Withdrawals**: Balances reserved for cross-chain withdrawal processing

## Integration Capabilities

### Name Service Integration
- **Username Payments**: Convert usernames to wallet addresses automatically
- **Identity Resolution**: Support both direct addresses and Name Service identities
- **Validation Layer**: Verification of identity ownership and validity

## Core Responsibilities

### Payment Processing
- **Token Transfers**: Handles all token movements within the EVVM ecosystem
- **Batch Operations**: Efficient multi-payment processing with individual transaction tracking
- **Staker Rewards**: Automatic reward distribution to fishers and stakers

### Signature & Nonce Management
- **Signature Verification**: Validates all EIP-191 signatures for ecosystem operations
- **Nonce Coordination**: Manages synchronous and asynchronous nonces for all services
- **Service Authorization**: Provides secure transaction authorization for Name Service, Staking, P2PSwap, and Treasury

### Treasury Operations
- **Deposit Management**: Handles principal token deposits and reward balances
- **Withdrawal Processing**: Manages token withdrawals and cross-chain transfers
- **Balance Tracking**: Maintains accurate balance records for all users and services

## Execution Methods

Core.sol supports two execution approaches:

### Direct Execution
- **User-Initiated**: Users interact directly with Core.sol functions
- **Immediate Processing**: Transactions submitted directly to the blockchain
- **Full Control**: Complete autonomy over transaction timing and parameters

### Fisher Execution  
- **Fishing Spot Integration**: Users submit signed transactions through fishing spots
- **Fisher Processing**: Specialized fisher nodes capture and execute transactions on behalf of users
- **Gasless Experience**: Users don't pay gas fees; fishers handle execution and receive rewards
- **Optimized Routing**: Fishers manage transaction optimization and gas handling

The Core Contract serves as the foundational infrastructure layer, providing unified payment processing, signature verification, centralized nonce management, and treasury operations for the entire EVVM ecosystem.

---

## Nonce Types in EVVM


Core.sol manages all nonces centrally for the entire EVVM ecosystem, implementing two distinct nonce mechanisms: `sync` and `async`. This centralized approach prevents replay attacks across multi-service transactions, as all services (Core, NameService, Staking, P2PSwap, Treasury) use the same unified nonce system.

## Centralized Nonce Management

**Why centralized nonces?**

EVVM fundamentally restructured nonce management. Previously, each service maintained its own nonce system, which created potential security vulnerabilities in cross-service transactions. Now, Core.sol serves as the single source of truth for all nonce validation:

- **Unified Tracking**: All nonces are tracked and validated by Core.sol
- **Cross-Service Security**: Prevents replay attacks when transactions span multiple services
- **Simplified Architecture**: Services no longer need individual nonce management logic
- **Consistent Behavior**: All ecosystem transactions follow the same nonce rules

Understanding these nonce types is essential for developers interfacing with any EVVM service, as they serve different purposes and behave in significantly different ways.

## Sync Nonce

### Definition and Behavior

The sync nonce is a consecutive counter that increments sequentially by one each time a payment transaction is executed. This mechanism closely resembles the standard nonce implementation used in Ethereum transactions.

### Key Characteristics:

- **Sequential Incrementing**: Each successful transaction increases the nonce value by exactly one unit.
- **Transaction Ordering**: Ensures transactions are processed in the order they were issued.
- **Replay Protection**: Prevents transaction replay attacks by requiring each transaction to have a unique nonce value.
- **Predictability**: The next valid nonce is always the current nonce value plus one.

### Use Cases:

- Standard payment operations where transaction order matters
- Operations that require deterministic processing sequence
- Situations where transaction dependencies exist
- Services that rely on deterministic payment processing

---

## Async Nonce

### Definition and Behavior

The async nonce is a non-consecutive number that is user-generated and transaction-specific. Unlike the sync nonce, async nonces do not follow a predetermined sequence and can be any valid number chosen by the user.

### Key Characteristics:

- **Non-sequential**: Numbers don't need to follow any particular order or sequence.
- **Uniqueness Per Address**: Each async nonce can only be used once per address.
- **User-defined**: Users can generate their own nonce values, providing flexibility in transaction preparation.
- **Parallelism**: Multiple transactions can be prepared independently without knowledge of other pending transactions.

### Use Cases:

- Parallel transaction processing
- Delayed execution scenarios
- Batch transaction preparation without dependency on execution order
- Systems where transaction preparation and submission might happen on different timelines

---

## Service Integration with Core.sol

All EVVM services rely on Core.sol for nonce management and validation:

### How Services Use Core Nonces

**NameService**, **Staking**, **P2PSwap**, and **Treasury** all follow this pattern:

1. **Signature Construction**: Service-specific hash functions create payload hashes (e.g., `NameServiceHashUtils.hashDataForRegister()`)
2. **Core Validation**: Services call Core.sol to verify signatures and validate nonces
3. **Unified Format**: All signatures follow the format: `{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}`
4. **Nonce Tracking**: Core.sol marks nonces as used after validation

### Benefits of Centralized Nonces

**Security:**
- **No Replay Across Services**: A signature used in NameService cannot be replayed in Staking or other services
- **Single Validation Point**: All nonce checks happen in Core.sol, reducing attack surface
- **Consistent Rules**: Same nonce behavior across all ecosystem components

**Developer Experience:**
- **Simplified Integration**: Services don't need to implement nonce logic
- **Predictable Behavior**: Same nonce rules everywhere in the ecosystem
- **Unified API**: All services use Core.sol's nonce getter functions

### Nonce Getter Functions

**Check Sync Nonce:**
```solidity
Core.getNextCurrentSyncNonce(address user)
```
Returns the next expected sequential nonce for the user.

**Check Async Nonce:**
```solidity
Core.getIfUsedAsyncNonce(address user, uint256 nonce)
```
Returns `true` if the nonce has been used, `false` if it's available.

> **Tip: Multi-Service Transactions**
When building transactions that interact with multiple EVVM services (e.g., staking and then registering a username), use async nonces to allow flexible execution ordering. The centralized nonce system ensures these operations cannot be replayed across services.

---

## Signature & Nonce Management


Core.sol provides centralized signature verification and nonce management for all EVVM services. This unified system ensures security consistency across the entire ecosystem and prevents replay attacks in multi-service transactions.

## validateAndConsumeNonce

**Function Type**: `external`  
**Function Signature**: `validateAndConsumeNonce(address,bytes32,address,uint256,bool,bytes)`

The primary function used by all EVVM services (NameService, Staking, P2PSwap, Treasury) to validate user signatures and consume nonces atomically. This is the foundation of the centralized signature verification system.

### Key Features

- **Centralized Validation**: Single point of signature verification for entire ecosystem
- **Atomic Operation**: Signature validation and nonce consumption happen together
- **Service Authorization**: Only smart contracts can call this function
- **User Filtering**: Integrates with optional UserValidator for transaction filtering
- **Cross-Service Security**: Prevents replay attacks between different services

### Parameters

| Field            | Type      | Description                                                                                         |
| ---------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `user`           | `address` | Address of the transaction signer                                                                   |
| `hashPayload`    | `bytes32` | Hash of the transaction parameters (generated by service-specific hash functions)                   |
| `originExecutor` | `address` | Optional `tx.origin` restriction. Use `address(0)` to allow any origin                              |
| `nonce`          | `uint256` | Nonce to validate and consume                                                                       |
| `isAsyncExec`    | `bool`    | `true` for asynchronous (parallel) nonces, `false` for synchronous (sequential)                     |
| `signature`      | `bytes`   | User's EIP-191 authorization signature                                                              |

### How Services Use This Function

All EVVM services follow this pattern:

```solidity
// 1. Service generates hash of its specific operation parameters
bytes32 hashPayload = NameServiceHashUtils.hashDataForRegister(
    username,
    lockNumber,
    amountToPay
);

// 2. Service calls Core.validateAndConsumeNonce
Core(coreAddress).validateAndConsumeNonce(
    user,
    hashPayload,
    originExecutor,
    nonce,
    isAsyncExec,
    signature
);

// 3. If no revert, signature is valid and nonce is consumed
// Service can now safely execute its logic
```

### Workflow

1. **Contract Verification**: Validates that `msg.sender` is a smart contract using `CAUtils.verifyIfCA()`. Reverts with `MsgSenderIsNotAContract` if called by an EOA.

2. **Signature Verification**: Reconstructs and validates the signature:
   - Builds signature payload: `buildSignaturePayload(evvmId, msg.sender, hashPayload, originExecutor, nonce, isAsyncExec)`
   - Recovers signer using `SignatureRecover.recoverSigner()`
   - Compares recovered address with `user` parameter
   - Reverts with `InvalidSignature` on mismatch

3. **Origin Executor Validation**: If `originExecutor` is not `address(0)`, checks that `tx.origin` matches. Reverts with `OriginIsNotTheOriginExecutor` on mismatch.

4. **User Validation**: Checks if user is allowed to execute transactions via `canExecuteUserTransaction(user)` (integrates with UserValidator if configured). Reverts with `UserCannotExecuteTransaction` if blocked.

5. **Nonce Management**: Validates and consumes the nonce based on `isAsyncExec`:
   - **Async (isAsyncExec = true)**: 
     - Checks nonce status via `asyncNonceStatus(user, nonce)`
     - Reverts with `AsyncNonceAlreadyUsed` if already used
     - Reverts with `AsyncNonceIsReservedByAnotherService` if reserved by different service
     - Marks nonce as used: `asyncNonce[user][nonce] = true`
   - **Sync (isAsyncExec = false)**:
     - Verifies nonce matches `nextSyncNonce[user]`
     - Reverts with `SyncNonceMismatch` on mismatch
     - Increments sync nonce: `++nextSyncNonce[user]`

### Security Features

**Replay Attack Prevention:**
- Atomic signature verification and nonce consumption
- Service-specific validation prevents cross-service replay
- Reserved nonces prevent service interference

**Service Isolation:**
- Each service provides unique `hashPayload`
- `msg.sender` (service address) is part of signature payload
- Signatures cannot be reused across services

**User Protection:**
- Optional UserValidator integration for compliance filtering
- Origin executor restrictions for additional security
- Consistent validation rules across all services

> **Tip: For Service Developers**
When building a custom EVVM service, always call `validateAndConsumeNonce` BEFORE executing any state changes. This ensures signatures are valid and prevents replay attacks.

---

## Nonce Reservation System

Core.sol provides a nonce reservation system allowing users to pre-allocate async nonces to specific services. This prevents race conditions and ensures deterministic execution ordering.

### reserveAsyncNonce

**Function Type**: `external`  
**Function Signature**: `reserveAsyncNonce(uint256,address)`

Reserves an async nonce exclusively for a specific service address.

#### Parameters

| Field            | Type      | Description                                          |
| ---------------- | --------- | ---------------------------------------------------- |
| `nonce`          | `uint256` | The async nonce value to reserve                     |
| `serviceAddress` | `address` | Service contract that can use this nonce             |

#### Use Cases

- **Cross-chain operations**: Reserve nonces for multi-step cross-chain transactions
- **Multi-signature workflows**: Ensure specific executors process transactions
- **Service-specific queues**: Create dedicated transaction queues per service
- **Front-running prevention**: Block other services from using specific nonces

#### Workflow

1. **Service Validation**: Checks that `serviceAddress` is not `address(0)`. Reverts with `InvalidServiceAddress` if zero.
2. **Usage Check**: Verifies nonce hasn't been used. Reverts with `AsyncNonceAlreadyUsed` if already consumed.
3. **Reservation Check**: Ensures nonce isn't already reserved. Reverts with `AsyncNonceAlreadyReserved` if reserved.
4. **Reserve**: Sets `asyncNonceReservedPointers[msg.sender][nonce] = serviceAddress`

#### Example

```solidity
// Reserve nonces 100-105 for NameService operations
for (uint256 i = 100; i <= 105; i++) {
    core.reserveAsyncNonce(i, nameServiceAddress);
}

// Now only NameService can consume these nonces for this user
```

---

### revokeAsyncNonce

**Function Type**: `external`  
**Function Signature**: `revokeAsyncNonce(address,uint256)`

Revokes a previously reserved async nonce, making it available for any service.

#### Parameters

| Field   | Type      | Description                               |
| ------- | --------- | ----------------------------------------- |
| `user`  | `address` | Address that reserved the nonce           |
| `nonce` | `uint256` | The async nonce to revoke reservation for |

#### Use Cases

- **Canceling operations**: Free nonces from canceled transactions
- **Correcting mistakes**: Fix accidental reservations
- **Reallocation**: Reassign nonces to different services

#### Workflow

1. **Usage Check**: Verifies nonce hasn't been used. Reverts with `AsyncNonceAlreadyUsed` if consumed.
2. **Reservation Check**: Ensures nonce is currently reserved. Reverts with `AsyncNonceNotReserved` if not.
3. **Clear**: Sets `asyncNonceReservedPointers[user][nonce] = address(0)`

> **Warning: Access Control**
Currently, `revokeAsyncNonce` can be called by anyone. In production, consider implementing authorization checks to ensure only the user or authorized addresses can revoke reservations.

---

## UserValidator System

Core.sol supports an optional UserValidator contract for transaction filtering and compliance requirements. This system allows blocking specific users from executing transactions without modifying Core.sol.

### Overview

The UserValidator system provides:

- **Optional Filtering**: Can be enabled/disabled without contract upgrades
- **Time-Delayed Governance**: 1-day waiting period for validator changes
- **Flexible Implementation**: Validator contract defines filtering logic
- **Ecosystem-Wide Effect**: Affects all services using `validateAndConsumeNonce`

### proposeUserValidator

**Function Type**: `external` (Admin only)  
**Function Signature**: `proposeUserValidator(address)`

Proposes a new UserValidator contract address with a 1-day time-lock.

#### Parameters

| Field          | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `newValidator` | `address` | Address of proposed UserValidator contract |

---

### cancelUserValidatorProposal

**Function Type**: `external` (Admin only)  
**Function Signature**: `cancelUserValidatorProposal()`

Cancels a pending UserValidator proposal before the time-lock expires.

---

### acceptUserValidatorProposal

**Function Type**: `external` (Admin only)  
**Function Signature**: `acceptUserValidatorProposal()`

Finalizes the UserValidator change after the 1-day time-lock period.

**Requirements:**
- Time-lock period must have passed
- Reverts with `ProposalForUserValidatorNotReady` if called too early

---

### IUserValidator Interface

Custom UserValidator contracts must implement:

```solidity
interface IUserValidator {
    function canExecute(address user) external view returns (bool);
}
```

**Implementation Examples:**

```solidity
// Whitelist-based validator
contract WhitelistValidator is IUserValidator {
    mapping(address => bool) public whitelisted;
    
    function canExecute(address user) external view returns (bool) {
        return whitelisted[user];
    }
}

// Blacklist-based validator
contract BlacklistValidator is IUserValidator {
    mapping(address => bool) public blacklisted;
    
    function canExecute(address user) external view returns (bool) {
        return !blacklisted[user];
    }
}

// KYC-based validator
contract KYCValidator is IUserValidator {
    mapping(address => bool) public kycVerified;
    
    function canExecute(address user) external view returns (bool) {
        return kycVerified[user];
    }
}
```

> **Note: Integration with Services**
When a UserValidator is active, `validateAndConsumeNonce` calls `validator.canExecute(user)` before processing any transaction. If it returns `false`, the transaction reverts with `UserCannotExecuteTransaction`.

---

## Related Functions

For information on nonce getter functions, see:
- [getNextCurrentSyncNonce](./05-Getters.md#getnextcurrentsyncnonce)
- [getIfUsedAsyncNonce](./05-Getters.md#getifusedasyncnonce)
- [getAsyncNonceReservation](./05-Getters.md#getasyncnoncereservation)
- [asyncNonceStatus](./05-Getters.md#asyncnoncestatus)
- [getUserValidatorAddress](./05-Getters.md#getuservalidatoraddress)

---

## pay Function


**Function Type**: `external`  
**Function Signature**: `pay(address,address,string,address,uint256,uint256,address,uint256,bool,bytes)`

The `pay` function executes a payment from one address to a single recipient address or identity. This is EVVM Core's primary single payment function with intelligent staker detection and centralized signature verification.

**Key features:**
- **Single Payment**: Transfers tokens from one sender to one recipient (address or username)
- **Staker Detection**: Automatically detects if the executor is a staker and distributes rewards accordingly
- **Centralized Nonce Management**: Uses Core.sol's unified nonce system for enhanced security
- **Identity Resolution**: Can send payments to usernames which are resolved to addresses via NameService
- **Signature Verification**: Validated through Core.sol's centralized signature system

The function supports both synchronous and asynchronous nonce management through the `isAsyncExec` parameter, making it flexible for various execution patterns and use cases. For details on nonce types, see [Nonce Types in EVVM](../02-NonceTypes.md). For signature details, see [Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

### Parameters

| Field            | Type      | Description                                                                                                                                    |
|------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `from`           | `address` | The address of the payment sender whose funds are being transferred and whose signature/nonce are validated.                                   |
| `to_address`     | `address` | Direct recipient address. Used when `to_identity` is empty.                                                                                    |
| `to_identity`    | `string`  | Username/identity of the recipient. If provided, the contract resolves it to an address via the NameService.                                   |
| `token`          | `address` | The token contract address for the transfer.                                                                                                   |
| `amount`         | `uint256` | The quantity of tokens to transfer from `from` to the recipient.                                                                               |
| `priorityFee`    | `uint256` | Additional fee for transaction priority. If the executor is a staker, they receive this fee as a reward.                                       |
| `senderExecutor` | `address` | Address authorized to execute this transaction. Use `address(0)` to allow any address to execute.                                              |
| `nonce`          | `uint256` | Transaction nonce value managed by Core.sol. Usage depends on `isAsyncExec`: if `false` (sync), must equal the expected synchronous nonce; if `true` (async), can be any unused nonce. |
| `isAsyncExec`    | `bool`    | Execution type flag: `false` = synchronous nonce (sequential), `true` = asynchronous nonce (parallel).                                          |
| `signature`      | `bytes`   | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this payment. Validated by Core.sol's centralized signature system.                 |

> **Note: Centralized Nonce Management**
The `nonce` parameter is managed centrally by Core.sol. When `isAsyncExec` is `false` (synchronous), the provided `nonce` must equal `Core.getNextCurrentSyncNonce(from)`. When `true` (asynchronous), the nonce can be any value not yet used, checked via `Core.getIfUsedAsyncNonce(from, nonce)`.

### Execution Methods

The function can be executed in multiple ways:

#### Fisher Execution

1. A user signs the payment details and sends the request (parameters + signature) to a fishing spot.
2. A fisher (preferably a staker for rewards) captures the transaction and validates the request.
3. The fisher submits the transaction to the function for processing and receives rewards if they are a staker.

#### Direct Execution

1. The user or any authorized service directly calls the `pay` function.
2. If a `senderExecutor` address is specified, only that address can submit the transaction.
3. If `senderExecutor` is set to `address(0)`, anyone can execute the transaction with a valid signature.

> **Tip: Additional Security Using Executor Address**
When using a service as the executor, we recommend specifying the service's address in the `senderExecutor` parameter for additional security.

### Workflow

1. **Signature Verification**: Validates the `signature` using Core.sol's centralized signature verification system:
   - Constructs signature payload: `buildSignaturePayload(evvmId, address(this), hashPayload, senderExecutor, nonce, isAsyncExec)`
   - `hashPayload` is generated via `CoreHashUtils.hashDataForPay(to_address, to_identity, token, amount, priorityFee)`
   - Recovers signer and compares with `from` address. Reverts with `InvalidSignature` on failure.

2. **User Validation**: Checks if the user is allowed to execute transactions using `canExecuteUserTransaction(from)`. Reverts with `UserCannotExecuteTransaction` if not allowed.

3. **Nonce Management**: Core.sol handles nonce verification and updates based on `isAsyncExec`:
   - **Async (isAsyncExec = true)**: Checks if the nonce hasn't been used via `asyncNonceStatus(from, nonce)`, then marks it as used. Reverts with `AsyncNonceAlreadyUsed` if already used, or `AsyncNonceIsReservedByAnotherService` if reserved by another service.
   - **Sync (isAsyncExec = false)**: Verifies the nonce matches `nextSyncNonce[from]`, then increments it. Reverts with `SyncNonceMismatch` on mismatch.

4. **Executor Validation**: If `senderExecutor` is not `address(0)`, checks that `msg.sender` matches the `senderExecutor` address. Reverts with `SenderIsNotTheSenderExecutor` if they don't match.

5. **Resolve Recipient Address**: Determines the final recipient address:
   - If `to_identity` is provided (not empty), resolves the identity to an owner address using `verifyStrictAndGetOwnerOfIdentity` from the NameService contract.
   - If `to_identity` is empty, uses the provided `to_address`.

6. **Balance Update**: Executes the payment transfer using the `_updateBalance` function, sending `amount` of `token` from the `from` address to the resolved recipient address.

7. **Staker Benefits Distribution**: If the executor (`msg.sender`) is a registered staker:
   - **Priority Fee Transfer**: If `priorityFee > 0`, transfers the `priorityFee` amount of `token` from the `from` address to the `msg.sender` (executor) as a staker reward.
   - **Principal Token Reward**: Grants 1x reward amount in principal tokens to the `msg.sender` (executor) using the `_giveReward` function.


For more information about the signature structure, refer to the [Payment Signature Structure section](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).


**Need to send from one user to multiple recipients?**  
Use [dispersePay](./03-dispersePay.md) to send tokens from a single sender to multiple different addresses or identities in one transaction.

**Need to execute multiple separate payments?**  
Use [batchPay](./02-batchPay.md) to process several individual `pay` operations within a single transaction, each with their own sender, recipient, and parameters.

---

## batchPay Function


**Function Type**: `external`  
**Function Signature**: `batchPay((address,address,string,address,uint256,uint256,address,uint256,bool,bytes)[])`
**Returns**: `(uint256 successfulTransactions, bool[] memory results)`

Processes multiple payments in a single transaction batch with individual success/failure tracking. Each payment instruction can originate from different senders and supports both staker and non-staker payment types, with comprehensive transaction statistics and detailed results for each operation.

## Parameters

| Parameter   | Type          | Description                                                   |
| ----------- | ------------- | ------------------------------------------------------------- |
| `batchData` | BatchData[] | An array of structs, each defining a single payment operation |

## Return Values

| Return Value             | Type        | Description                                                 |
| ------------------------ | ----------- | ----------------------------------------------------------- |
| `successfulTransactions` | `uint256`   | Number of payments that completed successfully              |
| `results`                | `bool[]`    | Boolean array indicating success/failure for each payment  |

## `BatchData` Struct

Defines the complete set of parameters for a single, independent payment within the batch.

```solidity
struct BatchData {
    address from;
    address to_address;
    string to_identity;
    address token;
    uint256 amount;
    uint256 priorityFee;
    address senderExecutor;
    uint256 nonce;
    bool isAsyncExec;
    bytes signature;
}
```

| Field            | Type      | Description                                                                                                                                         |
| ---------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | `address` | The address of the payment sender whose funds are being transferred and whose signature/nonce are validated.                                        |
| `to_address`     | `address` | Direct recipient address. Used when `to_identity` is empty.                                                                                         |
| `to_identity`    | `string`  | Username/identity of the recipient. If provided, the contract resolves it to an address via the NameService.                                        |
| `token`          | `address` | The token address for the transfer.                                                                                                        |
| `amount`         | `uint256` | The quantity of tokens to transfer from `from` to the recipient.                                                                                    |
| `priorityFee`    | `uint256` | Fee amount distributed to stakers as reward (only paid if executor is a staker).                                                                    |
| `senderExecutor` | `address` | Address authorized to execute this transaction. Use `address(0)` to allow any address to execute.                                                   |
| `nonce`          | `uint256` | Nonce value for transaction ordering and replay protection (managed centrally by Core.sol).                                              |
| `isAsyncExec`    | `bool`    | Determines nonce type: `true` for asynchronous (parallel), `false` for synchronous (sequential).                                          |
| `signature`      | `bytes`   | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this payment.                      |

> **Note: Signature Structure**
For details on signature construction, refer to the [Payment Signature Structure section](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md). Uses the centralized format: `{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}`.

## Execution Methods

This function can be executed by any address, with different behavior depending on whether the executor is a staker:

### Fisher Execution

- A fisher collects multiple authorized `BatchData` structures (with valid signatures) from various users through fishing spots.
- The fisher aggregates these into the `batchData` array and submits the transaction.
- If the fisher is a staker, they receive priority fees and principal token rewards.

### Direct Execution

- A user or service constructs the `batchData` array with one or multiple payment requests.
- They directly call `batchPay` with appropriate authorization.
- Staker executors receive priority fees and principal token rewards based on successful transactions.

> **Warning: Signature Validation Behavior**
If any signature verification fails during processing, the transaction will mark that specific payment as failed but continue processing remaining payments. Individual signature failures do not revert the entire batch. Other validation failures (insufficient balance, nonce issues, etc.) also mark individual payments as failed while allowing the batch to continue.

## Workflow

The function processes each payment in the `batchData` array independently, allowing partial success:

1. **Initialize Staker Status**: Checks once if `msg.sender` is a staker to optimize gas usage across all payments.

2. **Initialize Results Array**: Creates a boolean array to track individual payment results.

3. **For each payment in the array**:

   a. **Signature Verification**: Validates the `signature` using Core.sol's centralized signature verification:
   - Constructs signature payload: `buildSignaturePayload(evvmId, address(this), hashPayload, executor, nonce, isAsyncExec)`
   - `hashPayload` is generated via `CoreHashUtils.hashDataForPay(to_address, to_identity, token, amount, priorityFee)`
   - If signature is invalid, marks payment as failed and continues to next payment.

   b. **User Validation**: Checks if the user is allowed to execute transactions using `canExecuteUserTransaction()`. If not allowed, marks payment as failed.

   c. **Nonce Management**: Handles nonce verification and updates via Core.sol's centralized nonce system based on `isAsyncExec`:
   - **Async (isAsyncExec = true)**: Checks if the nonce hasn't been used via `asyncNonceStatus()`, then marks it as used. If already used or reserved by another service, marks payment as failed.
   - **Sync (isAsyncExec = false)**: Verifies the nonce matches the expected sequential nonce from `nextSyncNonce[from]`, then increments it. If mismatch, marks payment as failed.

   d. **Executor Validation**: If `senderExecutor` is not `address(0)`, checks that `msg.sender` matches the `senderExecutor` address. If they don't match, marks the payment as failed and continues to the next payment.

   e. **Balance Verification**: Checks if the sender has sufficient balance for both `amount` and `priorityFee` (if executor is a staker). If insufficient, marks payment as failed.

   f. **Recipient Resolution**: Determines the final recipient address:
   - If `to_identity` is provided, resolves it using `getOwnerOfIdentity()` from the NameService.
   - If `to_identity` is empty, uses `to_address`.
   - If identity resolution fails, marks payment as failed.

   g. **Payment Execution**: Executes the main transfer using `_updateBalance()` to move tokens from sender to recipient.

   h. **Priority Fee Distribution**: If the payment succeeded and `priorityFee > 0` and the executor is a staker, transfers the priority fee to the executor.

   i. **Result Tracking**: Marks the payment as successful and increments the success counter.

4. **Staker Rewards**: After processing all payments, if the executor is a staker, grants principal token rewards equal to the number of successful transactions using `_giveReward()`. 

5. **Return Values**: Returns the count of successful transactions and the detailed results array.

> **Note: Independent Processing**
Each payment is processed independently - failure of one payment (including signature validation) doesn't affect others in the batch. This allows for partial batch execution and maximum flexibility.

---

## payMultiple Function


**Function Type**: `external`  
**Function Signature**: `payMultiple((address,address,string,address,uint256,uint256,uint256,bool,address,bytes)[])`
**Returns**: `(uint256 successfulTransactions, bool[] memory results)`

Processes multiple payments in a single transaction batch with individual success/failure tracking. Each payment instruction can originate from different senders and supports both staker and non-staker payment types, with comprehensive transaction statistics and detailed results for each operation.

## Parameters

| Parameter | Type      | Description                                                   |
| --------- | --------- | ------------------------------------------------------------- |
| `payData` | PayData[] | An array of structs, each defining a single payment operation |

## Return Values

| Return Value             | Type        | Description                                                 |
| ------------------------ | ----------- | ----------------------------------------------------------- |
| `successfulTransactions` | `uint256`   | Number of payments that completed successfully              |
| `results`                | `bool[]`    | Boolean array indicating success/failure for each payment  |

## `PayData` Struct

Defines the complete set of parameters for a single, independent payment within the batch.

```solidity
struct PayData {
    address from;
    address to_address;
    string to_identity;
    address token;
    uint256 amount;
    uint256 priorityFee;
    uint256 nonce;
    bool priorityFlag;
    address executor;
    bytes signature;
}
```

| Field         | Type      | Description                                                                                                                                         |
| ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`        | `address` | The address of the payment sender whose funds are being transferred and whose signature/nonce are validated.                                        |
| `to_address`  | `address` | Direct recipient address. Used when `to_identity` is empty.                                                                                         |
| `to_identity` | `string`  | Username/identity of the recipient. If provided, the contract resolves it to an address via the NameService.                                        |
| `token`       | `address` | The token address for the transfer.                                                                                                        |
| `amount`      | `uint256` | The quantity of tokens to transfer from `from` to the recipient.                                                                                    |
| `priorityFee` | `uint256` | Fee amount distributed to stakers as reward (only paid if executor is a staker).                                                                    |
| `nonce`       | `uint256` | Nonce value for transaction ordering and replay protection (interpretation depends on `priorityFlag`).                                              |
| `priorityFlag`| `bool`    | Determines nonce type: `true` for asynchronous (custom nonce), `false` for synchronous (sequential nonce).                                          |
| `executor`    | `address` | Address authorized to execute this transaction. Use `address(0)` to allow any address to execute.                                                   |
| `signature`   | `bytes`   | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this payment.                      |


If you want to know more about the signature structure, refer to the [Payment Signature Structure section](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).


## Execution Methods

This function can be executed by any address, with different behavior depending on whether the executor is a staker:

### Fisher Execution

- A fisher collects multiple authorized `PayData` structures (with valid signatures) from various users through fishing spots.
- The fisher aggregates these into the `payData` array and submits the transaction.
- If the fisher is a staker, they receive priority fees and principal token rewards.

### Direct Execution

- A user or service constructs the `payData` array with one or multiple payment requests.
- They directly call `payMultiple` with appropriate authorization.
- Staker executors receive priority fees and principal token rewards based on successful transactions.

> **Warning: Signature Validation Behavior**
 If any signature verification fails during processing, the entire transaction will revert and no payments will be executed. All signatures must be valid for the batch to proceed. Other validation failures (insufficient balance, nonce issues, etc.) will mark individual payments as failed but allow the transaction to continue processing the remaining payments.

## Workflow

The function processes each payment in the `payData` array independently, allowing partial success:

1. **Initialize Results Array**: Creates a boolean array to track individual payment results.

2. **For each payment in the array**:

   a. **Signature Verification**: Validates the `signature` against all payment parameters using `verifyMessageSignedForPay`. Uses the appropriate nonce based on `priorityFlag`. Reverts with `InvalidSignature` if validation fails.

   b. **Executor Validation**: If `executor` is not `address(0)`, checks that `msg.sender` matches the `executor` address. If they don't match, marks the payment as failed and continues to the next payment.

   c. **Nonce Management**: Handles nonce verification and updates based on `priorityFlag`:
   - **Async (priorityFlag = true)**: Checks if the custom nonce hasn't been used, then marks it as used. If already used, marks payment as failed.
   - **Sync (priorityFlag = false)**: Verifies the nonce matches the expected sequential nonce, then increments it. If mismatch, marks payment as failed.

   d. **Recipient Resolution**: Determines the final recipient address:
   - If `to_identity` is provided, resolves it using `verifyStrictAndGetOwnerOfIdentity` from the NameService.
   - If `to_identity` is empty, uses `to_address`.

   e. **Balance Verification**: Checks if the sender has sufficient balance for both `amount` and `priorityFee`. If insufficient, marks payment as failed.

   f. **Payment Execution**: Executes the main transfer using `_updateBalance`. If the transfer fails, marks payment as failed.

   g. **Priority Fee Distribution**: If the payment succeeded and `priorityFee > 0` and the executor is a staker (`isAddressStaker(msg.sender)`), transfers the priority fee to the executor. If this fails, marks payment as failed.

   h. **Result Tracking**: Updates counters and result array based on payment success/failure.

3. **Staker Rewards**: After processing all payments, if the executor is a staker, grants principal token rewards equal to the number of successful transactions using `_giveReward`. 

4. **Return Values**: Returns the count of successful transactions, failed transactions, and the detailed results array.

Each payment is processed independently - failure of one payment (except for signature validation) doesn't affect others in the batch.

---

## dispersePay Function


**Function Type**: `external`  
**Function Signature**: `dispersePay(address,(uint256,address,string)[],address,uint256,uint256,address,uint256,bool,bytes)`

Distributes tokens from a single sender to multiple recipients with efficient single-source multi-recipient payment distribution. This function uses a single signature to authorize distribution to multiple recipients, supports both direct addresses and identity-based recipients, and includes integrated priority fee and staker reward systems.

The signature structure for these payments is detailed in the [Disperse Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/02-DispersePaySignatureStructure.md) section.

## Parameters

| Parameter        | Type                    | Description                                                                                                                       |
| ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | `address`               | The address of the payment sender whose funds will be distributed.                                                                |
| `toData`         | `DispersePayMetadata[]` | An array detailing each recipient's address/identity and the amount they should receive. See struct below.                        |
| `token`          | `address`               | The token address to be distributed.                                                                                              |
| `amount`         | `uint256`               | The total amount of tokens to distribute across all recipients. Must equal the sum of individual amounts in `toData`.             |
| `priorityFee`    | `uint256`               | Fee amount for the transaction executor (distributed to stakers as reward).                                                       |
| `senderExecutor` | `address`               | Address authorized to execute this transaction. Use `address(0)` to allow any address to execute.                                 |
| `nonce`          | `uint256`               | Transaction nonce for replay protection managed by Core.sol. Usage depends on `isAsyncExec`.                                                     |
| `isAsyncExec`    | `bool`                  | Determines nonce type: `true` for asynchronous (parallel), `false` for synchronous (sequential).                        |
| `signature`      | `bytes`                 | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing the distribution. |


If you want to know more about the signature structure, refer to the [Disperse Payment Signature Structure section](../../../05-SignatureStructures/01-EVVM/02-DispersePaySignatureStructure.md).


## `DispersePayMetadata` Struct

Defines the payment details for a single recipient within the `toData` array.

```solidity
struct DispersePayMetadata {
   uint256 amount;
   address to_address;
   string to_identity;
}
```

| Field         | Type      | Description                                                                                                  |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `amount`      | `uint256` | The amount of tokens to be sent to this recipient.                                                           |
| `to_address`  | `address` | Direct recipient address. Used when `to_identity` is an empty string (`""`).                                           |
| `to_identity` | `string`  | Username/identity of the recipient. If provided, the contract resolves it to an address via the NameService. |

If `to_identity` is an empty string (`""`), the `to_address` field will be used as the recipient's destination address. Otherwise, the contract attempts to resolve the `to_identity` to its owner address using the NameService.

## Execution Methods

This function can be executed by any address, with different behavior depending on whether the executor is a staker:

### Fisher Execution

- A fisher collects multiple disperse payment requests with valid signatures from users through fishing spots.
- The fisher submits the transaction and receives priority fees and principal token rewards if they are a staker.

### Direct Execution

- A user or service directly calls `dispersePay` with appropriate authorization.
- Staker executors receive priority fees and principal token rewards for processing.

When using a service as the executor, we recommend specifying the service's address in the `senderExecutor` parameter for additional security.

## Workflow {#disperse-pay-workflow}

1. **Signature Verification**: Validates the `signature` using Core.sol's centralized signature verification:
   - Constructs signature payload: `buildSignaturePayload(evvmId, address(this), hashPayload, senderExecutor, nonce, isAsyncExec)`
   - `hashPayload` is generated via `CoreHashUtils.hashDataForDispersePay(toData, token, amount, priorityFee)`
   - Recovers signer and compares with `from` address. Reverts with `InvalidSignature` on failure.

2. **User Validation**: Checks if the user is allowed to execute transactions using `canExecuteUserTransaction(from)`. Reverts with `UserCannotExecuteTransaction` if not allowed.

3. **Nonce Management**: Core.sol handles nonce verification and updates based on `isAsyncExec`:
   - **Async (isAsyncExec = true)**: Checks if the nonce hasn't been used via `asyncNonceStatus(from, nonce)`, then marks it as used. Reverts with `AsyncNonceAlreadyUsed` if already used, or `AsyncNonceIsReservedByAnotherService` if reserved by another service.
   - **Sync (isAsyncExec = false)**: Verifies the nonce matches `nextSyncNonce[from]`, then increments it. Reverts with `SyncNonceMismatch` on mismatch.

4. **Executor Validation**: If `senderExecutor` is not `address(0)`, checks that `msg.sender` matches the `senderExecutor` address. Reverts with `SenderIsNotTheSenderExecutor` if they don't match.

5. **Staker Check**: Determines if the executor (`msg.sender`) is a registered staker using `isAddressStaker`.

6. **Balance Verification**: Checks that the `from` address has sufficient balance. The required balance depends on staker status:
   - If executor is a staker: `amount + priorityFee`
   - If executor is not a staker: `amount` only (priorityFee is not collected)
   
   Reverts with `InsufficientBalance` if insufficient.

7. **Balance Deduction**: Subtracts the required amount from the sender's balance upfront:
   - If executor is a staker: deducts `amount + priorityFee`
   - If executor is not a staker: deducts `amount` only

8. **Distribution Loop**: Iterates through each recipient in the `toData` array:

   - **Amount Tracking**: Maintains a running total (`accumulatedAmount`) of distributed amounts
   - **Recipient Resolution**:
     - If `to_identity` is provided, verifies the identity exists using `strictVerifyIfIdentityExist` and resolves it to an owner address using `getOwnerOfIdentity`
     - If `to_identity` is empty, uses `to_address`
   - **Token Distribution**: Adds the specified amount to the recipient's balance

8. **Amount Validation**: Verifies that the total distributed amount (`accumulatedAmount`) exactly matches the specified `amount` parameter. Reverts with `InvalidAmount` if mismatch.

9. **Staker Benefits**: If the executor is a staker (`isAddressStaker(msg.sender)`):
   - Grants 1 principal token reward using `_giveReward`
   - Transfers the `priorityFee` to the executor's balance

10. **Nonce Update**: Marks the nonce as used to prevent replay attacks:
    - **Async (priorityFlag = true)**: Marks the custom nonce as used in `asyncUsedNonce`
    - **Sync (priorityFlag = false)**: Increments the sequential nonce in `nextSyncUsedNonce`

---

## caPay Function


**Function Type**: `external`  
**Function Signature**: `caPay(address,address,uint256)`  

Contract-to-address payment function designed for authorized smart contracts to distribute tokens without signature verification. This function allows registered smart contracts to efficiently transfer tokens using direct balance manipulation, primarily for automated distributions and system payouts.

## Key Features

- **Contract-Only Execution:** Only smart contracts (non-EOA addresses) can call this function, verified via bytecode presence
- **No Signature Required:** Bypasses signature verification as authorization is implicit through contract execution
- **No Nonce Management:** Does not use EVVM nonce systems since contracts rely on blockchain transaction nonces
- **Automated Distributions:** Designed for staking rewards, NameService fees, and other automated system payouts
- **Staker Rewards:** Contracts that are registered stakers receive principal token rewards for successful transfers

## Parameters

| Field    | Type      | Description                                                       |
| -------- | --------- | ----------------------------------------------------------------- |
| `to`     | `address` | The recipient's address for the token transfer.                   |
| `token`  | `address` | The token address to transfer.                                    |
| `amount` | `uint256` | The quantity of tokens to transfer from the calling contract.     |

## Workflow

1. **Contract Verification**: Validates that the caller (`msg.sender`) is a smart contract by checking its bytecode size using `extcodesize`. Reverts with `NotAnCA` if the caller is an Externally Owned Account (EOA).

2. **Balance Update**: Executes the token transfer using the `_updateBalance` function:
   - Verifies the calling contract has sufficient token balance
   - Debits the `amount` from the calling contract's balance
   - Credits the `amount` to the recipient's balance
   - Reverts with `UpdateBalanceFailed` if the transfer fails

3. **Staker Reward**: If the calling contract is a registered staker (`isAddressStaker(msg.sender)`), grants 1 principal token reward using `_giveReward`.

---

## disperseCaPay Function


**Function Type**: `external`  
**Function Signature**: `disperseCaPay((uint256,address)[],address,uint256)`

Contract-to-multiple-addresses payment distribution function that allows authorized smart contracts to distribute tokens to multiple recipients efficiently in a single transaction. This function is optimized for contract-based automated distributions with minimal overhead.

## Key Features

- **Contract-Only Execution:** Only smart contracts can call this function, verified via bytecode presence
- **Direct Address Distribution:** Optimized for direct address transfers without identity resolution
- **Batch Efficiency:** Single transaction distributes to multiple recipients with amount validation
- **No Authorization Overhead:** No signature verification or nonce management required
- **Staker Rewards:** Contracts that are registered stakers receive principal token rewards

## Parameters

| Parameter | Type                      | Description                                                                                                           |
| --------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `toData`  | `DisperseCaPayMetadata[]` | An array detailing each recipient's address and the amount they should receive. See struct below.                     |
| `token`   | `address`                 | The token address to distribute.                                                                                      |
| `amount`  | `uint256`                 | The total amount of tokens to distribute across all recipients. Must equal the sum of individual amounts in `toData`. |

## `DisperseCaPayMetadata` Struct

Defines the payment details for a single recipient within the `toData` array.

```solidity
struct DisperseCaPayMetadata {
   uint256 amount;
   address toAddress;
}
```

| Field       | Type      | Description                                     |
| ----------- | --------- | ----------------------------------------------- |
| `amount`    | `uint256` | The amount of tokens to send to this recipient. |
| `toAddress` | `address` | The recipient's direct wallet address.          |

## Workflow

1. **Contract Verification**: Validates that the caller (`msg.sender`) is a smart contract by checking its bytecode size using `extcodesize`. Reverts with `NotAnCA` if the caller is an Externally Owned Account (EOA).

2. **Balance Verification**: Checks that the calling contract has sufficient token balance to cover the total distribution amount. Reverts with `InsufficientBalance` if insufficient.

3. **Balance Deduction**: Subtracts the total `amount` from the calling contract's token balance upfront.

4. **Distribution Loop**: Iterates through each recipient in the `toData` array:

   - **Amount Tracking**: Maintains a running total (`accumulatedAmount`) of distributed amounts
   - **Overflow Check**: Validates that accumulated amount doesn't exceed the total amount during iteration
   - **Token Distribution**: Adds the specified amount directly to each recipient's balance

5. **Final Amount Validation**: Verifies that the total distributed amount exactly matches the specified `amount` parameter. Reverts with `InvalidAmount` if there's a mismatch.

6. **Staker Reward**: If the calling contract is a registered staker (`isAddressStaker(msg.sender)`), grants 1 principal token reward using `_giveReward`.

---

## Getter Functions


This section details all available getter functions in the EVVM contract, providing comprehensive information about the contract's state, configuration, and user data.

## System Configuration Functions

### getEvvmMetadata

**Function Type**: `view`  
**Function Signature**: `getEvvmMetadata()`

Returns the complete EVVM metadata configuration containing system-wide parameters and economic settings.

#### Return Value

Returns an `EvvmMetadata` struct containing:

| Field                     | Type      | Description                                           |
| ------------------------- | --------- | ----------------------------------------------------- |
| `principalTokenAddress`   | `address` | Address of the principal token (MATE token)          |
| `reward`                  | `uint256` | Current reward amount per transaction                 |
| `totalSupply`             | `uint256` | Total supply tracking for era transitions            |
| `eraTokens`               | `uint256` | Era tokens threshold for reward transitions          |

---

### getEvvmID

**Function Type**: `view`  
**Function Signature**: `getEvvmID()`

Gets the unique identifier for this EVVM instance used for signature verification and distinguishing between different EVVM deployments.

#### Return Value

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `uint256` | Unique identifier for this EVVM instance         |

---

### getNameServiceAddress

**Function Type**: `view`  
**Function Signature**: `getNameServiceAddress()`

Gets the current NameService contract address used for identity resolution in payments.

#### Return Value

| Type      | Description                                    |
| --------- | ---------------------------------------------- |
| `address` | Address of the integrated NameService contract |

---

### getStakingContractAddress

**Function Type**: `view`  
**Function Signature**: `getStakingContractAddress()`

Gets the authorized staking contract address that can modify staker status and receive rewards.

#### Return Value

| Type      | Description                                   |
| --------- | --------------------------------------------- |
| `address` | Address of the integrated staking contract    |

---

## Nonce Management Functions

### getNextCurrentSyncNonce {#getnextcurrentsyncnonce}

**Function Type**: `view`  
**Function Signature**: `getNextCurrentSyncNonce(address)`

Returns the expected nonce for the next synchronous payment transaction for a specific user.

#### Input Parameters

| Parameter | Type      | Description                           |
| --------- | --------- | ------------------------------------- |
| `user`    | `address` | Address to check sync nonce for       |

#### Return Value

| Type      | Description                  |
| --------- | ---------------------------- |
| `uint256` | Next synchronous nonce value |

---

### getIfUsedAsyncNonce {#getifusedasyncnonce}

**Function Type**: `view`  
**Function Signature**: `getIfUsedAsyncNonce(address,uint256)`

Checks if a specific asynchronous nonce has been used by a user to prevent replay attacks.

#### Input Parameters

| Parameter | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `user`    | `address` | Address to check nonce usage for          |
| `nonce`   | `uint256` | Specific nonce value to verify            |

#### Return Value

| Type   | Description                                          |
| ------ | ---------------------------------------------------- |
| `bool` | True if the nonce has been used, false if available |

---

### getAsyncNonceReservation {#getasyncnoncereservation}

**Function Type**: `view`  
**Function Signature**: `getAsyncNonceReservation(address,uint256)`

Gets the service address that has reserved a specific async nonce for a user. Returns `address(0)` if the nonce is not reserved.

#### Input Parameters

| Parameter | Type      | Description                          |
| --------- | --------- | ------------------------------------ |
| `user`    | `address` | Address of the user who owns the nonce |
| `nonce`   | `uint256` | Async nonce to check reservation for  |

#### Return Value

| Type      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `address` | Service address that reserved the nonce, or `address(0)` if not reserved |

#### Example

```solidity
// Check if nonce 100 is reserved for a user
address reservedService = core.getAsyncNonceReservation(userAddress, 100);

if (reservedService == address(0)) {
    // Nonce is not reserved, any service can use it
} else if (reservedService == nameServiceAddress) {
    // Nonce is reserved for NameService
} else {
    // Nonce is reserved for another service
}
```

---

### asyncNonceStatus {#asyncnoncestatus}

**Function Type**: `view`  
**Function Signature**: `asyncNonceStatus(address,uint256)`

Gets comprehensive status of an async nonce, indicating whether it's available, used, or reserved.

#### Input Parameters

| Parameter | Type      | Description                          |
| --------- | --------- | ------------------------------------ |
| `user`    | `address` | Address of the user who owns the nonce |
| `nonce`   | `uint256` | Async nonce to check status for      |

#### Return Value

| Type     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `bytes1` | Status code: `0x00` (available), `0x01` (used), `0x02` (reserved) |

#### Status Codes

- **`0x00` (Available)**: Nonce can be used by any service
- **`0x01` (Used)**: Nonce has been consumed and cannot be reused
- **`0x02` (Reserved)**: Nonce is reserved for a specific service

#### Example

```solidity
// Check status of nonce 200
bytes1 status = core.asyncNonceStatus(userAddress, 200);

if (status == 0x00) {
    // Nonce is available
} else if (status == 0x01) {
    // Nonce has been used
} else if (status == 0x02) {
    // Nonce is reserved for a specific service
    address reservedFor = core.getAsyncNonceReservation(userAddress, 200);
}
```

---

### getNextFisherDepositNonce

**Function Type**: `view`  
**Function Signature**: `getNextFisherDepositNonce(address)`

Returns the expected nonce for the next Fisher Bridge cross-chain deposit.

#### Input Parameters

| Parameter | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `user`    | `address` | Address to check deposit nonce for        |

#### Return Value

| Type      | Description                         |
| --------- | ----------------------------------- |
| `uint256` | Next Fisher Bridge deposit nonce    |

---

## Balance and Staking Functions

### getBalance

**Function Type**: `view`  
**Function Signature**: `getBalance(address,address)`

Gets the balance of a specific token for a user stored in the EVVM system.

#### Input Parameters

| Parameter | Type      | Description                          |
| --------- | --------- | ------------------------------------ |
| `user`    | `address` | Address to check balance for         |
| `token`   | `address` | Token contract address to check      |

#### Return Value

| Type   | Description                       |
| ------ | --------------------------------- |
| `uint` | Current token balance for the user |

---

### isAddressStaker

**Function Type**: `view`  
**Function Signature**: `isAddressStaker(address)`

Checks if an address is registered as a staker with transaction processing privileges and reward eligibility.

#### Input Parameters

| Parameter | Type      | Description                              |
| --------- | --------- | ---------------------------------------- |
| `user`    | `address` | Address to check staker status for       |

#### Return Value

| Type   | Description                                        |
| ------ | -------------------------------------------------- |
| `bool` | True if the address is a registered staker        |

---

## Economic System Functions

### getEraPrincipalToken

**Function Type**: `view`  
**Function Signature**: `getEraPrincipalToken()`

Gets the current era token threshold that triggers the next reward halving in the deflationary tokenomics system.

#### Return Value

| Type      | Description                      |
| --------- | -------------------------------- |
| `uint256` | Current era tokens threshold     |

---

### getRewardAmount

**Function Type**: `view`  
**Function Signature**: `getRewardAmount()`

Gets the current MATE token reward amount distributed to stakers for transaction processing.

#### Return Value

| Type      | Description                                |
| --------- | ------------------------------------------ |
| `uint256` | Current reward amount in MATE tokens       |

---

### getPrincipalTokenTotalSupply

**Function Type**: `view`  
**Function Signature**: `getPrincipalTokenTotalSupply()`

Gets the total supply of the principal token (MATE) used for era transition calculations.

#### Return Value

| Type      | Description                    |
| --------- | ------------------------------ |
| `uint256` | Total supply of MATE tokens    |

---

## Token Management Functions

### getWhitelistTokenToBeAdded

**Function Type**: `view`  
**Function Signature**: `getWhitelistTokenToBeAdded()`

Gets the address of the token that is pending whitelist approval after the time delay.

#### Return Value

| Type      | Description                                               |
| --------- | --------------------------------------------------------- |
| `address` | Address of the token prepared for whitelisting (zero if none) |

---

### getWhitelistTokenToBeAddedDateToSet

**Function Type**: `view`  
**Function Signature**: `getWhitelistTokenToBeAddedDateToSet()`

Gets the acceptance deadline for pending token whitelist proposals.

#### Return Value

| Type      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `uint256` | Timestamp when pending token can be whitelisted (0 if no pending proposal) |

---

## Proxy and Governance Functions

### getCurrentImplementation

**Function Type**: `view`  
**Function Signature**: `getCurrentImplementation()`

Gets the current active implementation contract address used by the proxy for delegatecalls.

#### Return Value

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `address` | Address of the current implementation contract   |

---

### getProposalImplementation

**Function Type**: `view`  
**Function Signature**: `getProposalImplementation()`

Gets the proposed implementation contract address pending approval for proxy upgrade.

#### Return Value

| Type      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `address` | Address of the proposed implementation contract (zero if none) |

---

### getTimeToAcceptImplementation

**Function Type**: `view`  
**Function Signature**: `getTimeToAcceptImplementation()`

Gets the acceptance deadline for the pending implementation upgrade.

#### Return Value

| Type      | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `uint256` | Timestamp when implementation upgrade can be executed (0 if no pending proposal) |

---

## Administrative Functions

### getCurrentAdmin

**Function Type**: `view`  
**Function Signature**: `getCurrentAdmin()`

Gets the current admin address with administrative privileges over the contract.

#### Return Value

| Type      | Description                    |
| --------- | ------------------------------ |
| `address` | Address of the current admin   |

---

### getProposalAdmin

**Function Type**: `view`  
**Function Signature**: `getProposalAdmin()`

Gets the proposed admin address pending approval for admin privileges.

#### Return Value

| Type      | Description                                          |
| --------- | ---------------------------------------------------- |
| `address` | Address of the proposed admin (zero if no pending proposal) |

---

### getTimeToAcceptAdmin

**Function Type**: `view`  
**Function Signature**: `getTimeToAcceptAdmin()`

Gets the acceptance deadline for the pending admin change.

#### Return Value

| Type      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `uint256` | Timestamp when admin change can be executed (0 if no pending proposal) |

---

## UserValidator Functions

### getUserValidatorAddress {#getuservalidatoraddress}

**Function Type**: `view`  
**Function Signature**: `getUserValidatorAddress()`

Gets the current active UserValidator contract address. Returns `address(0)` if no validator is configured.

#### Return Value

| Type      | Description                                  |
| --------- | -------------------------------------------- |
| `address` | Address of active UserValidator contract or `address(0)` |

> **Note: What is UserValidator?**
UserValidator is an optional contract that can filter which users are allowed to execute transactions in the EVVM ecosystem. See [UserValidator System](./03-SignatureAndNonceManagement.md#uservalidator-system) for details.

---

### getUserValidatorAddressDetails {#getuservalidatoraddressdetails}

**Function Type**: `view`  
**Function Signature**: `getUserValidatorAddressDetails()`

Gets full details of the UserValidator proposal including current validator, proposed validator, and time-lock information.

#### Return Value

Returns an `AddressTypeProposal` struct containing:

| Field           | Type      | Description                                        |
| --------------- | --------- | -------------------------------------------------- |
| `current`       | `address` | Current active UserValidator address               |
| `proposal`      | `address` | Proposed validator address (zero if no proposal)   |
| `timeToAccept`  | `uint256` | Timestamp when proposal can be accepted            |

#### Example

```solidity
// Get full validator details
ProposalStructs.AddressTypeProposal memory validatorDetails = 
    core.getUserValidatorAddressDetails();

if (validatorDetails.proposal != address(0)) {
    // There's a pending proposal
    if (block.timestamp >= validatorDetails.timeToAccept) {
        // Proposal is ready to accept
    } else {
        // Still waiting for time-lock
        uint256 timeRemaining = validatorDetails.timeToAccept - block.timestamp;
    }
}
```

---

## Usage Examples

### Checking User Balance

```solidity
// Check MATE token balance for a user
uint256 mateBalance = evvm.getBalance(userAddress, mateTokenAddress);

// Check if user is a staker
bool isStaker = evvm.isAddressStaker(userAddress);
```

### Nonce Management

```solidity
// Get next sync nonce for a user
uint256 nextNonce = evvm.getNextCurrentSyncNonce(userAddress);

// Check if async nonce is used
bool nonceUsed = evvm.getIfUsedAsyncNonce(userAddress, customNonce);
```

### Token Management Verification

```solidity
// Check if token is pending whitelist
address pendingToken = evvm.getWhitelistTokenToBeAdded();

// Get deadline for whitelist proposal
uint256 deadline = evvm.getWhitelistTokenToBeAddedDateToSet();
```

---

## Administrative Functions


This section covers all administrative functions in the EVVM contract, including system configuration, governance, and access control mechanisms. These functions implement time-delayed governance for critical system changes to ensure security and allow for community review.

> **Note: Proxy Management Functions**
The proxy management functions have been moved to their own dedicated section. See [Proxy Management Functions](./10-ProxyManagement.md) for complete documentation on implementation upgrades and proxy operations.

---

## Initial Setup Functions

### _setupNameServiceAndTreasuryAddress

**Function Type**: `external`  
**Function Signature**: `_setupNameServiceAndTreasuryAddress(address,address)`

One-time setup function to configure the NameService and Treasury contract addresses. This function can only be called once due to a breaker flag mechanism for security.

#### Input Parameters

| Parameter              | Type      | Description                                    |
| ---------------------- | --------- | ---------------------------------------------- |
| `_nameServiceAddress`  | `address` | Address of the deployed NameService contract   |
| `_treasuryAddress`     | `address` | Address of the deployed Treasury contract      |

#### Setup Process

1. **Breaker Validation**: Ensures the function can only be called once
2. **NameService Configuration**: Sets the NameService contract address for identity resolution
3. **Initial Balance**: Provides 10,000 MATE tokens to the NameService contract
4. **Staker Registration**: Registers NameService as a privileged staker
5. **Treasury Configuration**: Sets the Treasury contract address for balance operations

#### Security Features

- **One-Time Execution**: Breaker flag prevents multiple calls
- **Essential Integration**: Configures critical system dependencies
- **Automatic Staking**: NameService receives staker privileges automatically
- **Initial Funding**: NameService gets operational balance for fees and operations

#### Workflow

```solidity
// Initial state: breakerSetupNameServiceAddress == FLAG_IS_STAKER (0x01)
// After execution: breakerSetupNameServiceAddress == 0x00 (prevents re-execution)

evvm._setupNameServiceAndTreasuryAddress(nameServiceAddr, treasuryAddr);
```

---

## Admin Management Functions

The contract implements time-delayed admin transfers with a 1-day security period.

### proposeAdmin

**Function Type**: `external onlyAdmin`  
**Function Signature**: `proposeAdmin(address)`

Proposes a new admin address with a 1-day time delay for security.

#### Input Parameters

| Parameter    | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| `_newOwner`  | `address` | Address of the proposed new admin |

#### Security Features

- **1-day time delay**: Shorter than implementation upgrades but provides safety
- **Non-zero validation**: Prevents setting admin to zero address
- **Self-assignment prevention**: Cannot propose current admin as new admin
- **Admin-only access**: Only current admin can propose changes

#### Workflow

1. Current admin proposes a new admin address
2. System sets acceptance deadline (current time + 1 day)
3. Proposed admin must accept the role after the time delay
4. Current admin can cancel the proposal if needed

---

### rejectProposalAdmin

**Function Type**: `external onlyAdmin`  
**Function Signature**: `rejectProposalAdmin()`

Cancels a pending admin change proposal.

#### Security Features

- **Admin-only access**: Only current admin can reject proposals
- **Immediate effect**: Cancellation takes effect immediately
- **State cleanup**: Clears both proposal address and acceptance deadline

---

### acceptAdmin

**Function Type**: `external`  
**Function Signature**: `acceptAdmin()`

Allows the proposed admin to accept the admin role after the time delay.

#### Security Features

- **Time delay enforcement**: Can only be called after the acceptance deadline
- **Proposed admin only**: Only the proposed admin can call this function
- **Two-step process**: Requires both proposal and acceptance for security

#### Workflow

1. Verifies that the current timestamp exceeds the acceptance deadline
2. Verifies that the caller is the proposed admin
3. Updates the current admin to the proposed admin
4. Clears the proposal state

---

## NameService Integration

### setNameServiceAddress

**Function Type**: `external onlyAdmin`  
**Function Signature**: `setNameServiceAddress(address)`

Updates the NameService contract address for identity resolution.

#### Input Parameters

| Parameter              | Type      | Description                           |
| ---------------------- | --------- | ------------------------------------- |
| `_nameServiceAddress`  | `address` | Address of the new NameService contract |

#### Security Features

- **Admin-only access**: Only admin can change NameService integration
- **Immediate effect**: Change takes effect immediately
- **Critical integration**: Affects identity resolution in payments

#### Use Cases

- Upgrading to a new NameService contract version
- Switching to a different identity resolution system
- Fixing integration issues with the current NameService

---

## Usage Examples

### Admin Transfer Process

```solidity
// 1. Current admin proposes new admin
evvm.proposeAdmin(newAdminAddress);

// 2. Wait 1 day

// 3. Proposed admin accepts the role
// (must be called by the proposed admin)
evvm.acceptAdmin();
```

## Security Considerations

### Time Delays

- **Admin changes**: 1-day delay for administrative control

### Access Control

- All administrative functions require `onlyAdmin` modifier
- Two-step process for admin transfers prevents accidental loss of control
- Cancellation mechanisms allow recovery from erroneous proposals

### State Management

- Admin proposals can only be executed after time delays
- State is properly cleaned up after execution or cancellation
- Clear proposal and acceptance process prevents confusion

---

## Identity Resolution Functions


The EVVM contract integrates with the NameService to provide identity-based payment functionality, allowing users to send payments to human-readable usernames instead of complex addresses. This section covers the identity resolution system and NameService integration.

## NameService Integration

The EVVM contract uses the NameService to resolve usernames to wallet addresses, enabling user-friendly payment experiences while maintaining the security of blockchain addresses.

### Identity Resolution Process

When a payment includes a `to_identity` parameter, the EVVM contract performs the following resolution process:

1. **Identity Validation**: Checks if the provided identity exists in the NameService
2. **Strict Verification**: Ensures the identity is properly registered and active  
3. **Address Resolution**: Retrieves the wallet address associated with the identity
4. **Payment Processing**: Executes the payment to the resolved address

### NameService Functions Used

The EVVM contract utilizes several NameService functions for identity resolution:

#### verifyStrictAndGetOwnerOfIdentity

**Function Purpose**: Strict identity verification with address resolution  
**Usage Context**: Primary method for secure identity-to-address conversion

```solidity
address recipient = NameService(nameServiceAddress)
    .verifyStrictAndGetOwnerOfIdentity(to_identity);
```

**Security Features**:
- Performs comprehensive validation of identity status
- Ensures identity is not expired or suspended  
- Returns the current owner address
- Reverts if identity is invalid or inactive

#### strictVerifyIfIdentityExist

**Function Purpose**: Checks identity existence without address resolution  
**Usage Context**: Used in batch operations for efficiency

```solidity
bool exists = NameService(nameServiceAddress)
    .strictVerifyIfIdentityExist(to_identity);
```

**Use Cases**:
- Batch payment validation before processing
- Efficient existence checks in `dispersePay` operations
- Pre-validation in multi-recipient transactions

#### getOwnerOfIdentity

**Function Purpose**: Retrieves address associated with an identity  
**Usage Context**: Used after existence verification

```solidity
address owner = NameService(nameServiceAddress)
    .getOwnerOfIdentity(to_identity);
```

**Security Note**: Should only be used after confirming identity existence with `strictVerifyIfIdentityExist`.

## Identity Resolution in Payment Functions

### Single Payment Functions

In the unified `pay` function, identity resolution follows this pattern:

```solidity
address to = !Strings.equal(to_identity, "")
    ? NameService(nameServiceAddress).verifyStrictAndGetOwnerOfIdentity(to_identity)
    : to_address;
```

**Logic Flow**:
1. Check if `to_identity` is provided (not empty string)
2. If identity provided: Use `verifyStrictAndGetOwnerOfIdentity` for secure resolution
3. If identity empty: Use the provided `to_address` directly
4. Proceed with payment to the resolved address

### Batch Payment Functions

In `batchPay`, each payment in the batch undergoes individual identity resolution:

```solidity
to_aux = !Strings.equal(payData[iteration].to_identity, "")
    ? NameService(nameServiceAddress).verifyStrictAndGetOwnerOfIdentity(
        payData[iteration].to_identity
    )
    : payData[iteration].to_address;
```

**Benefits**:
- Each payment can use different resolution methods (identity or address)
- Failed identity resolution only affects individual payments in the batch
- Maintains security across all payments in the batch

### Disperse Payment Functions

In `dispersePay`, the resolution process is optimized for efficiency:

```solidity
if (!Strings.equal(toData[i].to_identity, "")) {
    if (NameService(nameServiceAddress).strictVerifyIfIdentityExist(
        toData[i].to_identity
    )) {
        to_aux = NameService(nameServiceAddress).getOwnerOfIdentity(
            toData[i].to_identity
        );
    }
} else {
    to_aux = toData[i].to_address;
}
```

**Optimization Features**:
- Two-step verification for better error handling
- Continues processing even if some identities are invalid
- Efficient batch processing of multiple recipients

## NameService Configuration

### Setup Process

The NameService integration is configured during contract deployment and setup:

#### Initial Setup

```solidity
function _setupNameServiceAddress(address _nameServiceAddress) external {
    if (breakerSetupNameServiceAddress == 0x00) {
        revert();
    }
    nameServiceAddress = _nameServiceAddress;
    balances[nameServiceAddress][evvmMetadata.principalTokenAddress] = 
        10000 * 10 ** 18;
    stakerList[nameServiceAddress] = FLAG_IS_STAKER;
}
```

**Setup Features**:
- One-time configuration with breaker flag protection
- Provides initial MATE token balance (10,000 MATE) to NameService
- Registers NameService as a privileged staker
- Prevents multiple setup calls for security

#### Administrative Updates

```solidity
function setNameServiceAddress(address _nameServiceAddress) external onlyAdmin {
    nameServiceAddress = _nameServiceAddress;
}
```

**Administrative Control**:
- Admin can update NameService address if needed
- Immediate effect for operational flexibility
- Used for upgrades or integration changes

## Security Considerations

### Identity Validation

1. **Strict Verification**: Always use `verifyStrictAndGetOwnerOfIdentity` for secure resolution
2. **Existence Checks**: Verify identity exists before attempting resolution
3. **Error Handling**: Proper handling of invalid or expired identities
4. **Fallback Mechanism**: Support both identity and direct address payments

### Attack Vectors

#### Identity Spoofing
- **Protection**: NameService handles identity uniqueness and ownership
- **Validation**: Strict verification prevents unauthorized identity use
- **Resolution**: Only valid, active identities can be resolved

#### Identity Expiration
- **Handling**: Expired identities fail strict verification
- **Fallback**: Users can always use direct addresses
- **Notification**: Clear error messages for resolution failures

#### Service Disruption
- **Resilience**: Direct address payments remain available
- **Isolation**: NameService issues don't affect address-based payments
- **Recovery**: Admin can update NameService address if needed

## Best Practices

### For Users

1. **Verify Identity**: Ensure the identity you're paying to is correct and active
2. **Fallback Option**: Keep recipient addresses as backup for critical payments
3. **Recent Validation**: Verify identity ownership before large payments

### For Developers

1. **Error Handling**: Implement proper error handling for identity resolution failures
2. **Validation**: Always validate identity format before attempting resolution
3. **Caching**: Consider caching resolved addresses for frequently used identities
4. **User Experience**: Provide clear feedback for identity resolution status

### For Integrators

1. **Dual Support**: Support both identity and address-based payments
2. **Validation UI**: Provide real-time identity validation in user interfaces
3. **Error Messages**: Display helpful error messages for resolution failures
4. **Address Display**: Show resolved addresses to users for confirmation

## Usage Examples

### Identity-Based Payment

```solidity
// Payment using identity
evvm.pay(
    senderAddress,
    address(0),          // Empty address
    "alice.mate",        // Identity to resolve
    tokenAddress,
    amount,
    priorityFee,
    nonce,
    isAsyncExec,        // async/sync flag
    executor,
    signature
);
```

### Address-Based Payment

```solidity
// Payment using direct address
evvm.pay(
    senderAddress,
    recipientAddress,    // Direct address
    "",                  // Empty identity
    tokenAddress,
    amount,
    priorityFee,
    0,                    // nonce (example)
    false,                // isAsyncExec (sync example)
    executor,
    signature
);
```

### Mixed Batch Payment

```solidity
PayData[] memory payments = new PayData[](2);

// Payment 1: Using identity
payments[0] = PayData({
    from: sender,
    to_address: address(0),
    to_identity: "alice.mate",
    token: tokenAddress,
    amount: amount1,
    // ... other fields
});

// Payment 2: Using direct address  
payments[1] = PayData({
    from: sender,
    to_address: recipientAddress,
    to_identity: "",
    token: tokenAddress,
    amount: amount2,
    // ... other fields
});

evvm.batchPay(payments);
```

## Integration Benefits

### User Experience
- **Human-Readable**: Users can send payments to memorable usernames
- **Error Reduction**: Reduces address copy-paste errors
- **Social Integration**: Enables social payment features

### Developer Benefits
- **Abstraction**: Simplifies address management in applications
- **Flexibility**: Supports both traditional and identity-based payments  
- **Future-Proof**: Easy integration with identity evolution

### Ecosystem Benefits
- **Adoption**: Lowers barriers to blockchain payment adoption
- **Integration**: Enables rich social and identity features
- **Standardization**: Provides consistent identity resolution across services

---

## Economic System Functions


The EVVM ecosystem implements a sophisticated economic system with deflationary tokenomics, reward distribution, and era-based transitions. This section covers the economic functions that manage token supply, rewards, and the evolution of the system's monetary policy.

## Token Economics Overview

The EVVM economic system is built around the MATE token with several key features:

- **Deflationary Mechanism**: Reward halving through era transitions
- **Staker Incentives**: Enhanced rewards for network participants  
- **Random Bonuses**: Lottery-style rewards for era transition triggers
- **Supply Management**: Controlled token distribution and burning

## Era Transition System

### recalculateReward

**Function Type**: `public`  
**Function Signature**: `recalculateReward()`

Triggers a reward recalculation and era transition in the token economy when the total supply exceeds the current era threshold.

#### Era Transition Mechanism

The function implements a deflationary system where:

1. **Threshold Check**: Activates when `totalSupply > eraTokens`
2. **Era Adjustment**: Moves half of remaining tokens to next era threshold
3. **Reward Halving**: Cuts base reward amount in half for future transactions  
4. **Bonus Distribution**: Provides random MATE bonus to the caller (1-5083x reward)

#### Economic Formula

```solidity
// Era threshold update
evvmMetadata.eraTokens += ((evvmMetadata.totalSupply - evvmMetadata.eraTokens) / 2);

// Random bonus calculation
uint256 bonus = evvmMetadata.reward * getRandom(1, 5083);

// Reward halving
evvmMetadata.reward = evvmMetadata.reward / 2;
```

#### Economic Impact

- **Scarcity Creation**: Era thresholds become progressively harder to reach
- **Inflation Reduction**: Reward halving reduces token inflation over time
- **Early Incentive**: Higher rewards for early ecosystem participation
- **Random Incentive**: Lottery mechanism for era transition triggering

#### Workflow

1. **Eligibility Check**: Verifies total supply exceeds current era tokens threshold
2. **Era Calculation**: Updates era threshold by adding half the excess supply
3. **Bonus Award**: Grants random MATE bonus (1-5083x base reward) to caller
4. **Reward Halving**: Reduces base reward for all future transactions
5. **State Update**: Updates metadata to reflect new economic parameters

#### Access Control

- **Public Function**: Anyone can trigger when conditions are met
- **Conditional Execution**: Only works when total supply exceeds era threshold
- **Single Execution**: Each era transition can only occur once per threshold

---

### getRandom

**Function Type**: `internal view`  
**Function Signature**: `getRandom(uint256,uint256)`

Generates pseudo-random numbers for era transition bonuses and other system randomness needs.

#### Input Parameters

| Parameter | Type      | Description                    |
| --------- | --------- | ------------------------------ |
| `min`     | `uint256` | Minimum value (inclusive)      |
| `max`     | `uint256` | Maximum value (inclusive)      |

#### Return Value

| Type      | Description                                  |
| --------- | -------------------------------------------- |
| `uint256` | Random number between min and max (inclusive) |

#### Randomness Source

```solidity
return min + (uint256(
    keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
) % (max - min + 1));
```

**Components**:
- **block.timestamp**: Current block timestamp for variability
- **block.prevrandao**: Validator randomness from consensus layer
- **Keccak256 Hashing**: Cryptographic mixing of randomness sources
- **Modulo Operation**: Maps to desired range

#### Security Considerations

- **Non-Critical Randomness**: Suitable for reward bonuses and incentives
- **Predictability**: Not suitable for high-stakes applications
- **Manipulation Resistance**: Difficult to manipulate but not impossible
- **Block-Based**: Updates with each new block

## Reward Distribution System

### _giveReward

**Function Type**: `internal`  
**Function Signature**: `_giveReward(address,uint256)`

Internal function that distributes MATE token rewards to stakers for transaction processing and network participation.

#### Input Parameters

| Parameter | Type      | Description                                    |
| --------- | --------- | ---------------------------------------------- |
| `user`    | `address` | Address of the staker to receive rewards       |
| `amount`  | `uint256` | Number of transactions or reward multiplier    |

#### Return Value

| Type   | Description                                      |
| ------ | ------------------------------------------------ |
| `bool` | True if reward distribution completed successfully |

#### Reward Calculation

```solidity
uint256 principalReward = evvmMetadata.reward * amount;
balances[user][evvmMetadata.principalTokenAddress] += principalReward;
```

**Formula**:
- **Total Reward** = Base Reward × Transaction Count
- **Base Reward**: Current system reward amount (halves with each era)
- **Transaction Count**: Number of successful operations processed

#### Use Cases

- **Single Payments**: 1x reward for processing individual payments
- **Batch Payments**: Multiple rewards based on successful transaction count
- **Bridge Operations**: Rewards for Fisher Bridge processing
- **Contract Operations**: Rewards for automated system operations

#### Integration Points

The reward system is integrated throughout EVVM functions:

```solidity
// Single payment reward
_giveReward(msg.sender, 1);

// Batch payment reward
_giveReward(msg.sender, successfulTransactions);

// Bridge operation reward  
_giveReward(msg.sender, 1);
```

## Economic State Functions

### Token Supply Management

#### getPrincipalTokenTotalSupply

**Function Type**: `view`  
**Function Signature**: `getPrincipalTokenTotalSupply()`

Returns the current total supply of MATE tokens used for era transition calculations.

#### getEraPrincipalToken

**Function Type**: `view`  
**Function Signature**: `getEraPrincipalToken()`

Returns the current era token threshold that triggers the next reward halving event.

#### getRewardAmount

**Function Type**: `view`  
**Function Signature**: `getRewardAmount()`

Returns the current base reward amount distributed to stakers for transaction processing.

### Economic Metadata

#### getEvvmMetadata

**Function Type**: `view`  
**Function Signature**: `getEvvmMetadata()`

Returns the complete economic configuration including token addresses, rewards, supply data, and era thresholds.

## Economic Scenarios

### Era Transition Example

Consider the following economic state:

```
Initial State:
- Total Supply: 1,000,000 MATE
- Era Tokens: 800,000 MATE  
- Base Reward: 100 MATE
- Excess Supply: 200,000 MATE (1,000,000 - 800,000)

After Era Transition:
- Era Tokens: 900,000 MATE (800,000 + 200,000/2)
- Base Reward: 50 MATE (100/2)
- Caller Bonus: 50-254,150 MATE (50 * random(1,5083))
- Next Threshold: 900,000 MATE
```

### Reward Halving Impact

| Era | Base Reward | Era Threshold | Economic Phase |
| --- | ----------- | ------------- | -------------- |
| 1   | 100 MATE    | 1M MATE       | High Inflation |
| 2   | 50 MATE     | ~1.5M MATE    | Moderate Inflation |
| 3   | 25 MATE     | ~2M MATE      | Low Inflation |
| 4   | 12.5 MATE   | ~2.5M MATE    | Deflationary |
| 5   | 6.25 MATE   | ~3M MATE      | Ultra Deflationary |

### Staker Economics

#### Transaction Processing Rewards

| Operation Type      | Base Reward | Additional Benefits |
| ------------------- | ----------- | ------------------- |
| Single Payment      | 1x reward   | Priority fees       |
| Batch Payment       | Nx reward   | Priority fees       |
| Bridge Operation    | 1x reward   | Bridge fees         |
| Contract Operation  | 1x reward   | Service fees        |

#### Era Transition Bonuses

Random bonus multipliers for triggering era transitions:

- **Minimum Bonus**: 1x base reward
- **Maximum Bonus**: 5083x base reward  
- **Average Bonus**: ~2542x base reward
- **Expected Value**: Significant incentive for monitoring

## Economic Security

### Inflation Control

- **Automatic Halving**: Reduces inflation with each era transition
- **Supply Caps**: Era thresholds create natural supply limits
- **Staker Distribution**: Rewards distributed to active participants only

### Economic Attacks

#### Era Manipulation
- **Attack Vector**: Attempting to manipulate era transition timing
- **Protection**: Public function allows anyone to trigger when eligible
- **Mitigation**: Random bonuses reduce predictable profit

#### Reward Farming
- **Attack Vector**: Gaming the reward system for excessive tokens
- **Protection**: Staker-only rewards and transaction validation
- **Mitigation**: Legitimate transaction processing required

#### Supply Inflation
- **Attack Vector**: Excessive reward distribution inflating supply
- **Protection**: Automatic halving mechanism reduces rewards over time
- **Mitigation**: Era thresholds become progressively harder to reach

## Integration Guidelines

### For Stakers

1. **Monitor Era Progress**: Track total supply approaching era thresholds
2. **Trigger Transitions**: Call `recalculateReward()` when eligible for bonuses  
3. **Optimize Processing**: Focus on high-volume periods for maximum rewards
4. **Long-term Planning**: Understand reward reduction trajectory

### For Developers

1. **Reward Integration**: Properly integrate `_giveReward()` in new functions
2. **Economic Queries**: Use getter functions for economic state information
3. **Era Monitoring**: Build tools to track era transition progress
4. **Reward Calculation**: Account for changing reward amounts in projections

### For Users

1. **Understand Economics**: Learn how era transitions affect system costs
2. **Timing Strategies**: Consider era transitions when planning large operations
3. **Staker Benefits**: Understand advantages of becoming a staker
4. **Long-term Value**: Recognize deflationary nature of tokenomics

## Economic Monitoring

### Key Metrics

- **Total Supply Growth**: Rate of MATE token creation
- **Era Progression**: Distance to next era transition
- **Reward Efficiency**: Rewards per transaction over time
- **Staker Participation**: Number of active reward recipients

### Health Indicators

- **Inflation Rate**: Current rate of token supply growth
- **Era Transition Frequency**: How often transitions occur
- **Reward Distribution**: Concentration of rewards among stakers
- **Economic Activity**: Transaction volume and reward generation

## Future Economic Evolution

### Predicted Trajectory

As the system matures:

1. **Early Growth**: High rewards attract initial stakers and users
2. **Expansion Phase**: Increased adoption drives era transitions
3. **Maturation**: Slower era transitions as thresholds become harder
4. **Stability**: Ultra-low inflation creates stable economic environment
5. **Sustainability**: System reaches long-term sustainable reward levels

### Adaptation Mechanisms

- **Community Governance**: Future economic parameter adjustments
- **Market Forces**: Natural balance between rewards and participation
- **Technical Evolution**: New features may introduce economic innovations
- **Cross-Chain Integration**: Economic effects of multi-chain expansion

---

## Staking Integration Functions


The EVVM contract integrates closely with the staking system to manage staker status, privileges, and rewards. This integration enables enhanced functionality for MATE token stakers while maintaining secure access control and reward distribution.

## Staking System Overview

The EVVM staking integration provides:

- **Staker Status Management**: Control over who can earn staking rewards
- **Enhanced Privileges**: Special access to staker-only functions
- **Reward Distribution**: Integrated MATE token rewards for stakers
- **Cross-Contract Communication**: Secure integration with staking contract

## Staker Status Functions

### pointStaker

**Function Type**: `public`  
**Function Signature**: `pointStaker(address,bytes1)`

Updates staker status for a user address, controlling access to staking privileges and rewards.

#### Input Parameters

| Parameter | Type      | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| `user`    | `address` | Address to update staker status for              |
| `answer`  | `bytes1`  | Flag indicating staker status/type               |

#### Access Control

```solidity
if (msg.sender != stakingContractAddress) {
    revert();
}
```

**Security Features**:
- **Staking Contract Only**: Only the authorized staking contract can call this function
- **Centralized Control**: Ensures staker status changes are properly authorized
- **Integration Security**: Prevents unauthorized staker privilege escalation

#### Staker Status Values

The `answer` parameter uses standardized flag values:

| Value              | Meaning                | Description                           |
| ------------------ | ---------------------- | ------------------------------------- |
| `FLAG_IS_STAKER`   | Active Staker          | User has staking privileges           |
| `0x00`             | Non-Staker             | User has no staking privileges        |
| Other values       | Custom Status          | Future staker types or special status |

#### Integration Flow

1. **Staking Contract Event**: User stakes or unstakes MATE tokens
2. **Status Update**: Staking contract calls `pointStaker()` to update status
3. **EVVM Update**: User's staker status is updated in EVVM contract
4. **Privilege Changes**: User gains/loses automatic staker benefits when executing payments

### isAddressStaker

**Function Type**: `view`  
**Function Signature**: `isAddressStaker(address)`

Checks if an address is registered as an active staker with transaction processing privileges.

#### Input Parameters

| Parameter | Type      | Description                        |
| --------- | --------- | ---------------------------------- |
| `user`    | `address` | Address to check staker status for |

#### Return Value

| Type   | Description                                  |
| ------ | -------------------------------------------- |
| `bool` | True if the address is a registered staker   |

#### Implementation

```solidity
function isAddressStaker(address user) public view returns (bool) {
    return stakerList[user] == FLAG_IS_STAKER;
}
```

**Validation Logic**:
- Checks if user's status equals the active staker flag
- Returns boolean for easy integration in other functions
- Used throughout EVVM for privilege verification

## Staker Privileges

### Enhanced Payment Processing

Stakers receive special privileges in payment processing functions:

#### Staker Payment Benefits

- **Automatic Detection**: The `pay` function automatically detects if executor is a staker
- **Enhanced Rewards**: Staker executors receive MATE token rewards for processing
- **Priority Fees**: Staker executors collect priority fees from users
- **Batch Processing**: Special rewards for batch payment processing

#### Privilege Detection

```solidity
if (isAddressStaker(msg.sender)) {
    // Staker gets priority fee and rewards
    if (priorityFee > 0) {
        if (!_updateBalance(from, msg.sender, token, priorityFee))
            revert ErrorsLib.UpdateBalanceFailed();
    }
    _giveReward(msg.sender, 1);
}
```

This automatic detection is used in:
- `pay` (unified payment function)
- `batchPay` (for enhanced rewards)
- `dispersePay` (single-source multi-recipient)
- Bridge operations

### Reward System Integration

#### Standard Rewards

Stakers receive base MATE rewards for transaction processing:

```solidity
_giveReward(msg.sender, 1);  // Single transaction reward
```

#### Batch Rewards

Enhanced rewards for batch processing:

```solidity
_giveReward(msg.sender, successfulTransactions);  // Multiple transaction rewards
```

#### Bridge Rewards

Special rewards for Fisher Bridge operations:

```solidity
balances[msg.sender][evvmMetadata.principalTokenAddress] += evvmMetadata.reward;
```

## Contract Integration

### Staking Contract Address

#### getStakingContractAddress

**Function Type**: `view`  
**Function Signature**: `getStakingContractAddress()`

Returns the authorized staking contract address that can modify staker status.

#### Setup and Configuration

The staking contract address is set during EVVM deployment:

```solidity
constructor(
    address _initialOwner,
    address _stakingContractAddress,
    EvvmMetadata memory _evvmMetadata
) {
    stakingContractAddress = _stakingContractAddress;
    // Initial MATE token allocation to staking contract
    balances[_stakingContractAddress][evvmMetadata.principalTokenAddress] = 
        getRewardAmount() * 2;
    // Register staking contract as staker
    stakerList[_stakingContractAddress] = FLAG_IS_STAKER;
}
```

**Initial Setup Features**:
- **Address Registration**: Sets authorized staking contract
- **Initial Funding**: Provides MATE tokens for reward distribution
- **Staker Status**: Grants staking contract staker privileges
- **Integration Ready**: Prepares for cross-contract communication

### Cross-Contract Communication

#### Staking Contract → EVVM

When users stake or unstake tokens:

1. **User Action**: Stakes/unstakes MATE tokens in staking contract
2. **Status Calculation**: Staking contract determines new staker status
3. **EVVM Update**: Staking contract calls `pointStaker()` to update status
4. **Privilege Change**: User gains/loses staker privileges in EVVM

#### EVVM → Staking Contract

EVVM provides reward distribution to the staking contract:

- **Initial Allocation**: MATE tokens provided during deployment
- **Ongoing Rewards**: System generates rewards for distribution
- **Contract Balance**: Staking contract maintains MATE balance for rewards

## Staker Economics

### Cost-Benefit Analysis

#### Staking Requirements

To become a staker, users typically need to:

1. **Stake MATE Tokens**: Lock tokens in staking contract
2. **Maintain Balance**: Keep minimum staking requirements
3. **Active Participation**: Process transactions to earn rewards
4. **Network Contribution**: Provide validation and processing services

#### Staker Benefits

| Benefit Type          | Description                                    | Value                    |
| --------------------- | ---------------------------------------------- | ------------------------ |
| MATE Rewards          | Base rewards for transaction processing        | Variable (era-based)     |
| Priority Fees         | User-paid fees for transaction processing      | Market-determined        |
| Bridge Fees           | Fees from Fisher Bridge operations            | User-paid + MATE rewards |
| Enhanced Access       | Access to staker-only functions               | Exclusive privileges     |
| Network Influence     | Participation in network validation           | Governance potential     |

### Reward Calculations

#### Single Transaction Rewards

```solidity
// Base MATE reward
uint256 baseReward = evvmMetadata.reward;

// Priority fee (if applicable)
uint256 priorityFee = userSpecifiedFee;

// Total earnings = Base reward + Priority fee
uint256 totalEarnings = baseReward + priorityFee;
```

#### Batch Transaction Rewards

```solidity
// Multiple base rewards
uint256 totalRewards = evvmMetadata.reward * successfulTransactions;

// Multiple priority fees (if applicable)
uint256 totalFees = sum(individualPriorityFees);

// Total earnings = Multiple rewards + Total fees
uint256 totalEarnings = totalRewards + totalFees;
```

## Integration Best Practices

### For Staking Contract Developers

#### Secure Integration

1. **Address Validation**: Ensure EVVM contract address is correct
2. **Access Control**: Properly restrict who can trigger status updates
3. **Error Handling**: Handle EVVM contract failures gracefully
4. **State Synchronization**: Keep staking and EVVM status in sync

#### Status Management

```solidity
// Example staking contract integration
function updateStakerStatus(address user) internal {
    if (isUserStaker(user)) {
        IEvvm(evvmAddress).pointStaker(user, FLAG_IS_STAKER);
    } else {
        IEvvm(evvmAddress).pointStaker(user, 0x00);
    }
}
```

### For EVVM Integrators

#### Staker Verification

Always verify staker status before granting privileges:

```solidity
function privilegedFunction() external {
    require(evvm.isAddressStaker(msg.sender), "Not a staker");
    // Privileged functionality here
}
```

#### Reward Distribution

Properly integrate reward distribution:

```solidity
function processTransaction() external {
    // Transaction processing logic
    
    if (evvm.isAddressStaker(msg.sender)) {
        // Grant rewards through EVVM internal function
        // This is handled automatically by EVVM functions
    }
}
```

### For Users

#### Becoming a Staker

1. **Research Requirements**: Understand staking token requirements
2. **Evaluate Economics**: Calculate potential rewards vs. staking costs
3. **Stake Tokens**: Follow staking contract procedures
4. **Verify Status**: Confirm staker status in EVVM using `isAddressStaker()`
5. **Start Processing**: Begin earning rewards through transaction processing

#### Maintaining Staker Status

1. **Monitor Requirements**: Keep track of minimum staking requirements
2. **Stay Active**: Regularly process transactions to earn rewards
3. **Manage Rewards**: Properly handle earned MATE tokens and fees
4. **Update Status**: Ensure status remains synchronized across contracts

## Security Considerations

### Access Control

#### Staking Contract Security

- **Single Authority**: Only one contract can update staker status
- **Address Verification**: Staking contract address must be validated
- **Function Restrictions**: `pointStaker()` is restricted to staking contract only

#### Status Manipulation Prevention

- **Centralized Control**: Prevents unauthorized staker privilege escalation
- **Contract-Only Updates**: EOAs cannot directly modify staker status
- **Synchronization**: Status changes must originate from staking contract

### Integration Risks

#### Contract Upgrade Risks

- **Address Changes**: Staking contract upgrades may require EVVM updates
- **Interface Changes**: Modified interfaces may break integration
- **State Migration**: Status synchronization during upgrades

#### Failure Scenarios

- **Staking Contract Failure**: EVVM continues operating with existing staker status
- **Communication Failure**: Status updates may be delayed or lost
- **Network Issues**: Cross-contract calls may fail during network congestion

## Monitoring and Maintenance

### Health Indicators

#### Integration Health

- **Status Synchronization**: Staking contract and EVVM status alignment
- **Update Frequency**: Rate of staker status changes
- **Reward Distribution**: Proper MATE reward allocation
- **Cross-Contract Calls**: Success rate of `pointStaker()` calls

#### System Metrics

- **Active Stakers**: Number of addresses with staker status
- **Reward Volume**: Total MATE rewards distributed to stakers
- **Transaction Processing**: Volume of staker-processed transactions
- **Integration Errors**: Failed cross-contract communications

### Troubleshooting

#### Common Issues

1. **Status Sync Failure**
   - Check staking contract integration
   - Verify EVVM contract address in staking contract
   - Review recent staker status changes

2. **Reward Distribution Issues**
   - Verify staker status using `isAddressStaker()`
   - Check MATE token balances
   - Review transaction processing logs

3. **Integration Breaks**
   - Validate contract addresses
   - Check interface compatibility
   - Review access control configurations

## Future Integration Enhancements

### Planned Features

- **Multi-Tier Staking**: Different staker levels with varying privileges
- **Governance Integration**: Staker voting rights in system governance
- **Cross-Chain Staking**: Staking integration across multiple chains
- **Advanced Rewards**: More sophisticated reward calculation mechanisms

### Extensibility

The current integration design supports:

- **Multiple Staker Types**: Using different flag values in `pointStaker()`
- **Enhanced Privileges**: New functions can easily check staker status
- **Reward Evolution**: Flexible reward system can accommodate changes
- **Protocol Evolution**: Integration can adapt to new staking mechanisms

---

## Proxy Management Functions


The EVVM contract uses a sophisticated proxy pattern with time-delayed upgrades to ensure security and allow for community review of critical system changes. This section covers all proxy-related functions for implementation management.

## Proxy Pattern Overview

The EVVM contract implements an upgradeable proxy pattern with the following security features:

- **Time-Delayed Upgrades**: 30-day delay for implementation changes
- **Community Review**: Extended time for security audits and community validation
- **Admin Control**: Only authorized admin can propose and execute upgrades
- **Cancellation Mechanism**: Ability to reject proposed upgrades before execution
- **Fallback Delegation**: Automatic delegation to current implementation

## Implementation Management Functions

### proposeImplementation

**Function Type**: `external onlyAdmin`  
**Function Signature**: `proposeImplementation(address)`

Proposes a new implementation contract for the proxy with a mandatory 30-day time delay for security.

#### Input Parameters

| Parameter   | Type      | Description                                    |
| ----------- | --------- | ---------------------------------------------- |
| `_newImpl`  | `address` | Address of the new implementation contract     |

#### Security Features

- **30-day time delay**: Allows comprehensive community review and validation
- **Admin-only access**: Only current admin can propose upgrades
- **Single proposal**: Only one implementation proposal can be pending at a time
- **Cancellable**: Can be rejected using `rejectUpgrade()` before deadline

#### Workflow

1. **Admin Proposal**: Admin calls `proposeImplementation()` with new implementation address
2. **Deadline Setting**: System sets acceptance deadline (current timestamp + 30 days)
3. **Community Review**: 30-day period for security audits and community validation
4. **Optional Cancellation**: Admin can cancel using `rejectUpgrade()` if issues are found
5. **Execution**: After 30 days, admin can execute upgrade using `acceptImplementation()`

#### Implementation

```solidity
function proposeImplementation(address _newImpl) external onlyAdmin {
    proposalImplementation = _newImpl;
    timeToAcceptImplementation = block.timestamp + 30 days;
}
```

---

### rejectUpgrade

**Function Type**: `external onlyAdmin`  
**Function Signature**: `rejectUpgrade()`

Cancels a pending implementation upgrade proposal before the time delay expires.

#### Security Features

- **Admin-only access**: Only current admin can reject upgrades
- **Immediate effect**: Cancellation takes effect immediately
- **Complete reset**: Clears both proposal address and acceptance deadline
- **Emergency mechanism**: Allows quick response to discovered security issues

#### Use Cases

- **Security Issues**: Community or auditors identify problems in proposed implementation
- **Better Alternative**: Superior implementation becomes available during review period
- **Administrative Decision**: Admin decides to withdraw the upgrade proposal
- **Emergency Response**: Quick cancellation of problematic proposals

#### Implementation

```solidity
function rejectUpgrade() external onlyAdmin {
    proposalImplementation = address(0);
    timeToAcceptImplementation = 0;
}
```

---

### acceptImplementation

**Function Type**: `external onlyAdmin`  
**Function Signature**: `acceptImplementation()`

Executes a pending implementation upgrade after the mandatory 30-day time delay has passed.

#### Security Features

- **Time delay enforcement**: Cannot be called before the acceptance deadline
- **Admin-only access**: Only current admin can execute upgrades
- **Automatic cleanup**: Clears proposal data after successful upgrade
- **Atomic execution**: Implementation change happens atomically

#### Execution Requirements

1. **Valid Proposal**: Must have a pending implementation proposal
2. **Time Elapsed**: Current timestamp must exceed the acceptance deadline
3. **Admin Authorization**: Must be called by the current admin
4. **Clean State**: Proposal state is cleared after execution

#### Workflow

1. **Deadline Verification**: Confirms that 30 days have passed since proposal
2. **Implementation Update**: Sets current implementation to proposed implementation
3. **State Cleanup**: Clears proposal implementation and acceptance deadline
4. **Proxy Activation**: New implementation becomes active for all delegatecalls

#### Implementation

```solidity
function acceptImplementation() external onlyAdmin {
    if (block.timestamp < timeToAcceptImplementation) revert();
    currentImplementation = proposalImplementation;
    proposalImplementation = address(0);
    timeToAcceptImplementation = 0;
}
```

---

## Proxy Query Functions

### getCurrentImplementation

**Function Type**: `view`  
**Function Signature**: `getCurrentImplementation()`

Gets the current active implementation contract address used by the proxy for delegatecalls.

#### Return Value

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `address` | Address of the current implementation contract   |

#### Use Cases

- **Integration Verification**: Confirm which implementation is currently active
- **Debugging**: Identify implementation during troubleshooting
- **Monitoring**: Track implementation changes over time
- **Interface Detection**: Determine available functions in current implementation

---

### getProposalImplementation

**Function Type**: `view`  
**Function Signature**: `getProposalImplementation()`

Gets the proposed implementation contract address that is pending approval for proxy upgrade.

#### Return Value

| Type      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `address` | Address of the proposed implementation contract (zero if none) |

#### Use Cases

- **Proposal Monitoring**: Track pending implementation upgrades
- **Community Review**: Allow community to examine proposed implementations
- **Security Analysis**: Enable security audits of pending upgrades
- **Decision Making**: Provide information for upgrade approval decisions

---

### getTimeToAcceptImplementation

**Function Type**: `view`  
**Function Signature**: `getTimeToAcceptImplementation()`

Gets the acceptance deadline for the pending implementation upgrade.

#### Return Value

| Type      | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `uint256` | Timestamp when implementation upgrade can be executed (0 if no pending proposal) |

#### Use Cases

- **Timing Information**: Know when upgrade can be executed
- **Countdown Tracking**: Monitor time remaining in review period
- **Automation**: Enable automated execution after deadline
- **Planning**: Schedule upgrade execution and related activities

---

## Fallback Mechanism

### Delegatecall Fallback

The EVVM contract implements a sophisticated fallback function that automatically delegates calls to the current implementation:

```solidity
fallback() external {
    if (currentImplementation == address(0)) revert();

    assembly {
        // Copy the entire calldata
        calldatacopy(0, 0, calldatasize())

        // Delegatecall to implementation
        let result := delegatecall(
            gas(), 
            sload(currentImplementation.slot), 
            0, 
            calldatasize(), 
            0, 
            0
        )

        // Copy the return data
        returndatacopy(0, 0, returndatasize())

        // Handle the result
        switch result
        case 0 {
            revert(0, returndatasize()) // Forward revert
        }
        default {
            return(0, returndatasize()) // Forward return
        }
    }
}
```

#### Fallback Features

- **Automatic Delegation**: Routes unknown function calls to current implementation
- **Gas Forwarding**: Passes all available gas to implementation
- **Data Preservation**: Maintains exact calldata and return data
- **Error Forwarding**: Properly forwards reverts and error messages
- **Security Check**: Reverts if no implementation is set

## Security Considerations

### Upgrade Security

#### Time Delay Benefits

- **Community Review**: 30 days allows thorough security analysis
- **Vulnerability Discovery**: Extended time for finding implementation bugs
- **Social Consensus**: Time for community discussion and consensus building
- **Emergency Response**: Ability to cancel upgrades if issues are found

#### Access Control

- **Admin-Only Operations**: All proxy management restricted to admin
- **Single Point of Control**: Centralized but time-delayed upgrade authority
- **Proposal Validation**: Admin can review proposals before execution
- **Emergency Cancellation**: Quick response capability for security issues

### Attack Vectors

#### Malicious Implementation

- **Protection**: 30-day review period allows security analysis
- **Mitigation**: Community can identify malicious code before execution
- **Response**: Admin can cancel malicious proposals using `rejectUpgrade()`

#### Admin Compromise

- **Risk**: Compromised admin could propose malicious implementations
- **Mitigation**: 30-day delay provides time to detect compromise
- **Response**: Community alert systems and emergency procedures

#### Implementation Bugs

- **Risk**: New implementations may contain bugs or vulnerabilities
- **Mitigation**: Extended review period and testing requirements
- **Response**: Cancel upgrade and deploy fixed implementation

## Integration Guidelines

### For Developers

#### Monitoring Upgrades

```solidity
// Check for pending upgrades
address pendingImpl = evvm.getProposalImplementation();
uint256 deadline = evvm.getTimeToAcceptImplementation();

if (pendingImpl != address(0)) {
    // Upgrade is pending - analyze and prepare
    uint256 timeRemaining = deadline - block.timestamp;
    // Implement monitoring and preparation logic
}
```

#### Implementation Development

1. **Security First**: Prioritize security in implementation development
2. **Comprehensive Testing**: Extensive testing before proposal
3. **Community Engagement**: Engage community during development
4. **Documentation**: Provide detailed upgrade documentation

### For Community

#### Review Process

1. **Code Analysis**: Examine proposed implementation code
2. **Security Audit**: Conduct or review security audits
3. **Testing**: Participate in testnet validation
4. **Feedback**: Provide feedback during review period

#### Monitoring Tools

- **Implementation Tracking**: Monitor current and proposed implementations
- **Deadline Alerts**: Set up notifications for upgrade deadlines
- **Change Analysis**: Analyze differences between implementations
- **Community Discussion**: Participate in upgrade discussions

## Best Practices

### Upgrade Planning

1. **Thorough Testing**: Comprehensive testing on testnets
2. **Security Audits**: Professional security audits before proposal
3. **Community Engagement**: Early community involvement and feedback
4. **Documentation**: Complete documentation of changes and rationale
5. **Emergency Procedures**: Clear procedures for upgrade cancellation

### Operational Security

1. **Admin Key Security**: Secure storage and management of admin keys
2. **Monitoring Systems**: Automated monitoring of upgrade proposals
3. **Response Procedures**: Defined procedures for security issues
4. **Community Coordination**: Clear communication channels with community

### Development Lifecycle

1. **Design Phase**: Community input on upgrade requirements
2. **Development Phase**: Transparent development with regular updates
3. **Testing Phase**: Comprehensive testing including security testing
4. **Review Phase**: Community review and feedback incorporation
5. **Deployment Phase**: Careful execution with monitoring

---

## Treasury Functions


The EVVM contract includes specialized functions that can only be called by the authorized Treasury contract. These functions provide controlled access to user balance management for treasury operations such as deposits, withdrawals, and automated distributions.

> **Warning: Treasury Authorization Required**
These functions will revert with `SenderIsNotTreasury()` if called by any address other than the authorized treasury contract.

## addAmountToUser

**Function Type**: `external`  
**Function Signature**: `addAmountToUser(address,address,uint256)`

Adds tokens to a user's balance in the EVVM system. This function is used by the treasury for deposit operations and reward distributions.

### Parameters

| Field    | Type      | Description                                    |
| -------- | --------- | ---------------------------------------------- |
| `user`   | `address` | Address of the user to receive the balance     |
| `token`  | `address` | Address of the token contract                  |
| `amount` | `uint256` | Amount of tokens to add to the user's balance |

### Workflow

1. **Authorization Check**: Validates that `msg.sender` is the authorized treasury contract, reverts with `SenderIsNotTreasury()` if unauthorized
2. **Balance Update**: Directly adds the specified `amount` to `balances[user][token]` mapping
3. **Immediate Effect**: Balance change takes effect immediately within the EVVM system

## removeAmountFromUser

**Function Type**: `external`  
**Function Signature**: `removeAmountFromUser(address,address,uint256)`

Removes tokens from a user's balance in the EVVM system. This function is used by the treasury for withdrawal operations and fee deductions.

### Parameters

| Field    | Type      | Description                                        |
| -------- | --------- | -------------------------------------------------- |
| `user`   | `address` | Address of the user to remove balance from        |
| `token`  | `address` | Address of the token contract                      |
| `amount` | `uint256` | Amount of tokens to remove from the user's balance |

### Workflow

1. **Authorization Check**: Validates that `msg.sender` is the authorized treasury contract, reverts with `SenderIsNotTreasury()` if unauthorized
2. **Balance Update**: Directly subtracts the specified `amount` from `balances[user][token]` mapping
3. **Underflow Risk**: No underflow protection - treasury must ensure sufficient balance exists (Solidity 0.8+ will revert on underflow)
4. **Immediate Effect**: Balance change takes effect immediately within the EVVM system

---

## Name Service Overview


> **Note: Integration Architecture**
NameService uses **centralized signature verification** via Core.sol's `validateAndConsumeNonce()`. All operations use async execution mode for optimal throughput.

The Name Service is a decentralized username management system providing human-readable identities across the EVVM ecosystem with built-in marketplace functionality.

## Core Features

### Username Registration
- **Pre-registration Protection**: Commit-reveal scheme prevents front-running (30-minute window)
- **Dynamic Pricing**: Costs scale with network activity (100x current EVVM reward)
- **Expiration Management**: Renewable usernames with 366-day expiration

### Custom Metadata
- **Schema-Based Storage**: Structured metadata for social links, contacts, and custom fields
- **Flexible Management**: Add, remove, or flush metadata entries independently
- **Cost**: 10x EVVM reward per metadata operation

### Username Marketplace
- **Offer System**: Time-based offers on existing usernames
- **Direct Trading**: Owner-controlled transfers with 0.5% marketplace fee
- **Token Locking**: Offers lock Principal Tokens until withdrawal or acceptance

### Security & Governance
- **Centralized Verification**: All signatures verified by Core.sol's `validateAndConsumeNonce()`
- **Async Execution**: All NameService operations use async nonces (`isAsyncExec = true`)
- **Hash-Based Signatures**: Uses NameServiceHashUtils for deterministic payload generation
- **Time-Delayed Admin**: 1-day waiting period for administrative changes

## Architecture

### Signature Verification Flow

```solidity
// All NameService operations follow this pattern
core.validateAndConsumeNonce(
    user,                                    // Signer address
    Hash.hashDataFor...(params),            // Operation-specific hash
    originExecutor,                         // tx.origin restriction
    nonce,                                  // User's Core nonce
    true,                                   // Always async
    signature                               // EIP-191 signature
);
```

**Key Components:**
- **NameServiceHashUtils**: Generates `hashPayload` for each operation
- **Core.validateAndConsumeNonce()**: Centralized signature verification
- **Async Nonces**: All operations use async execution mode
- **originExecutor**: Optional tx.origin restriction for security

### Payment Processing

NameService uses two payment methods:

**1. User Payments (requestPay):**
```solidity
// For registration fees, offer amounts, metadata costs
core.pay(
    user,                                   // Payer
    address(this),                          // NameService receives
    "",                                     // No identity
    principalToken,                         // Payment token
    amount + priorityFee,                   // Total amount
    priorityFee,                            // Executor reward
    address(this),                          // Executor address
    nonceEvvm,                              // Payment nonce
    true,                                   // Async
    signatureEvvm                           // Payment signature
);
```

**2. Staker Rewards (makeCaPay):**
```solidity
// For distributing rewards to stakers/executors
core.caPay(
    msg.sender,                            // Staker address
    principalToken,                        // Reward token
    rewardAmount + priorityFee             // Total reward
);
```

## Registration Process

Three-step process preventing front-running:

### 1. Pre-Registration (Commit Phase)
```solidity
bytes32 hashUsername = keccak256(abi.encodePacked(username, lockNumber));

preRegistrationUsername(
    user,
    hashUsername,           // Commitment hash
    originExecutor,
    nonce,
    signature,
    priorityFeeEvvm,
    nonceEvvm,
    signatureEvvm
);
```
- Stores commitment for 30 minutes
- Hash conceals actual username
- Front-runners cannot see desired username

### 2. Registration (Reveal Phase)
```solidity
registrationUsername(
    user,
    username,               // Revealed username
    lockNumber,             // Revealed secret
    originExecutor,
    nonce,
    signature,
    priorityFeeEvvm,
    nonceEvvm,
    signatureEvvm
);
```
- Validates commitment matches reveal
- Must occur within 30-minute window
- Grants 366 days of ownership

### 3. Management
- Add custom metadata
- Accept marketplace offers
- Renew before expiration
- Participate in marketplace

## Economic Model

### Registration Costs
- **Standard Rate**: 100x current EVVM reward amount for new usernames
- **Market-Based Pricing**: Uses renewal pricing logic if username has existing offers
- **Dynamic Adjustment**: Registration costs adapt to market demand
- **Offer-Driven Economics**: Higher demand usernames cost more to register

### Metadata Operations
- **Add Metadata**: 10x current EVVM reward amount per entry
- **Remove Metadata**: 10x current EVVM reward amount per entry
- **Flush All Metadata**: 10x reward amount per existing entry
- **No Metadata Limit**: Unlimited custom metadata entries per username

### Renewal Pricing
- **Time-Based**: Calculated using `seePriceToRenew()` function
- **Market Demand**: Pricing adapts based on offers
- **Expiration Protection**: Grace periods and renewal incentives
- **Standard Period**: 366 days per renewal

### Marketplace Economics
- **Trading Fee**: 0.5% of transaction value (split between marketplace and executor)
- **Offer Locking**: Full offer amount locked until withdrawal/acceptance
- **Executor Rewards**: Marketplace operations reward stakers
- **Fee Distribution**: 
  - 0.375% to marketplace
  - 0.125% to executor

## Integration with Core.sol

### Centralized Verification
```solidity
// Every NameService operation validates signature via Core
core.validateAndConsumeNonce(
    user,                                  // Signer
    hashPayload,                           // From NameServiceHashUtils
    originExecutor,                        // tx.origin check
    nonce,                                 // Core nonce
    true,                                  // Async mode
    signature                              // EIP-191 signature
);
```

**Benefits:**
- ✅ Single verification point reduces attack surface
- ✅ Unified nonce system prevents replay attacks
- ✅ Gas-efficient signature checking
- ✅ Consistent error handling

### Payment Integration
- **Unified Token System**: All payments use Principal Tokens through Core
- **Staker Rewards**: Rewards distributed via `core.caPay()`
- **Fee Collection**: Automatic routing to NameService contract
- **Priority Processing**: Higher fees enable faster execution

### Reward Distribution System

**Staker Rewards (if `msg.sender` is staker):**
- **Pre-registration**: 1x reward + priorityFee
- **Registration**: 50x reward + priorityFee
- **Make Offer**: 1x reward + 0.125% offer amount + priorityFee
- **Withdraw Offer**: 1x reward + priorityFee
- **Accept Offer**: Calculated based on offer amount + priorityFee
- **Renew Username**: 1x reward + priorityFee
- **Metadata Operations**: 1x reward + priorityFee each
- **Flush Username**: 10x reward + priorityFee

## NameServiceHashUtils Functions

All operations use dedicated hash generation:

```solidity

// Registration
Hash.hashDataForPreRegistrationUsername(hashUsername)
Hash.hashDataForRegistrationUsername(username, lockNumber)

// Marketplace
Hash.hashDataForMakeOffer(username, amount, expirationDate)
Hash.hashDataForWithdrawOffer(username, offerID)
Hash.hashDataForAcceptOffer(username, offerID)

// Username Management
Hash.hashDataForRenewUsername(username)

// Metadata
Hash.hashDataForAddCustomMetadata(identity, value)
Hash.hashDataForRemoveCustomMetadata(identity, key)
Hash.hashDataForFlushCustomMetadata(identity)

// Cleanup
Hash.hashDataForFlushUsername(username)
```

## Use Cases

### Individual Users
- **Digital Identity**: Establish recognizable username across platform
- **Profile Management**: Add social media links, contact info, credentials
- **Asset Trading**: Buy, sell, or trade valuable usernames
- **Metadata Storage**: Store custom structured data on-chain

### Organizations
- **Brand Protection**: Register and protect organizational usernames
- **Team Management**: Assign usernames to team members or departments
- **Public Presence**: Maintain verified organizational identity
- **Custom Schemas**: Implement organization-specific metadata

### Developers
- **Identity Resolution**: Resolve addresses to human-readable names
- **Metadata Standards**: Implement standardized user profile systems
- **Marketplace Tools**: Create trading interfaces and analytical tools
- **Integration APIs**: Build applications using NameService identities

## Best Practices

### Security
- **Use Random Lock Numbers**: Generate cryptographically random values for commit-reveal
- **Never Reuse Nonces**: Each operation needs unique nonce from Core
- **Validate Usernames**: Check format before committing
- **Set Executor Restrictions**: Use `originExecutor` for sensitive operations

### Gas Optimization
- **Batch Metadata**: Add multiple entries in sequence if needed
- **Time Renewals**: Renew before expiration for better pricing
- **Monitor Marketplace**: Withdraw expired offers to reclaim locked tokens
- **Plan Offers**: Calculate marketplace fees before submitting

### Development
- **Use HashUtils**: Always use NameServiceHashUtils for payload generation
- **Test Commit-Reveal**: Verify 30-minute window handling
- **Handle Expirations**: Implement expiration monitoring
- **Track Nonces**: Query Core.sol for available nonces

---

**License**: EVVM-NONCOMMERCIAL-1.0  
**Contract**: NameService.sol  
**Verification**: Centralized via Core.sol

## Technical Architecture

### Smart Contract Design
- **Modular Functions**: Separate contracts for different functionality areas
- **Upgrade Safety**: Time-locked governance prevents immediate changes
- **Gas Optimization**: Efficient operations for common use cases
- **Comprehensive API**: Over 30 getter functions for complete system state access

### Data Storage
- **On-Chain Metadata**: All usernames and metadata stored on blockchain
- **Efficient Indexing**: Optimized data structures for quick lookups
- **Scalable Design**: Architecture supports growing user base
- **State Verification**: Built-in functions for verifying data integrity and ownership

### Query Infrastructure
- **Real-Time Pricing**: Dynamic pricing functions based on current network conditions
- **Ownership Verification**: Multiple verification methods from basic checks to strict validation
- **Metadata Management**: Complete CRUD operations with efficient retrieval functions
- **Administrative Monitoring**: Full transparency of admin proposals and system status

### Data Validation Layer
- **Format Enforcement**: Strict validation rules for usernames, emails, and phone numbers
- **Security Checks**: Input sanitization prevents malformed data storage
- **Standard Compliance**: Email validation follows RFC standards for maximum compatibility
- **Character Set Control**: Username validation ensures consistent identifier formats

### Event System
- **Comprehensive Logging**: All operations emit detailed events
- **Integration Support**: Events enable external system integration
- **Audit Trail**: Complete history of all username operations

The Name Service represents a foundational layer for decentralized identity within the EVVM ecosystem, providing the infrastructure for human-readable addresses, rich profile information, and secure username trading.

---

## preRegistrationUsername


> **Note: Centralized Verification**
This function uses Core.sol's `validateAndConsumeNonce()` for signature verification. All NameService operations use **async execution** (`isAsyncExec = true`).

**Function Type**: `external`  
**Function Signature**: `preRegistrationUsername(address,bytes32,address,uint256,bytes,uint256,uint256,bytes)`

Pre-registers a username hash to prevent front-running attacks during the registration process. This function creates a 30-minute reservation window using a commit-reveal scheme where users commit to a hash of their desired username plus a secret lock number.

## Parameters

| Parameter                   | Type      | Description                                                                                                                     |
| --------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `user`                      | `address` | The address of the end-user initiating the pre-registration.                                                                    |
| `hashPreRegisteredUsername` | `bytes32` | The commitment hash calculated as `keccak256(abi.encodePacked(username, lockNumber))`.                                      |
| `originExecutor`            | `address` | Optional tx.origin restriction (use `address(0)` for unrestricted execution).                                                   |
| `nonce`                     | `uint256` | User's centralized nonce from Core.sol for this operation.                           |
| `signature`                 | `bytes`   | EIP-191 signature authorizing this operation (verified by Core.sol).                                                     |
| `priorityFeeEvvm`          | `uint256` | Optional fee (in Principal Tokens) paid to `msg.sender` (executor) if they are a staker. |
| `nonceEvvm`                | `uint256` | **Required if `priorityFeeEvvm > 0`**. User's Core nonce for the payment operation.   |
| `signatureEvvm`            | `bytes`   | **Required if `priorityFeeEvvm > 0`**. User's signature authorizing the Core payment.           |

> **Note: Signature Requirements**

**NameService Signature** (`signature`):
- Format: `{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}`
- Uses `NameServiceHashUtils.hashDataForPreRegistrationUsername(hashPreRegisteredUsername)`'
- Reference: [Pre-Registration Signature Structure](../../../05-SignatureStructures/02-NameService/01-preRegistrationUsernameStructure.md)

**Payment Signature** (`signatureEvvm`) - if `priorityFeeEvvm > 0`:
- Follows Core payment format
- Uses `CoreHashUtils.hashDataForPay()`
- Reference: [Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md)


##Hash Username Structure

The `hashPreRegisteredUsername` is calculated off-chain:

```solidity
bytes32 hashPreRegisteredUsername = keccak256(abi.encodePacked(username, lockNumber));
```

**Components:**
- `username` (string): The desired username (kept secret during commit phase)
- `lockNumber` (uint256): Secret number (required later during `registrationUsername`)

**Security:** The hash conceals the actual username from front-runners. Only the user knows the `lockNumber` needed to complete registration.

## Execution Flow

### 1. Signature Verification (Core.sol)

```solidity
core.validateAndConsumeNonce(
    user,                                                      // Signer
    Hash.hashDataForPreRegistrationUsername(hashPreRegisteredUsername), // Hash payload
    originExecutor,                                            // tx.origin check
    nonce,                                                     // Core nonce
    true,                                                      // Async
    signature                                                  // EIP-191 signature
);
```

**What Core.sol validates:**
- ✅ Signature matches `user` address
- ✅ Nonce is valid and available
- ✅ `tx.origin` matches `originExecutor` (if specified)
- ✅ Marks nonce as consumed
- ✅ Optionally delegates to UserValidator

### 2. Priority Fee Processing (if > 0)

```solidity
if (priorityFeeEvvm > 0) {
    requestPay(user, 0, priorityFeeEvvm, nonceEvvm, signatureEvvm);
}
```

Internally calls:
```solidity
core.pay(
    user,                                  // Payer
    address(this),                         // NameService
    "",                                    // No identity
    principalToken,                        // PT
    priorityFeeEvvm,                       // Amount
    priorityFeeEvvm,                       // Priority fee
    address(this),                         // Executor
    nonceEvvm,                             // Payment nonce
    true,                                  // Async
    signatureEvvm                          // Payment sig
);
```

### 3. Commitment Storage

Stores the commitment for 30 minutes:

```solidity
string memory key = string.concat("@", AdvancedStrings.bytes32ToString(hashPreRegisteredUsername));

identityDetails[key] = IdentityBaseMetadata({
    owner: user,
    expirationDate: block.timestamp + 30 minutes,
    customMetadataMaxSlots: 0,
    offerMaxSlots: 0,
    flagNotAUsername: 0x01                    // Marked as pre-registration
});
```

**Key Format:** `@<hash_string>` (e.g., `@0xa7f3c2d8e9b4f1a6...`)

### 4. Staker Rewards (if executor is staker)

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(msg.sender, core.getRewardAmount() + priorityFeeEvvm);
}
```

**Reward Breakdown:**
- Base reward: 1x `core.getRewardAmount()`
- Priority fee: Full `priorityFeeEvvm` amount
- Distributed via `core.caPay()`

## Execution Methods

Can be executed by any address. Rewards only distributed if `msg.sender` is a staker.

### Fisher Execution (Off-Chain Executors)

1. User signs operation and payment (if priority fee)
2. Fisher captures and validates transaction
3. Fisher submits to NameService contract
4. If fisher is staker, receives rewards

### Direct Execution

1. User or service submits directly to contract
2. If executor is staker, receives rewards
3. No intermediary needed

## Complete Example

**Scenario:** User wants to reserve username "alice" for 30 minutes

### Step 1: Generate Commitment

```solidity
string memory username = "alice";
uint256 lockNumber = 987654321;  // Keep secret!

bytes32 hashPreRegisteredUsername = keccak256(
    abi.encodePacked(username, lockNumber)
);
// Result: 0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
```

### Step 2: Generate Operation Signature

```solidity
// Generate hash payload
bytes32 hashPayload = NameServiceHashUtils.hashDataForPreRegistrationUsername(
    hashPreRegisteredUsername
);

// Construct signature message (via Core)
// Format: {evvmId},{nameServiceAddress},{hashPayload},{originExecutor},{nonce},{isAsyncExec}
```

### Step 3: Call Function

```solidity
nameService.preRegistrationUsername(
    user,                                   // 0x742d...
    hashPreRegisteredUsername,              // 0xa7f3...
    address(0),                             // Unrestricted
    nonce,                                  // 42
    signature,                              // Operation sig
    1000000000000000000,                    // 1 PT priority fee
    nonceEvvm,                              // 43
    signatureEvvm                           // Payment sig
);
```

### Step 4: Wait 30 Minutes

Commitment is now stored and valid for 30 minutes. Must complete registration within this window.

## Important Notes

### Time Window
- **Valid for**: 30 minutes from commitment
- **Must register**: Before `expirationDate` passes
- **If expired**: Must submit new pre-registration

### Lock Number Security
- **Randomness**: Use cryptographically secure random number
- **Secrecy**: Never share before registration
- **Storage**: Store safely client-side
- **Size**: uint256 (0 to 2^256-1)

### Front-Running Protection
```solidity
// Commit phase: Only hash is public
hashUsername = keccak256(abi.encodePacked("alice", 987654321))
// Front-runners see: 0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5...
// Front-runners cannot determine: "alice"

// Reveal phase (after 30 min): Username is revealed
regist rationUsername(..., "alice", 987654321, ...)
// Contract validates: keccak256("alice", 987654321) == stored hash
```

## Gas Costs

**Estimated Gas Usage:**
- Base operation: ~50,000 gas
- Core verification: ~5,000 gas
- Storage (commitment): ~20,000 gas
- Payment (if priority fee): ~30,000 gas
- **Total**: ~75,000 - 105,000 gas

## Error Handling

Common revert reasons:

```solidity
// From Core.sol validation
"Invalid signature"                 // Signature verification failed
"Nonce already used"                // Nonce was consumed
"Invalid executor"                  // tx.origin doesn't match originExecutor

// From payment processing (if priorityFeeEvvm > 0)
"Insufficient balance"              // User lacks PT for fee
"Payment signature invalid"         // Payment signature failed
```

## Related Functions

- **[registrationUsername](./02-registrationUsername.md)** - Complete registration (reveal phase)
- **[Core.validateAndConsumeNonce](../../01-EVVM/03-SignatureAndNonceManagement.md)** - Signature verification

---

## registrationUsername


> **Note: Centralized Verification**
This function uses Core.sol's `validateAndConsumeNonce()` for signature verification. Completes the commit-reveal scheme started by `preRegistrationUsername`.

**Function Type**: `external`  
**Function Signature**: `registrationUsername(address,string,uint256,address,uint256,bytes,uint256,uint256,bytes)`

Completes username registration by revealing the username and lock number used in pre-registration. This function validates the reveal against the stored commitment, processes the registration fee payment, and grants 366 days of ownership.

**Requirements:**
- Valid pre-registration with matching hash must exist
- Pre-registration must belong to the same `user`
- Pre-registration must not be expired (within 30-minute window)
- Username must be available and valid format
- User must pay registration fee (100x EVVM reward or market-based)

## Parameters

| Parameter           | Type      | Description                                                                                                                       |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `user`              | `address` | The address of the registrant (must match pre-registration address).                           |
| `username`          | `string`  | The desired username being registered (revealed from commit phase).                            |
| `lockNumber`        | `uint256` | The secret number used during pre-registration. Proves ownership of commitment. |
| `originExecutor`    | `address` | Optional tx.origin restriction (use `address(0)` for unrestricted).                                                                        |
| `nonce`             | `uint256` | User's centralized Core nonce for this operation.                                                                        |
| `signature`         | `bytes`   | EIP-191 signature authorizing this operation (verified by Core.sol).                                                           |
| `priorityFeeEvvm`  | `uint256` | Optional fee paid to executor, added to registration fee payment.         |
| `nonceEvvm`        | `uint256` | User's Core nonce for the payment operation (registration fee + priority fee).                                                   |
| `signatureEvvm`    | `bytes`   | User's signature authorizing the payment (registration fee + priority fee).               |

> **Note: Signature Requirements**

**NameService Signature** (`signature`):
- Uses `NameServiceHashUtils.hashDataForRegistrationUsername(username, lockNumber)`
- Reference: [Registration Signature Structure](../../../05-SignatureStructures/02-NameService/02-registrationUsernameStructure.md)

**Payment Signature** (`signatureEvvm`):
- Covers **total payment**: `getPriceOfRegistration(username) + priorityFeeEvvm`
- Uses `CoreHashUtils.hashDataForPay()`
- Reference: [Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md)


## Execution Flow

### 1. Signature Verification (Core.sol)

```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForRegistrationUsername(username, lockNumber),
    originExecutor,
    nonce,
    true,                                  // Async
    signature
);
```

**What Core.sol validates:**
- ✅ Signature matches `user` address
- ✅ Nonce is valid and available
- ✅ `tx.origin` matches `originExecutor` (if specified)
- ✅ Marks nonce as consumed

### 2. Username Validation

```solidity
// Admin bypass validation
if (admin.current != user && !IdentityValidation.isValidUsername(username)) {
    revert Error.InvalidUsername();
}

if (!isUsernameAvailable(username)) {
    revert Error.UsernameAlreadyRegistered();
}
```

**Validation Rules:**
- Alphanumeric characters only (a-z, 0-9, underscore)
- Length: 3-32 characters
- No leading/trailing underscores
- Not already registered (admin can override)

### 3. Registration Fee Payment

```solidity
uint256 registrationCost = getPriceOfRegistration(username);

requestPay(
    user,
    registrationCost,
    priorityFeeEvvm,
    nonceEvvm,
    signatureEvvm
);
```

Internally calls:
```solidity
core.pay(
    user,                                  // Payer
    address(this),                         // NameService receives
    "",                                    // No identity
    principalToken,                        // PT
    registrationCost + priorityFeeEvvm,    // Total
    priorityFeeEvvm,                       // Priority fee
    address(this),                         // Executor
    nonceEvvm,                             // Payment nonce
    true,                                  // Async
    signatureEvvm                          // Payment sig
);
```

**Registration Cost Calculation:**
```solidity
function getPriceOfRegistration(string memory username) public view returns (uint256) {
    return identityDetails[username].offerMaxSlots > 0
        ? seePriceToRenew(username)       // Market-based (if offers exist)
        : core.getRewardAmount() * 100;   // Standard rate
}
```

### 4. Pre-Registration Validation

```solidity
string memory key = string.concat(
    "@",
    AdvancedStrings.bytes32ToString(hashUsername(username, lockNumber))
);

// Validate commitment
if (
    identityDetails[key].owner != user ||
    identityDetails[key].expirationDate > block.timestamp
) {
    revert Error.PreRegistrationNotValid();
}
```

**Validates:**
- ✅ Pre-registration exists
- ✅ Matches same `user` address
- ✅ Waiting period has passed (30 minutes)
- ✅ Not expired

### 5. Username Registration

```solidity
identityDetails[username] = IdentityBaseMetadata({
    owner: user,
    expirationDate: block.timestamp + 366 days,
    customMetadataMaxSlots: 0,
    offerMaxSlots: 0,
    flagNotAUsername: 0x00                    // Marked as username
});
```

**Grants:**
- 366 days of ownership
- Metadata capabilities
- Marketplace participation

### 6. Staker Rewards (if executor is staker)

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(msg.sender, (50 * core.getRewardAmount()) + priorityFeeEvvm);
}
```

**Reward Breakdown:**
- Base reward: 50x `core.getRewardAmount()`
- Priority fee: Full `priorityFeeEvvm` amount
- Highest NameService reward (reflects registration importance)

### 7. Cleanup

```solidity
delete identityDetails[key];  // Remove pre-registration
```

Frees storage and gas refund.

## Complete Example

**Scenario:** Complete registration of "alice" after pre-registration

### Step 1: Recall Pre-Registration Details

```solidity
string memory username = "alice";
uint256 lockNumber = 987654321;  // Used in pre-registration

// Verify commitment matches
bytes32 expectedHash = keccak256(abi.encodePacked(username, lockNumber));
// Must match pre-registration hash
```

### Step 2: Calculate Registration Cost

```solidity
uint256 registrationCost = nameService.getPriceOfRegistration("alice");
// If no offers: 100x reward (e.g., 100 PT)
// If offers exist: Market-based pricing
```

### Step 3: Generate Signatures

```solidity
// Operation signature
bytes32 hashPayload = NameServiceHashUtils.hashDataForRegistrationUsername(
    username, 
    lockNumber
);

// Payment signature (covers total)
bytes32 paymentHash = CoreHashUtils.hashDataForPay(
    nameServiceAddress,                    // Receiver
    principalToken,
    registrationCost + priorityFee,
    priorityFee
);
```

### Step 4: Submit Registration

```solidity
nameService.registrationUsername(
    user,                                   // 0x742d...
    "alice",                                // Revealed username
    987654321,                              // Revealed lock number
    address(0),                             // Unrestricted
    nonce,                                  // 43
    signature,                              // Operation sig
    1000000000000000000,                    // 1 PT priority fee
    nonceEvvm,                              // 44
    signatureEvvm                           // Payment sig (covers 101 PT)
);
```

### Step 5: Username Registered

```solidity
// Now available for use
address owner = nameService.getOwnerOfIdentity("alice");        // user address
uint256 expires = nameService.getExpireDateOfIdentity("alice"); // now + 366 days
```

## Pricing Examples

### Standard Rate (No Offers)
```solidity
// No existing offers on username
registrationCost = 100 * core.getRewardAmount();
// Example: 100 * 1 PT = 100 PT
```

### Market-Based (With Offers)
```solidity
// Username has offers, uses seePriceToRenew()
// Price based on:
// - Time to expiration
// - Offer amounts
// - Market demand
registrationCost = seePriceToRenew("alice");
// Example: 150 PT (higher demand)
```

## Important Notes

### Time Constraints
- **Minimum wait**: 30 minutes after pre-registration
- **Maximum wait**: No hard limit, but pre-registration expires eventually
- **Best practice**: Register within 24 hours of pre-registration

### Lock Number Security
```solidity
// NEVER share lock number before registration
lockNumber = 987654321;  // Keep this secret!

// After registration, lock number can be public
// (but no harm in keeping it private)
```

### Username Validation
```solidity
// Valid usernames
"alice"          ✅  // lowercase letters
"alice123"       ✅  // letters + numbers
"alice_bob"      ✅  // underscores allowed

// Invalid usernames
"Alice"          ❌  // uppercase not allowed
"alice-bob"      ❌  // hyphens not allowed
"al"             ❌  // too short (< 3 chars)
"_alice"         ❌  // leading underscore
"alice_"         ❌  // trailing underscore
```

### Admin Override
```solidity
// Admin can bypass validation
if (admin.current == user) {
    // Skip validation
    // Allows admin to register any format
}
```

## Gas Costs

**Estimated Gas Usage:**
- Base operation: ~100,000 gas
- Core verification: ~5,000 gas
- Username validation: ~5,000 gas
- Payment processing: ~40,000 gas
- Storage (username): ~40,000 gas
- Cleanup (pre-reg): ~5,000 gas (refund)
- **Total**: ~195,000 gas

**Actual cost varies with:**
- Username length
- Market pricing calculations
- Staker reward distribution

## Error Handling

Common revert reasons:

```solidity
// From Core.sol
"Invalid signature"                 // Operation signature failed
"Nonce already used"                // Nonce consumed
"Invalid executor"                  // tx.origin mismatch

// From validation
"InvalidUsername"                   // Format validation failed
"UsernameAlreadyRegistered"         // Username taken

// From pre-registration check
"PreRegistrationNotValid"           // Commitment doesn't match
                                    // OR wrong owner
                                    // OR expired

// From payment
"Insufficient balance"              // User lacks PT
"Payment signature invalid"         // Payment sig failed
```

## Related Functions

- **[preRegistrationUsername](./01-preRegistrationUsername.md)** - Commit phase
- **[renewUsername](./06-renewUsername.md)** - Extend expiration
- **[Core.validateAndConsumeNonce](../../01-EVVM/03-SignatureAndNonceManagement.md)** - Verification system

---

## makeOffer


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `makeOffer(address user, string memory username, uint256 amount, uint256 expirationDate, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external returns (uint256 offerID)`

Creates a formal, time-limited offer to purchase an existing username by locking principal tokens in the marketplace. The offer commits 99.5% of the amount to potential purchase (0.5% marketplace fee). Can be executed by any address, with staker rewards distributed to `msg.sender` if they are registered as a staker.

## Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | The address making the offer (offeror) |
| `username` | `string` | Target username for purchase offer |
| `amount` | `uint256` | Total principal tokens to commit (gross amount including 0.5% fee) |
| `expirationDate` | `uint256` | Unix timestamp when offer automatically expires |
| `originExecutor` | `address` | The address authorized to submit this specific signed transaction |
| `nonce` | `uint256` | User's Core nonce for this signature (prevents replay attacks) |
| `signature` | `bytes` | EIP-191 signature from `user` authorizing offer creation |
| `priorityFeeEvvm` | `uint256` | Optional priority fee for faster processing (paid to staker executor) |
| `nonceEvvm` | `uint256` | User's Core nonce for the payment signature |
| `signatureEvvm` | `bytes` | User's signature authorizing the payment transfer |

**Returns**: `uint256 offerID` - Sequential identifier assigned to the created offer

## Signature Requirements

This function requires **two signatures** from the user:

### 1. NameService Offer Signature

Authorizes the marketplace offer creation:

```
Message Format: {evvmId},{serviceAddress},{hashPayload},{originExecutor},{nonce},{isAsyncExec}
Hash Payload: NameServiceHashUtils.hashDataForMakeOffer(username, amount, expirationDate)
Async Execution: true (always)
```

**Example**:
```solidity
string memory username = "alice";
uint256 amount = 50000000000000000000; // 50 tokens
uint256 expirationDate = 1800000000; // Far future timestamp

bytes32 hashPayload = NameServiceHashUtils.hashDataForMakeOffer(
    username,
    amount,
    expirationDate
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameServiceContract)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(bytes(message).length), message));
(uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, messageHash);
bytes memory signature = abi.encodePacked(r, s, v);
```

### 2. Payment Signature (Core.sol)

Authorizes the payment of `amount + priorityFeeEvvm`:

```
Payment Amount: amount + priorityFeeEvvm
Recipient: address(nameServiceContract)
```

This uses the standard [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

## Execution Flow

### 1. Signature Verification (Centralized)

Core.sol validates the signature and consumes the nonce:

```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForMakeOffer(username, amount, expirationDate),
    originExecutor,
    nonce,
    true,  // Always async execution
    signature
);
```

**Validation Steps**:
- Verifies nonce hasn't been used (prevents replay)
- Validates EIP-191 signature matches user + payload
- Confirms `tx.origin == originExecutor` (EOA verification)
- Marks nonce as consumed (prevents double-use)

**Reverts With**:
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidSignature()` - Signature validation failed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Username Validation

Validates the target username exists and is available for offers:

```solidity
if (
    identityDetails[username].flagNotAUsername == 0x01 ||
    !verifyIfIdentityExists(username)
) revert Error.InvalidUsername();
```

**Checks**:
- Username must be registered (not pre-registration)
- Username must not be flagged as invalid
- Username must exist in identity registry

**Reverts With**:
- `InvalidUsername()` - Username doesn't exist or is flagged

### 3. Offer Parameters Validation

Validates offer terms are reasonable:

```solidity
if (expirationDate <= block.timestamp)
    revert Error.CannotBeBeforeCurrentTime();

if (amount == 0)
    revert Error.AmountMustBeGreaterThanZero();
```

**Validation Rules**:
- Expiration must be in the future
- Amount must be greater than zero

**Reverts With**:
- `CannotBeBeforeCurrentTime()` - Expiration date has passed
- `AmountMustBeGreaterThanZero()` - Zero amount offer

### 4. Payment Processing

Transfers the offer amount from user to NameService contract:

```solidity
requestPay(user, amount, priorityFeeEvvm, nonceEvvm, signatureEvvm);
```

This internally calls:
```solidity
core.pay(
    user,                    // Payer
    address(this),          // Recipient (NameService)
    amount + priorityFeeEvvm,
    nonceEvvm,
    true,                   // Always async
    signatureEvvm
);
```

**Token Flow**:
- User → NameService: `amount + priorityFeeEvvm`
- Locked for potential username transfer

**Reverts With**: Any Core.pay() errors (insufficient balance, invalid signature)

### 5. Offer ID Assignment

Finds the next available sequential offer slot:

```solidity
uint256 offerID = 0;
while (usernameOffers[username][offerID].offerer != address(0))
    offerID++;
```

Increments through IDs until finding an empty slot (deleted or never used).

### 6. Offer Storage

Creates the marketplace offer with net amount (after 0.5% fee):

```solidity
uint256 amountToOffer = ((amount * 995) / 1000);  // 99.5%

usernameOffers[username][offerID] = Structs.OfferMetadata({
    offerer: user,
    expirationDate: expirationDate,
    amount: amountToOffer
});
```

**Fee Breakdown**:
- Net offer (locked for purchase): 99.5% of amount
- Marketplace fee: 0.5% of amount

### 7. Token Locking Accounting

Updates total locked tokens for withdrawal tracking:

```solidity
principalTokenTokenLockedForWithdrawOffers +=
    amountToOffer +      // Net offer (99.5%)
    (amount / 800);      // Fee portion (0.125%)
```

**Components**:
- Net offer amount: Used if offer is accepted
- Fee portion: Available for withdrawal refunds

### 8. Staker Reward Distribution

If executor is a registered staker, distributes rewards:

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(
        msg.sender,
        core.getRewardAmount() +         // Base reward (1x)
            ((amount * 125) / 100_000) + // 0.125% of offer
            priorityFeeEvvm              // Priority fee
    );
}
```

**Reward Calculation**:
```
Total Reward = Base Reward + Marketplace Incentive + Priority Fee
             = 1x + (amount × 0.125%) + priorityFeeEvvm
```

**Example** (50 token offer, 1 token priority fee):
```
Base: 1x getRewardAmount() (e.g., 0.01 tokens)
Marketplace: 50 × 0.00125 = 0.0625 tokens
Priority: 1.0 tokens
Total: ~1.0725 tokens
```

### 9. Offer Slot Management

Updates the maximum offer slot index for this username:

```solidity
if (offerID > identityDetails[username].offerMaxSlots) {
    identityDetails[username].offerMaxSlots++;
} else if (identityDetails[username].offerMaxSlots == 0) {
    identityDetails[username].offerMaxSlots++;
}
```

Tracks highest offer ID for efficient iteration.

## Complete Usage Example

```solidity
// Setup
address user = 0x123...;
string memory username = "bob";
uint256 amount = 100000000000000000000; // 100 tokens
uint256 expirationDate = block.timestamp + 30 days;
address originExecutor = msg.sender;
uint256 nonce = core.getNonce(user, address(nameService));
uint256 priorityFee = 5000000000000000000; // 5 tokens

// Generate offer signature
bytes32 hashPayload = NameServiceHashUtils.hashDataForMakeOffer(
    username,
    amount,
    expirationDate
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameService)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes memory signature = signMessage(user, message);

// Generate payment signature (amount + priority fee)
uint256 nonceEvvm = core.getNonce(user, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    user,
    address(nameService),
    amount + priorityFee,
    nonceEvvm
);

// Execute offer creation
uint256 offerID = nameService.makeOffer(
    user,
    username,
    amount,
    expirationDate,
    originExecutor,
    nonce,
    signature,
    priorityFee,
    nonceEvvm,
    signatureEvvm
);

// offerID = 0 (first offer for this username)
// Net offer locked: 99.5 tokens (99.5%)
// Marketplace fee: 0.5 tokens (0.5%)
// Staker reward: ~1x + 0.125 tokens + 5 tokens priority
```

## Gas Cost Estimation

| Operation | Approximate Gas |
|-----------|----------------|
| Core signature verification | ~25,000 |
| Username validation | ~5,000 |
| Payment processing (Core.pay) | ~85,000 |
| Offer storage (new slot) | ~45,000 |
| Staker reward distribution | ~30,000 |
| **Total Estimate** | **~190,000 gas** |

*Gas costs vary based on offer slot reuse and current network conditions.*

## Error Handling

### Core.sol Errors
- `Core__NonceAlreadyUsed()` - Signature nonce already consumed
- `Core__InvalidSignature()` - Invalid signature format or signer
- `Core__InvalidExecutor()` - msg.sender not authorized as executor

### NameService Validation Errors
- `InvalidUsername()` - Username doesn't exist or is pre-registration
- `CannotBeBeforeCurrentTime()` - Expiration date in the past
- `AmountMustBeGreaterThanZero()` - Offer amount is zero

### Payment Errors
- Core.pay() errors (insufficient balance, invalid payment signature)

## Economic Model

### Offer Amount Distribution

**100 Token Offer Example**:
```
┌────────────────────────────────────┐
│ User Pays: 100 tokens              │
├────────────────────────────────────┤
│ Net Offer (locked): 99.5 tokens    │  ← Transferred if accepted
│ Marketplace Fee: 0.5 tokens        │  ← NameService revenue
└────────────────────────────────────┘

Staker Reward Breakdown:
├─ Base Reward: 1x getRewardAmount()
├─ Marketplace Incentive: 0.125 tokens (0.125% of 100)
└─ Priority Fee: Variable (set by user)
```

### Fee vs Reward Split

The 0.5% marketplace fee splits into:
- **25%** (0.125% of offer) → Immediate staker reward
- **75%** (0.375% of offer) → Retained by protocol

This creates a marketplace incentive for stakers to process offers while maintaining protocol sustainability.

## State Changes

1. **User balance** → Decreased by `amount + priorityFeeEvvm`
2. **NameService balance** → Increased by `amount + priorityFeeEvvm`
3. **usernameOffers[username][offerID]** → New offer metadata stored
4. **principalTokenTokenLockedForWithdrawOffers** → Increased by locked amount
5. **identityDetails[username].offerMaxSlots** → Potentially incremented
6. **Core nonce** → User's nonce marked as consumed
7. **Staker balance** (if applicable) → Increased by reward + priority fee

## Related Functions

- [acceptOffer](./05-acceptOffer.md) - Accept a marketplace offer and transfer username
- [withdrawOffer](./04-withdrawOffer.md) - Cancel offer and reclaim locked tokens
- [getPriceOfRegistration](../05-GetterFunctions.md#getpriceofregistration) - Uses market offers for pricing
- [preRegistrationUsername](./01-preRegistrationUsername.md) - Initial username registration flow

## Implementation Notes

### Offer Expiration

Offers don't automatically expire:
- Expired offers can still be withdrawn by offerer
- Current owner can reject expired offers via acceptOffer validation
- Expiration acts as a commitment deadline, not automatic cleanup

### Sequential Offer IDs

Offer IDs are assigned sequentially per username:
- First offer: ID 0
- Deleted offers leave gaps that are reused
- `offerMaxSlots` tracks the highest ever used ID

### Token Locking Precision

The locked amount calculation ensures accurate accounting:
```solidity
netOffer = (amount * 995) / 1000        // 99.5%
locked = netOffer + (amount / 800)       // Add 0.125% for tracking
```

The additional 0.125% ensures the marketplace fee portion is accounted for in withdrawal scenarios.

---

## withdrawOffer


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `withdrawOffer(address user, string memory username, uint256 offerID, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Allows the original offeror to cancel their marketplace offer and retrieve the locked principal tokens. This refunds the entire locked amount (99.5% offer + marketplace fees) back to the offeror. Can only be executed by the address that created the offer. Optional priority fee can be paid to incentivize faster execution.

## Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | The address that created the offer (offeror) |
| `username` | `string` | Username the offer was made for |
| `offerID` | `uint256` | Identifier of the offer being withdrawn |
| `originExecutor` | `address` | EOA that will execute the transaction (verified with tx.origin) |
| `nonce` | `uint256` | User's Core nonce for this signature (prevents replay attacks) |
| `signature` | `bytes` | EIP-191 signature from `user` (offeror) authorizing the withdrawal |
| `priorityFeeEvvm` | `uint256` | Optional priority fee for faster processing (paid to staker executor) |
| `nonceEvvm` | `uint256` | User's Core nonce for the payment signature |
| `signatureEvvm` | `bytes` | User's signature authorizing the priority fee payment (if > 0) |

## Signature Requirements

This function requires **one or two signatures** from the offeror:

### 1. NameService Withdraw Offer Signature (Required)

Authorizes the offer cancellation and refund:

```
Message Format: {evvmId},{serviceAddress},{hashPayload},{originExecutor},{nonce},{isAsyncExec}
Hash Payload: NameServiceHashUtils.hashDataForWithdrawOffer(username, offerID)
Async Execution: true (always)
```

**Example**:
```solidity
string memory username = "alice";
uint256 offerID = 0;

bytes32 hashPayload = NameServiceHashUtils.hashDataForWithdrawOffer(
    username,
    offerID
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameServiceContract)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(bytes(message).length), message));
(uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, messageHash);
bytes memory signature = abi.encodePacked(r, s, v);
```

### 2. Payment Signature (Conditional - Only if priorityFeeEvvm > 0)

If providing a priority fee, authorizes payment to the executor:

```
Payment Amount: priorityFeeEvvm (only the fee, no base amount)
Recipient: address(nameServiceContract)
```

This uses the standard [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

**Note**: The `requestPay` call uses `amount = 0` because only the priority fee is being paid. The offer refund comes from locked escrow, not the user's active balance.

## Execution Flow

### 1. Signature Verification (Centralized)

Core.sol validates the signature and consumes the nonce:

```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForWithdrawOffer(username, offerID),
    originExecutor,
    nonce,
    true,  // Always async execution
    signature
);
```

**Validation Steps**:
- Verifies nonce hasn't been used (prevents replay)
- Validates EIP-191 signature matches user + payload
- Confirms `tx.origin == originExecutor` (EOA verification)
- Marks nonce as consumed (prevents double-use)

**Reverts With**:
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidSignature()` - Signature validation failed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Offerer Verification

Validates that the signer is the original offer creator:

```solidity
if (usernameOffers[username][offerID].offerer != user)
    revert Error.UserIsNotOwnerOfOffer();
```

**Checks**:
- `user` must match the stored `offerer` address
- Only the offer creator can withdraw their offer
- Prevents unauthorized withdrawals

**Reverts With**:
- `UserIsNotOwnerOfOffer()` - Signer is not the offer creator

### 3. Optional Priority Fee Payment

If offeror provides a priority fee, processes the payment:

```solidity
if (priorityFeeEvvm > 0)
    requestPay(user, 0, priorityFeeEvvm, nonceEvvm, signatureEvvm);
```

**Payment Details**:
- Payer: Offeror (withdrawing user)
- Recipient: NameService contract
- Base amount: 0 (no additional payment, refund from escrow)
- Priority fee: Variable (set by offeror to incentivize execution)

This internally calls:
```solidity
core.pay(
    user,
    address(this),
    0 + priorityFeeEvvm,  // Only the fee
    nonceEvvm,
    true,
    signatureEvvm
);
```

**Reverts With**: Any Core.pay() errors (invalid signature, insufficient balance)

### 4. Refund to Offeror

Returns the locked offer amount to the offeror:

```solidity
makeCaPay(user, usernameOffers[username][offerID].amount);
```

**Token Flow**:
- From: NameService locked funds
- To: Original offeror
- Amount: Net offer amount (99.5% of original commitment)

This internally calls `core.caPay()` to distribute from NameService reserves.

### 5. Offer Cleanup

Marks the offer as cancelled by clearing the offerer:

```solidity
usernameOffers[username][offerID].offerer = address(0);
```

**State Changes**:
- Offer slot becomes available for reuse
- Offer data remains but offerer = address(0) marks it invalid
- Prevents double withdrawal or acceptance

### 6. Staker Reward Distribution

If executor is a registered staker, distributes rewards:

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(
        msg.sender,
        core.getRewardAmount() +
            ((usernameOffers[username][offerID].amount * 1) / 796) +
            priorityFeeEvvm
    );
}
```

**Reward Calculation**:
```
Total Reward = Base Reward + Marketplace Fee Share + Priority Fee
             = 1x + (offerAmount / 796) + priorityFeeEvvm
             = 1x + ~0.1256% of offer + priorityFeeEvvm
```

**Example** (100 token offer, 1 token priority fee):
```
Base: 1x getRewardAmount() (e.g., 0.01 tokens)
Marketplace: 100 / 796 ≈ 0.1256 tokens (~0.1256%)
Priority: 1.0 tokens
Total: ~1.1356 tokens
```

### 7. Token Unlock Accounting

Updates the locked token accounting to reflect released funds:

```solidity
principalTokenTokenLockedForWithdrawOffers -=
    (usernameOffers[username][offerID].amount) +
    (((usernameOffers[username][offerID].amount * 1) / 199) / 4);
```

**Components Released**:
- Net offer amount: Refunded to offeror
- Marketplace fee portion: Used for staker reward
- Total unlocked from escrow

## Complete Usage Example

```solidity
// Setup (offeror withdrawing their offer)
address offeror = 0x123...;  // Original offer creator
string memory username = "alice";
uint256 offerID = 0;  // First offer on this username
address originExecutor = msg.sender;
uint256 nonce = core.getNonce(offeror, address(nameService));
uint256 priorityFee = 1000000000000000000; // 1 token

// Retrieve offer details (for reference)
OfferMetadata memory offer = nameService.usernameOffers(username, offerID);
// offer.offerer = 0x123...  (must match offeror)
// offer.expirationDate = 1800000000
// offer.amount = 99500000000000000000  (99.5 tokens net)

// Generate withdraw offer signature
bytes32 hashPayload = NameServiceHashUtils.hashDataForWithdrawOffer(
    username,
    offerID
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameService)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes memory signature = signMessage(offeror, message);

// Generate priority fee payment signature (if providing fee)
uint256 nonceEvvm = core.getNonce(offeror, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    offeror,
    address(nameService),
    priorityFee,  // Only the fee, base amount = 0
    nonceEvvm
);

// Execute offer withdrawal
nameService.withdrawOffer(
    offeror,
    username,
    offerID,
    originExecutor,
    nonce,
    signature,
    priorityFee,
    nonceEvvm,
    signatureEvvm
);

// Result:
// - Offeror receives: 99.5 tokens (refund from escrow)
// - Offer marked cancelled (offerer set to address(0))
// - Staker receives: ~1x + 0.1256 tokens + 1 token priority
// - Locked tokens decreased by ~99.6256 tokens
```

## Gas Cost Estimation

| Operation | Approximate Gas |
|-----------|----------------|
| Core signature verification | ~25,000 |
| Offerer verification | ~5,000 |
| Refund to offeror (caPay) | ~30,000 |
| Offer cleanup | ~5,000 |
| Staker reward distribution | ~30,000 |
| Token unlock accounting | ~5,000 |
| Optional priority fee payment | ~85,000 |
| **Total (no priority fee)** | **~100,000 gas** |
| **Total (with priority fee)** | **~185,000 gas** |

*Gas costs vary based on whether priority fee is included and current network conditions.*

## Error Handling

### Core.sol Errors
- `Core__NonceAlreadyUsed()` - Signature nonce already consumed
- `Core__InvalidSignature()` - Invalid signature format or signer
- `Core__InvalidExecutor()` - msg.sender not authorized as executor

### NameService Validation Errors
- `UserIsNotOwnerOfOffer()` - Signer is not the offer creator

### Payment Errors
- Core.pay() errors (for priority fee payment)
- Core.caPay() errors (for refund payment)

## Economic Model

### Token Flow Diagram

**100 Token Offer Withdrawal Example**:
```
Locked Escrow (from makeOffer):
┌─────────────────────────────────────┐
│ Net Offer: 99.5 tokens              │
│ Marketplace Fee: 0.5 tokens         │
└─────────────────────────────────────┘
              ↓
        withdrawOffer()
              ↓
┌─────────────────────────────────────┐
│ Offeror Refund:                     │
│   └─ 99.5 tokens → Offeror          │  ← Full net offer returned
├─────────────────────────────────────┤
│ Staker Reward:                      │
│   ├─ Base: 1x getRewardAmount()     │
│   ├─ Share: ~0.1256 tokens (~0.126%)│  ← Portion of marketplace fee
│   └─ Priority: 1.0 tokens           │  ← Optional offeror incentive
│   Total: ~1.1356 tokens             │
├─────────────────────────────────────┤
│ Offer Status:                       │
│   └─ Cancelled (offerer = address(0))│
└─────────────────────────────────────┘
```

### Marketplace Fee Distribution on Withdrawal

The 0.5% marketplace fee from `makeOffer` reduces on withdrawal:
- **~25%** (0.125% of offer) → Staker executing withdrawal
- **~75%** (0.375% of offer) → Lost/retained by protocol (not refunded)

This creates an incentive structure:
- Stakers profit from processing withdrawals (~0.125%)
- Offerors receive full net amount back (99.5%)
- Protocol retains small fee for marketplace usage

### Priority Fee Dynamics

Offerors can offer priority fees to:
- Accelerate withdrawal processing during congestion
- Ensure timely refund before price volatility
- Compete for staker attention in busy markets

Priority fees go 100% to the executing staker.

## State Changes

1. **Offeror balance** → Increased by offer amount (via caPay refund)
2. **Offeror balance** (if priority fee) → Decreased by `priorityFeeEvvm`
3. **usernameOffers[username][offerID].offerer** → Set to address(0) (offer cancelled)
4. **principalTokenTokenLockedForWithdrawOffers** → Decreased by unlocked amount
5. **Core nonce** → Offeror's nonce marked as consumed
6. **Staker balance** (if applicable) → Increased by reward + priority fee

## Related Functions

- [makeOffer](./03-makeOffer.md) - Create the marketplace offer being withdrawn
- [acceptOffer](./05-acceptOffer.md) - Alternative to withdrawal (complete sale)
- [GetterFunctions - Offer Info](../05-GetterFunctions.md) - Query offer details before withdrawing

## Implementation Notes

### No Expiration Enforcement

Unlike `acceptOffer`, withdrawals work regardless of expiration:
- Expired offers can be withdrawn by offeror at any time
- No timestamp validation on withdrawal
- Offers don't "lock" after expiration; creator retains control

This allows offerors to reclaim funds whenever needed, even if their offer wasn't accepted before expiration.

### Zero Priority Fee Handling

When `priorityFeeEvvm = 0`:
- `requestPay` check skips the call entirely
- No payment signature required (`signatureEvvm` can be empty)
- Only the withdraw offer signature is validated
- Reduces gas cost significantly (~85,000 gas saved)

### Reward Calculation Precision

The marketplace reward uses a single division:
```solidity
(offerAmount * 1) / 796
```

This evaluates to approximately:
- `offerAmount / 796 ≈ 0.1256% of offer`

For a 100 token offer:
- `100 / 796 ≈ 0.1256 tokens`

The constant `796` is calibrated to distribute roughly 25% of the 0.5% marketplace fee (0.125%) to the executing staker.

### Token Unlock Accounting

The unlock calculation matches the lock calculation from `makeOffer`:
```solidity
unlock = netOfferAmount + (((netOfferAmount * 1) / 199) / 4)
```

This ensures:
- Net offer amount released: Refunded to offeror
- Fee portion released: Used for staker reward
- Total matches original lock, preventing accounting drift

### Offer Slot Reuse

After withdrawal:
- Offer slot becomes available (offerer = address(0))
- Future `makeOffer` can reuse this offerID
- Efficient slot management prevents unbounded growth
- `offerMaxSlots` doesn't decrease (tracks historical high water mark)

---

## acceptOffer


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `acceptOffer(address user, string memory username, uint256 offerID, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Allows the current username owner to accept a marketplace offer, transferring ownership to the offeror and receiving the locked principal tokens. This completes the username sale transaction. Optional priority fee can be paid to incentivize faster execution by staker nodes.

## Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Current owner of the username (seller) |
| `username` | `string` | Username being sold |
| `offerID` | `uint256` | Identifier of the offer being accepted |
| `originExecutor` | `address` | The address authorized to submit this specific signed transaction |
| `nonce` | `uint256` | User's Core nonce for this signature (prevents replay attacks) |
| `signature` | `bytes` | EIP-191 signature from `user` (seller) authorizing the sale |
| `priorityFeeEvvm` | `uint256` | Optional priority fee for faster processing (paid to staker executor) |
| `nonceEvvm` | `uint256` | User's Core nonce for the payment signature |
| `signatureEvvm` | `bytes` | User's signature authorizing the priority fee payment (if > 0) |

## Signature Requirements

This function requires **one or two signatures** from the username owner:

### 1. NameService Accept Offer Signature (Required)

Authorizes the username sale and ownership transfer:

```
Message Format: {evvmId},{serviceAddress},{hashPayload},{originExecutor},{nonce},{isAsyncExec}
Hash Payload: NameServiceHashUtils.hashDataForAcceptOffer(username, offerID)
Async Execution: true (always)
```

**Example**:
```solidity
string memory username = "alice";
uint256 offerID = 0; // First offer

bytes32 hashPayload = NameServiceHashUtils.hashDataForAcceptOffer(
    username,
    offerID
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameServiceContract)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(bytes(message).length), message));
(uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, messageHash);
bytes memory signature = abi.encodePacked(r, s, v);
```

### 2. Payment Signature (Conditional - Only if priorityFeeEvvm > 0)

If providing a priority fee, authorizes payment to the executor:

```
Payment Amount: priorityFeeEvvm (only the fee, no base amount)
Recipient: address(nameServiceContract)
```

This uses the standard [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

**Note**: The `requestPay` call uses `amount = 0` because only the priority fee is being paid by the seller. The offer amount transfers from the locked escrow, not from the seller's active balance.

## Execution Flow

### 1. Signature Verification (Centralized)

Core.sol validates the signature and consumes the nonce:

```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForAcceptOffer(username, offerID),
    originExecutor,
    nonce,
    true,  // Always async execution
    signature
);
```

**Validation Steps**:
- Verifies nonce hasn't been used (prevents replay)
- Validates EIP-191 signature matches user + payload
- Confirms `tx.origin == originExecutor` (EOA verification)
- Marks nonce as consumed (prevents double-use)

**Reverts With**:
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidSignature()` - Signature validation failed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Ownership Verification

Validates that the signer is the current username owner:

```solidity
if (identityDetails[username].owner != user)
    revert Error.UserIsNotOwnerOfIdentity();
```

**Checks**:
- `user` must be the registered owner of `username`
- Only the owner can accept offers for their username

**Reverts With**:
- `UserIsNotOwnerOfIdentity()` - Signer doesn't own the username

### 3. Offer Validation

Validates the offer exists and is still active:

```solidity
if (
    usernameOffers[username][offerID].offerer == address(0) ||
    usernameOffers[username][offerID].expirationDate < block.timestamp
) revert Error.OfferInactive();
```

**Validation Rules**:
- Offer must exist (offerer != address(0))
- Offer must not have expired (expirationDate >= current time)

**Reverts With**:
- `OfferInactive()` - Offer doesn't exist or has expired

### 4. Optional Priority Fee Payment

If seller provides a priority fee, processes the payment:

```solidity
if (priorityFeeEvvm > 0) {
    requestPay(user, 0, priorityFeeEvvm, nonceEvvm, signatureEvvm);
}
```

**Payment Details**:
- Payer: Current owner (seller)
- Recipient: NameService contract
- Base amount: 0 (no additional payment, offer already locked)
- Priority fee: Variable (set by seller to incentivize execution)

This internally calls:
```solidity
core.pay(
    user,
    address(this),
    0 + priorityFeeEvvm,  // Only the fee
    nonceEvvm,
    true,
    signatureEvvm
);
```

**Reverts With**: Any Core.pay() errors (invalid signature, insufficient balance)

### 5. Payment to Seller

Transfers the locked offer amount to the current owner (seller):

```solidity
makeCaPay(user, usernameOffers[username][offerID].amount);
```

**Token Flow**:
- From: NameService locked funds
- To: Current owner (seller)
- Amount: Net offer amount (99.5% of original offer)

This internally calls `core.caPay()` to distribute from NameService reserves.

### 6. Ownership Transfer

Transfers username to the offeror (buyer):

```solidity
identityDetails[username].owner = usernameOffers[username][offerID].offerer;
```

**State Changes**:
- Previous owner: Receives payment, loses username
- New owner: Gains username, locked offer amount transferred
- All metadata remains intact (only ownership changes)

### 7. Offer Cleanup

Marks the offer as completed by clearing the offerer:

```solidity
usernameOffers[username][offerID].offerer = address(0);
```

This makes the offer slot available for reuse.

### 8. Staker Reward Distribution

If executor is a registered staker, distributes rewards:

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(
        msg.sender,
        (core.getRewardAmount()) +
            (((usernameOffers[username][offerID].amount * 1) / 199) / 4) +
            priorityFeeEvvm
    );
}
```

**Reward Calculation**:
```
Total Reward = Base Reward + Marketplace Fee Share + Priority Fee
             = 1x + (offerAmount / 199 / 4) + priorityFeeEvvm
             = 1x + ~0.1256% of offer + priorityFeeEvvm
```

**Example** (100 token offer, 2 token priority fee):
```
Base: 1x getRewardAmount() (e.g., 0.01 tokens)
Marketplace: 100 / 199 / 4 ≈ 0.1256 tokens (~0.1256%)
Priority: 2.0 tokens
Total: ~2.1356 tokens
```

### 9. Token Unlock Accounting

Updates the locked token accounting to reflect released funds:

```solidity
principalTokenTokenLockedForWithdrawOffers -=
    (usernameOffers[username][offerID].amount) +
    (((usernameOffers[username][offerID].amount * 1) / 199) / 4);
```

**Components Released**:
- Net offer amount: Paid to seller
- Marketplace reward portion: Paid to staker
- Total unlocked from escrow

## Complete Usage Example

```solidity
// Setup (owner accepting an offer)
address owner = 0x123...;  // Current username owner (seller)
string memory username = "alice";
uint256 offerID = 0;  // First offer on this username
address originExecutor = msg.sender;
uint256 nonce = core.getNonce(owner, address(nameService));
uint256 priorityFee = 2000000000000000000; // 2 tokens

// Retrieve offer details (for reference)
OfferMetadata memory offer = nameService.usernameOffers(username, offerID);
// offer.offerer = 0x456...  (buyer)
// offer.expirationDate = 1800000000
// offer.amount = 99500000000000000000  (99.5 tokens net)

// Generate accept offer signature
bytes32 hashPayload = NameServiceHashUtils.hashDataForAcceptOffer(
    username,
    offerID
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameService)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes memory signature = signMessage(owner, message);

// Generate priority fee payment signature (if providing fee)
uint256 nonceEvvm = core.getNonce(owner, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    owner,
    address(nameService),
    priorityFee,  // Only the fee, base amount = 0
    nonceEvvm
);

// Execute offer acceptance
nameService.acceptOffer(
    owner,
    username,
    offerID,
    originExecutor,
    nonce,
    signature,
    priorityFee,
    nonceEvvm,
    signatureEvvm
);

// Result:
// - Owner receives: 99.5 tokens (from locked escrow)
// - Username transfers to: 0x456... (buyer/offeror)
// - Staker receives: ~1x + 0.125 tokens + 2 tokens priority
// - Offer marked complete (offerer set to address(0))
// - Locked tokens decreased by 99.625 tokens
```

## Gas Cost Estimation

| Operation | Approximate Gas |
|-----------|----------------|
| Core signature verification | ~25,000 |
| Ownership + offer validation | ~10,000 |
| Payment to seller (caPay) | ~30,000 |
| Ownership transfer | ~25,000 |
| Offer cleanup | ~5,000 |
| Staker reward distribution | ~30,000 |
| Token unlock accounting | ~5,000 |
| Optional priority fee payment | ~85,000 |
| **Total (no priority fee)** | **~130,000 gas** |
| **Total (with priority fee)** | **~215,000 gas** |

*Gas costs vary based on whether priority fee is included and current network conditions.*

## Error Handling

### Core.sol Errors
- `Core__NonceAlreadyUsed()` - Signature nonce already consumed
- `Core__InvalidSignature()` - Invalid signature format or signer
- `Core__InvalidExecutor()` - msg.sender not authorized as executor

### NameService Validation Errors
- `UserIsNotOwnerOfIdentity()` - Signer doesn't own the username
- `OfferInactive()` - Offer doesn't exist or has expired

### Payment Errors
- Core.pay() errors (for priority fee payment)
- Core.caPay() errors (for seller payment)

## Economic Model

### Token Flow Diagram

**100 Token Offer Acceptance Example**:
```
Locked Escrow (from makeOffer):
┌─────────────────────────────────────┐
│ Net Offer: 99.5 tokens              │
│ Marketplace Fee: 0.5 tokens         │
└─────────────────────────────────────┘
              ↓
        acceptOffer()
              ↓
┌─────────────────────────────────────┐
│ Seller Payment:                     │
│   └─ 99.5 tokens → Owner            │  ← Current owner receives sale amount
├─────────────────────────────────────┤
│ Staker Reward:                      │
│   ├─ Base: 1x getRewardAmount()     │
│   ├─ Share: ~0.125 tokens (~0.126%) │  ← Portion of marketplace fee
│   └─ Priority: 2.0 tokens           │  ← Optional seller incentive
│   Total: ~2.1356 tokens             │
├─────────────────────────────────────┤
│ Ownership Transfer:                 │
│   └─ Username → Offeror (buyer)     │
└─────────────────────────────────────┘
```

### Marketplace Fee Distribution

The 0.5% marketplace fee from `makeOffer` splits on acceptance:
- **~25%** (0.125% of offer) → Staker executing acceptOffer
- **~75%** (0.375% of offer) → Protocol retention

This incentivizes stakers to execute acceptances while maintaining protocol sustainability.

### Priority Fee Dynamics

Sellers can offer priority fees to:
- Accelerate offer acceptance during high demand
- Ensure timely execution before offer expiration
- Compete for staker attention in crowded markets

Priority fees go 100% to the executing staker, creating dynamic market incentives.

## State Changes

1. **Seller balance** → Increased by offer amount (via caPay)
2. **Seller balance** (if priority fee) → Decreased by `priorityFeeEvvm`
3. **Username ownership** → Transferred from seller to offeror
4. **usernameOffers[username][offerID].offerer** → Set to address(0) (offer complete)
5. **principalTokenTokenLockedForWithdrawOffers** → Decreased by unlocked amount
6. **Core nonce** → Seller's nonce marked as consumed
7. **Staker balance** (if applicable) → Increased by reward + priority fee

## Related Functions

- [makeOffer](./03-makeOffer.md) - Create the marketplace offer being accepted
- [withdrawOffer](./04-withdrawOffer.md) - Cancel offer (alternative to acceptance)
- [GetterFunctions - Username Info](../05-GetterFunctions.md) - Query offer details before accepting

## Implementation Notes

### Offer Expiration Enforcement

Expired offers are automatically rejected:
- `expirationDate < block.timestamp` triggers `OfferInactive()` revert
- No manual cleanup required; expiration is enforced on acceptance
- Expired offers can still be withdrawn by the offeror

### Zero Priority Fee Handling

When `priorityFeeEvvm = 0`:
- `requestPay` call is skipped entirely
- No payment signature required (`signatureEvvm` can be empty)
- Only the accept offer signature is validated
- Reduces gas cost significantly (~85,000 gas saved)

### Reward Precision

The marketplace reward calculation uses integer division:
```solidity
(((offerAmount * 1) / 199) / 4)
```

This evaluates to approximately:
- `offerAmount / 199 = ~0.5025% of offer`
- `divided by 4 = ~0.1256% of offer`

For a 100 token offer:
- `100 / 199 / 4 ≈ 0.1256 tokens`

The nested division prevents overflow while maintaining reasonable precision for typical offer amounts.

### Ownership Transfer Atomicity

The ownership transfer happens **after** all validations and payments:
1. Validate signature & ownership
2. Validate offer exists & active
3. Process payments (priority fee + seller payment)
4. **Then** transfer ownership

This ensures the seller receives payment before losing ownership, preventing edge cases where transfer succeeds but payment fails.

---

## renewUsername


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `renewUsername(address user, string memory username, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Extends a username registration by 366 days. The renewal cost is dynamically calculated based on marketplace activity and timing. Usernames can be renewed up to 100 years in advance. The renewal preserves ownership, metadata, and all settings - only the expiration date changes.

## Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Current owner of the username |
| `username` | `string` | Username to renew |
| `originExecutor` | `address` | The address authorized to submit this specific signed transaction |
| `nonce` | `uint256` | User's Core nonce for this signature (prevents replay attacks) |
| `signature` | `bytes` | EIP-191 signature from `user` authorizing the renewal |
| `priorityFeeEvvm` | `uint256` | Optional priority fee for faster processing (paid to staker executor) |
| `nonceEvvm` | `uint256` | User's Core nonce for the payment signature |
| `signatureEvvm` | `bytes` | User's signature authorizing the renewal payment |

## Signature Requirements

This function requires **two signatures** from the username owner:

### 1. NameService Renewal Signature

Authorizes the username renewal:

```
Message Format: {evvmId},{serviceAddress},{hashPayload},{originExecutor},{nonce},{isAsyncExec}
Hash Payload: NameServiceHashUtils.hashDataForRenewUsername(username)
Async Execution: true (always)
```

**Example**:
```solidity
string memory username = "alice";

bytes32 hashPayload = NameServiceHashUtils.hashDataForRenewUsername(username);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameServiceContract)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(bytes(message).length), message));
(uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, messageHash);
bytes memory signature = abi.encodePacked(r, s, v);
```

### 2. Payment Signature (Core.sol)

Authorizes the renewal payment:

```
Payment Amount: seePriceToRenew(username) + priorityFeeEvvm
Recipient: address(nameServiceContract)
```

This uses the standard [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

**Note**: The renewal price is calculated dynamically. Users should query `seePriceToRenew(username)` before signing to know the exact amount.

## Execution Flow

### 1. Signature Verification (Centralized)

Core.sol validates the signature and consumes the nonce:

```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForRenewUsername(username),
    originExecutor,
    nonce,
    true,  // Always async execution
    signature
);
```

**Validation Steps**:
- Verifies nonce hasn't been used (prevents replay)
- Validates EIP-191 signature matches user + payload
- Confirms `tx.origin == originExecutor` (EOA verification)
- Marks nonce as consumed (prevents double-use)

**Reverts With**:
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidSignature()` - Signature validation failed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Ownership Verification

Validates the signer is the username owner:

```solidity
if (identityDetails[username].owner != user)
    revert Error.UserIsNotOwnerOfIdentity();
```

**Checks**:
- Only the current owner can renew
- Prevents unauthorized renewals

**Reverts With**:
- `UserIsNotOwnerOfIdentity()` - Signer doesn't own the username

### 3. Username Type Validation

Verifies the identity is a valid username:

```solidity
if (identityDetails[username].flagNotAUsername == 0x01)
    revert Error.IdentityIsNotAUsername();
```

**Checks**:
- Must be a completed registration (not pre-registration)
- Must be a username type identity

**Reverts With**:
- `IdentityIsNotAUsername()` - Identity is flagged as non-username

### 4. Renewal Time Limit Check

Prevents renewal beyond 100 years in advance:

```solidity
if (
    identityDetails[username].expirationDate >
    block.timestamp + 36500 days
) revert Error.RenewalTimeLimitExceeded();
```

**Business Logic**:
- Maximum forward registration: 100 years (36,500 days)
- Prevents excessive future locking
- Enables long-term ownership planning

**Reverts With**:
- `RenewalTimeLimitExceeded()` - Already renewed too far into future

### 5. Dynamic Price Calculation

Calculates the renewal cost based on marketplace activity:

```solidity
uint256 priceOfRenew = seePriceToRenew(username);
```

**Pricing Rules** (from `seePriceToRenew` function):
- **Within grace period** (expired < 30 days): Free (0 tokens)
- **Active offers exist**: Calculated based on highest active offer (variable)
- **No offers + renewing >1 year early**: 500,000 PT (fixed high cost)
- **Default**: Calculated based on registration cost model

This dynamic pricing:
- Incentivizes timely renewals (grace period)
- Reflects market demand (active offers)
- Discourages premature renewal (high cost for >1 year early)

### 6. Payment Processing

Transfers the renewal cost from user to NameService:

```solidity
requestPay(
    user,
    priceOfRenew,
    priorityFeeEvvm,
    nonceEvvm,
    signatureEvvm
);
```

This internally calls:
```solidity
core.pay(
    user,
    address(this),
    priceOfRenew + priorityFeeEvvm,
    nonceEvvm,
    true,
    signatureEvvm
);
```

**Token Flow**:
- User → NameService: `priceOfRenew + priorityFeeEvvm`
- Payment for 366-day extension

**Reverts With**: Any Core.pay() errors (insufficient balance, invalid signature)

### 7. Staker Reward Distribution

If executor is a registered staker, distributes substantial rewards:

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(
        msg.sender,
        core.getRewardAmount() +
            ((priceOfRenew * 50) / 100) +
            priorityFeeEvvm
    );
}
```

**Reward Calculation**:
```
Total Reward = Base Reward + 50% of Renewal Cost + Priority Fee
             = 1x + (priceOfRenew × 50%) + priorityFeeEvvm
```

**Example** (1000 token renewal, 10 token priority fee):
```
Base: 1x getRewardAmount() (e.g., 0.01 tokens)
Renewal Share: 1000 × 50% = 500 tokens (!)
Priority: 10 tokens
Total: 510.01 tokens
```

**Note**: The 50% reward share makes renewals highly incentivized for stakers. This encourages active marketplace participation and processing.

### 8. Expiration Extension

Extends the username registration by 366 days:

```solidity
identityDetails[username].expirationDate += 366 days;
```

**Duration Details**:
- Extension: 366 days (1 leap year)
- Preserves: Ownership, metadata, custom metadata, settings
- Changes: Only expiration date
- Stackable: Can renew multiple times up to 100-year limit

## Complete Usage Example

```solidity
// Setup
address owner = 0x123...;
string memory username = "alice";
address originExecutor = msg.sender;
uint256 nonce = core.getNonce(owner, address(nameService));
uint256 priorityFee = 10000000000000000000; // 10 tokens

// Query current expiration and renewal cost
uint256 currentExpiration = nameService.identityDetails(username).expirationDate;
uint256 renewalCost = nameService.seePriceToRenew(username);
// renewalCost = 1000000000000000000000 (1000 tokens)

// Generate renewal signature
bytes32 hashPayload = NameServiceHashUtils.hashDataForRenewUsername(username);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameService)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes memory signature = signMessage(owner, message);

// Generate payment signature
uint256 nonceEvvm = core.getNonce(owner, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    owner,
    address(nameService),
    renewalCost + priorityFee,
    nonceEvvm
);

// Execute renewal
nameService.renewUsername(
    owner,
    username,
    originExecutor,
    nonce,
    signature,
    priorityFee,
    nonceEvvm,
    signatureEvvm
);

// Result:
// - Owner pays: 1000 tokens (renewal) + 10 tokens (priority) = 1010 tokens
// - New expiration: currentExpiration + 366 days
// - Staker receives: ~1x + 500 tokens (50%) + 10 tokens = ~510 tokens
// - NameService retains: 500 tokens (50% of renewal cost)
```

## Gas Cost Estimation

| Operation | Approximate Gas |
|-----------|----------------|
| Core signature verification | ~25,000 |
| Ownership + type validation | ~10,000 |
| Time limit check | ~5,000 |
| Price calculation (seePriceToRenew) | ~15,000 |
| Payment processing (Core.pay) | ~85,000 |
| Expiration update | ~5,000 |
| Staker reward distribution | ~30,000 |
| **Total Estimate** | **~175,000 gas** |

*Gas costs vary based on complexity of price calculation and current network conditions.*

## Error Handling

### Core.sol Errors
- `Core__NonceAlreadyUsed()` - Signature nonce already consumed
- `Core__InvalidSignature()` - Invalid signature format or signer
- `Core__InvalidExecutor()` - msg.sender not authorized as executor

### NameService Validation Errors
- `UserIsNotOwnerOfIdentity()` - Signer doesn't own the username
- `IdentityIsNotAUsername()` - Identity is not a valid registered username
- `RenewalTimeLimitExceeded()` - Already renewed beyond 100-year limit

### Payment Errors
- Core.pay() errors (insufficient balance, invalid payment signature)

## Dynamic Pricing Model

### Pricing Scenarios

The `seePriceToRenew(username)` function returns different costs based on context:

#### 1. Grace Period Renewal (Free)
```
Condition: expired < 30 days ago
Cost: 0 tokens
Reasoning: Encourage owners to reclaim recently expired usernames
```

#### 2. Market-Based Pricing
```
Condition: Active offers exist for the username
Cost: Calculated from highest active offer
Reasoning: Reflect true market demand/value
```

#### 3. Premature Renewal Penalty
```
Condition: Current expiration > 1 year in future
Cost: 500,000 PT (fixed high cost)
Reasoning: Discourage excessive future locking
```

#### 4. Standard Renewal
```
Condition: Default case
Cost: Based on standard registration cost model
Reasoning: Consistent baseline pricing
```

### Example Price Scenarios

**Scenario A - Grace Period**:
```
Username: "alice"
Expired: 15 days ago
Price: 0 PT (free reclaim)
```

**Scenario B - High Demand Username**:
```
Username: "crypto"
Active Offers: 5 offers, highest = 10,000 PT
Price: ~Calculated based on 10,000 PT offer
```

**Scenario C - Premature Renewal**:
```
Username: "bob"
Current Expiration: 400 days from now
Price: 500,000 PT (penalty pricing)
```

**Scenario D - Standard Renewal**:
```
Username: "alice123"
Expiring: In 30 days, no offers
Price: ~Standard cost (e.g., 100-1000 PT)
```

## Economic Model

### Revenue Distribution

**1000 Token Renewal Example**:
```
┌──────────────────────────────────────┐
│ Owner Pays: 1000 tokens              │
├──────────────────────────────────────┤
│ Staker Reward: 500 tokens (50%)     │  ← Executing staker
│ Protocol Retention: 500 tokens (50%) │  ← NameService revenue
└──────────────────────────────────────┘

Plus Priority Fee:
└─ 100% → Staker (e.g., 10 tokens)
```

### Staker Incentive Design

The 50% reward share creates strong incentives:
- **High-value renewals**: Stakers earn substantial rewards (50% of large amounts)
- **Processing priority**: Competition to execute high-cost renewals
- **Market efficiency**: Ensures timely processing of valuable operations
- **Sustainable rewards**: Base reward (1x) + major share (50%) + priority fee

This is the **highest percentage reward** in the NameService contract, reflecting the importance of renewal processing.

## State Changes

1. **User balance** → Decreased by `priceOfRenew + priorityFeeEvvm`
2. **NameService balance** → Increased by `priceOfRenew + priorityFeeEvvm`
3. **identityDetails[username].expirationDate** → Increased by 366 days
4. **Core nonce** → User's nonce marked as consumed
5. **Staker balance** (if applicable) → Increased by substantial reward (50% of cost + priority)

## Related Functions

- [registrationUsername](./02-registrationUsername.md) - Initial username creation (366-day ownership)
- [seePriceToRenew](../05-GetterFunctions.md#seepricetorenew) - Query renewal cost before executing
- [flushUsername](../03-CustomMetadataFunctions/04-FlushUsername.md) - Alternative to renewal (delete username)

## Implementation Notes

### 366-Day Extension

Usernames renew for 366 days (not 365):
- Accounts for leap years
- Maintains consistent anniversary dates
- Prevents gradual time drift over multiple renewals

### 100-Year Forward Limit

The 36,500-day (100-year) limit prevents:
- Infinite future locking
- Economic distortion from extremely long holds
- Contract state bloat from far-future expirations

Users can still achieve indefinite ownership through periodic renewals.

### Grace Period Strategy

The grace period (expired < 30 days = free) creates beneficial dynamics:
- Original owners have time to reclaim (no immediate loss)
- Reduces accidental expiration consequences
- Incentivizes quick reclamation over marketplace purchases

### Renewal vs Re-Registration

Renewal advantages over letting expire and re-registering:
- **Preserves**: All custom metadata, settings, history
- **Cheaper**: Often lower cost than fresh registration
- **Faster**: No commit-reveal required (immediate)
- **Continuous**: No gap in ownership/availability

### Premature Renewal Economics

The 500,000 PT cost for renewing >1 year early serves important functions:
- **Prevents hoarding**: Discourages locking up names far in advance
- **Market liquidity**: Encourages owners to potentially sell vs hold empty
- **Fair access**: Allows market to determine true value vs preemptive locking

Most users should renew within 1 year of expiration to avoid penalty pricing.

---

## addCustomMetadata


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `addCustomMetadata(address user, string memory identity, string memory value, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Associates custom metadata with a registered username using a structured schema format. Supports arbitrary key-value information like social media handles, email addresses, membership affiliations, and more. Each metadata entry is stored in a separate slot with sequential indexing.

## Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Current owner of the username |
| `identity` | `string` | Username to add metadata to |
| `value` | `string` | Metadata string following recommended schema format (must not be empty) |
| `originExecutor` | `address` | EOA that will execute the transaction (verified with tx.origin) |
| `nonce` | `uint256` | User's Core nonce for this signature (prevents replay attacks) |
| `signature` | `bytes` | EIP-191 signature from `user` authorizing metadata addition |
| `priorityFeeEvvm` | `uint256` | Optional priority fee for faster processing (paid to staker executor) |
| `nonceEvvm` | `uint256` | User's Core nonce for the payment signature |
| `signatureEvvm` | `bytes` | User's signature authorizing the metadata fee payment |

## Signature Requirements

This function requires **two signatures** from the username owner:

### 1. NameService Metadata Signature

Authorizes adding the metadata entry:

```
Message Format: {evvmId},{serviceAddress},{hashPayload},{originExecutor},{nonce},{isAsyncExec}
Hash Payload: NameServiceHashUtils.hashDataForAddCustomMetadata(identity, value)
Async Execution: true (always)
```

**Example**:
```solidity
string memory identity = "alice";
string memory value = "socialMedia:x    >jistro";  // Padded subschema

bytes32 hashPayload = NameServiceHashUtils.hashDataForAddCustomMetadata(
    identity,
    value
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameServiceContract)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(bytes(message).length), message));
(uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, messageHash);
bytes memory signature = abi.encodePacked(r, s, v);
```

### 2. Payment Signature (Core.sol)

Authorizes payment of the metadata fee:

```
Payment Amount: getPriceToAddCustomMetadata() + priorityFeeEvvm
Recipient: address(nameServiceContract)
```

**Fee Calculation**:
```solidity
uint256 metadataFee = nameService.getPriceToAddCustomMetadata();
// metadataFee = 10 * core.getRewardAmount()
```

This uses the standard [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

## Recommended Metadata Format

While not enforced on-chain, following this structure enables standardized parsing:

```
Format: [schema]:[subschema]>[value]

Components:
- schema:     Main category (5 chars, pad if needed)
- subschema:  Subcategory (5 chars, pad if needed, optional)
- value:      Actual data (any length)

Separators:
- ':' - Separates schema and subschema
- '>' - Separates metadata type from value
```

### Standard Schema Examples

**Social Media Profiles**:
```
socialMedia:x    >jistro           // Twitter/X handle
socialMedia:github>evvm-org        // GitHub username
socialMedia:linkedin>john-doe      // LinkedIn profile
```

**Contact Information**:
```
email:dev  >dev@evvm.org           // Development email
email:personal>contact@alice.xyz   // Personal email
phone:work >+1-555-0100            // Work phone
```

**Membership & Affiliations**:
```
memberOf:>EVVM                     // Organization membership
memberOf:>DAOName                  // DAO membership
role :>Developer                   // Role/title
```

**Web Presence**:
```
url  :personal>https://alice.xyz   // Personal website
url  :portfolio>https://work.me    // Portfolio
```

**Note**: Schemas should follow [Schema.org](https://schema.org/docs/schemas.html) standards when possible for maximum interoperability.

## Execution Flow

### 1. Signature Verification (Centralized)

Core.sol validates the signature and consumes the nonce:

```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForAddCustomMetadata(identity, value),
    originExecutor,
    nonce,
    true,  // Always async execution
    signature
);
```

**Validation Steps**:
- Verifies nonce hasn't been used (prevents replay)
- Validates EIP-191 signature matches user + payload
- Confirms `tx.origin == originExecutor` (EOA verification)
- Marks nonce as consumed (prevents double-use)

**Reverts With**:
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidSignature()` - Signature validation failed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Ownership Verification

Validates the signer owns the username:

```solidity
if (identityDetails[identity].owner != user)
    revert Error.UserIsNotOwnerOfIdentity();
```

**Checks**:
- Only the owner can add metadata
- Prevents unauthorized modifications

**Reverts With**:
- `UserIsNotOwnerOfIdentity()` - Signer doesn't own the username

### 3. Value Validation

Ensures the metadata value is not empty:

```solidity
if (bytes(value).length == 0) revert Error.EmptyCustomMetadata();
```

**Business Logic**:
- Empty strings waste storage and gas
- All metadata must contain meaningful data

**Reverts With**:
- `EmptyCustomMetadata()` - Value string is empty

### 4. Payment Processing

Transfers the metadata fee from user to NameService:

```solidity
requestPay(
    user,
    getPriceToAddCustomMetadata(),  // 10x reward amount
    priorityFeeEvvm,
    nonceEvvm,
    signatureEvvm
);
```

**Fee Structure**:
```solidity
metadataFee = 10 * core.getRewardAmount()
```

This internally calls:
```solidity
core.pay(
    user,
    address(this),
    metadataFee + priorityFeeEvvm,
    nonceEvvm,
    true,
    signatureEvvm
);
```

**Token Flow**:
- User → NameService: `10x reward + priorityFeeEvvm`
- Payment for metadata storage

**Reverts With**: Any Core.pay() errors (insufficient balance, invalid signature)

### 5. Staker Reward Distribution

If executor is a registered staker, distributes substantial rewards:

```solidity
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(
        msg.sender,
        (5 * core.getRewardAmount()) +
            ((getPriceToAddCustomMetadata() * 50) / 100) +
            priorityFeeEvvm
    );
}
```

**Reward Calculation**:
```
Total Reward = Enhanced Base + 50% of Metadata Fee + Priority Fee
             = 5x base + (10x × 50%) + priorityFeeEvvm
             = 5x + 5x + priorityFeeEvvm
             = 10x base reward + priorityFeeEvvm
```

**Example** (base reward = 0.01 tokens, 1 token priority fee):
```
Enhanced Base: 5 × 0.01 = 0.05 tokens
Metadata Share: (10 × 0.01) × 50% = 0.05 tokens
Priority: 1.0 tokens
Total: 1.1 tokens
```

**Note**: This 100% reward return (10x earned on 10x cost) plus priority fee creates a neutral economic incentive for stakers while covering operational costs.

### 6. Metadata Storage

Stores the metadata in the next available slot:

```solidity
identityCustomMetadata[identity][
    identityDetails[identity].customMetadataMaxSlots
] = value;
```

**Storage Structure**:
- Mapping: `username → slot index → metadata value`
- Sequential indexing: 0, 1, 2, ...
- No gaps: All slots from 0 to maxSlots-1 are filled

### 7. Slot Counter Update

Increments the metadata slot counter:

```solidity
identityDetails[identity].customMetadataMaxSlots++;
```

**State Tracking**:
- Tracks total metadata entries
- Used for iteration and querying
- Monotonically increasing (never decreases, even on removal)

## Complete Usage Example

```solidity
// Setup
address owner = 0x123...;
string memory username = "alice";
string memory metadata = "socialMedia:x    >jistro";  // Twitter handle
address originExecutor = msg.sender;
uint256 nonce = core.getNonce(owner, address(nameService));
uint256 priorityFee = 1000000000000000000; // 1 token

// Query current metadata cost
uint256 metadataFee = nameService.getPriceToAddCustomMetadata();
// metadataFee = 10 × core.getRewardAmount() (e.g., 0.1 tokens)

// Generate metadata signature
bytes32 hashPayload = NameServiceHashUtils.hashDataForAddCustomMetadata(
    username,
    metadata
);

string memory message = string.concat(
    Strings.toString(block.chainid),
    ",",
    Strings.toHexString(address(nameService)),
    ",",
    Strings.toHexString(uint256(hashPayload)),
    ",",
    Strings.toHexString(originExecutor),
    ",",
    Strings.toString(nonce),
    ",true"
);

bytes memory signature = signMessage(owner, message);

// Generate payment signature
uint256 nonceEvvm = core.getNonce(owner, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    owner,
    address(nameService),
    metadataFee + priorityFee,
    nonceEvvm
);

// Execute metadata addition
nameService.addCustomMetadata(
    owner,
    username,
    metadata,
    originExecutor,
    nonce,
    signature,
    priorityFee,
    nonceEvvm,
    signatureEvvm
);

// Result:
// - Owner pays: 0.1 tokens (metadata fee) + 1 token (priority) = 1.1 tokens
// - Metadata stored: identityCustomMetadata["alice"][0] = "socialMedia:x    >jistro"
// - Slot counter: customMetadataMaxSlots = 1
// - Staker receives: 0.1 tokens (100% of fee) + 1 token (priority) = 1.1 tokens
```

## Gas Cost Estimation

| Operation | Approximate Gas |
|-----------|----------------|
| Core signature verification | ~25,000 |
| Ownership + value validation | ~8,000 |
| Payment processing (Core.pay) | ~85,000 |
| Metadata storage (new slot) | ~45,000 |
| Slot counter update | ~5,000 |
| Staker reward distribution | ~30,000 |
| **Total Estimate** | **~198,000 gas** |

*Gas costs vary based on metadata value length and current network conditions.*

## Error Handling

### Core.sol Errors
- `Core__NonceAlreadyUsed()` - Signature nonce already consumed
- `Core__InvalidSignature()` - Invalid signature format or signer
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### NameService Validation Errors
- `UserIsNotOwnerOfIdentity()` - Signer doesn't own the username
- `EmptyCustomMetadata()` - Value string is empty

### Payment Errors
- Core.pay() errors (insufficient balance, invalid payment signature)

## Economic Model

### Fee Distribution

**0.1 Token Metadata Fee Example** (10x base reward):
```
┌──────────────────────────────────────┐
│ Owner Pays: 0.1 tokens               │
├──────────────────────────────────────┤
│ Staker Reward Breakdown:             │
│   ├─ Enhanced Base: 0.05 (5x)       │  ← 5x base reward
│   ├─ Fee Share: 0.05 (50%)          │  ← 50% of 10x fee
│   └─ Priority: 1.0 tokens           │  ← User incentive
│   Total: 1.1 tokens                 │
├──────────────────────────────────────┤
│ Protocol Retention: 0.05 tokens (50%)│  ← NameService revenue
└──────────────────────────────────────┘
```

### Staker Incentive Design

The reward structure creates neutral economics:
- **Fee paid by user**: 10x base reward
- **Staker receives**: 5x base (enhanced) + 5x (50% share) = 10x total
- **Net to staker**: Breaks even on reward distribution
- **Priority fee**: 100% profit for staker
- **Protocol share**: 50% of fee (5x base)

This ensures:
- Metadata operations are cost-neutral for stakers (excluding priority fees)
- Priority fees create profit incentive
- Protocol sustains metadata infrastructure with 50% retention

## State Changes

1. **User balance** → Decreased by `metadataFee + priorityFeeEvvm`
2. **NameService balance** → Increased by `metadataFee + priorityFeeEvvm`
3. **identityCustomMetadata[identity][slot]** → New metadata value stored
4. **identityDetails[identity].customMetadataMaxSlots** → Incremented by 1
5. **Core nonce** → User's nonce marked as consumed
6. **Staker balance** (if applicable) → Increased by substantial reward

## Related Functions

- [removeCustomMetadata](./02-RemoveCustomMetadata.md) - Delete specific metadata entry
- [flushCustomMetadata](./03-FlushCustomMetadata.md) - Delete all metadata entries
- [GetterFunctions - Metadata Query](../05-GetterFunctions.md) - Retrieve stored metadata

## Implementation Notes

### Sequential Slot Allocation

Metadata slots are allocated sequentially:
- First entry: slot 0
- Second entry: slot 1
- Nth entry: slot N-1

The `customMetadataMaxSlots` value equals the number of active entries (assuming no removals). However, **removal doesn't decrement this counter** - it remains as a high-water mark.

### Schema Padding Guidelines

For optimal parsing, pad short schema/subschema to 5 characters:
```
"x" → "x    "  (4 spaces)
"dev" → "dev  "  (2 spaces)
"email" → "email"  (already 5 chars)
```

This enables fixed-width parsing:
```javascript
const schema = metadata.substring(0, 5).trim();
const subschema = metadata.substring(6, 11).trim();
const value = metadata.substring(12);
```

### Unlimited Metadata

There is no hardcoded limit on the number of metadata entries:
- Users can add as many entries as desired
- Each addition costs 10x base reward
- Gas costs scale linearly with total entries
- Storage is persistent across renewals

### Metadata Persistence

Custom metadata persists through:
- Username renewals
- Ownership transfers (via acceptOffer)
- Username expiration (can be reclaimed with metadata intact)

Metadata is only removed via:
- Explicit `removeCustomMetadata` call
- Bulk `flushCustomMetadata` call
- Complete `flushUsername` deletion

### Value Content Flexibility

While the schema format is recommended, the contract accepts any string:
- No on-chain validation of format compliance
- Off-chain applications should validate schema adherence
- Malformed metadata is the owner's responsibility
- Consider validating before signing to avoid wasted fees

---

## removeCustomMetadata


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `removeCustomMetadata(address user, string memory identity, uint256 key, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Removes a specific custom metadata entry identified by its slot index. If the removed entry is not the last slot, all subsequent entries are shifted down to maintain array continuity (no gaps). This ensures efficient iteration and consistent slot indexing.

## Parameters

| Parameter Name          | Type      | Description                                                                                                                                                        |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `user`                 | `address` | The address of the **current owner** of the `identity` who is removing the metadata.                                                                              |
| `identity`             | `string`  | The registered identity (e.g., username) from which the custom metadata will be removed.                                                                           |
| `key`                  | `uint256` | The index (zero-based) of the specific custom metadata entry to be removed from the identity's list.                                                               |
| `nonce`                | `uint256` | The **owner's (`user`)** nonce specific to the Name Service contract (`nameServiceNonce`) for this `removeCustomMetadata` action's replay protection.                  |
| `signature`            | `bytes`   | The EIP-191 signature **from the owner (`user`)** authorizing _this remove metadata action_.                              |
| `priorityFee_EVVM` | `uint256` | Optional fee (in principal tokens) paid **by the owner (`user`)** to the `msg.sender` (executor) via the EVVM contract for prioritized processing of this transaction. |
| `nonce_EVVM`           | `uint256` | **Required**. The **owner's (`user`)** nonce for the EVVM payment call used to pay the Metadata Removal Fee + Priority Fee.                               |
| `priorityFlag_EVVM`        | `bool`    | **Required**. Priority flag (sync/async) for the EVVM payment call paying the fees.                                                                        |
| `signature_EVVM`       | `bytes`   | **Required**. The **owner's (`user`)** signature authorizing the EVVM payment call paying the Metadata Removal Fee + Priority Fee.                        |

> **Note: Signature Links & EVVM Payment**

- The EVVM payment signature (`signature_EVVM`) covers the **total** amount (calculated Metadata Fee + `priorityFee_EVVM`) and is paid **by the identity owner (`user`)**. It uses the [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md). Since a metadata fee is always required, these EVVM parameters are **mandatory**.
- The Name Service remove custom metadata signature (`signature`) must be generated by the **current owner (`user`)** and follows the [Remove Custom Metadata Signature Structure](../../../05-SignatureStructures/02-NameService/08-removeCustomMetadataStructure.md).
- The metadata fee is calculated dynamically as **10 times the current EVVM reward amount** via `getPriceToRemoveCustomMetadata()`.


## Metadata Pricing

The cost to remove custom metadata is calculated dynamically based on the current EVVM reward amount:

**Metadata Removal Fee** = `10 * getRewardAmount()`

This ensures the pricing scales with the network's current reward structure and maintains consistency with other protocol fees.

### Workflow

Failure at validation steps typically reverts the transaction. The steps execute **in the specified order**.

1.  **Identity Ownership Verification**: Checks if the provided `user` address is the registered owner of the `identity`. Reverts if `user` is not the owner.
2.  **Name Service Nonce Verification**: Calls internal `verifyAsyncNonce(user, nonce)` which reverts with `AsyncNonceAlreadyUsed()` if the nonce was already used.
3.  **Remove Custom Metadata Signature Validation**: Verifies the `signature` provided by `user` (the owner) against the reconstructed message hash using `verifyMessageSignedForRemoveCustomMetadata`. Reverts if the signature is invalid according to the [Remove Custom Metadata Signature Structure](../../../05-SignatureStructures/02-NameService/08-removeCustomMetadataStructure.md).
4.  **Custom Metadata Index Validation**: Checks that the provided `key` (index) is valid, meaning it is less than the current number of metadata entries for the `identity` (`key < identityDetails[identity].customMetadataMaxSlots`). Reverts if the index is out of bounds.
5.  **Payment execution**: Calls `makePay` to transfer the payment using the `getPriceToRemoveCustomMetadata()` function and `priorityFee_EVVM` of principal tokens from `user` to the service via the EVVM contract. Reverts if the payment fails.
6.  **Custom Metadata Removal**: Removes the metadata entry at the specified `key` index for the `identity`. The removal process involves two scenarios:
    - **If `key == customMetadataMaxSlots` (Last element):** Directly deletes the metadata entry at `identityCustomMetadata[identity][key]`.
    - **If `key < customMetadataMaxSlots` (Not the last element):** 
      - Iterates from `i = key` up to `customMetadataMaxSlots - 1`.
      - In each iteration, copies the metadata entry from index `i + 1` to index `i` (`identityCustomMetadata[identity][i] = identityCustomMetadata[identity][i + 1]`).
      - Deletes the entry at the last occupied index (`identityCustomMetadata[identity][customMetadataMaxSlots]`) to clear the duplicated data.
7.  **Decrement Count**: Decreases the metadata count: `identityDetails[identity].customMetadataMaxSlots--` to reflect the removal.
8.  **Nonce Management**: Calls internal `markAsyncNonceAsUsed(user, nonce)` to mark the provided `nonce` as used and prevent replays.
9.  **Reward Distribution (to Executor)**: If the executor (`msg.sender`) is an sMATE staker, calls an internal helper function (`makeCaPay`) to distribute rewards in principal tokens directly to `msg.sender`. The rewards consist of:
    - 5 times the base reward amount (`5 * Evvm(evvmAddress.current).getRewardAmount()`).
    - The full `priorityFee_EVVM`, if it was greater than zero and successfully paid in Step 5.

---

## flushCustomMetadata


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `flushCustomMetadata(address user, string memory identity, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Removes all custom metadata entries for a username in one transaction. More gas-efficient than calling `removeCustomMetadata` multiple times. The cost is calculated per entry, making it proportional to the amount of metadata being deleted.

## Parameters

| Parameter Name          | Type      | Description                                                                                                                                                                                  |
| ----------------------- |-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `user`                 | `address` | The address of the **current owner** of the `identity` who is authorizing the flush.                                                                                                        |
| `identity`             | `string`  | The registered identity (e.g., username) from which all custom metadata entries will be flushed.                                                                                             |
| `nonce`                | `uint256` | The **owner's (`user`)** nonce specific to the NameService contract (`nameServiceNonce`) for this `flushCustomMetadata` action's replay protection.                                             |
| `signature`            | `bytes`   | The EIP-191 signature **from the owner (`user`)** authorizing *this flush all metadata action*.                                              |
| `priorityFee_EVVM` | `uint256` | Optional fee (in principal tokens) paid **by the owner (`user`)** to the `msg.sender` (executor) via the EVVM contract for prioritized processing of this transaction.                           |
| `nonce_EVVM`           | `uint256` | **Required**. The **owner's (`user`)** nonce for the EVVM payment call used to pay the total calculated Flush Fee + Priority Fee.                                               |
| `priorityFlag_EVVM`        | `bool`    | **Required**. Priority flag (sync/async) for the EVVM payment call paying the fees.                                                                                                 |
| `signature_EVVM`       | `bytes`   | **Required**. The **owner's (`user`)** signature authorizing the EVVM payment call.                        |

> **Note: Signature Links & EVVM Payment**

- The EVVM payment signature (`signature_EVVM`) covers the **total** amount (calculated Flush Fee + `priorityFee_EVVM`) and is paid **by the identity owner (`user`)**. It uses the [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md). Since a flush fee is always required, these EVVM parameters are **mandatory**.
- The NameService flush custom metadata signature (`signature`) must be generated by the **current owner (`user`)** and follows the [Flush Custom Metadata Signature Structure](../../../05-SignatureStructures/02-NameService/09-flushCustomMetadataStructure.md).
- The flush fee is calculated dynamically based on **10 times the current EVVM reward amount for each metadata entry** (`getPriceToFlushCustomMetadata(identity)`).


## Metadata Pricing

The cost to flush all custom metadata is calculated dynamically based on the current EVVM reward amount and the number of metadata entries:

**Flush Fee** = `(10 * getRewardAmount()) * customMetadataMaxSlots`

This ensures the pricing scales with both the network's current reward structure and the amount of work required to flush all entries.

### Workflow

Failure at validation steps typically reverts the transaction. The steps execute **in the specified order**.

1.  **Identity Ownership Verification**: Checks if the provided `user` address is the registered owner of the `identity`. Reverts if `user` is not the owner.
2.  **NameService Nonce Verification**: Calls internal `verifyAsyncNonce(user, nonce)` which reverts with `AsyncNonceAlreadyUsed()` if the nonce was already used.
3.  **Flush Custom Metadata Signature Validation**: Verifies the `signature` provided by `user` (the owner) against the reconstructed message hash using `verifyMessageSignedForFlushCustomMetadata`. Reverts if the signature is invalid according to the [Flush Custom Metadata Signature Structure](../../../05-SignatureStructures/02-NameService/09-flushCustomMetadataStructure.md).
4.  **Empty Metadata Validation**: Checks that the identity has at least one metadata entry (`identityDetails[identity].customMetadataMaxSlots > 0`). Reverts if there are no metadata entries to flush.
5.  **Payment Execution**: Calls `makePay` to transfer the payment using `getPriceToFlushCustomMetadata(identity)` and `priorityFee_EVVM` of principal tokens from `user` to the service via the EVVM contract. Reverts if the payment fails.
6.  **Custom Metadata Removal (Flush)**: Iterates through all metadata entries and deletes them:
    - Loops from `i = 0` to `customMetadataMaxSlots - 1`
    - Deletes each entry: `delete identityCustomMetadata[identity][i]`
7.  **Reward Distribution (to Executor)**: If the executor (`msg.sender`) is an sMATE staker, calls an internal helper function (`makeCaPay`) to distribute rewards in principal tokens directly to `msg.sender`. The rewards consist of:
    - 5 times the base reward amount **multiplied by the number of metadata entries** (`(5 * getRewardAmount()) * customMetadataMaxSlots`).
    - The full `priorityFee_EVVM`, if it was greater than zero and successfully paid in Step 5.
8.  **Reset Metadata Counter**: Sets `identityDetails[identity].customMetadataMaxSlots = 0` to reflect that all metadata has been removed.
9.  **Nonce Management**: Calls internal `markAsyncNonceAsUsed(user, nonce)` to mark the provided `nonce` as used and prevent replays.

---

## flushUsername


> **Note: Signature Verification**
This function uses **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. All NameService operations use the universal signature format with `NameServiceHashUtils` for hash generation.

**Function Type**: External  
**Function Signature**: `flushUsername(address user, string memory username, address originExecutor, uint256 nonce, bytes memory signature, uint256 priorityFeeEvm, uint256 nonceEvvm, bytes memory signatureEvvm) external`

Permanently deletes a username registration and all associated data. This is **irreversible** - the username becomes immediately available for others to register. All custom metadata is deleted, ownership is reset, and the username returns to initial state (except offerMaxSlots is preserved for historical tracking).

## Parameters

| Parameter Name          | Type      | Description                                                                                                                                                                          |
| ----------------------- |-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `user`                 | `address` | The address of the **current owner** of the `username` who is authorizing the permanent deletion.                                                                                   |
| `username`             | `string`  | The registered identity (e.g., username) to be permanently flushed from the system.                                                                                                  |
| `nonce`                | `uint256` | The **owner's (`user`)** nonce specific to the Name Service contract (`nameServiceNonce`) for this `flushUsername` action's replay protection.                                           |
| `signature`            | `bytes`   | The EIP-191 signature **from the owner (`user`)** authorizing *this flush username action*.                                        |
| `priorityFee_EVVM` | `uint256` | Optional fee (in principal tokens) paid **by the owner (`user`)** to the `msg.sender` (executor) via the EVVM contract for prioritized processing of this transaction.                   |
| `nonce_EVVM`           | `uint256` | **Required**. The **owner's (`user`)** nonce for the EVVM payment call used to pay the total calculated Flush Fee + Priority Fee.                                         |
| `priorityFlag_EVVM`        | `bool`    | **Required**. Priority flag (sync/async) for the EVVM payment call paying the fees.                                                                                         |
| `signature_EVVM`       | `bytes`   | **Required**. The **owner's (`user`)** signature authorizing the EVVM payment call to transfer the total calculated Flush Fee + Priority Fee.                           |

> **Note: Signature Links & EVVM Payment**

- The EVVM payment signature (`signature_EVVM`) covers the **total** amount (calculated Flush Fee + `priorityFee_EVVM`) and is paid **by the identity owner (`user`)**. It uses the [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md). Since a flush fee is required, these EVVM parameters are **mandatory**.
- The Name Service flush username signature (`signature`) must be generated by the **current owner (`user`)** and follows the [Flush Username Signature Structure](../../../05-SignatureStructures/02-NameService/10-flushUsernameStructure.md).
- The flush fee is calculated as the sum of metadata flush cost plus a base username deletion fee via `getPriceToFlushUsername(username)`.


## Username Flush Pricing

The cost to flush a username is calculated dynamically based on the current EVVM reward amount and includes both metadata removal and username deletion costs:

**Flush Fee** = `((10 * getRewardAmount()) * customMetadataMaxSlots) + getRewardAmount()`

This pricing includes:
- **Metadata removal cost**: 10x reward amount per metadata entry
- **Base username deletion fee**: 1x reward amount

### Workflow

Failure at validation steps typically reverts the transaction. The steps execute **in the specified order**.

1.  **Name Service Nonce Verification**: Calls internal `verifyAsyncNonce(user, nonce)` which reverts with `AsyncNonceAlreadyUsed()` if the nonce was already used.
2.  **Identity Ownership Verification**: Checks if the provided `user` address is the registered owner of the `username`. Reverts if `user` is not the owner.
3.  **Username Expiration and Type Validation**: Validates that the username has not expired and is a valid username type:
    - Checks that `block.timestamp < identityDetails[username].expireDate` (username is still active)
    - Checks that `identityDetails[username].flagNotAUsername == 0x00` (it's a username, not another type of identity)
    - Reverts with `FlushUsernameVerificationFailed` if either condition fails.
4.  **Flush Username Signature Validation**: Verifies the `signature` provided by `user` (the owner) against the reconstructed message hash using `verifyMessageSignedForFlushUsername`. Reverts if the signature is invalid according to the [Flush Username Signature Structure](../../../05-SignatureStructures/02-NameService/10-flushUsernameStructure.md).
5.  **Payment Execution**: Calls `makePay` to transfer the payment using `getPriceToFlushUsername(username)` and `priorityFee_EVVM` of principal tokens from `user` to the service via the EVVM contract. Reverts if the payment fails.
6.  **Custom Metadata Removal**: Iterates through all metadata entries and deletes them:
    - Loops from `i = 0` to `customMetadataMaxSlots - 1`
    - Deletes each entry: `delete identityCustomMetadata[username][i]`
7.  **Reward Distribution (to Executor)**: Calls an internal helper function (`makeCaPay`) to distribute rewards in principal tokens directly to `msg.sender` (the executor). The rewards consist of:
    - 5 times the base reward amount **multiplied by the number of metadata entries** (`(5 * getRewardAmount()) * customMetadataMaxSlots`).
    - The full `priorityFee_EVVM`, if it was greater than zero and successfully paid in Step 5.
8.  **Username Registration Reset**: Resets the username registration data while preserving offer slots:
    - Sets `owner` to `address(0)`
    - Sets `expireDate` to `0`
    - Sets `customMetadataMaxSlots` to `0`
    - Preserves existing `offerMaxSlots`
    - Sets `flagNotAUsername` to `0x00` (making it available for re-registration)
9.  **Nonce Management**: Calls internal `markAsyncNonceAsUsed(user, nonce)` to mark the provided `nonce` as used and prevent replays.

---

## Admin Functions


> **Note: Implementation Note**
Admin functions do NOT use the new centralized signature verification system. These are restricted `onlyAdmin` functions that execute directly. References to "EVVM" in function names remain for backward compatibility, but now refer to the **Core.sol** contract.

This section details the administrative functions available in the Name Service contract, which are restricted to the current admin address. These functions facilitate the secure transfer of the admin role, the withdrawal of collected protocol fees, and the updating of core contract dependencies like the Core contract address.

---

## Admin Role Transfer Process

The admin role is transferred using a secure, time-locked, two-step process to prevent immediate or malicious takeovers. This involves a proposal by the current admin and acceptance by the nominated successor after a mandatory waiting period.

### `proposeAdmin`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `proposeAdmin(address _adminToPropose)`

Initiates the admin role transfer process by nominating a new address as the proposed admin. This can only be called by the current admin. The function validates that the proposed admin is not the zero address and is different from the current admin.

#### Parameters

| Parameter        | Type    | Description                                 |
| ---------------- | ------- | ------------------------------------------- |
| `_adminToPropose` | `address` | The address of the nominated new admin.     |

### `cancelProposeAdmin`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `cancelProposeAdmin()`

Allows the **current admin** to cancel a pending admin change proposal before it has been accepted, immediately revoking the nomination.

### `acceptProposeAdmin`

**Function Type**: `public`
**Function Signature**: `acceptProposeAdmin()`

Allows the **proposed admin** to claim the admin role after the mandatory waiting period (1 day) has passed. This function can only be successfully called by the proposed admin address.

### Complete Workflow

1.  **Proposal Initiation**: The current admin calls `proposeAdmin(newAdminAddress)` to nominate a successor. The function validates that the new address is not zero and is different from the current admin. A proposal timestamp is recorded with a 1-day waiting period (`block.timestamp + 1 days`).
2.  **Proposal Cancellation (Optional)**: At any point before the role is accepted, the **current admin** can call `cancelProposeAdmin` to nullify the pending proposal by resetting the proposal address and time.
3.  **Role Acceptance**: The **proposed admin** must wait for the mandatory 1-day period to elapse after the proposal timestamp. After the waiting period is over, the proposed admin calls `acceptProposeAdmin`. The function verifies that the `msg.sender` is the proposed admin and that the waiting period has passed. Upon success, the admin role is transferred to the new address and the proposal data is reset.

---

## Fee Withdrawal Process

The withdrawal of collected protocol fees also follows a secure, time-locked, two-step proposal process to ensure transparency and prevent immediate fund drainage.

### `proposeWithdrawPrincipalTokens`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `proposeWithdrawPrincipalTokens(uint256 _amount)`

Initiates the withdrawal process by proposing an amount of principal tokens to be withdrawn from the contract's collected fees. The function validates that sufficient funds are available after reserving amounts for operations and locked offers.

> **Note: Withdrawable Amount Calculation**
The `_amount` can **only** be from the fees collected by the contract. The calculation ensures sufficient funds remain by subtracting:
- **5083**: Reserved amount for operations
- **Current reward amount**: Buffer for reward payments
- **Locked offer funds**: `principalTokenTokenLockedForWithdrawOffers` reserved for active offers

Formula: `Available = Total Balance - (5083 + Reward Amount + Locked Offers)`

#### Parameters

| Parameter | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| `_amount` | `uint256` | The amount of principal tokens to be withdrawn. |

### `cancelWithdrawPrincipalTokens`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `cancelWithdrawPrincipalTokens()`

Allows the current admin to cancel a pending fee withdrawal proposal before it has been claimed.

### `claimWithdrawPrincipalTokens`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `claimWithdrawPrincipalTokens()`

Allows the admin to execute the proposed withdrawal of principal tokens after the mandatory waiting period (1 day) has passed.

### Complete Workflow

1.  **Proposal Initiation**: The current admin calls `proposeWithdrawPrincipalTokens(_amount)`. The function validates that the proposed `_amount` is available after subtracting reserved funds (5083 + reward amount + locked offers) and is greater than zero. A proposal timestamp is recorded with a 1-day waiting period (`block.timestamp + 1 days`).
2.  **Proposal Cancellation (Optional)**: At any point before the withdrawal is claimed, the **current admin** can call `cancelWithdrawPrincipalTokens` to nullify the proposal by resetting the amount and time.
3.  **Withdrawal Confirmation**: The admin must wait for the mandatory 1-day period to elapse after the proposal timestamp. After the waiting period is over, the admin calls `claimWithdrawPrincipalTokens`. The function verifies that the waiting period has passed. Upon success, it transfers the proposed amount of principal tokens to the admin's address using `makeCaPay`, then resets the proposal data.

---

## Change EVVM Contract Address Process

This two-step, time-locked process allows the admin to safely update the address of the core EVVM contract dependency, ensuring the NameService contract can adapt to future infrastructure changes.

### `proposeChangeEVVMContractAddress`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `proposeChangeEvvmAddress(address _newEvvmAddress)`

Initiates the process to change the EVVM contract address by proposing a new address. The function validates that the new address is not the zero address.

#### Parameters
| Parameter                 | Type    | Description                                   |
| ------------------------- | ------- | --------------------------------------------- |
| `_newEvvmAddress` | `address` | The address of the new EVVM contract to be set. |

### `cancelChangeEvvmAddress`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `cancelChangeEvvmAddress()`

Allows the current admin to cancel a pending EVVM contract address change proposal before it has been finalized.

### `acceptChangeEvvmAddress`

**Function Type**: `public` (`onlyAdmin`)
**Function Signature**: `acceptChangeEvvmAddress()`

Allows the **current admin** to finalize the change and set the new EVVM contract address after the mandatory waiting period (1 day) has passed.

### Complete Workflow

1.  **Proposal Initiation**: The current admin calls `proposeChangeEvvmAddress(newEVVMAddress)` to nominate a new EVVM contract address. The function validates that the address is not zero. A proposal timestamp is recorded with a 1-day waiting period (`block.timestamp + 1 days`).
2.  **Proposal Cancellation (Optional)**: At any point before the new address is accepted, the **current admin** can call `cancelChangeEvvmAddress` to nullify the pending proposal by resetting the address and time.
3.  **Address Acceptance**: The **current admin** must wait for the mandatory 1-day period to elapse after the proposal timestamp. After the waiting period is over, the admin calls `acceptChangeEvvmAddress`. The function verifies that the waiting period has passed. Upon success, the EVVM contract address is updated to the new address and the proposal data is reset.

---

---

## Getter Functions(02-NameService)


> **Note: Implementation Note**
Getter functions are **view functions** that do not modify state. They do NOT use Core.sol's signature verification system. References to "EVVM" in function names (e.g., `getEvvmAddress`) refer to the **Core.sol** contract address.

This section documents the view functions available in the Name Service contract that allow querying system state, user information, pricing details, and administrative data. These functions are read-only and do not modify the blockchain state.

---

## Identity Verification Functions

### `verifyIfIdentityExists`

**Function Type**: `public view`  
**Function Signature**: `verifyIfIdentityExists(string memory _identity) returns (bool)`

Checks if an identity exists in the system, handling both pre-registrations and actual username registrations.

#### Parameters

| Parameter   | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| `_identity` | `string` | The identity/username to check           |

#### Returns

| Type   | Description                                    |
| ------ | ---------------------------------------------- |
| `bool` | `true` if the identity exists and is valid     |

### `strictVerifyIfIdentityExist`

**Function Type**: `public view`  
**Function Signature**: `strictVerifyIfIdentityExist(string memory _username) returns (bool)`

Strictly verifies if an identity exists and reverts if not found. This is a more strict version that reverts instead of returning false.

#### Parameters

| Parameter   | Type     | Description                 |
| ----------- | -------- | --------------------------- |
| `_username` | `string` | The username to verify      |

#### Returns

| Type   | Description                                           |
| ------ | ----------------------------------------------------- |
| `bool` | `true` if username exists (reverts if not found)     |

### `isUsernameAvailable`

**Function Type**: `public view`  
**Function Signature**: `isUsernameAvailable(string memory _username) returns (bool)`

Checks if a username is available for registration. A username is available if it was never registered or has been expired for 60+ days.

#### Parameters

| Parameter   | Type     | Description                                |
| ----------- | -------- | ------------------------------------------ |
| `_username` | `string` | The username to check availability for     |

#### Returns

| Type   | Description                                      |
| ------ | ------------------------------------------------ |
| `bool` | `true` if username is available for registration |

---

## Identity Information Functions

### `getOwnerOfIdentity`

**Function Type**: `public view`  
**Function Signature**: `getOwnerOfIdentity(string memory _username) returns (address)`

Returns the owner address of a registered identity.

#### Parameters

| Parameter   | Type     | Description             |
| ----------- | -------- | ----------------------- |
| `_username` | `string` | The username to query   |

#### Returns

| Type      | Description                      |
| --------- | -------------------------------- |
| `address` | Address of the username owner    |

### `verifyStrictAndGetOwnerOfIdentity`

**Function Type**: `public view`  
**Function Signature**: `verifyStrictAndGetOwnerOfIdentity(string memory _username) returns (address)`

Combines strict verification with owner lookup in one call. Reverts if username doesn't exist.

#### Parameters

| Parameter   | Type     | Description                           |
| ----------- | -------- | ------------------------------------- |
| `_username` | `string` | The username to verify and get owner  |

#### Returns

| Type      | Description                                    |
| --------- | ---------------------------------------------- |
| `address` | Owner address (reverts if username not found) |

### `getIdentityBasicMetadata`

**Function Type**: `public view`  
**Function Signature**: `getIdentityBasicMetadata(string memory _username) returns (address, uint256)`

Returns essential metadata for quick identity verification including owner and expiration date.

#### Parameters

| Parameter   | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `_username` | `string` | The username to get basic info for |

#### Returns

| Type                       | Description                         |
| -------------------------- | ----------------------------------- |
| `(address, uint256)`       | Owner address and expiration timestamp |

### `getExpireDateOfIdentity`

**Function Type**: `public view`  
**Function Signature**: `getExpireDateOfIdentity(string memory _identity) returns (uint256)`

Returns the timestamp when the username registration expires.

#### Parameters

| Parameter   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `_identity` | `string` | The username to check expiration for |

#### Returns

| Type      | Description                                        |
| --------- | -------------------------------------------------- |
| `uint256` | Expiration timestamp in seconds since Unix epoch   |

---

## Custom Metadata Functions

### `getAmountOfCustomMetadata`

**Function Type**: `public view`  
**Function Signature**: `getAmountOfCustomMetadata(string memory _username) returns (uint256)`

Returns the count of metadata slots currently used by a username.

#### Parameters

| Parameter   | Type     | Description                      |
| ----------- | -------- | -------------------------------- |
| `_username` | `string` | The username to count metadata   |

#### Returns

| Type      | Description                           |
| --------- | ------------------------------------- |
| `uint256` | Number of custom metadata entries     |

### `getFullCustomMetadataOfIdentity`

**Function Type**: `public view`  
**Function Signature**: `getFullCustomMetadataOfIdentity(string memory _username) returns (string[] memory)`

Retrieves all custom metadata entries for a username as an array.

#### Parameters

| Parameter   | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `_username` | `string` | The username to get metadata    |

#### Returns

| Type              | Description                            |
| ----------------- | -------------------------------------- |
| `string[] memory` | Array of all custom metadata strings   |

### `getSingleCustomMetadataOfIdentity`

**Function Type**: `public view`  
**Function Signature**: `getSingleCustomMetadataOfIdentity(string memory _username, uint256 _key) returns (string memory)`

Retrieves a specific custom metadata entry by index.

#### Parameters

| Parameter   | Type     | Description                           |
| ----------- | -------- | ------------------------------------- |
| `_username` | `string` | The username to get metadata from     |
| `_key`      | `uint256`| The index of the metadata entry       |

#### Returns

| Type            | Description                                 |
| --------------- | ------------------------------------------- |
| `string memory` | The metadata string at the specified index |

### `getCustomMetadataMaxSlotsOfIdentity`

**Function Type**: `public view`  
**Function Signature**: `getCustomMetadataMaxSlotsOfIdentity(string memory _username) returns (uint256)`

Returns the total capacity for custom metadata entries.

#### Parameters

| Parameter   | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| `_username` | `string` | The username to check metadata capacity  |

#### Returns

| Type      | Description                          |
| --------- | ------------------------------------ |
| `uint256` | Maximum number of metadata slots     |

---

## Marketplace Functions

### `getOffersOfUsername`

**Function Type**: `public view`  
**Function Signature**: `getOffersOfUsername(string memory _username) returns (OfferMetadata[] memory)`

Returns all offers made for a specific username, including both active and expired offers.

#### Parameters

| Parameter   | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `_username` | `string` | The username to get offers for  |

#### Returns

| Type                      | Description                              |
| ------------------------- | ---------------------------------------- |
| `OfferMetadata[] memory`  | Array of all offer metadata structures  |

### `getSingleOfferOfUsername`

**Function Type**: `public view`  
**Function Signature**: `getSingleOfferOfUsername(string memory _username, uint256 _offerID) returns (OfferMetadata memory)`

Retrieves detailed information about a particular offer.

#### Parameters

| Parameter   | Type     | Description                      |
| ----------- | -------- | -------------------------------- |
| `_username` | `string` | The username to get offer from   |
| `_offerID`  | `uint256`| The ID/index of specific offer   |

#### Returns

| Type                    | Description                            |
| ----------------------- | -------------------------------------- |
| `OfferMetadata memory`  | The complete offer metadata structure  |

### `getLengthOfOffersUsername`

**Function Type**: `public view`  
**Function Signature**: `getLengthOfOffersUsername(string memory _username) returns (uint256)`

Counts the total number of offers made for a username.

#### Parameters

| Parameter   | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `_username` | `string` | The username to count offers    |

#### Returns

| Type      | Description                              |
| --------- | ---------------------------------------- |
| `uint256` | Total number of offers that have been made |

---

## Pricing Functions

### `getPriceOfRegistration`

**Function Type**: `public view`  
**Function Signature**: `getPriceOfRegistration(string memory username) returns (uint256)`

Returns the price to register a specific username. Price is fully dynamic based on existing offers and timing:

- **No Offers**: Price is 100x current EVVM reward amount (standard rate)
- **Has Offers**: Price is calculated using `seePriceToRenew` function logic (market-based pricing)
  - Uses the same complex pricing algorithm as username renewal
  - Factors in active offers, market demand, and timing
  - Results in higher prices for in-demand usernames

#### Parameters

| Parameter  | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `username` | `string` | The username to get registration price for |

#### Returns

| Type      | Description                                     |
| --------- | ----------------------------------------------- |
| `uint256` | Current registration price in Principal Tokens  |

### `seePriceToRenew`

**Function Type**: `public view`  
**Function Signature**: `seePriceToRenew(string memory _identity) returns (uint256)`

Calculates the cost to renew a username registration. Pricing varies based on timing and market demand:

- Free if renewed before expiration (within grace period)
- Variable cost based on highest active offer (minimum 500 Principal Token)
- Fixed 500,000 Principal Token if renewed more than 1 year before expiration

#### Parameters

| Parameter   | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `_identity` | `string` | The username to calculate renewal price for |

#### Returns

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `uint256` | Cost in Principal Tokens to renew the username  |

### `getPriceToAddCustomMetadata`

**Function Type**: `public view`  
**Function Signature**: `getPriceToAddCustomMetadata() returns (uint256)`

Returns the current price to add custom metadata to a username. Price is dynamic based on current EVVM reward amount (10x reward).

#### Returns

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `uint256` | Cost in Principal Tokens (10x current reward)   |

### `getPriceToRemoveCustomMetadata`

**Function Type**: `public view**  
**Function Signature**: `getPriceToRemoveCustomMetadata() returns (uint256)`

Returns the current price to remove a single custom metadata entry.

#### Returns

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `uint256` | Cost in Principal Tokens (10x current reward)   |

### `getPriceToFlushCustomMetadata`

**Function Type**: `public view`  
**Function Signature**: `getPriceToFlushCustomMetadata(string memory _identity) returns (uint256)`

Returns the cost to remove all custom metadata entries from a username. Cost scales with the number of metadata entries.

#### Parameters

| Parameter   | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `_identity` | `string` | The username to calculate cost for |

#### Returns

| Type      | Description                                               |
| --------- | --------------------------------------------------------- |
| `uint256` | Total cost (10x reward amount per metadata entry)        |

### `getPriceToFlushUsername`

**Function Type**: `public view`  
**Function Signature**: `getPriceToFlushUsername(string memory _identity) returns (uint256)`

Returns the cost to completely remove a username and all its data. Includes cost for metadata removal plus base deletion fee.

#### Parameters

| Parameter   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `_identity` | `string` | The username to calculate cost for   |

#### Returns

| Type      | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `uint256` | Total cost (metadata flush cost + 1x reward amount)            |

---

## Nonce Management Functions

### `checkIfNameServiceNonceIsAvailable`

**Function Type**: `public view**  
**Function Signature**: `checkIfNameServiceNonceIsAvailable(address _user, uint256 _nonce) returns (bool)`

Checks if a nonce has been used by a specific user to prevent replay attacks.

#### Parameters

| Parameter | Type      | Description                    |
| --------- | --------- | ------------------------------ |
| `_user`   | `address` | Address of the user to check   |
| `_nonce`  | `uint256` | Nonce value to verify          |

#### Returns

| Type   | Description                                      |
| ------ | ------------------------------------------------ |
| `bool` | `true` if nonce used, `false` if still available |

---

## Administrative Getter Functions

### `getAdmin`

**Function Type**: `public view`  
**Function Signature**: `getAdmin() returns (address)`

Returns the current admin address with administrative privileges.

#### Returns

| Type      | Description                    |
| --------- | ------------------------------ |
| `address` | The current admin address      |

### `getAdminFullDetails`

**Function Type**: `public view`  
**Function Signature**: `getAdminFullDetails() returns (address, address, uint256)`

Returns complete admin information including pending proposals.

#### Returns

| Type                              | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `(address, address, uint256)`     | Current admin, proposed admin, acceptance time |

### `getProposedWithdrawAmountFullDetails`

**Function Type**: `public view`  
**Function Signature**: `getProposedWithdrawAmountFullDetails() returns (uint256, uint256)`

Returns information about pending token withdrawal proposals.

#### Returns

| Type                    | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `(uint256, uint256)`    | Proposed withdrawal amount and acceptance deadline     |

### `getEvvmAddress`

**Function Type**: `public view`  
**Function Signature**: `getEvvmAddress() returns (address)`

Returns the address of the EVVM contract used for payment processing.

#### Returns

| Type      | Description                         |
| --------- | ----------------------------------- |
| `address` | The current EVVM contract address   |

### `getEvvmAddressFullDetails`

**Function Type**: `public view`  
**Function Signature**: `getEvvmAddressFullDetails() returns (address, address, uint256)`

Returns complete EVVM address information including pending proposals.

#### Returns

| Type                              | Description                                           |
| --------------------------------- | ----------------------------------------------------- |
| `(address, address, uint256)`     | Current EVVM address, proposed address, acceptance time |

---

## Utility Functions

### `hashUsername`

**Function Type**: `public pure`  
**Function Signature**: `hashUsername(string memory _username, uint256 _randomNumber) returns (bytes32)`

Creates a hash of username and random number for pre-registration using the commit-reveal scheme to prevent front-running attacks.

#### Parameters

| Parameter       | Type     | Description                      |
| --------------- | -------- | -------------------------------- |
| `_username`     | `string` | The username to hash             |
| `_randomNumber` | `uint256`| Random number to add entropy     |

#### Returns

| Type      | Description                               |
| --------- | ----------------------------------------- |
| `bytes32` | Hash of the username and random number    |

---

## Data Validation Functions

These functions validate input data formats according to system rules and standards.

### Username Validation

**Function**: `isValidUsername(string memory username)` (internal pure)

Validates username format according to system rules:
- Must be at least 4 characters
- Must start with a letter
- Can only contain letters and digits

### Email Validation

**Function**: `isValidEmail(string memory _email)` (internal pure) 

Validates email address format:
- Checks for proper structure: prefix(3+ chars) + @ + domain(3+ chars) + . + TLD(2+ chars)
- Ensures valid characters in each section
- Returns `true` for valid format

### Phone Number Validation

**Function**: `isValidPhoneNumberNumber(string memory _phoneNumber)` (internal pure)

Validates phone number format:
- Must be 6-19 digits only
- No special characters or letters allowed
- Returns `true` for valid format

> **Note: Internal Functions**
The validation functions are marked as `internal` and are used by other contract functions for input validation. They are not directly callable from external contracts or users.

---

## Staking Service Overview


> **Note: Signature Verification**
User operations (`presaleStaking`, `publicStaking`) use **Core.sol's centralized verification** via `validateAndConsumeNonce()`. All staking signatures follow the universal EVVM format with `StakingHashUtils` for hash generation.

The Staking service is a dual-contract system enabling users to stake MATE tokens and receive time-weighted rewards for participating as network fishers.

## Architecture

- **Staking Contract**: User operations, access tiers, and governance
- **Estimator Contract**: Epoch-based reward calculations with time-weighted algorithms

## Key Features

### Multi-Tier Access
- **Golden Staking**: Exclusive golden fisher access with EVVM nonce sync
- **Presale Staking**: 800 presale users, maximum 2 staking tokens each
- **Public Staking**: Open access when enabled
- **Service Staking**: Three-phase process (prepare → pay → confirm) plus direct unstaking

### Security & Economics
- **Centralized Verification**: Core.sol validates all user operations
- **EIP-191 Signatures**: Cryptographic authorization with originExecutor (EOA verification)
- **Nonce Management**: Core async nonces for universal replay protection
- **Time-Delayed Governance**: 24-hour administrative changes
- **Time-Locked Unstaking**: 5-day waiting period for full unstaking (configurable)
- **Fixed Price**: 1 staking token = 5,083 MATE tokens
- **Enhanced Rewards**: 2x rewards for stakers validating transactions

### Reward System
- **Epoch-Based**: Time-weighted calculations ensuring fair distribution
- **Proportional**: Rewards based on staking duration and amount
- **Mathematical Precision**: Sophisticated algorithms for accurate reward allocation

---

## goldenStaking


**Function Type**: `external`  
**Function Signature**: `goldenStaking(bool,uint256,bytes)`  
**Function Selector**: `0x475c31ff`

The `goldenStaking` function provides administrative control over staking operations. It is exclusively accessible to the `goldenFisher` address, allowing privileged execution of stake/unstake actions that bypass standard verification requirements. This function automatically uses the golden fisher's synchronized EVVM nonce for transactions.

## Parameters

| Parameter         | Type    | Description                               |
| ----------------- | ------- | ----------------------------------------- |
| `isStaking`       | bool    | `true` = Stake, `false` = Unstake         |
| `amountOfStaking` | uint256 | Amount of staking tokens to stake/unstake |
| `signature_EVVM`  | bytes   | EVVM authorization signature              |

The EVVM payment signature (`signature_EVVM`) follows the [Single Payment Signature Structure](../../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

## Workflow

### Staking Process

1. **Authorization Validation**: Verifies caller is the designated `goldenFisher` address
2. **Process Execution**: Calls internal `stakingBaseProcess` with:
   - Golden fisher address as both payer and staker
   - Automatic synchronous EVVM nonce retrieval
   - No priority fees (set to 0)
   - Standard staking processing flow


For detailed information about the `stakingBaseProcess` implementation, refer to the [stakingBaseProcess](../02-InternalStakingFunctions/01-stakingBaseProcess.md).


### Unstaking Process

1. **Authorization Validation**: Verifies caller is the designated `goldenFisher` address
2. **Process Execution**: Calls internal `stakingBaseProcess` with:
   - Golden fisher address as both payer and staker
   - Automatic synchronous EVVM nonce retrieval
   - No priority fees (set to 0)
   - Standard unstaking processing flow


For detailed information about the `stakingBaseProcess` implementation, refer to the [stakingBaseProcess](../02-InternalStakingFunctions/01-stakingBaseProcess.md).


---

## presaleStaking


> **Note: Signature Verification**
presaleStaking uses Core.sol's centralized verification via `validateAndConsumeNonce()` with `StakingHashUtils.hashDataForPresaleStake()`. Includes `originExecutor` parameter (EOA executor verified with tx.origin).

**Function Type**: `external`  
**Function Signature**: `presaleStaking(address user, bool isStaking, address originExecutor, uint256 nonce, bytes signature, uint256 priorityFee_EVVM, uint256 nonceEvvm, bytes signatureEvvm)` 

The `presaleStaking` function enables presale participants to stake or unstake their MATE tokens under specific restrictions. This function ensures exclusive access for qualifying presale users while enforcing operational limits.

## Restrictions

- Fixed amount of 1 staking token per operation
- Maximum allocation of 2 staking tokens per user
- Requires active `allowPresaleStaking` flag
- Not available when `allowPublicStaking` flag is active (presale users must use `publicStaking` instead)


Note: In this repository's contract implementation the constructor enables `allowPublicStaking.flag` by default and leaves `allowPresaleStaking.flag` disabled. Deployments and testnets may use different defaults; consult the deployed contract metadata for runtime flag values.


## Parameters

| Parameter           | Type    | Description                                          |
| ------------------- | ------- | ---------------------------------------------------- |
| `user`              | address | Presale participant's wallet address                 |
| `isStaking`         | bool    | `true` = Stake, `false` = Unstake                    |
| `originExecutor`    | address | EOA that will execute the transaction (verified with tx.origin) |
| `nonce`             | uint256 | Core nonce for this signature (prevents replay attacks) |
| `signature`         | bytes   | User authorization signature                         |

> **Note:** For presale staking the function enforces a fixed amount of `1` token; therefore the signed message must include `_amountOfStaking = 1`.| `priorityFee_EVVM`  | uint256 | EVVM priority fee                                    |
| `nonce_EVVM`        | uint256 | EVVM payment operation nonce                         |
| `priorityFlag_EVVM` | bool    | EVVM execution mode (`true` = async, `false` = sync) |
| `signature_EVVM`    | bytes   | EVVM payment authorization                           |


- If you want to know more about the signature structure, refer to the [Standard Staking/Unstaking Signature Structure](../../../../05-SignatureStructures/03-Staking/01-StandardStakingStructure.md).
- The EVVM payment signature (`signature_EVVM`) follows the [Single Payment Signature Structure](../../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

## Workflow

The function supports two execution paths:

- **Fisher-Mediated**: A designated fisher captures the transaction from the fishing spot and submits it to the contract
- **Direct User Submission**: The user directly submits the transaction to the contract

## Staking Process

1. **Presale Staking Status**: Verifies `allowPresaleStaking.flag` is enabled and `allowPublicStaking.flag` is disabled, reverts with `PresaleStakingDisabled()` otherwise

2. **Centralized Verification**: Validates signature and consumes nonce via Core.sol:
```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForPresaleStake(isStaking, 1),  // Fixed amount = 1
    originExecutor,
    nonce,
    true,  // Always async
    signature
);
```

**Validates**:
- Signature authenticity via EIP-191
- Nonce hasn't been consumed
- Executor is the specified EOA (via `tx.origin`)

**On Failure**:
- `Core__InvalidSignature()` - Invalid signature
- `Core__NonceAlreadyUsed()` - Nonce consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

3. **Presale Participant Verification**: Confirms the user is registered as a presale participant using `userPresaleStaker[user].isAllow`, reverts with `UserIsNotPresaleStaker()` if not authorized
4. **Limit Check**: Ensures `userPresaleStaker[user].stakingAmount < 2`, reverts with `UserPresaleStakerLimitExceeded()` if limit reached
5. **Counter Update**: Increments `userPresaleStaker[user].stakingAmount`
6. **Process Execution**: Calls the internal `stakingBaseProcess` function with:
   - User address and IsAService=false in AccountMetadata
   - Fixed amount of 1 staking token
   - Standard EVVM payment processing
   - Historical record updates and reward distribution


For detailed information about the `stakingBaseProcess` function, refer to the [stakingBaseProcess](../02-InternalStakingFunctions/01-stakingBaseProcess.md).


## Unstaking Process

1. **Presale Staking Status**: Verifies `allowPresaleStaking.flag` is enabled and `allowPublicStaking.flag` is disabled, reverts with `PresaleStakingDisabled()` otherwise

2. **Centralized Verification**: Validates signature and consumes nonce via Core.sol (same as staking)

3. **Presale Participant Verification**: Confirms the user is registered as a presale participant using `userPresaleStaker[user].isAllow`, reverts with `UserIsNotPresaleStaker()` if not authorized
4. **Balance Check**: Ensures `userPresaleStaker[user].stakingAmount > 0`, reverts with `UserPresaleStakerLimitExceeded()` if no stakes to unstake
5. **Counter Decrement**: Decrements `userPresaleStaker[user].stakingAmount`
6. **Process Execution**: Calls the internal `stakingBaseProcess` function with:
   - User address and IsAService=false in AccountMetadata
   - Fixed amount of 1 staking token
   - Standard EVVM payment processing
   - Historical record updates and reward distribution


For detailed information about the `stakingBaseProcess` function, refer to the [stakingBaseProcess](../02-InternalStakingFunctions/01-stakingBaseProcess.md).


---

## publicStaking


> **Note: Signature Verification**
publicStaking uses Core.sol's centralized verification via `validateAndConsumeNonce()` with `StakingHashUtils.hashDataForPublicStake()`. Includes `originExecutor` parameter (EOA executor verified with tx.origin).

**Function Type**: `external`  
**Function Signature**: `publicStaking(address user, bool isStaking, uint256 amountOfStaking, address originExecutor, uint256 nonce, bytes signature, uint256 priorityFee_EVVM, uint256 nonceEvvm, bytes signatureEvvm)`  
**Function Selector**: `0x21cc1749`

The `publicStaking` function enables universal access to MATE token staking when the `allowPublicStaking.flag` is enabled, regardless of presale participation status or account type.


Note: In this repository's contract implementation the constructor enables `allowPublicStaking.flag` by default and leaves `allowPresaleStaking.flag` disabled. Deployments and testnets may use different defaults; consult the deployed contract metadata for runtime flag values.


## Parameters

| Parameter           | Type    | Description                                          |
| ------------------- | ------- | ---------------------------------------------------- |
| `user`              | address | User address                                         |
| `isStaking`         | bool    | `true` = Stake, `false` = Unstake                    |
| `amountOfStaking`   | uint256 | Amount of staking tokens to stake/unstake            |
| `originExecutor`    | address | EOA that will execute the transaction (verified with tx.origin) |
| `nonce`             | uint256 | Core nonce for this signature (prevents replay attacks) |
| `signature`         | bytes   | User authorization signature                         |
| `priorityFee_EVVM`  | uint256 | EVVM priority fee                                    |
| `nonce_EVVM`        | uint256 | EVVM payment operation nonce                         |
| `priorityFlag_EVVM` | bool    | EVVM execution mode (`true` = async, `false` = sync) |
| `signature_EVVM`    | bytes   | EVVM payment authorization                           |


- If you want to know more about the signature structure, refer to the [Standard Staking/Unstaking Signature Structure](../../../../05-SignatureStructures/03-Staking/01-StandardStakingStructure.md).
- The EVVM payment signature (`signature_EVVM`) follows the [Single Payment Signature Structure](../../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

## Workflow

The function supports two execution paths:

- **Fisher-Mediated**: A designated fisher captures the transaction from the fishing spot and submits it to the contract
- **Direct User Submission**: The user directly submits the transaction to the contract

## Staking Process

1. **Feature Status Verification**: Confirms `allowPublicStaking.flag` is enabled

2. **Centralized Verification**: Validates signature and consumes nonce via Core.sol:
```solidity
core.validateAndConsumeNonce(
    user,
    Hash.hashDataForPublicStake(isStaking, amountOfStaking),
    originExecutor,
    nonce,
    true,  // Always async
    signature
);
```

**Validates**:
- Signature authenticity via EIP-191
- Nonce hasn't been consumed
- Executor is the specified EOA (via `tx.origin`)

**On Failure**:
- `Core__InvalidSignature()` - Invalid signature
- `Core__NonceAlreadyUsed()` - Nonce consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

3. **Process Execution**: Calls the internal `stakingBaseProcess` function with:
   - User address and IsAService=false in AccountMetadata
   - Specified amount of staking tokens
   - Standard EVVM payment processing
   - Historical record updates and reward distribution


For detailed information about the `stakingBaseProcess` function, refer to the [stakingBaseProcess](../02-InternalStakingFunctions/01-stakingBaseProcess.md).


## Unstaking Process

1. **Feature Status Verification**: Confirms `allowPublicStaking.flag` is enabled  

2. **Centralized Verification**: Validates signature and consumes nonce via Core.sol (same as staking)

3. **Process Execution**: Calls the internal `stakingBaseProcess` function with:
   - User address and IsAService=false in AccountMetadata
   - Specified amount of staking tokens
   - Standard EVVM payment processing
   - Historical record updates and reward distribution


For detailed information about the `stakingBaseProcess` function, refer to the [stakingBaseProcess](../02-InternalStakingFunctions/01-stakingBaseProcess.md).


---

## Service Staking Introduction


The EVVM Staking system provides native support for smart contracts (services) to participate in staking operations. Service staking is designed with enhanced security and atomicity requirements to prevent token loss while enabling Services to become network fishers.

## Overview

Service staking operates differently from user staking due to the nature of smart contracts:

- **Contract-Only Access**: Only smart contracts can use service staking functions (enforced by `onlyCA` modifier)
- **Atomic Operations**: Staking requires a three-phase atomic process to ensure transaction safety
- **Simplified Unstaking**: Direct unstaking without signatures or complex payment processing
- **Same Time Locks**: Subject to identical cooldown periods as user staking

## Three-Phase Service Staking Process

Service staking requires three sequential steps that MUST occur in the same transaction:

### Step 1: prepareServiceStaking
- **Function**: `prepareServiceStaking(uint256 amountOfStaking)`
- **Purpose**: Records pre-staking state and metadata
- **Process**: Stores service address, timestamp, intended amount, and balance snapshots
- **Access**: Contract accounts only (`onlyCA`)

### Step 2: EVVM Payment
- **Function**: `EVVM.caPay(address, address, uint256)`
- **Purpose**: Transfers Principal Tokens to staking contract
- **Amount**: `amountOfStaking * PRICE_OF_STAKING` Principal Tokens
- **Target**: Staking contract address

### Step 3: confirmServiceStaking
- **Function**: `confirmServiceStaking()`
- **Purpose**: Validates payment and completes staking
- **Validation**: Confirms exact payment amounts and same-transaction execution
- **Completion**: Calls `stakingBaseProcess` to finalize staking

> **Warning: Critical Transaction Requirements**

All three steps MUST occur in the same transaction. If any step is missed or fails:
- **Token Loss Risk**: Principal Tokens may become permanently locked in the staking contract
- **No Recovery Mechanism**: There is no way to recover tokens from incomplete operations
- **Transaction Atomicity**: Use proper error handling to ensure all-or-nothing execution


## Service Unstaking Process

Service unstaking is a simplified single-step process:

### Direct Unstaking
- **Function**: `serviceUnstaking(uint256 amountOfStaking)`
- **Process**: Direct call to `stakingBaseProcess` with service parameters
- **Access**: Contract accounts only (`onlyCA`)
- **Payment**: Returns `amountOfStaking * PRICE_OF_STAKING` Principal Tokens
- **No Signatures**: Unlike user unstaking, no signature validation required

### Time Lock Restrictions
Service unstaking follows the same time lock rules as user unstaking:
- **Re-staking Cooldown**: Must wait after complete unstaking before staking again
- **Full Unstaking Cooldown**: 21-day wait period for withdrawing all staked tokens

## Key Differences from User Staking

| Aspect | User Staking | Service Staking |
|--------|-------------|-----------------|
| **Access Control** | Any address | Contract accounts only (`onlyCA`) |
| **Staking Process** | Single function call with signatures | Three-phase atomic process |
| **Payment Method** | EVVM `pay()` with signatures | Direct `caPay()` transfer |
| **Unstaking** | Signature + nonce validation | Direct function call |
| **Time Locks** | Same cooldown periods | Same cooldown periods |
| **Rewards** | Standard reward distribution | Standard reward distribution |

## Integration Methods

### Method 1: Manual Three-Phase Process

Directly implement the three-step process in your service contract:

```solidity
contract MyService {
    address immutable STAKING_CONTRACT;
    address immutable EVVM_CONTRACT;
    
    function stakeTokens(uint256 amount) external {
        // Step 1: Prepare
        Staking(STAKING_CONTRACT).prepareServiceStaking(amount);
        
        // Step 2: Pay
        uint256 cost = amount * Staking(STAKING_CONTRACT).priceOfStaking();
        Evvm(EVVM_CONTRACT).caPay(
            STAKING_CONTRACT, 
            0x0000000000000000000000000000000000000001, // PRINCIPAL_TOKEN_ADDRESS
            cost
        );
        
        // Step 3: Confirm
        Staking(STAKING_CONTRACT).confirmServiceStaking();
    }
    
    function unstakeTokens(uint256 amount) external {
        Staking(STAKING_CONTRACT).serviceUnstaking(amount);
    }
}
```

### Method 2: StakingServiceHooks Library (Recommended)

Use the helper library available at `@evvm/testnet-contracts/library/StakingServiceHooks.sol` for simplified, atomic operations:

```solidity

contract MyService is StakingServiceHooks {
    constructor(address stakingAddress) StakingServiceHooks(stakingAddress) {
        // StakingServiceHooks automatically:
        // - Sets stakingHookAddress = stakingAddress
        // - Retrieves and sets evvmHookAddress from staking contract
    }
    
    function stakeTokens(uint256 amount) external {
        // Atomic operation that handles all 3 steps automatically:
        // 1. prepareServiceStaking(amount)
        // 2. caPay(stakingContract, PRINCIPAL_TOKEN_ADDRESS, cost)
        // 3. confirmServiceStaking()
        _makeStakeService(amount);
    }
    
    function unstakeTokens(uint256 amount) external {
        // Direct wrapper for serviceUnstaking
        _makeUnstakeService(amount);
    }
    
    // Optional: Update staking contract address
    function updateStakingContract(address newStakingAddress) external onlyOwner {
        _changeStakingHookAddress(newStakingAddress);
    }
}
```

**Key StakingServiceHooks Features:**
- **Automatic Address Management**: Constructor sets both staking and EVVM addresses
- **Atomic Staking**: `makeStakeService()` prevents token loss through transaction atomicity  
- **Error Prevention**: Transaction reverts completely if any step fails
- **Simplified Integration**: No need to manage three separate contract calls
- **Address Updates**: Built-in functions to update contract addresses when needed

## StakingServiceHooks Library

The `StakingServiceHooks` is a helper abstract contract located at `@evvm/testnet-contracts/library/StakingServiceHooks.sol` that simplifies service staking integration by providing pre-built hooks for service contracts to safely interact with the EVVM staking system.

### Library Architecture

```solidity
abstract contract StakingServiceHooks {
    address stakingHookAddress;  // Staking contract address
    address evvmHookAddress;     // EVVM contract address
    
    constructor(address _stakingAddress) {
        stakingHookAddress = _stakingAddress;
        evvmHookAddress = Staking(_stakingAddress).getEvvmAddress();
    }
}
```

### Core Functions

#### makeStakeService(uint256 amountToStake)
- **Type**: `internal` function
- **Purpose**: Performs complete atomic staking operation
- **Process**: Executes all three staking steps in a single transaction:
  1. `Staking(stakingHookAddress).prepareServiceStaking(amountToStake)`
  2. `Evvm(evvmHookAddress).caPay(stakingContract, PRINCIPAL_TOKEN_ADDRESS, cost)`
  3. `Staking(stakingHookAddress).confirmServiceStaking()`
- **Safety**: Ensures atomicity - if any step fails, entire transaction reverts

#### makeUnstakeService(uint256 amountToUnstake)
- **Type**: `internal` function
- **Purpose**: Simplified unstaking wrapper
- **Process**: Direct call to `Staking(stakingHookAddress).serviceUnstaking(amountToUnstake)`
- **Returns**: `amountToUnstake * PRICE_OF_STAKING` Principal Tokens to the service

#### _changeStakingHookAddress(address newStakingAddress)
- **Type**: `internal` function
- **Purpose**: Updates both staking and EVVM contract addresses
- **Process**: Sets new staking address and automatically retrieves corresponding EVVM address
- **Use Case**: When staking contract is upgraded

#### changeEvvmHookAddress(address newEvvmAddress)
- **Type**: `internal` function  
- **Purpose**: Manually updates only the EVVM contract address
- **Use Case**: When EVVM contract is upgraded independently (rare)
- **Note**: Prefer using `_changeStakingHookAddress` for consistency

### Benefits of Using StakingServiceHooks

- **Token Loss Prevention**: Atomic operations ensure all-or-nothing execution
- **Simplified Integration**: Single inheritance provides all necessary functionality
- **Automatic Address Management**: Constructor and update functions handle contract addresses
- **Error Safety**: Complete transaction reversion prevents partial state updates
- **Reduced Gas Costs**: Optimized for minimal gas usage in atomic operations

## Validation and Error Handling

### Common Validation Errors

| Function | Error | Condition |
|----------|-------|-----------|
| `prepareServiceStaking` | `AddressIsNotAService()` | Called by EOA instead of contract |
| `confirmServiceStaking` | `ServiceDoesNotStakeInSameTx()` | Not called in same transaction as prepare |
| `confirmServiceStaking` | `ServiceDoesNotFulfillCorrectStakingAmount()` | Incorrect payment amount |
| `confirmServiceStaking` | `AddressMismatch()` | Different caller than prepare step |
| `serviceUnstaking` | `AddressMustWaitToFullUnstake()` | Full unstaking cooldown not met |

### Balance Requirements

Before staking, ensure the service contract has sufficient Principal Token balance:
```solidity
uint256 requiredBalance = amountToStake * stakingContract.priceOfStaking();
require(evvmContract.getBalance(address(this), PRINCIPAL_TOKEN_ADDRESS) >= requiredBalance, "Insufficient balance");
```

## Security Considerations

### Critical Safety Requirements

1. **Transaction Atomicity**: Never split the three-phase staking process across multiple transactions
2. **Balance Verification**: Always check Principal Token balance before initiating staking
3. **Error Handling**: Implement comprehensive error handling for all staking operations
4. **Access Control**: Restrict staking functions to authorized addresses within your service

### Time Lock Management

Service contracts must respect the same time lock restrictions as user staking:
- **Re-staking Cooldown**: Configurable wait period after complete unstaking
- **Full Unstaking Cooldown**: Default 21-day wait period for withdrawing all tokens
- **Balance Monitoring**: Track when cooldown periods will expire

## Best Practices

1. **Prefer StakingServiceHooks**: Use the helper library for most implementations
2. **Implement Balance Checks**: Verify sufficient funds before attempting staking operations
3. **Use Try-Catch Patterns**: Handle staking failures gracefully with proper error recovery
4. **Monitor Cooldowns**: Track time lock periods and notify users of waiting requirements
5. **Test Edge Cases**: Thoroughly test scenarios including insufficient balances and cooldown periods

The service staking system provides secure functionality for smart contracts to participate in the EVVM network while preventing common integration pitfalls that could result in token loss.

---

## prepareServiceStaking


**Function Type**: `external`  
**Function Signature**: `prepareServiceStaking(uint256)`  
**Access Control**: `onlyCA` (Contract Accounts Only)

The `prepareServiceStaking` function is the first step in the service staking process. It records the pre-staking state and prepares the necessary metadata for validation. This function must be followed by payment via `EVVM.caPay()` and completion via `confirmServiceStaking()` in the same transaction.

> **Warning: Critical Transaction Requirements**

All three steps MUST occur in the same transaction:
1. Call `prepareServiceStaking(amount)` - Records balances and metadata
2. Use `EVVM.caPay()` to transfer Principal Tokens to the staking contract  
3. Call `confirmServiceStaking()` - Validates payment and completes staking

**CRITICAL WARNING**: If the process is not completed properly (especially if caPay is called but confirmServiceStaking is not), the Principal Tokens will remain locked in the staking contract with no way to recover them. The service will lose the tokens permanently.


## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `amountOfStaking` | uint256 | Amount of staking tokens the service intends to stake |

## Workflow

### Preparation Process

1. **Access Control**: Verifies caller is a contract account using `onlyCA` modifier
2. **Metadata Recording**: Stores critical pre-staking information:
   - Service address (`msg.sender`)
   - Current timestamp
   - Intended staking amount
   - Service's Principal Token balance before staking
   - Staking contract's Principal Token balance before staking

### State Changes

The function populates the `serviceStakingData` struct with:

```solidity
struct ServiceStakingMetadata {
    address service;                      // Service contract address
    uint256 timestamp;                    // Block timestamp when prepare was called
    uint256 amountOfStaking;             // Intended staking amount
    uint256 amountServiceBeforeStaking;  // Service balance before staking
    uint256 amountStakingBeforeStaking;  // Contract balance before staking
}
```

## Integration Requirements

### Following Steps Required

After calling `prepareServiceStaking()`, the service must:

1. **Make Payment**: Use `EVVM.caPay()` to transfer `amountOfStaking * PRICE_OF_STAKING` Principal Tokens to the staking contract
2. **Confirm Staking**: Call `confirmServiceStaking()` to validate payment and complete the staking process

### Access Control

- **Only Contract Accounts**: Function restricted to smart contracts via `onlyCA` modifier
- **Same Transaction**: All steps must occur in a single transaction
- **Balance Validation**: Subsequent confirmation validates exact payment amounts

## Example Usage

```solidity
// Step 1: Prepare staking for 5 tokens
stakingContract.prepareServiceStaking(5);

// Step 2: Transfer required Principal Tokens  
uint256 cost = 5 * stakingContract.priceOfStaking();
evvmContract.caPay(address(stakingContract), PRINCIPAL_TOKEN_ADDRESS, cost);

// Step 3: Confirm and complete staking
stakingContract.confirmServiceStaking();
```


This function only records metadata and does not perform any token transfers. The actual payment and staking completion occurs in the subsequent steps.


> **Danger: Token Loss Warning**

Failure to complete all three steps in the same transaction will result in permanent loss of Principal Tokens. Always ensure proper transaction atomicity when implementing service staking.


---

## confirmServiceStaking


**Function Type**: `external`  
**Function Signature**: `confirmServiceStaking()`  
**Access Control**: `onlyCA` (Contract Accounts Only)

The `confirmServiceStaking` function is the final step in the service staking process. It validates that payment was made correctly and completes the staking operation. This function must be called in the same transaction as `prepareServiceStaking()` and the EVVM payment.

## Parameters

None - The function uses data stored during `prepareServiceStaking()`.

## Workflow

### Validation Process

1. **Payment Verification**: Validates that the correct amount of Principal Tokens was transferred:
   - Service balance decreased by exactly `amountOfStaking * PRICE_OF_STAKING`
   - Staking contract balance increased by exactly `amountOfStaking * PRICE_OF_STAKING`

2. **Transaction Timing**: Confirms operation occurs in the same transaction as `prepareServiceStaking`:
   - Compares current `block.timestamp` with stored timestamp
   - Reverts with `ServiceDoesNotStakeInSameTx()` if timestamps differ

3. **Service Authentication**: Ensures caller matches the service that initiated preparation:
   - Compares `msg.sender` with stored service address
   - Reverts with `AddressMismatch()` if addresses don't match

### Completion Process

4. **Staking Execution**: Calls `stakingBaseProcess` with:
   - Service address and IsAService=true in AccountMetadata
   - Staking operation (isStaking=true)
   - Prepared staking amount
   - Zero values for EVVM parameters (no additional payment needed)

## Validation Errors

The function performs strict validation and reverts with specific errors:

| Error | Condition | Description |
|-------|-----------|-------------|
| `ServiceDoesNotFulfillCorrectStakingAmount()` | Incorrect payment amount | Service didn't transfer exactly the required amount |
| `ServiceDoesNotStakeInSameTx()` | Different timestamp | Function not called in same transaction as preparation |
| `AddressMismatch()` | Wrong caller | Caller doesn't match the service that prepared staking |

## Balance Calculations

The function calculates required payment as:
```solidity
uint256 totalStakingRequired = PRICE_OF_STAKING * serviceStakingData.amountOfStaking;
```

And validates:
```solidity
// Service balance must decrease by exact amount
serviceBalanceBefore - totalStakingRequired == serviceBalanceAfter

// Contract balance must increase by exact amount  
contractBalanceBefore + totalStakingRequired == contractBalanceAfter
```

## State Changes

Upon successful validation:

1. **Staker Status**: Service receives staker status via `Evvm(EVVM_ADDRESS).pointStaker(address, 0x01)`
2. **History Update**: Transaction recorded in service's staking history
3. **Metadata Cleared**: Service staking metadata is implicitly cleared for next operation

## Integration Points

### With stakingBaseProcess
- Calls core staking logic with service-specific parameters
- IsAService=true flag indicates contract account staking
- No additional EVVM payments required (already completed)

### With EVVM Contract
- Validates balance changes through EVVM balance queries
- Coordinates with EVVM for staker status assignment

## Example Complete Flow

```solidity
// Complete service staking in one transaction
function stakeAsService(uint256 amount) external {
    // Step 1: Prepare
    stakingContract.prepareServiceStaking(amount);
    
    // Step 2: Pay
    uint256 cost = amount * stakingContract.priceOfStaking();
    evvmContract.caPay(address(stakingContract), PRINCIPAL_TOKEN_ADDRESS, cost);
    
    // Step 3: Confirm (this function)
    stakingContract.confirmServiceStaking();
}
```


For detailed information about the core staking logic, refer to the [stakingBaseProcess](../../02-InternalStakingFunctions/01-stakingBaseProcess.md).



This function must be called immediately after payment via `EVVM.caPay()` in the same transaction. Any delay or separate transaction will cause validation failures.


---

## serviceUnstaking


**Function Type**: `external`  
**Function Signature**: `serviceUnstaking(uint256)`  
**Access Control**: `onlyCA` (Contract Accounts Only)

The `serviceUnstaking` function allows smart contracts (services) to unstake their staking tokens directly. This is a simplified unstaking process for services that doesn't require signatures or complex payment processing.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `amountOfStaking` | uint256 | Amount of staking tokens to unstake |

## Workflow

### Unstaking Process

1. **Access Control**: Verifies caller is a contract account using `onlyCA` modifier
2. **Direct Processing**: Calls `stakingBaseProcess` with service-specific parameters:
   - Service address and IsAService=true in AccountMetadata
   - Unstaking operation (isStaking=false) 
   - Specified unstaking amount
   - Zero values for all EVVM parameters

### Service Advantages

Unlike user unstaking, service unstaking:
- **No Signatures Required**: Services don't need to provide authorization signatures
- **No Priority Fees**: No additional payment processing needed
- **Simplified Flow**: Direct call to core staking logic
- **Contract-Only**: Restricted to smart contract accounts for security

## Token Return Process

When unstaking is successful:

1. **Token Calculation**: Returns `amountOfStaking * PRICE_OF_STAKING` Principal Tokens
2. **Direct Transfer**: Tokens transferred directly to the service address via `makeCaPay()`
3. **Status Update**: If full unstaking, removes staker status via EVVM contract
4. **History Recording**: Updates service's staking history with unstaking transaction

## Time Lock Restrictions

Service unstaking is subject to the same time lock restrictions as user unstaking:

### Re-staking Cooldown
- Must wait after complete unstaking before staking again
- Controlled by `secondsToUnlockStaking.actual`

### Full Unstaking Cooldown  
- Must wait the full period (default 21 days) for complete unstaking
- Controlled by `secondsToUnlockFullUnstaking.actual`
- Applies when unstaking all remaining tokens

## Error Conditions

The function may revert with:

| Error | Condition |
|-------|-----------|
| `AddressIsNotAService()` | Caller is not a contract account (EOA attempted access) |
| `AddressMustWaitToFullUnstake()` | Full unstaking cooldown period not met |
| `InsufficientStakingBalance()` | Attempting to unstake more than available |

## Integration Points

### With stakingBaseProcess
- Uses core unstaking logic with service-specific configuration
- IsAService=true enables service-specific processing paths
- Simplified parameter set (no signatures or payments)

### With EVVM Contract
- Token returns processed through EVVM's `caPay()` function
- Staker status updates coordinated with EVVM contract
- Balance queries for validation

## Example Usage

```solidity
// Service unstaking 3 tokens
contract MyService {
    function unstakeTokens() external {
        // Unstake 3 staking tokens
        stakingContract.serviceUnstaking(3);
        
        // Service will receive: 3 * PRICE_OF_STAKING Principal Tokens
        // Tokens appear in service's EVVM balance
    }
    
    function unstakeAll() external {
        // Check current staked amount
        uint256 stakedAmount = stakingContract.getUserAmountStaked(address(this));
        
        // Unstake everything (subject to full unstaking cooldown)
        stakingContract.serviceUnstaking(stakedAmount);
    }
}
```

## Comparison with User Unstaking

| Aspect | Service Unstaking | User Unstaking |
|--------|------------------|----------------|
| **Access Control** | Contract accounts only | Any address |
| **Signatures** | None required | EIP-191 signature required |
| **Payment Processing** | None | Optional priority fees |
| **Nonce Management** | None | Nonce validation required |
| **Time Locks** | Same restrictions | Same restrictions |


For detailed information about the core unstaking logic and time lock calculations, refer to the [stakingBaseProcess](../../02-InternalStakingFunctions/01-stakingBaseProcess.md).



Services can check their current staked amount using `getUserAmountStaked(address(this))` before calling this function to ensure they don't attempt to unstake more than available.


---

## gimmeYiel


**Function Type**: `external`  
**Function Signature**: `gimmeYiel(address)`  
**Returns**: `(bytes32,address,uint256,uint256,uint256)`

## Parameters

| Parameter | Type | Description |
|---|---:|---|
| `user` | address | Address of the user claiming rewards |

## Return Values

| Return | Type | Description |
|---|---:|---|
| `epochAnswer` | bytes32 | Epoch identifier (0 if nothing to distribute) |
| `tokenToBeRewarded` | address | Token address used for the reward |
| `amountTotalToBeRewarded` | uint256 | Calculated reward amount for the user |
| `idToOverwriteUserHistory` | uint256 | Index in user history to update with reward record |
| `timestampToBeOverwritten` | uint256 | Timestamp to write into the updated history entry |

## Workflow

1. **History Check**: Ensures the user has staking history to evaluate
2. **Estimation Call**: Calls the configured `Estimator.makeEstimation(user)` which returns the epoch, token address and the computed reward amount plus history metadata indices
3. **Reward Distribution**: If `amountTotalToBeRewarded > 0`:
   - Transfers the reward to the user using `makeCaPay(tokenToBeRewarded, user, amountTotalToBeRewarded)`
   - Updates the user's `HistoryMetadata` entry at `idToOverwriteUserHistory` with the reward `transactionType`, `amount`, and `timestamp`
4. **Executor Incentive**: If the caller (`msg.sender`) is a registered staker (checked via `evvm.isAddressStaker(msg.sender)`), the function pays a small incentive to the caller as:
   - `makeCaPay(PRINCIPAL_TOKEN_ADDRESS, msg.sender, evvm.getRewardAmount() * 1)`

## Interaction Notes

- **Estimator Integration**: This function depends on accurate epoch data supplied to the `Estimator` (via `notifyNewEpoch`). The estimator performs time-weighted calculations and returns reward amounts and history indices for in-place updates.
- **Atomicity**: All distribution and history updates are performed within the same call to ensure consistent accounting.
- **No Extra Signature Required**: `gimmeYiel` is called by external accounts (e.g., relayers or stakers). The function does not require user signatures; it relies on historical data in the contract and Estimator's calculations.

## Examples

- A staker or any caller can trigger `gimmeYiel(user)` to calculate and distribute available rewards to `user`. If rewards are distributed, the caller may receive a small principal-token incentive if the caller is a staker.

This doc describes the exact implementation present in the current contract sources; if you prefer a different user-facing name for the function in docs, we can alias it (e.g., "claimYield") but the code will still use `gimmeYiel`.

---

## stakingBaseProcess


**Function Type**: `internal`

The `stakingBaseProcess` function implements the core staking logic that handles both service and user staking operations. It processes payments, updates history, handles time locks, and manages EVVM integration for all staking types.

## Parameters

| Parameter           | Type            | Description                                                    |
| ------------------- | --------------- | -------------------------------------------------------------- |
| `account`           | AccountMetadata | Metadata of the account performing the staking operation       |
| `isStaking`         | bool            | `true` = Stake (requires payment), `false` = Unstake (provides refund) |
| `amountOfStaking`   | uint256         | Amount of staking tokens to stake/unstake                      |
| `priorityFee_EVVM`  | uint256         | Priority fee for EVVM transaction                              |
| `nonce_EVVM`        | uint256         | Nonce for EVVM contract transaction                            |
| `priorityFlag_EVVM` | bool            | `true` = async EVVM transaction, `false` = sync               |
| `signature_EVVM`    | bytes           | Signature for EVVM contract transaction                        |

### AccountMetadata Structure

The `account` parameter uses the following struct:

```solidity
struct AccountMetadata {
    address Address;     // Address of the account
    bool IsAService;     // Boolean indicating if the account is a smart contract (service) account
}
```

## Workflow

The function processes two distinct operation types with different validation and execution flows:

- **Staking Operations**: Payment processing, cooldown validation, and stake assignment
- **Unstaking Operations**: Conditional payments, token refunds, and stake removal

## Staking Process

1. **Re-Staking Cooldown Check**: Verifies `getTimeToUserUnlockStakingTime(account.Address) <= block.timestamp`, reverts with `AddressMustWaitToStakeAgain()` if cooldown period hasn't elapsed
2. **Payment Processing**: 
   - **For Users (!account.IsAService)**: Calls `makePay(account.Address, PRICE_OF_STAKING * amountOfStaking, priorityFee_EVVM, priorityFlag_EVVM, nonce_EVVM, signature_EVVM)`
   - **For Services (account.IsAService)**: Skips payment processing (already handled in preparation phase)
3. **Staker Status Assignment**: Sets `Evvm(EVVM_ADDRESS).pointStaker(account.Address, 0x01)` to mark as active staker
4. **Balance Calculation**: Calculates new total stake:
   - **First time staking**: `auxSMsteBalance = amountOfStaking`
   - **Additional staking**: `auxSMsteBalance = lastTotalStaked + amountOfStaking`
5. **History Update**: Pushes `HistoryMetadata` with transaction type `bytes32(uint256(1))`, amount, timestamp, and total staked
6. **Executor Rewards**: If `msg.sender` is a staker and `!account.IsAService`, pays `(getRewardAmount() * 2) + priorityFee_EVVM` via `makeCaPay()`

## Unstaking Process

1. **Full Unstaking Validation**: If `amountOfStaking == getUserAmountStaked(account.Address)` (complete unstaking):
   - **Cooldown Check**: Verifies `getTimeToUserUnlockFullUnstakingTime(account.Address) <= block.timestamp`, reverts with `AddressMustWaitToFullUnstake()` if cooldown not met
   - **Status Removal**: Sets `Evvm(EVVM_ADDRESS).pointStaker(account.Address, 0x00)` to remove staker status
2. **Optional Priority Payment**: If `priorityFee_EVVM != 0 && !account.IsAService` (user unstaking with priority fee):
   - **Priority Fee Payment**: Calls `makePay(account.Address, 0, priorityFee_EVVM, priorityFlag_EVVM, nonce_EVVM, signature_EVVM)` (amount is 0, only priority fee is paid)
3. **Balance Calculation**: `auxSMsteBalance = lastTotalStaked - amountOfStaking`
4. **Token Refund**: Calls `makeCaPay(PRINCIPAL_TOKEN_ADDRESS, account.Address, PRICE_OF_STAKING * amountOfStaking)` to return tokens
5. **History Update**: Pushes `HistoryMetadata` with transaction type `bytes32(uint256(2))`, amount, timestamp, and remaining total staked
6. **Executor Rewards**: If `msg.sender` is a staker and `!account.IsAService`, pays `(getRewardAmount() * 2) + priorityFee_EVVM` via `makeCaPay()`


For detailed information about the helper functions, refer to:
- [makePay](../05-makePay.md) - Handles EVVM payment processing
- [makeCaPay](../04-makeCaPay.md) - Handles token distributions
- [Getter Functions](../06-Getters.md) - Time lock and balance functions


---

## Administrative Functions(02-StakingContract)


> **Note: Implementation Note**
Administrative functions do **not** use Core.sol's `validateAndConsumeNonce()` pattern. They are directly protected by `onlyOwner` modifier and execute through standard transaction authentication via `msg.sender`.

This section details all administrative functions in the contract, which implement a secure time-delayed governance system to ensure safe management of critical contract parameters and roles.

> **Note: Time-Delayed Governance**
All administrative changes follow a secure two-step process with a mandatory 24-hour waiting period to prevent immediate modifications to critical parameters.

---

## Presale Staker Management

### addPresaleStaker

**Function Type**: `external`  
**Function Signature**: `addPresaleStaker(address)`  

Allows the admin to add a single new presale staker to the contract.

#### Parameters

| Parameter | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| `_staker` | address | Address of the new presale staker |

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Limit Validation**: Ensures adding this staker won't exceed the 800 staker limit (`LIMIT_PRESALE_STAKER`)
3. **Staker Registration**: Sets `userPresaleStaker[_staker].isAllow = true`
4. **Counter Update**: Increments `presaleStakerCount`

---

### addPresaleStakers

**Function Type**: `external`  
**Function Signature**: `addPresaleStakers(address[])`  

Allows the admin to add multiple presale stakers in a single transaction for efficient batch processing.

#### Parameters

| Parameter  | Type      | Description                               |
| ---------- | --------- | ----------------------------------------- |
| `_stakers` | address[] | Array of addresses of new presale stakers |

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Batch Processing**: Iterates through the array of staker addresses
3. **Individual Limit Check**: For each address, verifies the 800 staker limit (`LIMIT_PRESALE_STAKER`)
4. **Staker Registration**: Sets `userPresaleStaker[_stakers[i]].isAllow = true` for each valid address
5. **Counter Update**: Increments `presaleStakerCount` for each successfully added staker

---

## Admin Role Management

### proposeAdmin

**Function Type**: `external`  
**Function Signature**: `proposeAdmin(address)`  

Initiates the admin role transfer process by proposing a new admin address.

#### Parameters

| Parameter   | Type    | Description                       |
| ----------- | ------- | --------------------------------- |
| `_newAdmin` | address | Address of the proposed new admin |

#### Workflow

1. **Admin Verification**: Validates caller has current admin privileges
2. **Proposal Setup**: Sets `admin.proposal = _newAdmin`
3. **Time Lock Activation**: Sets `admin.timeToAccept = block.timestamp + 1 days`

---

### rejectProposalAdmin

**Function Type**: `external`  
**Function Signature**: `rejectProposalAdmin()`  

Allows the current admin to cancel a pending admin change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has current admin privileges
2. **Proposal Cancellation**: Resets `admin.proposal = address(0)`
3. **Time Lock Reset**: Resets `admin.timeToAccept = 0`

---

### acceptNewAdmin

**Function Type**: `external`  
**Function Signature**: `acceptNewAdmin()`  

Allows the proposed admin to accept the role after the mandatory waiting period.

#### Workflow

1. **Proposal Validation**: Verifies `msg.sender == admin.proposal`
2. **Time Lock Validation**: Confirms `admin.timeToAccept <= block.timestamp`
3. **Role Transfer**: Updates `admin.actual = admin.proposal`
4. **Cleanup**: Resets `admin.proposal = address(0)` and `admin.timeToAccept = 0`

---

## Golden Fisher Role Management

### proposeGoldenFisher

**Function Type**: `external`  
**Function Signature**: `proposeGoldenFisher(address)`  

Initiates the golden fisher role assignment process.

#### Parameters

| Parameter        | Type    | Description                               |
| ---------------- | ------- | ----------------------------------------- |
| `_goldenFisher` | address | Address of the proposed new golden fisher |

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Proposal Setup**: Sets `goldenFisher.proposal = _goldenFisher`
3. **Time Lock Activation**: Sets `goldenFisher.timeToAccept = block.timestamp + 1 days`

---

### rejectProposalGoldenFisher

**Function Type**: `external`  
**Function Signature**: `rejectProposalGoldenFisher()`  

Allows the current admin to cancel a pending golden fisher change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Proposal Cancellation**: Resets `goldenFisher.proposal = address(0)`
3. **Time Lock Reset**: Resets `goldenFisher.timeToAccept = 0`

---

### acceptNewGoldenFisher

**Function Type**: `external`  
**Function Signature**: `acceptNewGoldenFisher()`  

Allows the admin to confirm the new golden fisher role assignment after the waiting period.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Time Lock Validation**: Confirms `goldenFisher.timeToAccept <= block.timestamp`
3. **Role Assignment**: Updates `goldenFisher.actual = goldenFisher.proposal`
4. **Cleanup**: Resets `goldenFisher.proposal = address(0)` and `goldenFisher.timeToAccept = 0`

---

## Staking Time Lock Configuration

### proposeSetSecondsToUnlockStaking

**Function Type**: `external`  
**Function Signature**: `proposeSetSecondsToUnlockStaking(uint256)`  

Initiates the process to change the re-staking cooldown period.

#### Parameters

| Parameter                 | Type    | Description                          |
| ------------------------- | ------- | ------------------------------------ |
| `_secondsToUnlockStaking` | uint256 | New staking unlock period in seconds |

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Proposal Setup**: Sets `secondsToUnlockStaking.proposal = _secondsToUnlockStaking`
3. **Time Lock Activation**: Sets `secondsToUnlockStaking.timeToAccept = block.timestamp + 1 days`

---

### rejectProposalSetSecondsToUnlockStaking

**Function Type**: `external`  
**Function Signature**: `rejectProposalSetSecondsToUnlockStaking()`  

Allows the current admin to cancel a pending staking unlock period change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Proposal Cancellation**: Resets `secondsToUnlockStaking.proposal = 0`
3. **Time Lock Reset**: Resets `secondsToUnlockStaking.timeToAccept = 0`

---

### acceptSetSecondsToUnlockStaking

**Function Type**: `external`  
**Function Signature**: `acceptSetSecondsToUnlockStaking()`  

Allows the admin to confirm the new staking unlock period after the waiting period.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Time Lock Validation**: Confirms `secondsToUnlockStaking.timeToAccept <= block.timestamp`
3. **Configuration Update**: Updates `secondsToUnlockStaking.actual = secondsToUnlockStaking.proposal`
4. **Cleanup**: Resets `secondsToUnlockStaking.proposal = 0` and `secondsToUnlockStaking.timeToAccept = 0`

---

## Full Unstaking Time Lock Configuration

### prepareSetSecondsToUnlockFullUnstaking

**Function Type**: `external`  
**Function Signature**: `prepareSetSecondsToUnllockFullUnstaking(uint256)`  

Initiates the process to change the full unstaking cooldown period.

#### Parameters

| Parameter                         | Type    | Description                                 |
| --------------------------------- | ------- | ------------------------------------------- |
| `_secondsToUnllockFullUnstaking` | uint256 | New full unstaking unlock period in seconds |

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Proposal Setup**: Sets `secondsToUnllockFullUnstaking.proposal = _secondsToUnllockFullUnstaking`
3. **Time Lock Activation**: Sets `secondsToUnllockFullUnstaking.timeToAccept = block.timestamp + 1 days`

---

### cancelSetSecondsToUnlockFullUnstaking

**Function Type**: `external`  
**Function Signature**: `cancelSetSecondsToUnllockFullUnstaking()`  

Allows the current admin to cancel a pending full unstaking unlock period change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Proposal Cancellation**: Resets `secondsToUnllockFullUnstaking.proposal = 0`
3. **Time Lock Reset**: Resets `secondsToUnllockFullUnstaking.timeToAccept = 0`

---

### confirmSetSecondsToUnlockFullUnstaking

**Function Type**: `external`  
**Function Signature**: `confirmSetSecondsToUnllockFullUnstaking()`  

Allows the admin to confirm the new full unstaking unlock period after the waiting period.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Time Lock Validation**: Confirms `secondsToUnllockFullUnstaking.timeToAccept <= block.timestamp`
3. **Configuration Update**: Updates `secondsToUnllockFullUnstaking.actual = secondsToUnllockFullUnstaking.proposal`
4. **Cleanup**: Resets `secondsToUnllockFullUnstaking.proposal = 0` and `secondsToUnllockFullUnstaking.timeToAccept = 0`

---

## Public Staking Flag Management

### prepareChangeAllowPublicStaking

**Function Type**: `external`  
**Function Signature**: `prepareChangeAllowPublicStaking()`  

Initiates the process to toggle the public staking availability flag.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges
2. **Time Lock Activation**: Sets `allowPublicStaking.timeToAccept = block.timestamp + 1 days`

---

### cancelChangeAllowPublicStaking

**Function Type**: `external`  
**Function Signature**: `cancelChangeAllowPublicStaking()`  

Allows the current admin to cancel a pending public staking flag change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Time Lock Reset**: Resets `allowPublicStaking.timeToAccept = 0`

---

### confirmChangeAllowPublicStaking

**Function Type**: `external`  
**Function Signature**: `confirmChangeAllowPublicStaking()`  

Allows the admin to confirm the public staking flag toggle after the waiting period.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Time Lock Validation**: Confirms `allowPublicStaking.timeToAccept <= block.timestamp`
3. **Flag Toggle**: Updates `allowPublicStaking` with new `BoolTypeProposal` struct:
   - `flag`: `!allowPublicStaking.flag` (toggles the boolean state)
   - `timeToAccept`: `0` (resets the time lock)
4. **Cleanup**: Resets time lock to 0 through the struct assignment

---

## Presale Staking Flag Management

### prepareChangeAllowPresaleStaking

**Function Type**: `external`  
**Function Signature**: `prepareChangeAllowPresaleStaking()`  

Initiates the process to toggle the presale staking availability flag.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Time Lock Activation**: Sets `allowPresaleStaking.timeToAccept = block.timestamp + TIME_TO_ACCEPT_PROPOSAL` (1 day)

---

### cancelChangeAllowPresaleStaking

**Function Type**: `external`  
**Function Signature**: `cancelChangeAllowPresaleStaking()`  

Allows the current admin to cancel a pending presale staking flag change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Time Lock Reset**: Resets `allowPresaleStaking.timeToAccept = 0`

---

### confirmChangeAllowPresaleStaking

**Function Type**: `external`  
**Function Signature**: `confirmChangeAllowPresaleStaking()`  

Allows the admin to confirm the presale staking flag toggle after the waiting period.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Time Lock Validation**: Confirms `allowPresaleStaking.timeToAccept <= block.timestamp`
3. **Flag Toggle**: Updates `allowPresaleStaking.flag = !allowPresaleStaking.flag`
4. **Cleanup**: Sets `allowPresaleStaking.timeToAccept = 0`

---

## Estimator Contract Management

### proposeEstimator

**Function Type**: `external`  
**Function Signature**: `proposeEstimator(address)`  

Initiates the process to change the estimator contract address.

#### Parameters

| Parameter    | Type    | Description                            |
| ------------ | ------- | -------------------------------------- |
| `_estimator` | address | Address of the proposed new estimator |

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Proposal Setup**: Sets `estimatorAddress.proposal = _estimator`
3. **Time Lock Activation**: Sets `estimatorAddress.timeToAccept = block.timestamp + TIME_TO_ACCEPT_PROPOSAL` (1 day)

---

### rejectProposalEstimator

**Function Type**: `external`  
**Function Signature**: `rejectProposalEstimator()`  

Allows the current admin to cancel a pending estimator change proposal.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Proposal Cancellation**: Resets `estimatorAddress.proposal = address(0)`
3. **Time Lock Reset**: Resets `estimatorAddress.timeToAccept = 0`

---

### acceptNewEstimator

**Function Type**: `external`  
**Function Signature**: `acceptNewEstimator()`  

Allows the admin to confirm the new estimator address after the waiting period.

#### Workflow

1. **Admin Verification**: Validates caller has admin privileges using `onlyOwner` modifier
2. **Time Lock Validation**: Confirms `estimatorAddress.timeToAccept <= block.timestamp`
3. **Contract Update**: Updates `estimatorAddress.actual = estimatorAddress.proposal`
4. **Instance Update**: Updates `estimator = IEstimator(estimatorAddress.actual)`
5. **Cleanup**: Resets `estimatorAddress.proposal = address(0)` and `estimatorAddress.timeToAccept = 0`

---

## Data Structures

### AddressTypeProposal

```solidity
struct AddressTypeProposal {
    address actual;      // Current active address
    address proposal;    // Proposed new address
    uint256 timeToAccept; // Timestamp when proposal can be accepted
}
```

Used for managing: `admin`, `goldenFisher`, `estimatorAddress`

### UintTypeProposal

```solidity
struct UintTypeProposal {
    uint256 actual;      // Current active value
    uint256 proposal;    // Proposed new value
    uint256 timeToAccept; // Timestamp when proposal can be accepted
}
```

Used for managing: `secondsToUnlockStaking`, `secondsToUnllockFullUnstaking`

### BoolTypeProposal

```solidity
struct BoolTypeProposal {
    bool flag;           // Current boolean state
    uint256 timeToAccept; // Timestamp when flag change can be executed
}
```

Used for managing: `allowPresaleStaking`, `allowPublicStaking`

### presaleStakerMetadata

```solidity
struct presaleStakerMetadata {
    bool isAllow;        // Whether address can participate in presale staking
    uint256 stakingAmount; // Current staking tokens staked (max 2 for presale)
}
```

Used for tracking presale staker status and limits.

---

## makeCaPay


**Function Type**: `internal`

The `makeCaPay` function provides a streamlined interface for contract-to-contract payment operations through the EVVM contract's `caPay` function.

## Parameters

| Parameter      | Type    | Description                                     |
| -------------- | ------- | ----------------------------------------------- |
| `tokenAddress` | address | Address of the token contract to be transferred |
| `user`         | address | Recipient address for the payment               |
| `amount`       | uint256 | Amount of tokens to transfer                    |

## Workflow

1. **Direct Payment Execution**: Calls the EVVM contract's `caPay` function with the provided parameters in the order: user, tokenAddress, amount

## Description

This internal function serves as a simple wrapper around the EVVM contract's `caPay` function, providing a consistent interface for contract-to-contract token transfers. It is commonly used for:

- Priority fee distributions to transaction executors
- Reward distributions to stakers
- Token withdrawals during unstaking operations
- Service fee payments

This function uses the EVVM contract's direct payment mechanism, which does not require signatures since it's executed directly by the staking contract itself.

---

## makePay


**Function Type**: `internal`

The `makePay` function facilitates payment processing through the EVVM contract, directing transactions to either synchronous or asynchronous processing paths based on specified parameters.

## Parameters

| Parameter      | Type    | Description                                          |
| -------------- | ------- | ---------------------------------------------------- |
| `user`         | address | User address for the payment transaction             |
| `amount`       | uint256 | Amount of tokens involved in the transaction         |
| `priorityFee`  | uint256 | EVVM priority fee for transaction processing         |
| `priorityFlag` | bool    | EVVM execution mode (`true` = async, `false` = sync) |
| `nonce`        | uint256 | EVVM payment operation nonce for replay protection   |
| `signature`    | bytes   | EVVM payment authorization signature                 |

## Workflow

1. **Payment Processing**: Uses the unified `pay` function for both synchronous and asynchronous processing
2. **Payment Execution**: Forwards parameters to the EVVM contract's `pay` function for payment processing and automatic staker detection
   - The `pay` function receives: user address, contract address, empty string, PRINCIPAL_TOKEN_ADDRESS, amount, priorityFee, nonce, priorityFlag, contract address, and signature

## Description

This internal function serves as a standardized interface for EVVM payment operations, utilizing the unified `pay` function which automatically handles staker detection and reward distribution. It simplifies the interface between the staking contract and the EVVM payment system.

The EVVM payment signature follows the [Single Payment Signature Structure](../../../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md).

---

## Getter Functions(02-StakingContract)


> **Note: Implementation Note**
View functions remain fully backward compatible for querying staking state, user history, and contract configuration. They do not use signature verification.

This section details all available getter functions in the contract, providing comprehensive information about the contract's state and configuration.

---

## Contract State Retrieval Functions

### getAddressHistory

**Function Type**: `view`  
**Function Signature**: `getAddressHistory(address _account)`

Retrieves the complete transaction history for a specified user address.

#### Input Parameters

| Parameter  | Type    | Description                                   |
| ---------- | ------- | --------------------------------------------- |
| `_account` | address | Address of the user to retrieve history for   |

#### Return Value

Returns an array of `HistoryMetadata` structs containing the user's transaction history:

```solidity
struct HistoryMetadata {
    bytes32 transactionType;  // 0x01 for staking, 0x02 for unstaking
    uint256 amount;            // Amount of staking tokens staked/unstaked
    uint256 timestamp;         // Transaction timestamp
    uint256 totalStaked;       // User's total staked tokens after transaction
}
```

---

### getSizeOfAddressHistory

**Function Type**: `view`  
**Function Signature**: `getSizeOfAddressHistory(address _account)`

Returns the total number of transactions in a user's history.

#### Input Parameters

| Parameter  | Type    | Description                                          |
| ---------- | ------- | ---------------------------------------------------- |
| `_account` | address | Address of the user to query                         |

#### Return Value

| Type    | Description                                    |
| ------- | ---------------------------------------------- |
| uint256 | Number of transactions in user's history       |

---

### getAddressHistoryByIndex

**Function Type**: `view`  
**Function Signature**: `getAddressHistoryByIndex(address _account, uint256 _index)`

Retrieves a specific transaction from a user's history based on its index.

#### Input Parameters

| Parameter  | Type    | Description                                   |
| ---------- | ------- | --------------------------------------------- |
| `_account` | address | Address of the user to query                  |
| `_index`   | uint256 | Index of the transaction to retrieve          |

#### Return Value

Returns a single `HistoryMetadata` struct:

```solidity
struct HistoryMetadata {
    bytes32 transactionType;  // 0x01 for staking, 0x02 for unstaking
    uint256 amount;            // Amount of staking tokens staked/unstaked
    uint256 timestamp;         // Transaction timestamp
    uint256 totalStaked;       // User's total staked tokens after transaction
}
```

---

## Price and Token Functions

### priceOfStaking

**Function Type**: `view`  
**Function Signature**: `priceOfStaking()`

Calculates the current exchange rate between staking tokens and MATE tokens.

#### Return Value

| Type    | Description                             |
| ------- | --------------------------------------- |
| uint256 | Current exchange rate (staking tokens to MATE)   |

---

## User Time Lock Functions

### getTimeToUserUnlockFullUnstakingTime

**Function Type**: `view`  
**Function Signature**: `getTimeToUserUnlockFullUnstakingTime(address _account)`

Calculates when a user can perform full unstaking (withdraw all tokens) based on their transaction history. Full unstaking requires waiting after the last time their balance reached 0.

#### Input Parameters

| Parameter  | Type    | Description                                |
| ---------- | ------- | ------------------------------------------ |
| `_account` | address | Address of the user to query               |

#### Return Value

| Type    | Description                                         |
| ------- | --------------------------------------------------- |
| uint256 | Timestamp when user can perform full unstaking      |

#### Execution Flow

1. **Backward History Search**: Iterates through user's history from most recent to oldest transaction
2. **Zero Balance Detection**: Searches for the last transaction where `totalStaked == 0`
3. **Cooldown Calculation**: If found, returns `timestamp + secondsToUnlockFullUnstaking.actual`
4. **Fallback Logic**: If no zero balance found in history, uses first transaction timestamp `userHistory[_account][0].timestamp + secondsToUnlockFullUnstaking.actual`

---

### getTimeToUserUnlockStakingTime

**Function Type**: `view`  
**Function Signature**: `getTimeToUserUnlockStakingTime(address _account)`

Calculates when a user becomes eligible to stake again after their last full unstaking. Users must wait a configurable period after their balance reaches zero.

#### Input Parameters

| Parameter  | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| `_account` | address | Address of the user to query              |

#### Return Value

| Type    | Description                                      |
| ------- | ------------------------------------------------ |
| uint256 | Timestamp when user can stake again (0 if already allowed) |

#### Execution Flow

1. **History Check**: If no history exists (`length == 0`), returns `0` (user can stake immediately)
2. **Recent Transaction Analysis**: Examines the most recent transaction in user's history
3. **Zero Balance Cooldown**: If last transaction resulted in `totalStaked == 0`, returns `timestamp + secondsToUnlockStaking.actual`
4. **No Cooldown**: If current balance > 0, returns `0` (user can stake immediately)

---

## System Configuration Functions

### getSecondsToUnlockFullUnstaking

**Function Type**: `view`  
**Function Signature**: `getSecondsToUnlockFullUnstaking()`

Retrieves the current full unstaking unlock period in seconds.

#### Return Value

| Type    | Description                                    |
| ------- | ---------------------------------------------- |
| uint256 | Current full unstaking time lock period        |

---

### getSecondsToUnlockStaking

**Function Type**: `view`  
**Function Signature**: `getSecondsToUnlockStaking()`

Retrieves the current staking unlock period in seconds.

#### Return Value

| Type    | Description                                |
| ------- | ------------------------------------------ |
| uint256 | Current staking time lock period           |

---

## User Asset Functions

### getUserAmountStaked

**Function Type**: `view`  
**Function Signature**: `getUserAmountStaked(address _account)`

Retrieves the total amount of staking tokens currently staked by a user.

#### Input Parameters

| Parameter  | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| `_account` | address | Address of the user to query              |

#### Return Value

| Type    | Description                                |
| ------- | ------------------------------------------ |
| uint256 | Total amount of staking tokens staked by the user   |

---

## Contract Reference Functions

### getGoldenFisher

**Function Type**: `view`  
**Function Signature**: `getGoldenFisher()`

Retrieves the address of the Golden Fisher contract.

#### Return Value

| Type    | Description                               |
| ------- | ----------------------------------------- |
| address | Address of the Golden Fisher contract     |

---

### getGoldenFisherProposal

**Function Type**: `view`  
**Function Signature**: `getGoldenFisherProposal()`

Retrieves the address of the Golden Fisher contract proposal.

#### Return Value

| Type    | Description                                      |
| ------- | ------------------------------------------------ |
| address | Address of the Golden Fisher contract proposal   |

---

### getEstimatorAddress

**Function Type**: `view`  
**Function Signature**: `getEstimatorAddress()`

Retrieves the address of the current Estimator contract.

#### Return Value

| Type    | Description                               |
| ------- | ----------------------------------------- |
| address | Address of the current Estimator contract |

---

### getEstimatorProposal

**Function Type**: `view`  
**Function Signature**: `getEstimatorProposal()`

Retrieves the address of the proposed new Estimator contract.

#### Return Value

| Type    | Description                                      |
| ------- | ------------------------------------------------ |
| address | Address of the proposed Estimator contract (zero address if none) |

---

### getEvvmAddress

**Function Type**: `view`  
**Function Signature**: `getEvvmAddress()`

Retrieves the address of the EVVM contract.

#### Return Value

| Type    | Description                               |
| ------- | ----------------------------------------- |
| address | Address of the EVVM contract              |

---

### getMateAddress

**Function Type**: `view`  
**Function Signature**: `getMateAddress()`

Retrieves the address of the staking token contract.

#### Return Value

| Type    | Description                                |
| ------- | ------------------------------------------ |
| address | Address of the staking token contract        |

---

### getOwner

**Function Type**: `view`  
**Function Signature**: `getOwner()`

Retrieves the address of the contract owner.

#### Return Value

| Type    | Description                               |
| ------- | ----------------------------------------- |
| address | Address of the contract owner             |

---

## Presale Staker Information

### getPresaleStaker

**Function Type**: `view`  
**Function Signature**: `getPresaleStaker(address _account)`

Determines if a user is a presale staker and retrieves their staked amount.

#### Input Parameters

| Parameter  | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| `_account` | address | Address of the user to query              |

#### Return Value

| Type    | Description                                              |
| ------- | -------------------------------------------------------- |
| bool    | `true` if user is a presale staker, `false` otherwise    |
| uint256 | Amount of staking tokens staked by the user during presale        |

---

### getPresaleStakerCount

**Function Type**: `view`  
**Function Signature**: `getPresaleStakerCount()`

Retrieves the total number of presale stakers in the contract.

#### Return Value

| Type    | Description                                |
| ------- | ------------------------------------------ |
| uint256 | Number of presale stakers in the contract  |

---

## Contract Status Functions

### getAllowPublicStaking

**Function Type**: `view`  
**Function Signature**: `getAllowPublicStaking()`

Retrieves the complete public staking configuration and status including the current flag state and any pending changes.

#### Return Value

| Type             | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| BoolTypeProposal | Complete public staking configuration with flag and pending change timestamp |

The struct contains the following fields:

```solidity
struct BoolTypeProposal {
    bool flag;           // Current value of the allowPublicStaking variable
    uint256 timeToAccept; // Timestamp when the change should be accepted
}
```

---

### getAllowPresaleStaking

**Function Type**: `view`  
**Function Signature**: `getAllowPresaleStaking()`

Retrieves the complete presale staking configuration and status including the current flag state and any pending changes.

#### Return Value

| Type             | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| BoolTypeProposal | Complete presale staking configuration with flag and pending change timestamp |

The struct contains the following fields:

```solidity
struct BoolTypeProposal {
    bool flag;           // Current value of the allowPresaleStaking variable
    uint256 timeToAccept; // Timestamp when the change should be accepted
}
```

---

## EVVM Integration Functions

### getEvvmID

**Function Type**: `view`  
**Function Signature**: `getEvvmID()`

Retrieves the unique identifier for the EVVM instance this staking contract is connected to.

#### Return Value

| Type    | Description                                    |
| ------- | ---------------------------------------------- |
| uint256 | Unique EVVM identifier used in signature verification |

---

### getEvvmAddress

**Function Type**: `view`  
**Function Signature**: `getEvvmAddress()`

Retrieves the address of the EVVM core contract.

#### Return Value

| Type    | Description                               |
| ------- | ----------------------------------------- |
| address | Address of the EVVM contract              |

---

### getMateAddress

**Function Type**: `view`  
**Function Signature**: `getMateAddress()`

Retrieves the address representing the Principal Token (MATE) in the EVVM system.

#### Return Value

| Type    | Description                                    |
| ------- | ---------------------------------------------- |
| address | Address representing the Principal Token       |

---

### getOwner

**Function Type**: `view`  
**Function Signature**: `getOwner()`

Retrieves the address of the current contract admin/owner.

#### Return Value

| Type    | Description                               |
| ------- | ----------------------------------------- |
| address | Address of the contract admin             |

---

## History and Time Lock System


The staking contract maintains a comprehensive history system and implements time-based restrictions to ensure fair and secure staking operations. This system prevents rapid staking/unstaking cycles and provides complete transaction traceability.

## HistoryMetadata Structure

Every staking and unstaking operation is recorded in the user's history using the `HistoryMetadata` struct:

```solidity
struct HistoryMetadata {
    bytes32 transactionType;  // Transaction identifier
    uint256 amount;           // Amount of staking tokens involved
    uint256 timestamp;        // When the transaction occurred
    uint256 totalStaked;      // User's total staked balance after transaction
}
```

### Transaction Types

The `transactionType` field identifies the operation performed:

| Value | Type | Description |
|-------|------|-------------|
| `bytes32(uint256(1))` | **Staking** | Tokens added to user's stake |
| `bytes32(uint256(2))` | **Unstaking** | Tokens removed from user's stake |

### Record Details

Each history entry captures:

- **`amount`**: Specific tokens staked/unstaked in this transaction
- **`timestamp`**: Exact time when the operation occurred (block.timestamp)
- **`totalStaked`**: User's cumulative staked balance after this transaction

## Time Lock Mechanisms

The contract enforces two types of cooldown periods to maintain system stability and prevent abuse:

### Re-Staking Cooldown

**Purpose**: Prevents immediate re-staking after complete unstaking

- **Trigger**: Activated when user's `totalStaked` reaches `0` (complete unstaking)
- **Duration**: Configurable via `secondsToUnlockStaking.actual`
- **Logic**: User must wait before staking again after their balance reached zero
- **Function**: `getTimeToUserUnlockStakingTime()`

### Full Unstaking Cooldown

**Purpose**: Prevents frequent complete withdrawals

- **Trigger**: Based on the last time user's `totalStaked` was `0`
- **Duration**: Configurable via `secondsToUnllockFullUnstaking.actual` (default: 5 days)
- **Logic**: User must wait before performing complete unstaking
- **Function**: `getTimeToUserUnlockFullUnstakingTime()`

## Cooldown Calculation Logic

### Re-Staking Time Calculation

**Function**: `getTimeToUserUnlockStakingTime(address _account)`

```solidity
function getTimeToUserUnlockStakingTime(address _account) public view returns (uint256) {
    uint256 lengthOfHistory = userHistory[_account].length;
    
    if (lengthOfHistory == 0) {
        return 0; // No history = can stake immediately
    }
    
    if (userHistory[_account][lengthOfHistory - 1].totalStaked == 0) {
        return userHistory[_account][lengthOfHistory - 1].timestamp + 
               secondsToUnlockStaking.actual;
    } else {
        return 0; // Current balance > 0 = no cooldown
    }
}
```

**Logic Flow**:
1. **No History**: User can stake immediately (`return 0`)
2. **Last Transaction Check**: Examines most recent transaction
3. **Zero Balance Cooldown**: If `totalStaked == 0`, apply cooldown
4. **Already Allowed**: If current balance > 0, no cooldown (`return 0`)

### Full Unstaking Time Calculation

**Function**: `getTimeToUserUnlockFullUnstakingTime(address _account)`

```solidity
function getTimeToUserUnlockFullUnstakingTime(address _account) public view returns (uint256) {
    for (uint256 i = userHistory[_account].length; i > 0; i--) {
        if (userHistory[_account][i - 1].totalStaked == 0) {
            return userHistory[_account][i - 1].timestamp + 
                   secondsToUnlockFullUnstaking.actual;
        }
    }
    
    return userHistory[_account][0].timestamp + 
           secondsToUnlockFullUnstaking.actual;
}
```

**Logic Flow**:
1. **Backward History Search**: Iterates from most recent to oldest transaction
2. **Zero Balance Detection**: Finds last time `totalStaked == 0`
3. **Cooldown Applied**: `lastZeroTimestamp + secondsToUnlockFullUnstaking.actual`
4. **Fallback**: If no zero balance found, uses first transaction timestamp

## Practical Examples

### Example 1: First-Time User

```solidity
// User stakes for the first time
History: []
getTimeToUserUnlockStakingTime() → 0 (can stake immediately)
getTimeToUserUnlockFullUnstakingTime() → 0 (no history)

// After staking 5 tokens
History: [
    {
        transactionType: bytes32(uint256(1)),
        amount: 5,
        timestamp: 1625097600,
        totalStaked: 5
    }
]
```

### Example 2: Complete Unstaking Cycle

```solidity
// User completely unstakes (totalStaked becomes 0)
History: [
    {
        transactionType: bytes32(uint256(2)),
        amount: 5,
        timestamp: 1625184000,
        totalStaked: 0  // ← This triggers cooldowns
    }
]

getTimeToUserUnlockStakingTime() → 1625184000 + secondsToUnlockStaking.actual
getTimeToUserUnlockFullUnstakingTime() → 1625184000 + secondsToUnlockFullUnstaking.actual
```

### Example 3: Partial Unstaking

```solidity
// User partially unstakes (totalStaked > 0)
History: [
    {
        transactionType: bytes32(uint256(2)),
        amount: 2,
        timestamp: 1625270400,
        totalStaked: 3  // ← Still has stake, no cooldown
    }
]

getTimeToUserUnlockStakingTime() → 0 (can stake immediately)
getTimeToUserUnlockFullUnstakingTime() → searches for last totalStaked == 0
```

## Integration with Staking Functions

### stakingBaseProcess Integration

The history system is automatically updated in `stakingBaseProcess`:

```solidity
// History entry creation for both staking and unstaking
userHistory[stakingAccount].push(
    HistoryMetadata({
        transactionType: isStaking ? bytes32(uint256(1)) : bytes32(uint256(2)),
        amount: amountOfStaking,
        timestamp: block.timestamp,
        totalStaked: auxSMsteBalance
    })
);
```

### Cooldown Validation

Before allowing operations, functions check time locks:

```solidity
// Staking cooldown check
if (getTimeToUserUnlockStakingTime(stakingAccount) > block.timestamp) {
    revert ErrorsLib.AddressMustWaitToStakeAgain();
}

// Full unstaking cooldown check  
if (getTimeToUserUnlockFullUnstakingTime(stakingAccount) > block.timestamp) {
    revert ErrorsLib.AddressMustWaitToFullUnstake();
}
```

## Administrative Configuration

Both time lock periods (`secondsToUnlockStaking.actual` and `secondsToUnlockFullUnstaking.actual`) are configurable by the contract administrator through a secure proposal system.

For detailed information about configuring these time lock periods, including the proposal system, time delays, and all available administrative functions, see [Administrative Functions](./03-AdminFunctions.md).

---

## notifyNewEpoch


**Function Type**: `external`  
**Access Control**: `onlyActivator`  
**Function Signature**: `notifyNewEpoch(address,uint256,uint256,uint256)`

Initializes a new reward distribution epoch by setting the epoch metadata. This function is called by the activator to establish the parameters for reward calculations during a specific time period.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenPool` | address | Address of the token pool contract containing rewards |
| `totalPool` | uint256 | Total amount of tokens available for distribution in this epoch |
| `totalStaked` | uint256 | Total amount of tokens staked across all users at epoch start |
| `tStart` | uint256 | Timestamp when the epoch begins |

## Functionality

### Epoch Initialization
The function creates a new `EpochMetadata` struct with:
- **Token Pool**: Sets the reward pool contract address
- **Total Pool**: Establishes the total reward amount available
- **Total Staked**: Records the aggregate staked amount for proportional calculations
- **Time Final**: Automatically sets to current block timestamp (`block.timestamp`)
- **Time Start**: Uses the provided start timestamp parameter

### Access Control
- **Activator Only**: Function restricted to the activator address
- **Administrative Control**: Prevents unauthorized epoch manipulation

## Usage Context

This function is typically called:
1. **Epoch Transitions**: When starting a new reward distribution period
2. **Pool Updates**: When reward pools are refreshed or modified  
3. **Staking Adjustments**: After significant changes in total staked amounts

## State Changes

- **Epoch Metadata**: Completely overwrites the current epoch data
- **Reward Pool**: Establishes the available reward pool for calculations
- **Time Boundaries**: Sets the temporal boundaries for reward calculations

## Integration

### With Staking Contract
- Coordinates with staking contract for total staked amounts
- Ensures reward calculations align with actual staking data

### With Reward Distribution
- Provides the foundation for `makeEstimation` function calculations
- Establishes the parameters needed for proportional reward distribution


The epoch end time (`tFinal`) is automatically set to the current block timestamp when this function is called, creating a time window from `tStart` to `tFinal` for reward calculations.


## Example Workflow

1. **Activator calls `notifyNewEpoch`** with new epoch parameters
2. **Epoch metadata is updated** with current timestamp as end time
3. **Reward calculations** can now be performed using `makeEstimation`
4. **Users receive rewards** proportional to their staking participation during the epoch

---

## makeEstimation


**Function Type**: `external`  
**Access Control**: `onlyStaking`  
**Function Signature**: `makeEstimation(address)`  
**Returns**: `(bytes32,address,uint256,uint256,uint256)`

Calculates and distributes epoch-based staking rewards for a specific user based on their staking history and participation during the epoch period. This function implements a time-weighted average staking calculation to ensure fair reward distribution.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `_user` | address | Address of the user for whom to calculate rewards |

## Return Values

| Return | Type | Description |
|--------|------|-------------|
| `epochAnswer` | bytes32 | Epoch identifier (returns 0 if already processed) |
| `tokenAddress` | address | Address of the reward token pool |
| `amountTotalToBeRewarded` | uint256 | Total reward amount calculated for the user |
| `idToOverwrite` | uint256 | Index in user's history to overwrite with epoch data |
| `timestampToOverwrite` | uint256 | Timestamp to record in the overwritten history entry |

## Functionality

### Time-Weighted Average Calculation

The function implements the following formula for fair reward distribution:

$$
averageSm = \frac{\sum_{i=1}^{n} [(t_i - t_{i-1}) \times S_{i-1}] \times 10^{18}}{t_{Final} - t_{Start}}
$$

Where:
- `ti` = timestamp of current iteration
- `ti-1` = timestamp of previous iteration  
- `Si-1` = staked amount at previous timestamp
- `tFinal` = epoch end time
- `tStart` = epoch start time

### Reward Calculation Process

1. **History Analysis**: Iterates through user's staking history within the epoch period
2. **Time-Weighted Calculation**: Calculates the weighted average of staked amounts over time
3. **Proportional Distribution**: Applies the user's proportion of total staked amounts
4. **Pool Adjustment**: Updates epoch pool to reflect distributed rewards

### Edge Cases Handled

#### Already Processed Users
```solidity
if (h.transactionType == epochId) return (0, address(0), 0, 0, 0);
```
Returns zero values if user has already received rewards for this epoch.

#### Single History Entry
```solidity
if (size == 1) totSmLast = h.totalStaked;
```
Handles users with only one staking transaction in their history.

#### Future Timestamps
```solidity
if (h.timestamp > epoch.tFinal) {
    if (totSmLast > 0) sumSmT += (epoch.tFinal - tLast) * totSmLast;
    // Process remaining calculations...
}
```
Properly handles history entries that extend beyond the epoch end time.

## State Changes

### Epoch Pool Updates
- **Total Pool**: Reduces by the amount rewarded to the user
- **Total Staked**: Decreases by the user's final staked amount
- **Remaining Rewards**: Available for subsequent user reward calculations

## Access Control

- **Staking Contract Only**: Function can only be called by the registered staking contract
- **Authorization Protection**: Prevents unauthorized reward calculations and manipulations

## Integration Points

### With Staking Contract
- **History Access**: Reads user staking history from the staking contract
- **Reward Processing**: Coordinated reward distribution with staking operations
- **Data Consistency**: Ensures reward calculations match actual staking data

### With Epoch Management
- **Epoch Boundaries**: Uses epoch metadata for time-based calculations
- **Pool Management**: Manages reward pool depletion and allocation

## Mathematical Precision

### Scaling Factor
Uses `1e18` scaling factor to maintain precision in:
- Time-weighted average calculations
- Proportional reward distributions
- Final reward amount determinations

### Calculation Accuracy
The time-weighted approach ensures:
- **Fair Distribution**: Rewards proportional to actual staking participation
- **Time Consideration**: Longer staking periods receive proportionally higher rewards
- **Accurate Accounting**: Precise tracking of staking contributions over time

## Example Workflow

1. **Staking contract calls `makeEstimation`** for a user
2. **Function retrieves user's staking history** within epoch period  
3. **Time-weighted average is calculated** based on staking duration and amounts
4. **Proportional reward is determined** from the available epoch pool
5. **Epoch pool is updated** to reflect the distributed reward
6. **Return values provide** reward amount and history update information

---

## Admin Functions(03-Estimator)


The Estimator contract implements a comprehensive administrative governance system with time-delayed proposals for all critical address updates. This system ensures security through a 24-hour delay period for all administrative changes.

## Governance Architecture

### Time-Delayed Proposal System
All administrative functions follow a secure three-step process:
1. **Proposal Creation**: Admin proposes a new address with 24-hour delay
2. **Waiting Period**: 24-hour security delay before acceptance
3. **Proposal Execution**: Anyone can execute the proposal after the delay period

### Managed Addresses
The system manages four critical contract addresses:
- **Activator**: Controls epoch notifications and system activation
- **EVVM Address**: Core EVVM contract for payment processing
- **Staking Address**: Staking contract for user data access
- **Admin**: Primary administrative control address

## Activator Address Management

### `setActivatorProposal`
**Access Control**: `onlyActivator`  
**Function Signature**: `setActivatorProposal(address)`

Creates a proposal to change the activator address.

**Parameters:**
- `_proposal` (address): New proposed activator address

**Process:**
1. Sets the proposed activator address
2. Establishes acceptance time as current timestamp + 24 hours
3. Requires current activator authorization

### `cancelActivatorProposal`
**Access Control**: `onlyActivator`  
**Function Signature**: `cancelActivatorProposal()`

Cancels any pending activator address proposal.

**Process:**
1. Resets proposal address to zero address
2. Resets acceptance time to zero
3. Prevents unauthorized address changes

### `acceptActivatorProposal`
**Access Control**: `public`  
**Function Signature**: `acceptActivatorProposal()`

Executes the activator address change after the delay period.

**Requirements:**
- Current timestamp must exceed the acceptance time
- Valid proposal must exist

**Process:**
1. Verifies delay period has elapsed
2. Updates actual activator address to proposed address
3. Clears proposal data

## EVVM Address Management

### `setEvvmAddressProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `setEvvmAddressProposal(address)`

Creates a proposal to update the EVVM contract address.

**Parameters:**
- `_proposal` (address): New proposed EVVM contract address

### `cancelEvvmAddressProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `cancelEvvmAddressProposal()`

Cancels any pending EVVM address proposal.

### `acceptEvvmAddressProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `acceptEvvmAddressProposal()`

Executes the EVVM address change after verification of the delay period.

## Staking Address Management

### `setAddressStakingProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `setAddressStakingProposal(address)`

Creates a proposal to update the staking contract address.

**Parameters:**
- `_proposal` (address): New proposed staking contract address

### `cancelAddressStakingProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `cancelAddressStakingProposal()`

Cancels any pending staking address proposal.

### `acceptAddressStakingProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `acceptAddressStakingProposal()`

Executes the staking address change after the required delay period.

## Admin Address Management

### `setAdminProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `setAdminProposal(address)`

Creates a proposal to transfer administrative control to a new address.

**Parameters:**
- `_proposal` (address): New proposed admin address

### `cancelAdminProposal`
**Access Control**: `onlyAdmin`  
**Function Signature**: `cancelAdminProposal()`

Cancels any pending admin address proposal.

### `acceptAdminProposal`
**Access Control**: `public`  
**Function Signature**: `acceptAdminProposal()`

Executes the admin address transfer after the delay period.

**Note:** This function is publicly callable to ensure admin transfer can occur even if the current admin becomes unavailable.

## Security Features

### Time-Lock Protection
- **24-Hour Delay**: All address changes require a 24-hour waiting period
- **Proposal Visibility**: All proposals are publicly visible during the waiting period
- **Emergency Cancellation**: Current authorized addresses can cancel proposals

### Access Control Patterns
- **Role-Based Permissions**: Each function has specific role requirements
- **Separation of Concerns**: Different roles for different administrative functions
- **Public Execution**: Some acceptance functions are public to prevent admin lockout

### Proposal Structure
Each address proposal includes:
```solidity
struct AddressTypeProposal {
    address actual;      // Current active address
    address proposal;    // Proposed new address  
    uint256 timeToAccept; // Timestamp when proposal can be executed
}
```

## Integration Points

### With Core Contracts
- **Staking Contract**: Maintains connection for user data access
- **EVVM Contract**: Coordinates payment processing integration
- **Activator System**: Controls epoch and system activation functions

### With Governance
- **Decentralized Control**: Time delays provide community oversight opportunity
- **Emergency Response**: Cancellation functions provide emergency controls
- **Transparent Process**: All proposals are publicly visible and verifiable

## Usage Workflows

### Standard Address Update
1. **Proposal Creation**: Authorized address creates proposal
2. **Community Review**: 24-hour period for community oversight
3. **Proposal Execution**: Anyone executes proposal after delay
4. **System Update**: Contract begins using new address

### Emergency Cancellation
1. **Threat Detection**: Unauthorized or malicious proposal detected
2. **Immediate Cancellation**: Authorized address cancels proposal
3. **System Protection**: Prevents unauthorized address changes


All administrative functions include time delays for security. Plan address updates in advance to accommodate the 24-hour waiting period.



The public nature of acceptance functions ensures that administrative changes can be completed even if the current admin becomes unavailable, preventing system lockout scenarios.


---

## simulteEstimation


**Function Type**: `external view`  
**Access Control**: `public`  
**Function Signature**: `simulteEstimation(address)`  
**Returns**: `(bytes32,address,uint256,uint256,uint256)`

View function that allows previewing potential epoch rewards for a specific user without executing any state changes. This enables users and interfaces to display estimated rewards before initiating the actual claim process.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `_user` | address | Address of the user to simulate rewards for |

## Return Values

| Return | Type | Description |
|--------|------|-------------|
| `epochAnswer` | bytes32 | Epoch identifier that would be recorded (returns 0 if already processed) |
| `tokenAddress` | address | Address of the reward token |
| `amountTotalToBeRewarded` | uint256 | Calculated reward amount the user would receive |
| `idToOverwrite` | uint256 | Index in user's history that would be updated |
| `timestampToOverwrite` | uint256 | Timestamp that would be recorded in the history |

## Functionality

### Reward Preview Calculation

The function mirrors the logic of `makeEstimation` but operates as a read-only view:

1. **History Iteration**: Reads through the user's staking history within the current epoch period
2. **Time-Weighted Average**: Calculates the weighted average of staked amounts over time
3. **Reward Estimation**: Computes proportional rewards based on the user's participation

### Time-Weighted Average Formula

The same formula used in `makeEstimation`:

$$
averageSm = \frac{\sum_{i=1}^{n} [(t_i - t_{i-1}) \times S_{i-1}] \times 10^{18}}{t_{Final} - t_{Start}}
$$

Where:
- `ti` = timestamp of current iteration
- `ti-1` = timestamp of previous iteration  
- `Si-1` = staked amount at previous timestamp
- `tFinal` = epoch end time
- `tStart` = epoch start time

### Edge Cases

#### Already Claimed Rewards
```solidity
if (h.transactionType == epochId) return (0, address(0), 0, 0, 0);
```
Returns zero values if the user has already claimed rewards for the current epoch.

#### Single History Entry
```solidity
if (size == 1) totSmLast = h.totalStaked;
```
Properly handles users with only one transaction in their staking history.

## Use Cases

### Frontend Integration
- **Reward Display**: Show users their estimated rewards before claiming
- **UI/UX Enhancement**: Provide real-time reward estimations
- **Decision Support**: Help users decide when to claim rewards

### Pre-Transaction Validation
- **Claim Verification**: Check if claiming would be worthwhile before paying gas
- **Already Claimed Detection**: Verify if rewards haven't been claimed yet

## Comparison with makeEstimation

| Aspect | simulteEstimation | makeEstimation |
|--------|-------------------|----------------|
| **Type** | view | external |
| **Access** | public | onlyStaking |
| **State Changes** | None | Updates epoch pool |
| **Purpose** | Preview | Execute |
| **Gas Cost** | Free (view) | Transaction gas |

---

## Getters

# Getter Functions

The Estimator contract provides several view functions to retrieve epoch information and administrative proposal metadata.

## Epoch Getters

### `getEpochMetadata`

**Function Signature**: `getEpochMetadata()`  
**Returns**: `EpochMetadata memory`

Returns the complete epoch metadata structure containing all current epoch information.

**Return Structure:**
```solidity
struct EpochMetadata {
    address tokenPool;   // Token address for rewards
    uint256 totalPool;   // Total reward pool amount
    uint256 totalStaked; // Total staked amount in epoch
    uint256 tStart;      // Epoch start timestamp
    uint256 tFinal;      // Epoch end timestamp
}
```

---

### `getActualEpochInUint`

**Function Signature**: `getActualEpochInUint()`  
**Returns**: `uint256`

Returns the current epoch identifier as an unsigned integer.

---

### `getActualEpochInFormat`

**Function Signature**: `getActualEpochInFormat()`  
**Returns**: `bytes32`

Returns the current epoch identifier in bytes32 format, which is the format used for history tracking and verification.

---

## Administrative Metadata Getters

All administrative getters return a `ProposalMetadata` structure:

```solidity
struct ProposalMetadata {
    address actual;       // Current active address
    address proposal;     // Proposed new address
    uint256 acceptedTime; // Timestamp when proposal can be accepted
}
```

---

### `getActivatorMetadata`

**Function Signature**: `getActivatorMetadata()`  
**Returns**: `ProposalMetadata memory`

Returns the activator address metadata, including the current activator, any pending proposal, and the acceptance timestamp.

---

### `getEvvmAddressMetadata`

**Function Signature**: `getEvvmAddressMetadata()`  
**Returns**: `ProposalMetadata memory`

Returns the EVVM contract address metadata, including the current address, any pending proposal, and the acceptance timestamp.

---

### `getAddressStakingMetadata`

**Function Signature**: `getAddressStakingMetadata()`  
**Returns**: `ProposalMetadata memory`

Returns the Staking contract address metadata, including the current address, any pending proposal, and the acceptance timestamp.

---

### `getAdminMetadata`

**Function Signature**: `getAdminMetadata()`  
**Returns**: `ProposalMetadata memory`

Returns the admin address metadata, including the current admin, any pending proposal, and the acceptance timestamp.

---

## Usage Examples

### Checking Epoch Status

```javascript
const epochData = await estimator.getEpochMetadata();
console.log("Epoch Start:", epochData.tStart);
console.log("Epoch End:", epochData.tFinal);
console.log("Total Pool:", epochData.totalPool);
```

### Verifying Pending Proposals

```javascript
const adminMeta = await estimator.getAdminMetadata();
if (adminMeta.proposal !== ethers.ZeroAddress) {
    console.log("Pending admin change to:", adminMeta.proposal);
    console.log("Can accept after:", new Date(adminMeta.acceptedTime * 1000));
}
```

---

## Treasury System Overview


The Treasury system enables secure asset movement between external blockchains and the EVVM ecosystem. It provides validated mechanisms for users to deposit assets into EVVM and withdraw them back to their preferred blockchain environments.

## Two Treasury Solutions

EVVM offers two treasury architectures for different deployment scenarios:

### Simple Treasury
Single-chain solution for when EVVM operates on the same blockchain as user assets.

**Best for:**
- Same-chain operations
- Lower complexity
- Cost efficiency
- Direct integration

### Crosschain Treasury
Multi-chain solution enabling asset transfers across different blockchains.

**Best for:**
- Cross-chain operations
- Multiple blockchain support
- Advanced features like fisher bridge
- Interoperability protocols (Hyperlane, LayerZero, Axelar)

## Core Functions

Both systems provide:
- **Asset Deposits**: Native coins and ERC20 tokens
- **Asset Withdrawals**: Secure balance verification
- **EVVM Integration**: Direct balance management
- **Security Protection**: Principal token withdrawal prevention

## Available Documentation

- **[Simple Treasury](./01-TreasurySimple/01-Overview.md)**: Single-chain treasury operations
- **[Crosschain Treasury](./02-TreasuryCrosschain/01-Overview.md)**: Multi-chain treasury system

## Choosing Your Treasury

| Need | Simple Treasury | Crosschain Treasury |
|------|----------------|-------------------|
| Same-chain only | ✅ | ❌ |
| Multi-chain support | ❌ | ✅ |
| Lower gas costs | ✅ | ⚖️ |
| Advanced features | ❌ | ✅ |

---

## Simple Treasury Overview


> **Note: Direct Execution Model**
Treasury operations use **direct transaction execution** via `msg.sender`. These functions do NOT use signature verification or nonce management - users interact directly with the contract using standard blockchain transactions.

The Simple Treasury provides a streamlined, single-chain solution for asset management within EVVM. It operates on the same blockchain as the EVVM core contract, offering direct and efficient asset deposit and withdrawal operations.

## When to Use Simple Treasury

**Ideal for:**
- EVVM running on the same blockchain as user assets
- Direct integration scenarios
- Lower gas costs and complexity
- Single-chain environments

**Not suitable for:**
- Multi-chain operations
- Cross-chain bridge requirements
- Gasless transaction needs

## Key Features

- **Direct Execution**: Users interact directly with the Treasury contract
- **Same-Chain Operations**: All transactions on the same blockchain as EVVM
- **Native & ERC20 Support**: Both native coins and standard tokens
- **EVVM Integration**: Seamless balance synchronization
- **Security Protection**: Principal token withdrawal prevention

## Available Functions

- **[deposit](./02-deposit.md)**: Deposit native coins or ERC20 tokens into EVVM
- **[withdraw](./03-withdraw.md)**: Withdraw assets from EVVM back to user wallet
- **`getCoreAddress()`**: Returns the configured EVVM Core contract address (view function)

## Security Considerations

- The Treasury acts as an accounting gateway: it transfers custody of tokens to the contract (for ERC20) or receives native coins and then calls `core.addAmountToUser(...)` to credit balances. For withdrawals, it calls `core.removeAmountFromUser(...)` before performing external transfers.
- Principal token withdrawals are expressly blocked by design: attempting to withdraw the Principal Token will revert (`PrincipalTokenIsNotWithdrawable()`).
- **No Signature Verification**: Treasury operations execute directly from `msg.sender` without off-chain signatures or nonce management.
- Consider using safe ERC20 transfer helpers and adding tests for token transfer failures and malicious token behaviour.

## Architecture

```
User Wallet → Simple Treasury → EVVM Core
     ↑              ↓
     └──────────────┘
   (Same Blockchain)
```

The Simple Treasury acts as a direct bridge between user wallets and EVVM balances on the same blockchain.

---

## Deposit Function

# deposit

**Function Type**: `external payable`  
**Function Signature**: `deposit(address,uint256)`  
**Returns**: `void`

Deposits host chain coins or ERC20 tokens from the host blockchain into the EVVM virtual blockchain. The function transfers assets from the user's wallet on the host blockchain to the Treasury contract and credits the equivalent balance in the EVVM system.

## Parameters

| Parameter | Type      | Description                                                    |
| --------- | --------- | -------------------------------------------------------------- |
| `token`   | `address` | Token contract address or `address(0)` for host chain coin   |
| `amount`  | `uint256` | Amount to deposit (must match `msg.value` for host chain coin) |

## Workflow

**Host Chain Coin Deposit Flow** (when `token == address(0)`):

1. **Zero Check**: Ensures `msg.value > 0`. Reverts with `DepositAmountMustBeGreaterThanZero()` if zero host chain coin is sent.
2. **Amount Validation**: Verifies that `amount` exactly matches `msg.value`. Reverts with `InvalidDepositAmount()` if they don't match.
3. **EVVM Balance Credit**: Calls `core.addAmountToUser(msg.sender, address(0), msg.value)` to credit the user's host chain coin balance in EVVM.

**ERC20 Deposit Flow** (when `token != address(0)`):

1. **Host Chain Coin Validation**: Ensures `msg.value == 0` (no host chain coin should be sent with ERC20 deposits). Reverts with `DepositCoinWithToken()` if host chain coin is sent.
2. **Amount Validation**: Ensures `amount > 0`. Reverts with `DepositAmountMustBeGreaterThanZero()` if amount is zero.
3. **Host Blockchain Transfer**: Executes `IERC20(token).transferFrom(msg.sender, address(this), amount)` to move tokens from user to Treasury contract.
4. **EVVM Balance Credit**: Calls `core.addAmountToUser(msg.sender, token, amount)` to credit the user's token balance in EVVM.

## Errors

- `DepositAmountMustBeGreaterThanZero()` — Reverted when attempting to deposit zero host chain coin or zero ERC20 amount.
- `InvalidDepositAmount()` — Reverted when `amount` does not match `msg.value` for native coin deposits.
- `DepositCoinWithToken()` — Reverted when native coin is sent alongside an ERC20 deposit.

## Security & Notes

- ERC20 transfers use `IERC20(token).transferFrom(msg.sender, address(this), amount)` in the current implementation. Some tokens do not strictly follow the ERC20 spec (they may return `false` on failure or not return a boolean), so using a safe transfer helper (e.g., `SafeTransferLib.safeTransferFrom`) or validating the return value in tests is recommended.
- The ERC20 transfer occurs before calling `addAmountToUser(...)`. Be aware that non-standard tokens (or ERC777 hooks) could attempt reentrancy; tests should cover malicious token behaviour.
- When depositing native coin (`address(0)`), the function requires `msg.value == amount` — the `amount` parameter is validated against `msg.value` to avoid ambiguity. Consider calling `deposit(address(0), msg.value)` for clarity in integrations.

---

## Withdraw Function

# withdraw

**Function Type**: `external`  
**Function Signature**: `withdraw(address,uint256)`  
**Returns**: `void`

Withdraws host chain coins or ERC20 tokens from the EVVM virtual blockchain back to the user's wallet on the host blockchain. This function includes principal token protection to prevent withdrawal of the ecosystem's core token.

## Parameters

| Parameter | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| `token`   | `address` | Token contract address or `address(0)` for host chain coin |
| `amount`  | `uint256` | Amount to withdraw                                   |

## Workflow

1. **Principal Token Protection**: Checks if the token is the ecosystem's principal token using `core.getPrincipalTokenAddress()`. Reverts with `PrincipalTokenIsNotWithdrawable()` if attempting to withdraw the principal token.
2. **EVVM Balance Verification**: Validates that the user has sufficient balance in EVVM using `core.getBalance(msg.sender, token) < amount`. Reverts with `InsufficientBalance()` if the user lacks adequate funds.
3. **Conditional Transfer Flow**:
   - **Host Chain Coin Withdrawal** (`token == address(0)`): 
     - Calls `core.removeAmountFromUser(msg.sender, address(0), amount)` to debit the user's EVVM balance
     - Uses `SafeTransferLib.safeTransferETH(msg.sender, amount)` to transfer host chain coins from Treasury to user
   - **ERC20 Withdrawal** (`token != address(0)`): 
     - Calls `core.removeAmountFromUser(msg.sender, token, amount)` to debit the user's EVVM balance
     - Executes `IERC20(token).transfer(msg.sender, amount)` to send tokens from Treasury to user

## Errors

- `PrincipalTokenIsNotWithdrawable()` — Reverted when attempting to withdraw the configured Principal Token (see `core.getPrincipalTokenAddress()`).
- `InsufficientBalance()` — Reverted when `core.getBalance(msg.sender, token) < amount`.

## Security & Notes

- The contract updates EVVM balances via `core.removeAmountFromUser(...)` before performing the external token/ETH transfer. This is a safe ordering (state change before external call) and helps prevent reentrancy issues on withdraw paths.
- For ETH transfers the contract uses `SafeTransferLib.safeTransferETH` which is recommended. For ERC20 transfers it uses `IERC20(token).transfer(...)` — consider using `SafeTransferLib.safeTransfer` for robustness against non-compliant tokens and to detect transfer failures.
- The correctness of `removeAmountFromUser`/`addAmountToUser` depends on the Core contract having the Treasury as the authorized caller (i.e., `Core.treasuryAddress` must be set). Tests should ensure that `Core` is configured so that these treasury calls succeed.
- Add unit tests that cover: withdrawing the principal token (should revert), insufficient balance, successful ETH withdraw, successful ERC20 withdraw, and token transfer failures.

---

## Crosschain Treasury Overview


The Crosschain Treasury enables secure asset transfers between EVVM and external blockchains using interoperability protocols.

## Architecture

Two coordinated stations communicate through cross-chain protocols:

### Host Chain Station
- Operates on EVVM's blockchain
- Handles withdrawals from EVVM to external chains
- Receives Fisher bridge deposits from external chains
- Integrates with EVVM core contract

### External Chain Station
- Deployed on external blockchains
- Handles deposits from users to EVVM
- Receives Fisher bridge withdrawals from EVVM
- Manages real asset custody (ERC20 and native coins)

## Supported Protocols

| Protocol | ID | Description |
|----------|----|----|
| **Hyperlane** | `0x01` | Modular interoperability framework |
| **LayerZero** | `0x02` | Omnichain protocol |
| **Axelar** | `0x03` | Decentralized cross-chain network |

## Fisher Bridge System

Gasless cross-chain transactions:
- **Gasless Operations**: No native tokens needed for gas on destination chains
- **EIP-191 Signatures**: User authorization via signed messages
- **Priority Fees**: Economic incentives for Fisher executors
- **Nonce-Based Security**: Replay attack prevention

## When to Use

**Ideal for:**
- EVVM on different blockchain than user assets
- Multi-chain support
- Gasless transaction requirements

## Available Documentation

### Host Chain Station
- **[withdraw](./02-HostChainStation/01-withdraw.md)**: Withdraw to external chains
- **[fisherBridgeReceive](./02-HostChainStation/02-fisherBridgeReceive.md)**: Receive gasless deposits
- **[fisherBridgeSend](./02-HostChainStation/03-fisherBridgeSend.md)**: Process gasless withdrawals
- **[Admin Functions](./02-HostChainStation/05-AdminFunctions.md)**: System management

### External Chain Station
- **[depositERC20](./03-ExternalChainStation/01-depositERC20.md)**: Deposit tokens to EVVM
- **[depositCoin](./03-ExternalChainStation/02-depositCoin.md)**: Deposit native coins to EVVM
- **[fisherBridgeReceive](./03-ExternalChainStation/03-fisherBridgeReceive.md)**: Receive gasless withdrawals
- **[fisherBridgeSendERC20](./03-ExternalChainStation/04-fisherBridgeSendERC20.md)**: Process gasless ERC20 transfers
- **[fisherBridgeSendCoin](./03-ExternalChainStation/05-fisherBridgeSendCoin.md)**: Process gasless coin transfers
- **[Admin Functions](./03-ExternalChainStation/06-AdminFunctions.md)**: System configuration

> **Warning: Security Considerations**
- **Principal Token Protection**: Principal token (MATE) withdrawals blocked via `PrincipalTokenIsNotWithdrawable()` error
- **Cross-Chain Authorization**: All messages require sender and chain ID validation
- **Fisher Bridge Signatures**: EIP-191 compliant signatures with structured message format
- **Nonce-Based Protection**: Sequential nonce tracking prevents replay attacks
- **Time-Delayed Governance**: 1-day delays for admin and Fisher executor changes
- **Access Control**: `onlyAdmin` and `onlyFisherExecutor` modifiers restrict critical functions
- **Protocol Validation**: Chain-specific authorization for Hyperlane, LayerZero, and Axelar
- **Balance Verification**: Insufficient balance checks with `InsufficientBalance()` error protection

## Gas Management

Each protocol requires different gas payment mechanisms:
- **Hyperlane**: Native tokens paid to mailbox contract
- **LayerZero**: Estimated fees through LayerZero endpoint
- **Axelar**: Gas service payments for cross-chain execution

Users must provide sufficient native tokens to cover cross-chain transaction costs when initiating transfers.

---

## withdraw


**Function Type**: `external payable`  
**Function Signature**: `withdraw(address,address,uint256,bytes1)`  
**Returns**: `void`

Withdraws tokens from EVVM balance and sends them to external chain via selected cross-chain protocol. This function validates balance, deducts from EVVM, and bridges via Hyperlane, LayerZero, or Axelar protocols.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `toAddress` | `address` | Recipient address on the external chain |
| `token` | `address` | Token contract address or `address(0)` for native coin |
| `amount` | `uint256` | Amount to withdraw |
| `protocolToExecute` | `bytes1` | Cross-chain protocol identifier (`0x01`, `0x02`, or `0x03`) |

## Protocol Identifiers

| Value | Protocol | Description |
|-------|----------|-------------|
| `0x01` | Hyperlane | Uses Hyperlane mailbox for cross-chain messaging |
| `0x02` | LayerZero | Uses LayerZero endpoint for omnichain transfers |
| `0x03` | Axelar | Uses Axelar gateway for decentralized cross-chain communication |

## Workflow

### Initial Validations
1. **Principal Token Protection**: Validates token is not the Principal Token (MATE) using `core.getEvvmMetadata().principalTokenAddress`. Reverts with `Error.PrincipalTokenIsNotWithdrawable()` if attempted.
2. **Balance Verification**: Confirms user has sufficient EVVM balance using `core.getBalance(msg.sender, token)`. Reverts with `Error.InsufficientBalance()` if insufficient.
3. **EVVM Balance Deduction**: Calls `core.removeAmountFromUser(msg.sender, token, amount)` to deduct from user's virtual balance.

### Protocol-Specific Execution

#### Hyperlane (`0x01`)
```solidity
bytes memory payload = PayloadUtils.encodePayload(token, toAddress, amount);
uint256 quote = IMailbox(hyperlane.mailboxAddress).quoteDispatch(
    hyperlane.externalChainStationDomainId,
    hyperlane.externalChainStationAddress,
    payload
);
IMailbox(hyperlane.mailboxAddress).dispatch{value: quote}(
    hyperlane.externalChainStationDomainId,
    hyperlane.externalChainStationAddress,
    payload
);
```
- **Payload Encoding**: Uses `PayloadUtils.encodePayload()` for standardized message format
- **Quote Calculation**: Gets exact dispatch cost via `IMailbox.quoteDispatch()`
- **Message Dispatch**: Sends to external station via Hyperlane mailbox with proper gas payment

#### LayerZero (`0x02`)
```solidity
bytes memory payload = PayloadUtils.encodePayload(token, toAddress, amount);
MessagingFee memory fee = _quote(
    layerZero.externalChainStationEid,
    payload,
    options,
    false
);
_lzSend(
    layerZero.externalChainStationEid,
    payload,
    options,
    MessagingFee(fee.nativeFee, 0),
    msg.sender
);
```
- **Payload Encoding**: Uses `PayloadUtils.encodePayload()` for consistent data structure
- **Fee Quotation**: Calculates exact messaging fee via `_quote()` function
- **Omnichain Send**: Dispatches via LayerZero V2 endpoint with proper fee handling

#### Axelar (`0x03`)
```solidity
bytes memory payload = PayloadUtils.encodePayload(token, toAddress, amount);
IAxelarGasService(axelar.gasServiceAddress).payNativeGasForContractCall{
    value: msg.value
}(
    address(this),
    axelar.externalChainStationChainName,
    axelar.externalChainStationAddress,
    payload,
    msg.sender
);
gateway().callContract(
    axelar.externalChainStationChainName,
    axelar.externalChainStationAddress,
    payload
);
```
- **Payload Encoding**: Uses `PayloadUtils.encodePayload()` for cross-chain compatibility
- **Gas Service Payment**: Prepays execution gas to Axelar gas service contract
- **Gateway Dispatch**: Routes message through Axelar gateway with refund to sender

## Payload Encoding

The function uses standardized payload encoding via `PayloadUtils` library:
```solidity
bytes memory payload = PayloadUtils.encodePayload(token, toAddress, amount);
```

This creates a consistent format decoded on external chain station using:
```solidity
(address token, address toAddress, uint256 amount) = PayloadUtils.decodePayload(payload);
```

The payload structure ensures:
1. **Token identification**: ERC20 contract address or `address(0)` for native coins
2. **Recipient specification**: Exact recipient address on external chain  
3. **Amount precision**: Token amount in native decimals

## Gas Requirements

Users must send sufficient native tokens with the transaction to cover:
- **Hyperlane**: Mailbox dispatch fees
- **LayerZero**: Endpoint messaging fees  
- **Axelar**: Gas service payments

> **Warning: Gas Payment Required**
The transaction will revert if insufficient native tokens are provided to cover cross-chain messaging costs. Use the respective quote functions to estimate required amounts.

## Security Features

- **User Authorization**: Only holders can withdraw from their own EVVM balances
- **Principal Token Protection**: `Error.PrincipalTokenIsNotWithdrawable()` prevents MATE token withdrawal
- **Balance Verification**: `Error.InsufficientBalance()` protection with EVVM balance checks
- **Protocol Validation**: Reverts for invalid protocol identifiers
- **Cross-Chain Security**: Each protocol validates sender authorization on message receipt

## External Chain Processing

Upon successful cross-chain message delivery, the External Chain Station:
1. **Message Validation**: Verifies sender authorization and chain ID
2. **Payload Decoding**: Uses `PayloadUtils.decodePayload()` to extract transfer details
3. **Asset Transfer**: Transfers ERC20 tokens or native coins to recipient
4. **Event Emission**: Logs successful cross-chain transfer for tracking

---

## fisherBridgeReceive


**Function Type**: `external`  
**Function Signature**: `fisherBridgeReceive(address,address,address,uint256,uint256,bytes)`  
**Access Control**: `onlyFisherExecutor`  
**Returns**: `void`

Receives Fisher bridge transactions from external chain and credits EVVM balances. Verifies EIP-191 signature, increments nonce, and adds balance to recipient and executor for priority fees.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | `address` | Original sender on the external chain |
| `addressToReceive` | `address` | Recipient address for the EVVM balance credit |
| `tokenAddress` | `address` | Token contract address or `address(0)` for native coin |
| `priorityFee` | `uint256` | Fee amount paid to the fisher executor |
| `amount` | `uint256` | Amount to credit to the recipient's EVVM balance |
| `signature` | `bytes` | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this transaction. |

## Access Control

This function can only be called by addresses with the `fisherExecutor` role:

```solidity
modifier onlyFisherExecutor() {
    if (msg.sender != fisherExecutor.current) {
        revert();
    }
    _;
}
```

## Workflow

### 1. Signature Verification
```solidity
core.validateAndConsumeNonce(
    from,
    Hash.hashDataForFisherBridge(
        addressToReceive,
        tokenAddress,
        priorityFee,
        amount
    ),
    fisherExecutor.current,
    nonce,
    true,
    signature
);
```

Validates EIP-191 signature using Core contract's nonce system. The hash is generated using `TreasuryCrossChainHashUtils.hashDataForFisherBridge()` with the transaction parameters. The `async: true` parameter indicates this uses a separate nonce system from regular EVVM operations.

### 2. EVVM Balance Updates

#### Recipient Credit
```solidity
core.addAmountToUser(addressToReceive, tokenAddress, amount);
```
Adds the transfer amount to recipient's EVVM balance via core contract integration.

#### Fisher Executor Fee
```solidity
if (priorityFee > 0)
    core.addAmountToUser(msg.sender, tokenAddress, priorityFee);
```
Credits priority fee to Fisher executor's EVVM balance as processing incentive.

## Signature Message Format


For more information about the signature structure, refer to the [Fisher Bridge Signature Structure](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md).


## EVVM Integration

The function directly integrates with the EVVM core contract for balance management:

```solidity
core.addAmountToUser(addressToReceive, tokenAddress, amount);
```

This provides:
- **Direct Balance Credit**: Adds tokens to user's EVVM virtual balance
- **Token Type Support**: Handles both ERC20 tokens and native ETH (address(0))
- **Atomic Operations**: Ensures consistent state between Treasury and EVVM core
- **Fee Distribution**: Separates user funds from Fisher executor incentives
- **Nonce Management**: Core contract validates and consumes nonces to prevent replay attacks

## Security Features

- **Fisher Executor Authorization**: `onlyFisherExecutor` modifier restricts function access
- **EIP-191 Signature Verification**: Structured message format with EVVM ID binding
- **Nonce-Based Replay Protection**: Sequential nonce tracking per user address
- **EVVM ID Integration**: Cross-instance security through unique identifiers
- **Balance Segregation**: Separate handling of transfer amount and priority fees

## Cross-Chain Flow

1. **External Chain**: User initiates Fisher bridge transaction with signature
2. **Fisher Monitoring**: Fisher executor captures transaction from external station
3. **Host Chain Processing**: This function validates and credits EVVM balances
4. **Balance Availability**: Tokens immediately available in user's EVVM account
    }
}
```

## Fisher Bridge Benefits

### For Users
- **Gasless Transactions**: Users don't need native tokens on the host chain
- **Flexible Recipients**: Can specify different recipient addresses
- **Signature-based Authorization**: Secure consent without direct interaction

### For Fisher Executors
- **Priority Fees**: Earn fees for facilitating transfers
- **Batch Processing**: Can process multiple transfers efficiently
- **Automated Operations**: Enable programmatic cross-chain services

## Security Features

### Signature Security
- **EIP-191 Standard**: Uses Ethereum's signed message standard (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))
- **Replay Protection**: Nonce-based prevention of signature reuse
- **Address Binding**: Signature tied to specific sender address

### Access Control
- **Fisher Authorization**: Only authorized executors can call the function
- **Signature Validation**: Cryptographic proof of user consent required (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))

### Balance Management
- **Direct EVVM Integration**: Secure balance updates through authorized treasury functions
- **Atomic Operations**: Balance credits are processed atomically

## Error Conditions

| Error | Condition |
|-------|-----------|
| `InvalidSignature()` | Signature verification fails |
| Access Control Revert | Called by unauthorized address (not current fisher executor) |

## Usage Example

A typical fisher bridge receive flow:

1. User signs a message on external chain authorizing the transfer
2. Fisher executor receives the signature and transfer details
3. Fisher calls `fisherBridgeReceive` with the signature and transfer parameters
4. Function validates signature and credits EVVM balances
5. User receives tokens in EVVM, fisher receives priority fee (if applicable)

> **Note: Fisher Executor Management**
Fisher executors are managed through a time-delayed governance system. See [Admin Functions](./05-AdminFunctions.md) for details on executor management.

---

## fisherBridgeSend


**Function Type**: `external`  
**Function Signature**: `fisherBridgeSend(address,address,address,uint256,uint256,bytes)`  
**Access Control**: `onlyFisherExecutor`  
**Returns**: `void`

Processes Fisher bridge token transfers from host to external chain. Validates balance and signature, deducts from sender, pays executor fee, and emits event for external chain processing.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | `address` | User initiating the withdrawal from EVVM |
| `addressToReceive` | `address` | Recipient address on the external chain |
| `tokenAddress` | `address` | Token contract address or `address(0)` for native coin |
| `priorityFee` | `uint256` | Fee amount paid to the fisher executor |
| `amount` | `uint256` | Amount to withdraw from user's EVVM balance |
| `signature` | `bytes` | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this withdrawal. |

## Access Control

```solidity
modifier onlyFisherExecutor() {
    if (msg.sender != fisherExecutor.current) {
        revert();
    }
    _;
}
```

Only addresses with the current `fisherExecutor` role can call this function.

## Workflow

### 1. Principal Token Protection
```solidity
if (tokenAddress == core.getEvvmMetadata().principalTokenAddress)
    revert Error.PrincipalTokenIsNotWithdrawable();
```
Prevents withdrawal of Principal Token (MATE) to protect ecosystem integrity.

### 2. Balance Validation
```solidity
if (core.getBalance(from, tokenAddress) < amount)
    revert Error.InsufficientBalance();
```
Verifies user has sufficient EVVM balance for the withdrawal amount (note: priority fee is deducted separately).

### 3. Signature Verification
```solidity
core.validateAndConsumeNonce(
    from,
    Hash.hashDataForFisherBridge(
        addressToReceive,
        tokenAddress,
        priorityFee,
        amount
    ),
    fisherExecutor.current,
    nonce,
    true,
    signature
);
```

Validates EIP-191 signature using Core contract's nonce system. The hash is generated using `TreasuryCrossChainHashUtils.hashDataForFisherBridge()` with the transaction parameters. The `async: true` parameter indicates this uses a separate nonce system from regular EVVM operations.

### 4. EVVM Balance Operations

#### User Balance Deduction
```solidity
core.removeAmountFromUser(from, tokenAddress, amount + priorityFee);
```
Deducts total amount (transfer + fee) from user's EVVM balance.

#### Fisher Executor Fee
```solidity
if (priorityFee > 0)
    core.addAmountToUser(msg.sender, tokenAddress, priorityFee);
```
Credits priority fee to Fisher executor's EVVM balance as processing incentive.

### 5. Event Emission
```solidity
emit FisherBridgeSend(
    from,
    addressToReceive,
    tokenAddress,
    priorityFee,
    amount,
    nonce
);
```

Emits an event containing all transfer details for external chain monitoring and processing.

## Event Definition

```solidity
event FisherBridgeSend(
    address indexed from,
    address indexed addressToReceive,
    address indexed tokenAddress,
    uint256 priorityFee,
    uint256 amount,
    uint256 nonce
);
```

### Event Parameters
- `from`: User who initiated the withdrawal (indexed)
- `addressToReceive`: Recipient on external chain (indexed)  
- `tokenAddress`: Token being withdrawn (indexed)
- `priorityFee`: Fee paid to fisher executor
- `amount`: Withdrawal amount
- `nonce`: Execution nonce used for this transaction

## External Chain Processing

The emitted event serves as a signal for external chain operations. The corresponding external chain station or fisher services should:

1. Monitor for `FisherBridgeSend` events
2. Extract transfer details from event parameters
3. Execute the actual token transfer on the external chain
4. Transfer `amount` of `tokenAddress` to `addressToReceive`

## Security Features

### Signature Security
- **EIP-191 Compliance**: Standard Ethereum signed message format
- **Nonce Protection**: Prevents signature replay attacks
- **User Authorization**: Cryptographic proof of user consent

### Balance Protection
- **Principal Token Guard**: Prevents withdrawal of ecosystem's core token
- **Sufficient Balance Check**: Validates user has adequate funds
- **Atomic Operations**: Balance updates are processed atomically

### Access Control
- **Fisher Authorization**: Only current fisher executor can initiate withdrawals
- **Signature Validation**: Requires valid user signature for each transaction (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))

## Fee Structure

The priority fee mechanism incentivizes fisher executors:
- **User Pays**: Total debit of `amount + priorityFee` from user balance
- **Fisher Receives**: Priority fee credited to executor's EVVM balance
- **Net Transfer**: User receives `amount` on external chain

## Error Conditions

| Error | Condition |
|-------|-----------|
| `PrincipalTokenIsNotWithdrawable()` | Attempting to withdraw principal token |
| `InsufficientBalance()` | User lacks sufficient EVVM balance |
| `InvalidSignature()` | Signature verification fails |
| Access Control Revert | Called by unauthorized address |

## Usage Flow

1. **User Intent**: User wants to withdraw tokens from EVVM to external chain
2. **Signature Creation**: User signs withdrawal authorization message
3. **Fisher Execution**: Authorized fisher calls `fisherBridgeSend` with signature
4. **Validation**: Function validates signature and user balance
5. **Balance Update**: EVVM balances updated (user debited, fisher credited fee)
6. **Event Emission**: Event emitted for external chain processing
7. **External Transfer**: External services process the actual token transfer

> **Warning: Off-chain Coordination Required**
This function only updates EVVM balances and emits events. The actual token transfer on the external chain must be handled by off-chain services monitoring these events.

---

## External Chain Address Management


The Treasury Host Chain Station uses a time-delayed proposal system to configure external chain station addresses for all supported cross-chain protocols. This administrative governance ensures secure management of cross-chain connections.

## proposeExternalChainAddress

**Function Type**: `external`  
**Function Signature**: `proposeExternalChainAddress(address,string)`  
**Access Control**: `onlyAdmin`  
**Returns**: `void`

Proposes new external chain station addresses for all protocols with a mandatory time delay for security. Note: **the current implementation sets the delay to `1 minute` (for testnet/dev convenience); in production this is expected to be a longer period (e.g., 1 day).**

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `externalChainStationAddress` | `address` | External station address for Hyperlane and LayerZero |
| `externalChainStationAddressString` | `string` | External station address for Axelar (string format) |

### Workflow

1. **One-Time Check**: Validates `fuseSetExternalChainAddress != 0x01` to ensure this is not initial setup
2. **Proposal Setup**: Creates `ChangeExternalChainAddressParams` with both address formats
3. **Time Lock**: Sets `timeToAccept = block.timestamp + 1 day` (or configured delay)

```solidity
externalChainAddressChangeProposal = ChangeExternalChainAddressParams({
    porposeAddress_AddressType: externalChainStationAddress,
    porposeAddress_StringType: externalChainStationAddressString,
    timeToAccept: block.timestamp + 1 minutes
});
```

## rejectProposalExternalChainAddress

**Function Type**: `external`  
**Function Signature**: `rejectProposalExternalChainAddress()`  
**Access Control**: `onlyAdmin`  
**Returns**: `void`

Cancels a pending external chain address change proposal.

### Workflow

Resets the proposal to default state:
```solidity
externalChainAddressChangeProposal = ChangeExternalChainAddressParams({
    porposeAddress_AddressType: address(0),
    porposeAddress_StringType: "",
    timeToAccept: 0
});
```

## acceptExternalChainAddress

**Function Type**: `external`  
**Function Signature**: `acceptExternalChainAddress()`  
**Access Control**: `public` (anyone can execute after time delay)  
**Returns**: `void`

Accepts pending external chain address changes and updates all protocol configurations.

### Workflow

1. **Time Validation**: Ensures `block.timestamp >= externalChainAddressChangeProposal.timeToAccept`
2. **Hyperlane Update**: Converts address to bytes32 and sets `hyperlane.externalChainStationAddress`
3. **LayerZero Update**: Converts address to bytes32 and sets `layerZero.externalChainStationAddress`
4. **Axelar Update**: Sets `axelar.externalChainStationAddress` using string format
5. **Peer Setup**: Calls `_setPeer()` to establish LayerZero peer relationship

## Governance Workflow

The complete process for changing external chain addresses:

1. **Propose**: Admin calls `proposeExternalChainAddress()` with new addresses
2. **Wait**: Mandatory time delay (typically 1 day) for security review
3. **Accept or Reject**: 
   - Anyone can call `acceptExternalChainAddress()` after delay
   - Admin can call `rejectProposalExternalChainAddress()` to cancel

## Protocol-Specific Address Formats

### Hyperlane & LayerZero
- **Input Format**: `address`
- **Stored Format**: `bytes32` (converted internally)
- **Usage**: Direct address representation for protocol routing

### Axelar
- **Format**: `string`
- **Usage**: Human-readable address for Axelar gateway calls
- **Example**: `"0x742d35Cc6634C0532925a3b8D43C1C16bE8c9123"`

## Security Considerations

### Time-Delayed Governance
- **Proposal Period**: 1-day delay provides time for community review
- **Cancellation**: Admin can reject proposals before acceptance
- **Public Execution**: Anyone can execute after delay expires

### Address Validation
- **Critical Setup**: Incorrect addresses will break cross-chain communication
- **Format Consistency**: Both address and string parameters must represent the same contract
- **One-Time Fuse**: `fuseSetExternalChainAddress` prevents certain re-configurations

## Usage Example

```solidity
// Step 1: Propose new external chain address
proposeExternalChainAddress(
    0x742d35Cc6634C0532925a3b8D43C1C16bE8c9123, // address format
    "0x742d35Cc6634C0532925a3b8D43C1C16bE8c9123"  // string format
);

// Step 2: Wait for time delay (1 day)
// ...

// Step 3: Accept the proposal
acceptExternalChainAddress();
```

> **Warning: Critical Configuration**
This system establishes the foundation for all cross-chain communication. Incorrect addresses will result in failed transfers and potential loss of funds. Always verify external station deployment and address accuracy before proposing changes.

---

## Admin Functions(02-HostChainStation)


The Treasury Host Chain Station includes comprehensive administrative functions with time-delayed governance to ensure secure management of critical system parameters and roles.

## Admin Management

### proposeAdmin

**Function Type**: `external`  
**Function Signature**: `proposeAdmin(address)`  
**Access Control**: `onlyAdmin`

Proposes a new admin address with a mandatory time delay for security.

**Note:** the current implementation sets the delay to `1 minute` (test/dev convenience); in production a longer delay (e.g., 1 day) is typical.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `_newOwner` | `address` | Address of the proposed new admin |

#### Workflow
1. **Validation**: Ensures new address is not zero address or current admin
2. **Proposal Setup**: Sets `admin.proposal = _newOwner`
3. **Time Lock**: Sets `admin.timeToAccept = block.timestamp + 1 days`

```solidity
function proposeAdmin(address _newOwner) external onlyAdmin {
    if (_newOwner == address(0) || _newOwner == admin.current) revert();
    
    admin.proposal = _newOwner;
    admin.timeToAccept = block.timestamp + 1 days;
}
```

### rejectProposalAdmin

**Function Type**: `external`  
**Function Signature**: `rejectProposalAdmin()`  
**Access Control**: `onlyAdmin`

Cancels a pending admin change proposal.

#### Workflow
1. **Reset Proposal**: Sets `admin.proposal = address(0)`
2. **Clear Timestamp**: Sets `admin.timeToAccept = 0`

### acceptAdmin

**Function Type**: `external`  
**Function Signature**: `acceptAdmin()`  
**Access Control**: Proposed admin only

Accepts a pending admin proposal and completes the admin transition.

#### Workflow
1. **Time Validation**: Ensures `block.timestamp >= admin.timeToAccept`
2. **Authority Check**: Validates `msg.sender == admin.proposal`
3. **Admin Transfer**: Sets `admin.current = admin.proposal`
4. **Cleanup**: Resets proposal and timestamp to zero

```solidity
function acceptAdmin() external {
    if (block.timestamp < admin.timeToAccept) revert();
    if (msg.sender != admin.proposal) revert();
    
    admin.current = admin.proposal;
    admin.proposal = address(0);
    admin.timeToAccept = 0;
}
```

## Fisher Executor Management

### proposeFisherExecutor

**Function Type**: `external`  
**Function Signature**: `proposeFisherExecutor(address)`  
**Access Control**: `onlyAdmin`

Proposes a new fisher executor with the same time-delay mechanism as admin changes.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `_newFisherExecutor` | `address` | Address of the proposed new fisher executor |

#### Workflow
1. **Validation**: Ensures new address is not zero or current executor
2. **Proposal Setup**: Sets `fisherExecutor.proposal = _newFisherExecutor`
3. **Time Lock**: Sets `fisherExecutor.timeToAccept = block.timestamp + 1 days`

### rejectProposalFisherExecutor

**Function Type**: `external`  
**Function Signature**: `rejectProposalFisherExecutor()`  
**Access Control**: `onlyAdmin`

Cancels a pending fisher executor change proposal.

### acceptFisherExecutor

**Function Type**: `external`  
**Function Signature**: `acceptFisherExecutor()`  
**Access Control**: Proposed fisher executor only

Accepts a pending fisher executor proposal and completes the transition.

#### Workflow
1. **Time Validation**: Ensures sufficient time has passed
2. **Authority Check**: Validates caller is the proposed executor
3. **Role Transfer**: Updates current fisher executor
4. **Cleanup**: Resets proposal state

## Getter Functions

### getAdmin

**Function Type**: `external view`  
**Function Signature**: `getAdmin()`  
**Returns**: `AddressTypeProposal memory`

Returns the complete admin state including current admin, proposed admin, and acceptance timestamp.

```solidity
struct AddressTypeProposal {
    address current;    // Current admin address
    address proposal;   // Proposed new admin (address(0) if none)
    uint256 timeToAccept; // Timestamp when proposal can be accepted
}
```

### getFisherExecutor

**Function Type**: `external view`  
**Function Signature**: `getFisherExecutor()`  
**Returns**: `AddressTypeProposal memory`

Returns the complete fisher executor state with the same structure as admin state.

### getNextFisherExecutionNonce

**Function Type**: `external view`  
**Function Signature**: `getNextFisherExecutionNonce(address)`  
**Returns**: `uint256`

Returns the next nonce value for a specific user's fisher bridge operations.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | User address to query nonce for |

### getCoreAddress

**Function Type**: `external view`  
**Function Signature**: `getCoreAddress()`  
**Returns**: `address`

Returns the address of the connected EVVM core contract.

### Configuration Getters

#### getHyperlaneConfig
**Returns**: `HyperlaneConfig memory`
```solidity
struct HyperlaneConfig {
    uint32 externalChainStationDomainId;
    bytes32 externalChainStationAddress;
    address mailboxAddress;
}
```

#### getLayerZeroConfig  
**Returns**: `LayerZeroConfig memory`
```solidity
struct LayerZeroConfig {
    uint32 externalChainStationEid;
    bytes32 externalChainStationAddress;
    address endpointAddress;
}
```

#### getAxelarConfig
**Returns**: `AxelarConfig memory`
```solidity
struct AxelarConfig {
    string externalChainStationChainName;
    string externalChainStationAddress;
    address gasServiceAddress;
    address gatewayAddress;
}
```

#### getOptions
**Returns**: `bytes memory`

Returns the LayerZero execution options used for cross-chain messaging.

## Security Features

### Time-Delayed Governance
- **1-Day Delay**: All role changes require 24-hour waiting period
- **Proposal/Accept Pattern**: Two-step process prevents accidental changes
- **Current Admin Control**: Only current admin can propose changes
- **Self-Accept**: Proposed addresses must accept their own appointments

### Role Separation
- **Admin Role**: Controls system configuration and role proposals
- **Fisher Executor Role**: Processes fisher bridge transactions
- **Distinct Management**: Separate proposal/accept cycles for each role

### Access Control
```solidity
modifier onlyAdmin() {
    if (msg.sender != admin.current) {
        revert();
    }
    _;
}

modifier onlyFisherExecutor() {
    if (msg.sender != fisherExecutor.current) {
        revert();
    }
    _;
}
```

## Governance Flow Example

### Admin Change Process
1. **Proposal**: Current admin calls `proposeAdmin(newAddress)`
2. **Wait Period**: 24-hour delay begins
3. **Acceptance**: Proposed admin calls `acceptAdmin()` after delay
4. **Completion**: Admin role transferred, proposal state cleared

### Emergency Rejection
- Current admin can call `rejectProposalAdmin()` at any time to cancel pending changes
- Useful for responding to compromised proposed addresses or changed requirements

> **Warning: Governance Security**
The time-delayed governance system protects against unauthorized role changes but requires careful coordination:
- Ensure proposed addresses are controlled and available for acceptance
- Current admins retain rejection power during the delay period  
- Lost access to proposed addresses requires starting the proposal process over

---

## depositERC20


**Function Type**: `external payable`  
**Function Signature**: `depositERC20(address,address,uint256,bytes1)`  
**Returns**: `void`

Deposits ERC20 tokens and sends them to host chain via selected cross-chain protocol. Supports Hyperlane, LayerZero, and Axelar protocols for reliable token bridging to EVVM ecosystem.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `toAddress` | `address` | Recipient address for EVVM balance credit |
| `token` | `address` | ERC20 token contract address (cannot be `address(0)`) |
| `amount` | `uint256` | Amount of tokens to deposit |
| `protocolToExecute` | `bytes1` | Cross-chain protocol identifier (`0x01`, `0x02`, or `0x03`) |

## Protocol Identifiers

| Value | Protocol | Description |
|-------|----------|-------------|
| `0x01` | Hyperlane | Uses Hyperlane mailbox for cross-chain messaging |
| `0x02` | LayerZero | Uses LayerZero endpoint for omnichain transfers |
| `0x03` | Axelar | Uses Axelar gateway for decentralized cross-chain communication |

## Workflow

### 1. Payload Encoding
```solidity
bytes memory payload = PayloadUtils.encodePayload(token, toAddress, amount);
```
Creates standardized cross-chain message payload using PayloadUtils library.

### 2. Token Transfer and Validation
```solidity
verifyAndDepositERC20(token, amount);
```
Internally verifies token approval and executes `transferFrom` to custody tokens in this contract.

### 3. Protocol-Specific Cross-Chain Execution

#### Hyperlane (`0x01`)
```solidity
uint256 quote = IMailbox(hyperlane.mailboxAddress).quoteDispatch(
    hyperlane.hostChainStationDomainId,
    hyperlane.hostChainStationAddress,
    payload
);
IMailbox(hyperlane.mailboxAddress).dispatch{value: quote}(
    hyperlane.hostChainStationDomainId,
    hyperlane.hostChainStationAddress,
    payload
);
```
- **Quote Calculation**: Gets exact dispatch cost from Hyperlane mailbox
- **Message Dispatch**: Sends encoded payload to host chain station
- **Gas Payment**: Uses quoted amount for precise fee payment

#### LayerZero (`0x02`)
```solidity
MessagingFee memory fee = _quote(
    layerZero.hostChainStationEid,
    payload,
    options,
    false
);
_lzSend(
    layerZero.hostChainStationEid,
    payload,
    options,
    MessagingFee(fee.nativeFee, 0),
    msg.sender
);
```
- **Fee Quotation**: Calculates exact LayerZero messaging costs
- **Omnichain Send**: Utilizes LayerZero V2 OApp framework
- **Refund Handling**: Excess fees automatically refunded to sender

#### Axelar (`0x03`)
```solidity
IAxelarGasService(axelar.gasServiceAddress).payNativeGasForContractCall{
    value: msg.value
}(
    address(this),
    axelar.hostChainStationChainName,
    axelar.hostChainStationAddress,
    payload,
    msg.sender
);
gateway().callContract(
    axelar.hostChainStationChainName,
    axelar.hostChainStationAddress,
    payload
);
```
- **Gas Service Payment**: Prepays execution gas via Axelar gas service
- **Gateway Routing**: Routes message through Axelar's decentralized gateway
- **Refund Management**: Gas refunds processed through Axelar's system

## Token Requirements

### ERC20 Transfer Process
The function uses an internal validation function for secure token transfers:
```solidity
verifyAndDepositERC20(token, amount);
```

This internally:
1. Verifies token is not `address(0)`
2. Checks user has approved this contract for the deposit amount
3. Executes `IERC20(token).transferFrom(msg.sender, address(this), amount)`

### Prerequisites
- **Token Approval**: Users must approve the External Chain Station contract for the deposit amount
- **Sufficient Balance**: User must have adequate token balance for the transfer
- **Valid Token**: Token contract must be a valid ERC20 implementation

## Cross-Chain Message Processing

### Payload Structure
```solidity
bytes memory payload = PayloadUtils.encodePayload(token, toAddress, amount);
```

### Host Chain Processing
Upon successful cross-chain message delivery:
1. **Payload Decoding**: `PayloadUtils.decodePayload()` extracts transfer parameters
2. **EVVM Integration**: `core.addAmountToUser(toAddress, token, amount)`  
3. **Balance Credit**: Recipient's EVVM balance immediately reflects the deposited tokens

## Gas Requirements

Users must provide sufficient native tokens (`msg.value`) to cover cross-chain messaging costs:

- **Hyperlane**: Mailbox dispatch fees
- **LayerZero**: Endpoint messaging fees
- **Axelar**: Gas service payments for execution

Use the respective quote functions to estimate required amounts:
- `getQuoteHyperlane(toAddress, token, amount)`
- `quoteLayerZero(toAddress, token, amount)`

## Security Features

### Input Validation
- **Token Address**: `verifyAndDepositERC20()` prevents `address(0)` deposits
- **Allowance Check**: Function reverts with `Error.InsufficientBalance()` if insufficient approval
- **Safe Transfer**: Standard `IERC20.transferFrom()` with approval verification
- **Protocol Support**: Validates supported protocol identifiers (0x01, 0x02, 0x03)

### Cross-Chain Security  
- **Message Authentication**: Each protocol validates sender and origin chain
- **Payload Integrity**: `PayloadUtils` ensures consistent encoding/decoding
- **Recipient Verification**: Direct address binding prevents misdirected funds

## Error Conditions

| Error | Condition |
|-------|-----------|
| `Error.InsufficientBalance()` | User hasn't approved sufficient tokens |
| Generic Revert | Token address is `address(0)` |
| Protocol Revert | Invalid `protocolToExecute` value |
| Insufficient Gas | `msg.value` doesn't cover cross-chain messaging costs |

## Usage Example

```solidity
// 1. Approve tokens
IERC20(tokenAddress).approve(externalChainStationAddress, depositAmount);

// 2. Get gas quote
uint256 gasRequired = getQuoteHyperlane(recipientAddress, tokenAddress, depositAmount);

// 3. Execute deposit
depositERC20{value: gasRequired}(
    recipientAddress,
    tokenAddress, 
    depositAmount,
    0x01 // Hyperlane
);
```

## Integration with EVVM

The deposit flow connects external chain assets to EVVM balances:

1. **External Chain**: User transfers ERC20 tokens to external station
2. **Cross-Chain**: Message sent to host chain station  
3. **Host Chain**: Host station receives message and credits EVVM balance
4. **EVVM**: Recipient can use tokens within the EVVM ecosystem

> **Warning: Gas Payment Required**
Ensure sufficient native tokens are sent with the transaction to cover cross-chain messaging costs. Insufficient gas will cause transaction failure and potential token loss.

> **Note: ERC20 Approval Required**
Users must approve the external chain station contract before calling this function. The approval should cover at least the deposit amount.

---

## depositCoin


**Function Type**: `external payable`  
**Function Signature**: `depositCoin(address,uint256,bytes1)`  
**Returns**: `void`

Deposits native ETH and sends it to host chain via selected cross-chain protocol. The msg.value must cover both the deposit amount and protocol messaging fees.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `toAddress` | `address` | Recipient address for EVVM balance credit |
| `amount` | `uint256` | Amount of native coins to deposit |
| `protocolToExecute` | `bytes1` | Cross-chain protocol identifier (`0x01`, `0x02`, or `0x03`) |

## Protocol Identifiers

| Value | Protocol | Description |
|-------|----------|-------------|
| `0x01` | Hyperlane | Uses Hyperlane mailbox for cross-chain messaging |
| `0x02` | LayerZero | Uses LayerZero endpoint for omnichain transfers |
| `0x03` | Axelar | Uses Axelar gateway for decentralized cross-chain communication |

## Workflow

### 1. Input Validation
```solidity
if (msg.value < amount) revert Error.InsufficientBalance();
```
Ensures sufficient msg.value to cover at least the deposit amount before processing.

### 2. Payload Encoding
```solidity
bytes memory payload = PayloadUtils.encodePayload(address(0), toAddress, amount);
```
Creates standardized payload with `address(0)` representing native ETH using PayloadUtils library.

### 3. Protocol-Specific Cross-Chain Execution

#### Hyperlane (`0x01`)
```solidity
uint256 quote = IMailbox(hyperlane.mailboxAddress).quoteDispatch(
    hyperlane.hostChainStationDomainId,
    hyperlane.hostChainStationAddress,
    payload
);
if (msg.value < (quote + amount)) 
    revert Error.InsufficientBalance();
    
IMailbox(hyperlane.mailboxAddress).dispatch{value: quote}(
    hyperlane.hostChainStationDomainId,
    hyperlane.hostChainStationAddress,
    payload
);
```
- **Quote Calculation**: Gets exact dispatch cost from Hyperlane mailbox
- **Total Validation**: `msg.value >= amount + quote` ensures sufficient funds
- **Fee Payment**: Uses precise quote for gas payment

#### LayerZero (`0x02`)
```solidity
MessagingFee memory fee = _quote(
    layerZero.hostChainStationEid,
    payload,
    options,
    false
);
if (msg.value < (fee + amount)) 
    revert Error.InsufficientBalance();
    
_lzSend(
    layerZero.hostChainStationEid,
    payload,
    options,
    MessagingFee(fee.nativeFee, 0),
    msg.sender
);
```
- **Fee Quotation**: Calculates exact LayerZero V2 messaging costs
- **Balance Validation**: Ensures sufficient funds for deposit + messaging
- **Refund Mechanism**: LayerZero handles excess fee refunds automatically

#### Axelar (`0x03`)
```solidity
// msg.value - amount is used for gas service payment
    
IAxelarGasService(axelar.gasServiceAddress).payNativeGasForContractCall{
    value: msg.value - amount
}(
    address(this),
    axelar.hostChainStationChainName,
    axelar.hostChainStationAddress,
    payload,
    msg.sender
);
gateway().callContract(
    axelar.hostChainStationChainName,
    axelar.hostChainStationAddress,
    payload
);
```
- **Fund Separation**: `msg.value > amount` ensures gas budget available
- **Gas Service Payment**: `msg.value - amount` allocated for cross-chain execution
- **Gateway Dispatch**: Routes message through Axelar's decentralized network

## Native Coin Handling

### Value Distribution
The `msg.value` serves dual purposes:
1. **Deposit Amount**: Actual ETH being bridged to EVVM ecosystem
2. **Protocol Fees**: Gas costs for cross-chain message execution

### Fee Structure by Protocol
- **Hyperlane**: `msg.value >= amount + quote` for precise fee calculation
- **LayerZero**: `msg.value >= amount + fee.nativeFee` with automatic refunds
- **Axelar**: `msg.value > amount` with remainder allocated to gas service

## Cross-Chain Message Processing

### Payload Structure
```solidity
bytes memory payload = PayloadUtils.encodePayload(address(0), toAddress, amount);
```
Uses standardized PayloadUtils with `address(0)` representing native ETH.

### Host Chain Processing
Upon successful cross-chain message delivery:
1. **Payload Decoding**: `PayloadUtils.decodePayload()` extracts `(address(0), toAddress, amount)`
2. **EVVM Integration**: `Evvm(evvmAddress).addAmountToUser(toAddress, address(0), amount)`
3. **Balance Update**: Recipient's EVVM balance reflects deposited native coins

## Gas Estimation

Before calling this function, estimate total required value:

### Hyperlane
```solidity
uint256 gasQuote = getQuoteHyperlane(toAddress, address(0), amount);
uint256 totalRequired = amount + gasQuote;
```

### LayerZero
```solidity
uint256 layerZeroFee = quoteLayerZero(toAddress, address(0), amount);
uint256 totalRequired = amount + layerZeroFee;
```

### Axelar
For Axelar, provide sufficient value to cover both deposit and gas service:
```solidity
uint256 totalRequired = amount + estimatedAxelarGas;
```

## Security Features

### Input Validation
- **Initial Check**: `Error.InsufficientBalance()` ensures msg.value >= amount
- **Balance Validation**: Protocol-specific checks ensure sufficient `msg.value` for fees
- **Atomic Processing**: Deposit and cross-chain messaging happen atomically

### Cross-Chain Security
- **Message Authentication**: Each protocol validates sender authorization
- **Payload Integrity**: `PayloadUtils` ensures consistent data encoding
- **Native Asset Handling**: Standardized `address(0)` convention across protocols

## Error Conditions

| Error | Condition |
|-------|-----------|
| `Error.InsufficientBalance()` | Initial check: `msg.value < amount` |
| `Error.InsufficientBalance()` | Hyperlane: `msg.value < quote + amount` |
| `Error.InsufficientBalance()` | LayerZero: `msg.value < fee + amount` |
| Protocol Revert | Unsupported `protocolToExecute` identifier |
| Cross-Chain Failure | Insufficient gas payment for selected protocol |

## Usage Examples

### Hyperlane Deposit
```solidity
// 1. Get gas quote
uint256 gasRequired = getQuoteHyperlane(recipientAddress, address(0), depositAmount);
uint256 totalValue = depositAmount + gasRequired;

// 2. Execute deposit
depositCoin{value: totalValue}(
    recipientAddress,
    depositAmount,
    0x01 // Hyperlane
);
```

### LayerZero Deposit
```solidity
// 1. Get fee quote
uint256 layerZeroFee = quoteLayerZero(recipientAddress, address(0), depositAmount);
uint256 totalValue = depositAmount + layerZeroFee;

// 2. Execute deposit
depositCoin{value: totalValue}(
    recipientAddress,
    depositAmount,
    0x02 // LayerZero
);
```

### Axelar Deposit
```solidity
// 1. Estimate total (deposit + gas)
uint256 totalValue = depositAmount + estimatedAxelarGas;

// 2. Execute deposit
depositCoin{value: totalValue}(
    recipientAddress,
    depositAmount,
    0x03 // Axelar
);
```

## Integration Flow

1. **External Chain**: User sends native coins to external station
2. **Value Split**: Coins divided between deposit amount and gas fees
3. **Cross-Chain**: Message sent to host chain station with deposit details
4. **Host Chain**: Host station credits EVVM balance with native coin equivalent
5. **EVVM**: Recipient can use deposited coins within EVVM ecosystem

> **Warning: Sufficient Value Required**
Ensure `msg.value` covers both the deposit amount and cross-chain messaging fees. Each protocol has different gas requirements that must be satisfied for successful execution.

> **Note: Native Coin Representation**
Native coins are represented as `address(0)` in EVVM balances, consistent with the standard convention for native currency handling.

---

## fisherBridgeReceive(03-ExternalChainStation)


**Function Type**: `external`  
**Function Signature**: `fisherBridgeReceive(address,address,address,uint256,uint256,uint256,bytes)`  
**Access Control**: `onlyFisherExecutor`  
**Returns**: `void`

Receives and validates Fisher bridge transactions from host chain. Verifies EIP-191 signature using asyncNonce system (independent from Core.sol) and marks nonce as used to prevent replay attacks.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | `address` | Original sender on the host chain (user requesting withdrawal) |
| `addressToReceive` | `address` | Recipient address on the external chain |
| `tokenAddress` | `address` | Token contract address or `address(0)` for native coin |
| `priorityFee` | `uint256` | Fee amount paid to the fisher executor |
| `amount` | `uint256` | Amount to transfer to the recipient |
| `nonce` | `uint256` | User-managed sequential nonce for replay protection |
| `signature` | `bytes` | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this transaction. |

## Access Control

```solidity
modifier onlyFisherExecutor() {
    if (msg.sender != fisherExecutor.current) {
        revert();
    }
    _;
}
```

Only addresses with the current `fisherExecutor` role can call this function.

## Workflow

### 1. Nonce Validation
```solidity
if (asyncNonce[from][nonce]) revert CoreError.AsyncNonceAlreadyUsed();
```

Checks if nonce has already been used. The External Chain Station uses `asyncNonce[from][nonce]` mapping instead of Core.sol's nonce system (which doesn't exist on external chains).

### 2. Signature Verification
```solidity
if (
    SignatureRecover.recoverSigner(
        AdvancedStrings.buildSignaturePayload(
            evvmID,
            hostChainAddress.currentAddress,
            Hash.hashDataForFisherBridge(
                addressToReceive,
                tokenAddress,
                priorityFee,
                amount
            ),
            fisherExecutor.current,
            nonce,
            true
        ),
        signature
    ) != from
) revert CoreError.InvalidSignature();
```

Validates EIP-191 signature by recovering the signer and comparing to `from` address. Uses `SignatureRecover.recoverSigner()` with payload built by `AdvancedStrings.buildSignaturePayload()`.

### 3. Mark Nonce as Used
```solidity
asyncNonce[from][nonce] = true;
```
Marks this nonce as consumed to prevent replay attacks.

## Validation-Only Function

This function serves as a validation endpoint and **does not perform token transfers**. Its purpose:

1. **Signature Validation**: Cryptographically verifies user authorization for Fisher bridge operations
2. **Nonce Management**: Tracks sequential nonces to prevent replay attacks
3. **Access Control**: Ensures only authorized Fisher executors can validate transactions
4. **Cross-Chain Coordination**: Provides secure validation for off-chain Fisher bridge processes

**Note**: Actual token transfers on the external chain must be handled by separate Fisher bridge mechanisms that coordinate with this validation system.

## Signature Message Format


For more information about the signature structure, refer to the [Fisher Bridge Signature Structure](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md).


## Fisher Bridge Architecture

### Cross-Chain Coordination
1. **Host Chain**: User authorizes withdrawal via `fisherBridgeSend`
2. **Event Emission**: Host chain emits `FisherBridgeSend` event
3. **External Chain**: Fisher executor calls `fisherBridgeReceive` with same signature
4. **Validation**: External station validates signature and nonce
5. **Execution**: Off-chain services execute the actual token transfer

### Nonce Synchronization
The External Chain Station uses an independent `asyncNonce[from][nonce]` mapping:
- **NOT Core.sol**: External chains don't have Core.sol, so this is a separate nonce system
- **User-Managed**: Each user maintains their own sequential nonces
- **Replay Protection**: Once `asyncNonce[from][nonce]` is true, that signature cannot be reused
- **Coordination**: Both host and external chain stations mark the same nonce as used

## Security Features

### Signature Security
- **EIP-191 Compliance**: Standard Ethereum signed message format
- **SignatureRecover**: Uses `SignatureRecover.recoverSigner()` to validate signatures
- **AdvancedStrings**: Payload built with `AdvancedStrings.buildSignaturePayload()`
- **Replay Protection**: `asyncNonce` mapping prevents signature reuse
- **User Authorization**: Cryptographic proof of user consent
- **Address Binding**: Signature tied to specific sender address

### Access Control
- **Fisher Authorization**: Only authorized executors can validate signatures
- **Distributed Validation**: Same signature validates on both chains

### Nonce Management
- **AsyncNonce System**: Uses `asyncNonce[from][nonce]` mapping (NOT Core.sol)
- **Independent System**: External Chain doesn't have Core.sol
- **Mark as Used**: Sets `asyncNonce[from][nonce] = true` after validation
- **Per-User Tracking**: Individual nonce tracking for each user

## Integration with External Services

Since this function only validates signatures, external services must:

### Monitor Host Chain Events
```solidity
event FisherBridgeSend(
    address indexed from,
    address indexed addressToReceive,
    address indexed tokenAddress,
    uint256 priorityFee,
    uint256 amount,
    uint256 nonce
);
```

### Execute Token Transfers
Based on validated parameters:
- **Native Coins**: Transfer `amount` of native currency to `addressToReceive`
- **ERC20 Tokens**: Transfer `amount` of `tokenAddress` tokens to `addressToReceive`
- **Priority Fees**: Handle fee distribution to fisher executor

### Error Handling
- **Signature Validation**: Use this function to verify user authorization (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))
- **Nonce Tracking**: Ensure nonce synchronization with host chain
- **Transfer Validation**: Verify successful token transfers

## Error Conditions

| Error | Condition |
|-------|-----------|  
| `CoreError.AsyncNonceAlreadyUsed()` | Nonce has already been used for this user |
| `CoreError.InvalidSignature()` | Signature verification fails |
| Access Control Revert | Called by unauthorized address (not current fisher executor) |

## Usage Flow

1. **Host Chain**: User calls `fisherBridgeSend` with signature
2. **Event Monitoring**: External services detect `FisherBridgeSend` event
3. **Signature Validation**: Fisher calls `fisherBridgeReceive` with same parameters
4. **Nonce Increment**: External station increments user's nonce
5. **Token Transfer**: External services execute actual transfer
6. **Fee Distribution**: Priority fees handled by external coordination

## Coordination Requirements

For proper fisher bridge operation:

### Signature Consistency
- Same signature used on both host and external chains
- Identical parameter values across chains
- Synchronized nonce values

### Service Integration
- Off-chain monitoring of host chain events
- External token transfer execution
- Priority fee distribution mechanisms
- Error handling and retry logic

> **Note: Off-chain Coordination Required**
This function only validates signatures and manages nonces. Actual token transfers on the external chain require off-chain services that coordinate between the validation and execution steps.

> **Warning: AsyncNonce System**
The External Chain Station uses `asyncNonce[from][nonce]` mapping instead of Core.sol's nonce system. This is because Core.sol doesn't exist on external chains. Users must manage their own sequential nonces, and each nonce can only be used once.

---

## fisherBridgeSendERC20


**Function Type**: `external`  
**Function Signature**: `fisherBridgeSendERC20(address,address,address,uint256,uint256,uint256,bytes)`  
**Access Control**: `onlyFisherExecutor`  
**Returns**: `void`

Processes Fisher bridge ERC20 token transfers to host chain. Validates signature using asyncNonce system, deposits tokens, and emits tracking event for cross-chain coordination.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | `address` | User initiating the deposit from external chain |
| `addressToReceive` | `address` | Recipient address for EVVM balance credit |
| `tokenAddress` | `address` | ERC20 token contract address |
| `priorityFee` | `uint256` | Fee amount paid to the fisher executor |
| `amount` | `uint256` | Amount to deposit to EVVM |
| `nonce` | `uint256` | User-managed sequential nonce for replay protection |
| `signature` | `bytes` | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this deposit. |

## Access Control

```solidity
modifier onlyFisherExecutor() {
    if (msg.sender != fisherExecutor.current) {
        revert();
    }
    _;
}
```

Only addresses with the current `fisherExecutor` role can call this function.

## Workflow

### 1. Nonce Validation
```solidity
if (asyncNonce[from][nonce]) revert CoreError.AsyncNonceAlreadyUsed();
```

Checks if nonce has already been used. The External Chain Station uses `asyncNonce[from][nonce]` mapping instead of Core.sol's nonce system.

### 2. Signature Verification
```solidity
if (
    SignatureRecover.recoverSigner(
        AdvancedStrings.buildSignaturePayload(
            evvmID,
            hostChainAddress.currentAddress,
            Hash.hashDataForFisherBridge(
                addressToReceive,
                tokenAddress,
                priorityFee,
                amount
            ),
            fisherExecutor.current,
            nonce,
            true
        ),
        signature
    ) != from
) revert CoreError.InvalidSignature();
```

Validates EIP-191 signature by recovering the signer and comparing to `from` address. Uses `SignatureRecover.recoverSigner()` with payload built by `AdvancedStrings.buildSignaturePayload()`.

### 3. Token Transfer
```solidity
// Implementation calls:
verifyAndDepositERC20(tokenAddress, amount);

// Internally:
// if (token == address(0)) revert();
// if (IERC20(token).allowance(msg.sender, address(this)) < amount)
//     revert ErrorsLib.InsufficientBalance();
// IERC20(token).transferFrom(msg.sender, address(this), amount);
```

Transfers the deposit `amount` from the user to the contract using `transferFrom` (the implementation validates allowance and performs `transferFrom`). **Note:** the `priorityFee` is not transferred here — it is represented in the emitted event and will be credited to the fisher executor on the host chain when the message is processed.

### 4. Mark Nonce as Used
```solidity
asyncNonce[from][nonce] = true;
```
Marks this nonce as consumed to prevent replay attacks.

### 5. Event Emission
```solidity
emit FisherBridgeSend(
    from,
    addressToReceive,
    tokenAddress,
    priorityFee,
    amount,
    nonce
);
```

Emits event with transfer details for cross-chain coordination.

## Token Requirements

### ERC20 Approval
Before the fisher executor can call this function, the user must approve the external chain station:
```solidity
IERC20(tokenAddress).approve(externalChainStationAddress, amount);
```

### Transfer Validation
The function validates and executes the token transfer:
```solidity
function verifyAndDepositERC20(address token, uint256 amount) internal {
    if (token == address(0)) revert();
    if (IERC20(token).allowance(msg.sender, address(this)) < amount)
        revert Error.InsufficientBalance();
    
    IERC20(token).transferFrom(msg.sender, address(this), amount);
}
```

## Event Definition

```solidity
event FisherBridgeSend(
    address indexed from,
    address indexed addressToReceive,
    address indexed tokenAddress,
    uint256 priorityFee,
    uint256 amount,
    uint256 nonce
);
```

### Event Parameters
- `from`: User who authorized the deposit (indexed)
- `addressToReceive`: Recipient on EVVM (indexed)
- `tokenAddress`: ERC20 token being deposited (indexed)
- `priorityFee`: Fee paid to fisher executor
- `amount`: Deposit amount
- `nonce`: Execution nonce used for this transaction

## Cross-Chain Processing

The emitted event serves as a signal for cross-chain operations:

### Host Chain Coordination
1. **Event Monitoring**: Host chain services monitor for `FisherBridgeSend` events
2. **Message Creation**: Create cross-chain message with event parameters
3. **EVVM Credit**: Host chain station credits `addressToReceive` with `amount`
4. **Fee Handling**: Priority fee management through EVVM balance system

### Signature Synchronization
The same signature used here should be processable by the host chain station's `fisherBridgeReceive` function for coordination.

## Fisher Bridge Benefits

### For Users
- **Gasless Deposits**: Fisher pays gas fees on external chain
- **Simplified UX**: Single signature authorizes the entire flow
- **Flexible Recipients**: Can specify different EVVM recipient addresses

### For Fisher Executors
- **Priority Fees**: Earn fees for facilitating deposits
- **Token Custody**: Temporary custody of tokens before cross-chain transfer
- **Service Provision**: Enable cross-chain deposit services

## Security Features

### Signature Security
- **EIP-191 Standard**: Uses Ethereum's signed message standard (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))
- **SignatureRecover**: Uses `SignatureRecover.recoverSigner()` to validate signatures
- **AdvancedStrings**: Payload built with `AdvancedStrings.buildSignaturePayload()`
- **Replay Protection**: `asyncNonce` mapping prevents signature reuse
- **Parameter Binding**: Signature tied to specific transfer parameters

### Token Security
- **Allowance Validation**: Ensures sufficient approval before transfer
- **Transfer Verification**: Uses standard ERC20 `transferFrom` with revert on failure
- **Address Validation**: Rejects zero address for token parameter

### Access Control
- **Fisher Authorization**: Only authorized executors can initiate deposits
- **Signature Validation**: Requires valid user signature for each transaction (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))

## Error Conditions

| Error | Condition |
|-------|-----------|  
| `CoreError.AsyncNonceAlreadyUsed()` | Nonce has already been used for this user |
| `CoreError.InvalidSignature()` | Signature verification fails |
| `Error.InsufficientBalance()` | Insufficient ERC20 allowance |
| ERC20 Transfer Failure | Token transfer reverts (insufficient balance, paused token, etc.) |
| Access Control Revert | Called by unauthorized address |

## Usage Flow

1. **User Approval**: User approves external chain station for token spending
2. **Signature Creation**: User signs authorization message with deposit details
3. **Fisher Execution**: Authorized fisher calls `fisherBridgeSendERC20`
4. **Validation**: Function validates signature and transfers tokens
5. **Event Emission**: Event emitted for cross-chain coordination
6. **Cross-Chain**: Host chain services process the deposit to EVVM
7. **Balance Credit**: Recipient receives tokens in EVVM balance

## Integration Requirements

### Off-Chain Services
- **Event Monitoring**: Listen for `FisherBridgeSend` events
- **Cross-Chain Messaging**: Send deposit instructions to host chain
- **Nonce Tracking**: Track used nonces in `asyncNonce[from][nonce]` mapping

### Token Handling
- **Custody Management**: External station holds tokens until cross-chain processing
- **Transfer Coordination**: Ensure tokens reach correct EVVM balances
- **Fee Distribution**: Handle priority fee allocation

> **Warning: Token Approval Required**
Users must approve the external chain station contract before fishers can execute deposits. Insufficient allowance will cause transaction failure.

> **Note: Cross-Chain Coordination**
This function initiates the deposit process but requires off-chain services to complete the cross-chain transfer and EVVM balance crediting.

---

## fisherBridgeSendCoin


**Function Type**: `external payable`  
**Function Signature**: `fisherBridgeSendCoin(address,address,uint256,uint256,uint256,bytes)`  
**Access Control**: `onlyFisherExecutor`  
**Returns**: `void`

Facilitates native coin deposits from external chain to EVVM through the fisher bridge system. This function validates user signatures using asyncNonce system, accepts native currency payments, and emits events for cross-chain processing coordination.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | `address` | User initiating the deposit from external chain |
| `addressToReceive` | `address` | Recipient address for EVVM balance credit |
| `priorityFee` | `uint256` | Fee amount paid to the fisher executor |
| `amount` | `uint256` | Amount of native coins to deposit to EVVM |
| `nonce` | `uint256` | User-managed sequential nonce for replay protection |
| `signature` | `bytes` | Cryptographic signature ([EIP-191](https://eips.ethereum.org/EIPS/eip-191)) from the `from` address authorizing this deposit. |

## Access Control

```solidity
modifier onlyFisherExecutor() {
    if (msg.sender != fisherExecutor.current) {
        revert();
    }
    _;
}
```

Only addresses with the current `fisherExecutor` role can call this function.

## Workflow

### 1. Nonce Validation
```solidity
if (asyncNonce[from][nonce]) revert CoreError.AsyncNonceAlreadyUsed();
```

Checks if nonce has already been used. The External Chain Station uses `asyncNonce[from][nonce]` mapping instead of Core.sol's nonce system.

### 2. Signature Verification
```solidity
if (
    SignatureRecover.recoverSigner(
        AdvancedStrings.buildSignaturePayload(
            evvmID,
            hostChainAddress.currentAddress,
            Hash.hashDataForFisherBridge(
                addressToReceive,
                address(0), // Native coins
                priorityFee,
                amount
            ),
            fisherExecutor.current,
            nonce,
            true
        ),
        signature
    ) != from
) revert CoreError.InvalidSignature();
```

Validates EIP-191 signature by recovering the signer and comparing to `from` address. Uses `SignatureRecover.recoverSigner()` with payload built by `AdvancedStrings.buildSignaturePayload()`.


For more information about the signature structure, refer to the [Fisher Bridge Signature Structure](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md).


### 3. Payment Validation
```solidity
if (msg.value != amount + priorityFee)
    revert Error.InsufficientBalance();
```

Ensures the fisher executor sends exactly the required amount:
- `amount`: Native coins for deposit to EVVM
- `priorityFee`: Fee paid to the fisher executor

### 4. Mark Nonce as Used
```solidity
asyncNonce[from][nonce] = true;
```
Marks this nonce as consumed to prevent replay attacks.

### 5. Event Emission
```solidity
emit FisherBridgeSend(
    from,
    addressToReceive,
    address(0), // Native coins
    priorityFee,
    amount,
    nonce
);
```

Emits event with transfer details for cross-chain coordination.

## Native Coin Handling

### Payment Structure
The `msg.value` must equal the sum of:
- **Deposit Amount**: Native coins to be credited in EVVM
- **Priority Fee**: Compensation for the fisher executor

### Value Validation
```solidity
Total Required = amount + priorityFee
msg.value must equal Total Required
```

Unlike ERC20 deposits, native coin deposits require exact payment matching.

## Event Definition

```solidity
event FisherBridgeSend(
    address indexed from,
    address indexed addressToReceive,
    address indexed tokenAddress, // address(0) for native coins
    uint256 priorityFee,
    uint256 amount,
    uint256 nonce
);
```

### Event Parameters
- `from`: User who authorized the deposit (indexed)
- `addressToReceive`: Recipient on EVVM (indexed)
- `tokenAddress`: `address(0)` for native coins (indexed)
- `priorityFee`: Fee paid to fisher executor
- `amount`: Native coin deposit amount
- `nonce`: Execution nonce used for this transaction

## Cross-Chain Processing

### Host Chain Coordination
1. **Event Monitoring**: Host chain services monitor for `FisherBridgeSend` events with `tokenAddress == address(0)`
2. **Native Coin Recognition**: Identify native coin deposits by zero address
3. **EVVM Credit**: Host chain station credits `addressToReceive` with `amount` of native coins
4. **Fee Handling**: Priority fee management through EVVM balance system

### Signature Consistency
The signature format includes `address(0)` for native coins, ensuring consistency between external and host chain validation.

## Fisher Bridge Benefits

### For Users
- **Gasless Deposits**: Users don't pay gas fees on external chain
- **Direct Payment**: Simple native currency payment to fisher
- **Signature Authorization**: Single signature authorizes the deposit

### For Fisher Executors
- **Priority Fees**: Earn fees in native currency
- **Direct Payment**: Receive both deposit and fee in single transaction
- **Service Revenue**: Generate income from cross-chain deposit facilitation

## Security Features

### Signature Security
- **EIP-191 Standard**: Uses Ethereum's signed message standard (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))
- **SignatureRecover**: Uses `SignatureRecover.recoverSigner()` to validate signatures
- **AdvancedStrings**: Payload built with `AdvancedStrings.buildSignaturePayload()`
- **Native Coin Identifier**: `address(0)` clearly identifies native coin deposits
- **Replay Protection**: `asyncNonce` mapping prevents signature reuse
- **Parameter Binding**: Signature tied to specific deposit parameters

### Payment Security
- **Exact Value Matching**: Requires precise payment amount
- **Atomic Operation**: Payment and validation in single transaction
- **Fee Transparency**: Clear separation of deposit amount and priority fee

### Access Control
- **Fisher Authorization**: Only authorized executors can accept deposits
- **Signature Validation**: Cryptographic proof of user consent required (see [signature format](../../../../05-SignatureStructures/04-Treasury/01-FisherBridgeSignatureStructure.md))

## Error Conditions

| Error | Condition |
|-------|-----------|  
| `CoreError.AsyncNonceAlreadyUsed()` | Nonce has already been used for this user |
| `CoreError.InvalidSignature()` | Signature verification fails |
| `Error.InsufficientBalance()` | `msg.value != amount + priorityFee` |
| Access Control Revert | Called by unauthorized address |

## Usage Flow

1. **User Intent**: User wants to deposit native coins to EVVM
2. **Signature Creation**: User signs authorization message with deposit details
3. **Fisher Payment**: Fisher sends `amount + priorityFee` in native currency
4. **Fisher Execution**: Fisher calls `fisherBridgeSendCoin` with signature
5. **Validation**: Function validates signature and payment amount
6. **Event Emission**: Event emitted for cross-chain coordination
7. **Cross-Chain**: Host chain services process the deposit to EVVM
8. **Balance Credit**: Recipient receives native coins in EVVM balance

## Payment Example

For a deposit of 1 ETH with 0.01 ETH priority fee:

```solidity
fisherBridgeSendCoin{value: 1.01 ether}(
    userAddress,
    recipientAddress, 
    0.01 ether, // priorityFee
    1 ether,    // amount
    userNonce,  // nonce
    signature
);
```

Result:
- **External Station**: Receives 1.01 ETH
- **EVVM Credit**: Recipient gets 1 ETH balance
- **Fisher Fee**: 0.01 ETH compensation

## Integration Requirements

### Off-Chain Services
- **Event Monitoring**: Listen for `FisherBridgeSend` events with `address(0)`
- **Native Coin Processing**: Handle native currency cross-chain transfers
- **Nonce Synchronization**: Maintain coordination with host chain

### Payment Coordination
- **User-Fisher Agreement**: Establish terms for deposit and fee amounts
- **Payment Verification**: Ensure correct value transmission
- **Cross-Chain Messaging**: Coordinate with host chain for EVVM crediting

> **Warning: Exact Payment Required**
The fisher executor must send exactly `amount + priorityFee` in native currency. Any deviation will cause transaction failure.

> **Note: Native Coin Representation**
Native coins are consistently represented as `address(0)` throughout the system, from signature creation to EVVM balance crediting.

---

## Admin Functions(03-ExternalChainStation)


The Treasury External Chain Station includes comprehensive administrative functions with time-delayed governance, following the same security patterns as the host chain station but adapted for external chain operations.

## Admin Management

### proposeAdmin

**Function Type**: `external`  
**Function Signature**: `proposeAdmin(address)`  
**Access Control**: `onlyAdmin`

Proposes a new admin address with a mandatory 1-day time delay for security.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `_newOwner` | `address` | Address of the proposed new admin |

#### Workflow
1. **Validation**: Ensures new address is not zero address or current admin
2. **Proposal Setup**: Sets `admin.proposal = _newOwner`
3. **Time Lock**: Sets `admin.timeToAccept = block.timestamp + 1 minutes` (current testnet/dev setting; production may use `+ 1 days`)

### rejectProposalAdmin

**Function Type**: `external`  
**Function Signature**: `rejectProposalAdmin()`  
**Access Control**: `onlyAdmin`

Cancels a pending admin change proposal.

### acceptAdmin

**Function Type**: `external`  
**Function Signature**: `acceptAdmin()`  
**Access Control**: Proposed admin only

Accepts a pending admin proposal and completes the admin transition.

## Fisher Executor Management

### proposeFisherExecutor

**Function Type**: `external`  
**Function Signature**: `proposeFisherExecutor(address)`  
**Access Control**: `onlyAdmin`

Proposes a new fisher executor with the same time-delay mechanism.

### rejectProposalFisherExecutor

**Function Type**: `external`  
**Function Signature**: `rejectProposalFisherExecutor()`  
**Access Control**: `onlyAdmin`

Cancels a pending fisher executor change proposal.

### acceptFisherExecutor

**Function Type**: `external`  
**Function Signature**: `acceptFisherExecutor()`  
**Access Control**: Proposed fisher executor only

Accepts a pending fisher executor proposal.

## Cross-Chain Configuration

### setHostChainAddress

**Function Type**: `external`  
**Function Signature**: `setHostChainAddress(bytes32,string)`  
**Access Control**: `onlyAdmin`

Configures the host chain station address for all supported cross-chain protocols.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `hostChainStationAddressBytes32` | `bytes32` | Host station address in bytes32 format (for Hyperlane and LayerZero) |
| `hostChainStationAddressString` | `string` | Host station address in string format (for Axelar) |

#### Workflow
```solidity
function setHostChainAddress(
    bytes32 hostChainStationAddressBytes32,
    string memory hostChainStationAddressString
) external onlyAdmin {
    hyperlane.hostChainStationAddress = hostChainStationAddressBytes32;
    layerZero.hostChainStationAddress = hostChainStationAddressBytes32;
    axelar.hostChainStationAddress = hostChainStationAddressString;
    _setPeer(
        layerZero.hostChainStationEid,
        layerZero.hostChainStationAddress
    );
}
```

## Getter Functions

### getAdmin

**Function Type**: `external view`  
**Function Signature**: `getAdmin()`  
**Returns**: `AddressTypeProposal memory`

Returns the complete admin state including current admin, proposed admin, and acceptance timestamp.

### getFisherExecutor

**Function Type**: `external view`  
**Function Signature**: `getFisherExecutor()`  
**Returns**: `AddressTypeProposal memory`

Returns the complete fisher executor state.

### getIfUsedAsyncNonce

**Function Type**: `external view`  
**Function Signature**: `getIfUsedAsyncNonce(address, uint256)`  
**Returns**: `bool`

Checks if a specific nonce has been used for a user's Fisher bridge operations.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | User address to query |
| `nonce` | `uint256` | Nonce value to check |

### Configuration Getters

#### getHyperlaneConfig
**Returns**: `HyperlaneConfig memory`
```solidity
struct HyperlaneConfig {
    uint32 hostChainStationDomainId;
    bytes32 hostChainStationAddress;
    address mailboxAddress;
}
```

#### getLayerZeroConfig
**Returns**: `LayerZeroConfig memory`
```solidity
struct LayerZeroConfig {
    uint32 hostChainStationEid;
    bytes32 hostChainStationAddress;
    address endpointAddress;
}
```

#### getAxelarConfig
**Returns**: `AxelarConfig memory`
```solidity
struct AxelarConfig {
    string hostChainStationChainName;
    string hostChainStationAddress;
    address gasServiceAddress;
    address gatewayAddress;
}
```

#### getOptions
**Returns**: `bytes memory`

Returns the LayerZero execution options used for cross-chain messaging.

## External Chain Specific Features

### Asset Management
Unlike the host chain station, the external chain station:
- **Holds Real Assets**: Manages actual ERC20 tokens and native coins
- **No EVVM Integration**: Doesn't directly interact with EVVM balances
- **Transfer Execution**: Handles final asset delivery to users

### Cross-Chain Coordination
- **Message Reception**: Receives withdrawal instructions from host chain
- **Asset Distribution**: Transfers tokens/coins to specified recipients
- **Event Emission**: Signals deposit operations for host chain processing

## Security Features

### Time-Delayed Governance
- **1-Day Delay**: All role changes require 24-hour waiting period
- **Proposal/Accept Pattern**: Two-step process prevents accidental changes
- **Emergency Rejection**: Current admin can cancel pending proposals

### Asset Security
- **Real Asset Custody**: Manages actual tokens and native coins
- **Transfer Validation**: Ensures sufficient balances before transfers
- **Address Verification**: Validates recipient addresses for asset delivery

### Cross-Chain Security
- **Protocol Authentication**: Validates messages from authorized host chain station
- **Address Configuration**: Secure setup of cross-chain communication endpoints
- **Message Integrity**: Ensures accurate parameter transmission across chains

## Configuration Requirements

### Host Chain Setup
Before calling `setHostChainAddress`:
1. **Host Station Deployment**: Ensure host chain station is deployed and configured
2. **Address Verification**: Confirm both bytes32 and string formats represent same address
3. **Protocol Compatibility**: Verify host station supports all three protocols

### Asset Requirements
For proper operation, ensure:
1. **Token Holdings**: Sufficient ERC20 token balances for withdrawal processing
2. **Native Balance**: Adequate native coins for user withdrawals and gas fees
3. **Allowance Management**: Proper token approval mechanisms if needed

## Error Conditions

Similar to host chain station:
- **Access Control**: Unauthorized calls to admin-only functions
- **Time Validation**: Premature acceptance attempts
- **Address Validation**: Invalid or duplicate address proposals

## Governance Flow

The administrative flow mirrors the host chain station:
1. **Proposal**: Current admin proposes changes
2. **Time Delay**: 24-hour waiting period
3. **Acceptance**: Proposed address accepts the role
4. **Completion**: Role transfer and state cleanup

> **Warning: Cross-Chain Coordination**
When changing admin or fisher executor roles, ensure coordination between host and external chain stations to maintain synchronized operations.

> **Note: Asset Custody Responsibility**
The external chain station holds real assets and is responsible for their secure management and distribution. Admin changes affect control over these assets.

---

## P2P Swap Contract Overview


> **Note: Signature Verification**
P2PSwap uses Core.sol's centralized signature verification via `validateAndConsumeNonce()` with hash-based operation validation through `P2PSwapHashUtils`.

The P2P Swap Contract is a decentralized token exchange system enabling trustless peer-to-peer token swaps with an order book marketplace.

## Core Features

### Order Management
- **Order Creation (`makeOrder`)**: Create swap orders offering one token for another
- **Order Cancellation (`cancelOrder`)**: Cancel unfilled orders and reclaim tokens
- **Order Fulfillment**: Two dispatch methods with different fee structures
- **Market Discovery**: Automatic market creation for new token pairs

### Fee Structures
- **Proportional Fee**: Percentage-based fees (configurable rate, default 5%)
- **Fixed Fee**: Capped fees with maximum limits (default 0.001 ETH) and 10% tolerance
- **Three-Way Distribution**: Fees split between sellers (50%), MATE stakers (10%), service treasury (40%)

### Integration
- **Core.sol**: Centralized signature verification and nonce management
- **P2PSwapHashUtils**: Hash generation for all operations
- **Token Transfers**: via `requestPay()` (lock) and `makeCaPay()` (release)
- **Staking Rewards**: 2-5x MATE rewards for staker executors
- **EIP-191 Signatures**: Authorization for all operations

## Architecture

### Centralized Verification Pattern

All P2PSwap user functions follow this pattern:

```solidity
// 1. Centralized signature verification
core.validateAndConsumeNonce(
    user,
    P2PSwapHashUtils.hashDataFor[Operation](...),
    originExecutor,  // or address(0) for makeOrder
    nonce,
    true,            // Always async execution
    signature
);

// 2. Operation-specific business logic
// ... market lookup, order validation ...

// 3. Token transfers via Core
requestPay(user, token, amount, priorityFee, nonceEvvm, true, signatureEvvm);
makeCaPay(recipient, token, amount);

// 4. Staker rewards
if (core.isAddressStaker(msg.sender)) {
    makeCaPay(msg.sender, MATE_TOKEN_ADDRESS, priorityFee);
}
_rewardExecutor(msg.sender, 2-5x);
```

### Hash Functions

P2PSwap uses `P2PSwapHashUtils` for operation-specific hash generation:

```solidity
// makeOrder: Locks tokenA and creates order
hashDataForMakeOrder(tokenA, tokenB, amountA, amountB)

// cancelOrder: Refunds tokenA and deletes order
hashDataForCancelOrder(tokenA, tokenB, orderId)

// dispatchOrder: Executes trade (both fee models use same hash)
hashDataForDispatchOrder(tokenA, tokenB, orderId)
```

### Signature Format

Universal signature format for all P2PSwap operations:

```
{evvmId},{p2pSwapAddress},{hashPayload},{originExecutor},{nonce},true
```

Where:
- `evvmId`: Chain ID (from `block.chainid`)
- `p2pSwapAddress`: P2PSwap contract address
- `hashPayload`: Result from `P2PSwapHashUtils.hashDataFor[Operation](...)`
- `originExecutor`: EOA address that will execute the transaction (verified with `tx.origin` in Core.sol), or `address(0)` for makeOrder
- `nonce`: User's nonce for P2PSwap service (from `core.getNonce(user, p2pSwapAddress)`)
- `true`: Always async execution (`isAsyncExec = true`)

### Nonce Management

**Current**: Centralized in Core.sol
- Query nonce: `core.getNonce(user, address(p2pSwap))`
- Automatic consumption: Handled by `core.validateAndConsumeNonce()`
- Per-user, per-service nonce tracking

**Current**: Centralized async nonces in Core.sol (unified tracking)
- ❌ `nonceP2PSwap[user][nonce]` (removed)
- ❌ `verifyAsyncNonce()` (removed)
- ❌ `markAsyncNonceAsUsed()` (removed)

### Payment Processing

P2PSwap uses two Core payment patterns:

**requestPay()** - Locks tokens in Core
```solidity
requestPay(user, token, amount, priorityFee, nonce, true, signature);
```
Used for:
- Locking tokenA when creating orders (makeOrder)
- Collecting tokenB + fees when filling orders (dispatchOrder)
- Collecting priority fees from users

**makeCaPay()** - Releases tokens from Core
```solidity
makeCaPay(recipient, token, amount);
```
Used for:
- Refunding tokenA when canceling (cancelOrder)
- Paying seller their tokenB (dispatchOrder)
- Distributing fees to stakers and service
- Transferring tokenA to buyer (dispatchOrder)

## Market Structure

### Market Creation

Markets are automatically created for new token pairs:

```solidity
marketId[tokenA][tokenB] = nextMarketId;
marketMetadata[marketId] = MarketInformation({
    tokenA: tokenA,
    tokenB: tokenB,
    maxSlot: 0,
    ordersAvailable: 0
});
```

**Key Properties:**
- Markets are bidirectional: `market(A,B)` handles both A→B and B→A orders
- Each market has independent order ID space (1, 2, 3...)
- Deleted orders leave gaps that get reused
- `maxSlot` tracks highest order ID ever used
- `ordersAvailable` counts active orders

### Order Storage

Orders stored per-market:

```solidity
ordersInsideMarket[marketId][orderId] = Order({
    seller: userAddress,
    amountA: tokenA amount locked,
    amountB: tokenB amount required
});
```

**Order Lifecycle:**
1. **Created**: Seller locks tokenA, order active
2. **Filled**: Buyer pays tokenB + fee, receives tokenA, order deleted
3. **Cancelled**: Seller reclaims tokenA, order deleted

## Economic Model

### Fee Distribution (Proportional & Fixed)

When an order is filled, fees are distributed:

| Recipient | Share | Purpose |
|-----------|-------|---------|
| **Seller** | 50% of fee | Reward for providing liquidity |
| **Service Treasury** | 40% of fee | Protocol sustainability |
| **MATE Stakers** | 10% of fee | Staker rewards pool |

**Default Fee Rate**: 5% (500 / 10,000)

**Example** (100 USDC order with 5% fee):
- Fee: 5 USDC
- Seller receives: 100 USDC (order amount) + 2.5 USDC (50% of fee)
- Treasury accumulates: 2 USDC (40% of fee)
- Stakers share: 0.5 USDC (10% of fee)

### Fixed Fee Model

**Purpose**: Protects buyers from excessive fees on large orders

**Mechanism:**
```
proportionalFee = (amountB * percentageFee) / 10,000
fixedFee = min(proportionalFee, maxLimitFillFixedFee)

// 10% tolerance range
minRequired = amountB + (fixedFee * 90%)
maxRequired = amountB + fixedFee

// Buyer can pay anywhere in range
if (paid >= minRequired && paid <= maxRequired) {
    actualFee = paid - amountB
}
```

**Tolerance Benefit:**
- Allows UI flexibility for fee display
- Handles rounding differences
- User can choose exact payment amount

**Default Cap**: 0.001 ETH (~$2-3 at typical prices)

### Staker Rewards

Executors who are registered stakers receive MATE token rewards:

| Operation | Base Reward | With Priority | Notes |
|-----------|-------------|---------------|-------|
| **makeOrder** | 2x | 3x | Order creation |
| **cancelOrder** | 2x | 3x | Order cancellation |
| **dispatchOrder** | 4x | 5x | Order fulfillment (+ refund handling) |

Where `1x = core.getRewardAmount()` (MATE tokens)

**Priority Fee:** Additional MATE paid by user to executor
- Optional but incentivizes faster execution
- Paid before operation execution
- Distributed to executor if they're a staker

## Operation Summary

| Operation | Purpose | Hash Function | originExecutor |
|-----------|---------|---------------|----------------|
| **makeOrder** | Create order, lock tokenA | hashDataForMakeOrder(tokenA, tokenB, amountA, amountB) | ❌ address(0) |
| **cancelOrder** | Cancel order, refund tokenA | hashDataForCancelOrder(tokenA, tokenB, orderId) | ✅ Yes |
| **dispatchOrder_fillPropotionalFee** | Fill order with % fee | hashDataForDispatchOrder(tokenA, tokenB, orderId) | ✅ Yes |
| **dispatchOrder_fillFixedFee** | Fill order with capped fee | hashDataForDispatchOrder(tokenA, tokenB, orderId) | ✅ Yes |

## Admin Functions

P2PSwap includes time-locked governance for parameter updates:

- **Fee Configuration**: Update `percentageFee` (proportional model)
- **Cap Configuration**: Update `maxLimitFillFixedFee` (fixed model)
- **Reward Percentages**: Adjust seller/service/staker fee splits
- **Ownership Transfer**: Propose and accept new owner
- **Treasury Withdrawal**: Extract accumulated service fees

All admin changes require a time-lock period before acceptance.

## Security Features

- ✅ **Nonce Protection**: Centralized Core.sol nonce prevents replay attacks
- ✅ **Signature Validation**: EIP-191 signatures for all operations
- ✅ **Ownership Verification**: Only order owner can cancel
- ✅ **Atomic Operations**: Order fill is atomic (payment → transfer → delete)
- ✅ **Token Locking**: User tokens locked in Core.sol during order lifetime
- ✅ **Fee Validation**: Fixed fee model includes minimum payment checks
- ✅ **Overpayment Refund**: Excess payments automatically refunded

---

**License**: EVVM-NONCOMMERCIAL-1.0  
**Contract**: P2PSwap.sol  
**License**: EVVM-NONCOMMERCIAL-1.0

---

## makeOrder Function

# makeOrder

> **Note: Signature Verification**
makeOrder uses Core.sol's centralized signature verification via `validateAndConsumeNonce()` with `P2PSwapHashUtils.hashDataForMakeOrder()`. Note: makeOrder uses `address(0)` as originExecutor.

**Function Signature**:
```solidity
function makeOrder(
    address user,
    MetadataMakeOrder memory metadata,
    bytes memory signature,
    uint256 priorityFeeEvvm,
    uint256 nonceEvvm,
    bytes memory signatureEvvm
) external returns (uint256 market, uint256 orderId)
```

Creates a new token swap order in the P2P marketplace, locking tokenA in Core.sol and opening an order slot for future fulfillment.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Order creator whose tokens will be locked |
| `metadata` | `MetadataMakeOrder` | Order details (nonce, tokenA, tokenB, amountA, amountB) |
| `signature` | `bytes` | EIP-191 signature from `user` for operation authorization |
| `priorityFeeEvvm` | `uint256` | Optional MATE priority fee for faster execution |
| `nonceEvvm` | `uint256` | Nonce for Core payment transaction (locks tokenA) |
| `signatureEvvm` | `bytes` | Signature for Core payment authorization |

### MetadataMakeOrder Structure

```solidity
struct MetadataMakeOrder {
    uint256 nonce;    // Core nonce for P2PSwap service
    address tokenA;   // Token being offered
    address tokenB;   // Token being requested
    uint256 amountA;  // Amount of tokenA to lock
    uint256 amountB;  // Amount of tokenB required to fill
}
```

## Return Values

| Value | Type | Description |
|-------|------|-------------|
| `market` | `uint256` | ID of the market (auto-created if new pair) |
| `orderId` | `uint256` | Unique ID of the order within the market |

## Signature Requirements

> **Note: Operation Hash**
```solidity
bytes32 hashPayload = P2PSwapHashUtils.hashDataForMakeOrder(
    metadata.tokenA,
    metadata.tokenB,
    metadata.amountA,
    metadata.amountB
);
```

**Signature Format**:
```
{evvmId},{p2pSwapAddress},{hashPayload},{address(0)},{nonce},true
```

**Important**: makeOrder uses `address(0)` as originExecutor because it doesn't restrict who can execute (anyone can submit the transaction). Other P2PSwap operations specify the EOA executor.

**Payment Signature**: Separate signature required for locking tokenA via Core.pay().

## Execution Flow

### 1. Centralized Verification
```solidity
core.validateAndConsumeNonce(
    user,
    P2PSwapHashUtils.hashDataForMakeOrder(
        metadata.tokenA,
        metadata.tokenB,
        metadata.amountA,
        metadata.amountB
    ),
    address(0),        // makeOrder doesn't use originExecutor
    metadata.nonce,
    true,              // Always async execution
    signature
);
```

**Validates**:
- Signature authenticity via EIP-191
- Nonce hasn't been consumed
- Hash matches order parameters
- User authorization
- originExecutor = address(0) (no restriction on who executes)

**On Failure**:
- `Core__InvalidSignature()` - Invalid or mismatched signature
- `Core__NonceAlreadyUsed()` - Nonce already consumed

### 2. Lock TokenA
```solidity
requestPay(
    user,
    metadata.tokenA,
    metadata.amountA,
    priorityFeeEvvm,
    nonceEvvm,
    true,              // Always async
    signatureEvvm
);
```

**Action**: Transfers `amountA` of `tokenA` from user to Core.sol, locking it for order lifetime.

### 3. Market Resolution
```solidity
market = findMarket(metadata.tokenA, metadata.tokenB);
if (market == 0) {
    market = createMarket(metadata.tokenA, metadata.tokenB);
}
```

**Automatic Creation**: If no market exists for this token pair, creates new market with unique ID.

**Market Storage**:
```solidity
marketId[tokenA][tokenB] = nextMarketId;
marketMetadata[nextMarketId] = MarketInformation({
    tokenA: tokenA,
    tokenB: tokenB,
    maxSlot: 0,
    ordersAvailable: 0
});
```

### 4. Order ID Assignment
```solidity
if (marketMetadata[market].maxSlot == marketMetadata[market].ordersAvailable) {
    // All slots filled, create new slot
    marketMetadata[market].maxSlot++;
    marketMetadata[market].ordersAvailable++;
    orderId = marketMetadata[market].maxSlot;
} else {
    // Find first available slot (from cancelled orders)
    for (uint256 i = 1; i <= marketMetadata[market].maxSlot + 1; i++) {
        if (ordersInsideMarket[market][i].seller == address(0)) {
            orderId = i;
            break;
        }
    }
    marketMetadata[market].ordersAvailable++;
}
```

**Slot Reuse**: Cancelled orders leave gaps that get reused for efficiency.

### 5. Order Storage
```solidity
ordersInsideMarket[market][orderId] = Order({
    seller: user,
    amountA: metadata.amountA,
    amountB: metadata.amountB
});
```

### 6. Staker Rewards
```solidity
if (core.isAddressStaker(msg.sender)) {
    if (priorityFeeEvvm > 0) {
        makeCaPay(msg.sender, metadata.tokenA, priorityFeeEvvm);
    }
}

_rewardExecutor(msg.sender, priorityFeeEvvm > 0 ? 3 : 2);
```

**Rewards**:
- **Priority Fee**: MATE tokens paid upfront (if > 0)
- **Base Reward**: 2x MATE (no priority) or 3x MATE (with priority)
- **Requirement**: msg.sender must be registered staker

## Complete Usage Example

```solidity
// Scenario: Create order offering 1000 USDC for 0.5 ETH
address user = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0;
address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
address eth = 0x0000000000000000000000000000000000000000;

// 1. Get current nonce
uint256 nonce = core.getNonce(user, address(p2pSwap));

// 2. Create order metadata
MetadataMakeOrder memory metadata = MetadataMakeOrder({
    nonce: nonce,
    tokenA: usdc,
    tokenB: eth,
    amountA: 1000 * 10**6,      // 1000 USDC (6 decimals)
    amountB: 0.5 ether          // 0.5 ETH
});

// 3. Generate hash for signature
bytes32 hashPayload = P2PSwapHashUtils.hashDataForMakeOrder(
    metadata.tokenA,
    metadata.tokenB,
    metadata.amountA,
    metadata.amountB
);

// 4. Create signature message
string memory message = string.concat(
    Strings.toString(block.chainid), ",",
    Strings.toHexString(address(p2pSwap)), ",",
    Strings.toHexString(uint256(hashPayload)), ",",
    Strings.toHexString(address(0)), ",",        // makeOrder uses address(0)
    Strings.toString(nonce), ",true"
);

// 5. User signs with EIP-191
bytes memory signature = signMessage(message, userPrivateKey);

// 6. Generate payment signature for locking USDC
uint256 nonceEvvm = core.getNonce(user, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    user,
    usdc,
    metadata.amountA,
    0,                  // No priority fee in payment
    nonceEvvm,
    true
);

// 7. Execute makeOrder
(uint256 marketId, uint256 orderId) = p2pSwap.makeOrder(
    user,
    metadata,
    signature,
    1 ether,            // 1 MATE priority fee
    nonceEvvm,
    signatureEvvm
);

// Result:
// - 1000 USDC locked in Core.sol
// - Order created in USDC/ETH market
// - Staker executor receives 1 MATE (priority) + 3x MATE (reward)
// - Order ID returned for future reference
```

## Gas Costs

Estimated gas consumption:

| Scenario | Gas Cost | Notes |
|----------|----------|-------|
| **Existing Market** | ~180,000 gas | Reusing slot |
| **Existing Market (new slot)** | ~200,000 gas | Incrementing maxSlot |
| **New Market** | ~250,000 gas | Market creation overhead |
| **New Pair + New Slot** | ~270,000 gas | Full initialization |

**Variable Factors**:
- Token type (ERC20 vs ETH)
- Market state (existing vs new)
- Slot reuse (gap vs new)

## Economic Model

### User Costs
- **Order Creation**: Free (only gas)
- **Token Lock**: No fee (tokens locked, not spent)
- **Priority Fee**: Optional MATE payment for faster execution

### Staker Revenue
| Component | Amount | Condition |
|-----------|--------|-----------|
| **Priority Fee** | User-defined | If priorityFeeEvvm > 0 |
| **Base Reward** | 2x MATE | No priority fee |
| **Enhanced Reward** | 3x MATE | With priority fee |

**Profitability**: makeOrder is moderately profitable due to base MATE rewards.

## Error Handling

### Core.sol Errors
- `Core__InvalidSignature()` - Signature validation failed
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidExecutor()` - (Not applicable, uses address(0))
- `Core__InsufficientBalance()` - User lacks tokenA balance

### P2PSwap Errors
- `"Insuficient balance"` - User cannot lock required tokenA amount

## State Changes

**Order Created**:
- `ordersInsideMarket[market][orderId]` - New Order stored
- `marketMetadata[market].ordersAvailable++` - Incremented
- `marketMetadata[market].maxSlot++` - If creating new slot

**Market Created** (if new pair):
- `marketCount++` - Global market counter
- `marketId[tokenA][tokenB]` - New market ID assigned
- `marketMetadata[marketId]` - Market info initialized

**Token Locked**:
- User's tokenA balance in Core.sol reduced by amountA

## Related Functions

- [cancelOrder](./02-cancelOrder.md) - Cancel order and reclaim tokenA
- [dispatchOrder (Proportional)](./03-dispatchOrder-proportional.md) - Fill order with % fee
- [dispatchOrder (Fixed)](./04-dispatchOrder-fixed.md) - Fill order with capped fee
- [Getter Functions](../03-GetterFunctions.md) - Query markets and orders

---

**License**: EVVM-NONCOMMERCIAL-1.0  
**Gas Estimate**: 180k-270k gas  
**Staker Reward**: 2-3x MATE

---

## cancelOrder Function

# cancelOrder

> **Note: Signature Verification**
cancelOrder uses Core.sol's centralized signature verification via `validateAndConsumeNonce()` with `P2PSwapHashUtils.hashDataForCancelOrder()`. Includes `originExecutor` parameter.

**Function Signature**:
```solidity
function cancelOrder(
    address user,
    MetadataCancelOrder memory metadata,
    uint256 priorityFeeEvvm,
    uint256 nonceEvvm,
    bytes memory signatureEvvm
) external
```

Cancels an existing order and refunds locked tokenA to the order creator. Only the original order owner can cancel.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Order owner requesting cancellation |
| `metadata` | `MetadataCancelOrder` | Cancellation details including originExecutor, nonce, and signature |
| `priorityFeeEvvm` | `uint256` | Optional MATE priority fee for faster execution |
| `nonceEvvm` | `uint256` | Nonce for Core payment transaction (for priority fee) |
| `signatureEvvm` | `bytes` | Signature for Core payment authorization (if priority fee > 0) |

### MetadataCancelOrder Structure

```solidity
struct MetadataCancelOrder {
    address tokenA;           // Token originally offered
    address tokenB;           // Token originally requested
    uint256 orderId;          // Order ID to cancel
    address originExecutor;   // EOA that will execute (verified with tx.origin)
    uint256 nonce;            // Core nonce for P2PSwap service
    bytes signature;          // User's authorization signature
}
```

## Signature Requirements

> **Note: Operation Hash**
```solidity
bytes32 hashPayload = P2PSwapHashUtils.hashDataForCancelOrder(
    metadata.tokenA,
    metadata.tokenB,
    metadata.orderId
);
```

**Signature Format**:
```
{evvmId},{p2pSwapAddress},{hashPayload},{originExecutor},{nonce},true
```

**Payment Signature** (if priorityFeeEvvm > 0): Separate MATE payment signature required.

## Execution Flow

### 1. Centralized Verification
```solidity
core.validateAndConsumeNonce(
    user,
    P2PSwapHashUtils.hashDataForCancelOrder(
        metadata.tokenA,
        metadata.tokenB,
        metadata.orderId
    ),
    metadata.originExecutor,
    metadata.nonce,
    true,                      // Always async execution
    metadata.signature
);
```

**Validates**:
- Signature authenticity via EIP-191
- Nonce hasn't been consumed
- Hash matches cancellation parameters
- Executor is the specified EOA (via `tx.origin`)

**On Failure**:
- `Core__InvalidSignature()` - Invalid or mismatched signature
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Market & Order Lookup
```solidity
uint256 market = findMarket(metadata.tokenA, metadata.tokenB);

_validateOrderOwnership(market, metadata.orderId, user);
```

**Validation**:
- Market exists (market != 0)
- Order exists (seller != address(0))
- User owns the order (seller == user)

**On Failure**:
- `"Invalid order"` - Order doesn't exist or user not owner

### 3. Priority Fee Collection (Optional)
```solidity
if (priorityFeeEvvm > 0) {
    requestPay(
        user,
        MATE_TOKEN_ADDRESS,
        0,                     // No principal payment
        priorityFeeEvvm,
        nonceEvvm,
        true,                  // Always async
        signatureEvvm
    );
}
```

**Action**: If priority fee specified, collects MATE from user for executor reward.

### 4. Refund TokenA
```solidity
makeCaPay(
    user,
    metadata.tokenA,
    ordersInsideMarket[market][metadata.orderId].amountA
);
```

**Action**: Returns original locked tokenA amount from Core.sol to user.

### 5. Clear Order
```solidity
_clearOrderAndUpdateMarket(market, metadata.orderId);
```

**State Changes**:
- `ordersInsideMarket[market][orderId].seller = address(0)` - Marks order as deleted
- `marketMetadata[market].ordersAvailable--` - Decrements active order count
- Order slot becomes available for reuse

### 6. Staker Rewards
```solidity
if (core.isAddressStaker(msg.sender) && priorityFeeEvvm > 0) {
    makeCaPay(msg.sender, MATE_TOKEN_ADDRESS, priorityFeeEvvm);
}

_rewardExecutor(msg.sender, priorityFeeEvvm > 0 ? 3 : 2);
```

**Rewards**:
- **Priority Fee**: MATE tokens (if > 0)
- **Base Reward**: 2x MATE (no priority) or 3x MATE (with priority)
- **Requirement**: msg.sender must be registered staker

## Complete Usage Example

```solidity
// Scenario: Cancel order #5 in USDC/ETH market
address user = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0;
address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
address eth = 0x0000000000000000000000000000000000000000;
address executor = 0x123...;  // Authorized executor

// 1. Get current nonce
uint256 nonce = core.getNonce(user, address(p2pSwap));

// 2. Generate hash for signature
bytes32 hashPayload = P2PSwapHashUtils.hashDataForCancelOrder(
    usdc,
    eth,
    5  // orderId
);

// 3. Create signature message
string memory message = string.concat(
    Strings.toString(block.chainid), ",",
    Strings.toHexString(address(p2pSwap)), ",",
    Strings.toHexString(uint256(hashPayload)), ",",
    Strings.toHexString(executor), ",",
    Strings.toString(nonce), ",true"
);

// 4. User signs with EIP-191
bytes memory signature = signMessage(message, userPrivateKey);

// 5. Create metadata struct
MetadataCancelOrder memory metadata = MetadataCancelOrder({
    tokenA: usdc,
    tokenB: eth,
    orderId: 5,
    originExecutor: executor,
    nonce: nonce,
    signature: signature
});

// 6. Generate payment signature for priority fee (optional)
uint256 priorityFee = 2 ether;  // 2 MATE
uint256 nonceEvvm = core.getNonce(user, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    user,
    MATE_TOKEN_ADDRESS,
    0,                  // No principal
    priorityFee,
    nonceEvvm,
    true
);

// 7. Execute cancelOrder
p2pSwap.cancelOrder(
    user,
    metadata,
    priorityFee,
    nonceEvvm,
    signatureEvvm
);

// Result:
// - Original locked USDC refunded to user
// - Order #5 marked as deleted
// - Market ordersAvailable decremented
// - Staker executor receives 2 MATE (priority) + 3x MATE (reward)
```

## Gas Costs

Estimated gas consumption:

| Scenario | Gas Cost | Notes |
|----------|----------|-------|
| **No Priority Fee** | ~140,000 gas | Basic cancellation + refund |
| **With Priority Fee** | ~180,000 gas | Includes MATE payment processing |
| **First Market Cancellation** | ~150,000 gas | Additional storage updates |

**Variable Factors**:
- Token type (ERC20 vs ETH)
- Priority fee (adds payment processing)
- Market state (first vs subsequent cancellations)

## Economic Model

### User Costs
- **Cancellation Fee**: None (only gas)
- **Priority Fee**: Optional MATE payment for faster execution
- **Refund**: Full tokenA amount returned

### User Benefits
- ✅ 100% refund of locked tokens
- ✅ No cancellation penalty
- ✅ Immediate token availability

### Staker Revenue
| Component | Amount | Condition |
|-----------|--------|-----------|
| **Priority Fee** | User-defined MATE | If priorityFeeEvvm > 0 |
| **Base Reward** | 2x MATE | No priority fee |
| **Enhanced Reward** | 3x MATE | With priority fee |

**Profitability**: cancelOrder is moderately profitable for stakers with priority fees.

## Error Handling

### Core.sol Errors
- `Core__InvalidSignature()` - Signature validation failed
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidExecutor()` - Unauthorized executor attempting execution

### P2PSwap Errors
- `"Invalid order"` - Order doesn't exist, wrong user, or already cancelled
- Market not found (internal validation)

## State Changes

**Order Cancelled**:
- `ordersInsideMarket[market][orderId].seller = address(0)` - Order deleted
- `marketMetadata[market].ordersAvailable--` - Active count decreased

**Token Refunded**:
- User's tokenA balance in Core.sol increased by original amountA

**Slot Available**:
- Order ID becomes available for reuse in future makeOrder calls

## Use Cases

### User Initiated
- **Price Change**: Original exchange rate no longer favorable
- **Need Liquidity**: Urgent need for locked tokens
- **Market Shift**: Better opportunities elsewhere

### Strategic Cancellation
- **Before Expiry**: Cancel before market conditions worsen
- **Partial Fill**: Cancel if only partial fills acceptable
- **Update Terms**: Cancel and create new order with different parameters

## Related Functions

- [makeOrder](./01-makeOrder.md) - Create new order after cancellation
- [dispatchOrder (Proportional)](./03-dispatchOrder-proportional.md) - Alternative: let order be filled
- [dispatchOrder (Fixed)](./04-dispatchOrder-fixed.md) - Alternative: let order be filled
- [Getter Functions](../03-GetterFunctions.md) - Query order details before cancelling

---

**License**: EVVM-NONCOMMERCIAL-1.0  
**Gas Estimate**: 140k-180k gas  
**Staker Reward**: 2-3x MATE  
**Refund**: 100% tokenA

---

## dispatchOrder_fillPropotionalFee


> **Note: Signature Verification**
dispatchOrder_fillPropotionalFee uses Core.sol's centralized verification via `validateAndConsumeNonce()` with `P2PSwapHashUtils.hashDataForDispatchOrder()`. Includes `originExecutor` parameter.

**Function Signature**:
```solidity
function dispatchOrder_fillPropotionalFee(
    address user,
    MetadataDispatchOrder memory metadata,
    uint256 priorityFeeEvvm,
    uint256 nonceEvvm,
    bytes memory signatureEvvm
) external
```

Fills an existing order using a proportional fee model where fee = `(amountB × percentageFee) / 10,000`. Transfers tokenA to buyer, pays seller with tokenB + fee share, distributes remaining fees.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Buyer address filling the order |
| `metadata` | `MetadataDispatchOrder` | Dispatch details including originExecutor, nonce, and signature |
| `priorityFeeEvvm` | `uint256` | Optional MATE priority fee for faster execution |
| `nonceEvvm` | `uint256` | Nonce for Core payment transaction (collects tokenB + fee) |
| `signatureEvvm` | `bytes` | Signature for Core payment authorization |

### MetadataDispatchOrder Structure

```solidity
struct MetadataDispatchOrder {
    address tokenA;                // Token buyer will receive
    address tokenB;                // Token buyer will pay
    uint256 orderId;               // Order ID to fill
    uint256 amountOfTokenBToFill;  // Amount to pay (must be >= amountB + fee)
    address originExecutor;        // EOA that will execute (verified with tx.origin)
    uint256 nonce;                 // Core nonce for P2PSwap service
    bytes signature;               // User's authorization signature
}
```

## Signature Requirements

> **Note: Operation Hash**
```solidity
bytes32 hashPayload = P2PSwapHashUtils.hashDataForDispatchOrder(
    metadata.tokenA,
    metadata.tokenB,
    metadata.orderId
);
```

**Note**: Both proportional and fixed fee variants use the **same hash function**.

**Signature Format**:
```
{evvmId},{p2pSwapAddress},{hashPayload},{originExecutor},{nonce},true
```

**Payment Signature**: Separate signature required for paying tokenB + fee via Core.pay().

## Fee Model

### Calculation
```solidity
fee = (orderAmountB × percentageFee) / 10,000

// Default: percentageFee = 500 (5%)
// Example: 100 USDC order → 5 USDC fee
```

### Distribution (Default: seller 50%, service 40%, staker 10%)

| Recipient | Share | Purpose |
|-----------|-------|---------|
| **Seller** | 50% | amountB + (fee × 50%) |
| **Service Treasury** | 40% | fee × 40% (accumulated) |
| **MATE Stakers** | 10% | fee × 10% (distributed) |

**Total to Buyer**: Must pay `amountB + fee`  
**Seller Receives**: `amountB + (fee × 50%)`  
**Example** (100 USDC order, 5 USDC fee):
- Buyer pays: 105 USDC
- Seller gets: 100 USDC (order) + 2.5 USDC (50% of fee) = 102.5 USDC
- Treasury: 2 USDC (40% of fee)
- Stakers: 0.5 USDC (10% of fee)

## Execution Flow

### 1. Centralized Verification
```solidity
core.validateAndConsumeNonce(
    user,
    P2PSwapHashUtils.hashDataForDispatchOrder(
        metadata.tokenA,
        metadata.tokenB,
        metadata.orderId
    ),
    metadata.originExecutor,
    metadata.nonce,
    true,                          // Always async execution
    metadata.signature
);
```

**Validates**:
- Signature authenticity via EIP-191
- Nonce hasn't been consumed
- Executor is the specified EOA (via `tx.origin`)

**On Failure**:
- `Core__InvalidSignature()` - Invalid signature
- `Core__NonceAlreadyUsed()` - Nonce consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Market & Order Lookup
```solidity
uint256 market = findMarket(metadata.tokenA, metadata.tokenB);

Order storage order = _validateMarketAndOrder(market, metadata.orderId);
```

**Validation**:
- Market exists
- Order exists (seller != address(0))
- Order is active

**On Failure**: Internal revert if invalid

### 3. Fee Calculation & Validation
```solidity
uint256 fee = calculateFillPropotionalFee(order.amountB);
// fee = (order.amountB * percentageFee) / 10_000

uint256 requiredAmount = order.amountB + fee;

if (metadata.amountOfTokenBToFill < requiredAmount) {
    revert("Insuficient amountOfTokenToFill");
}
```

**Required**: Buyer must provide at least `amountB + fee`

### 4. Collect Payment
```solidity
requestPay(
    user,
    metadata.tokenB,
    metadata.amountOfTokenBToFill,
    priorityFeeEvvm,
    nonceEvvm,
    true,                          // Always async
    signatureEvvm
);
```

**Action**: Transfers `amountOfTokenBToFill` from buyer to Core.sol

### 5. Overpayment Refund
```solidity
bool didRefund = _handleOverpaymentRefund(
    user,
    metadata.tokenB,
    metadata.amountOfTokenBToFill,
    requiredAmount
);
```

**If overpaid**: Refunds `amountOfTokenBToFill - requiredAmount` via makeCaPay()  
**Benefit**: Allows UI flexibility, user won't lose excess

### 6. Fee Distribution
```solidity
_distributePayments(
    metadata.tokenB,
    order.amountB,
    fee,
    order.seller,
    msg.sender,
    priorityFeeEvvm
);
```

**Internal Distribution**:
```solidity
// Calculate portions
uint256 sellerFee = (fee × rewardPercentage.seller) / 10000;
uint256 serviceFee = (fee × rewardPercentage.service) / 10000;
uint256 stakerFee = (fee × rewardPercentage.mateStaker) / 10000;

// Seller payment
makeDisperseCaPay([{
    recipient: seller,
    token: tokenB,
    amount: amountB + sellerFee
}, {
    recipient: executor,
    token: MATE,
    amount: priorityFee + stakerFee
}]);

// Service treasury (accumulated)
balancesOfContract[tokenB] += serviceFee;
```

### 7. Transfer TokenA to Buyer
```solidity
makeCaPay(user, metadata.tokenA, order.amountA);
```

**Action**: Releases original locked tokenA from seller to buyer

### 8. Staker Rewards
```solidity
_rewardExecutor(msg.sender, didRefund ? 5 : 4);
```

**Rewards** (MATE tokens):
- **4x**: Standard fill
- **5x**: Fill + handled refund correctly

### 9. Clear Order
```solidity
_clearOrderAndUpdateMarket(market, metadata.orderId);
```

**State Changes**:
- Order deleted (seller = address(0))
- Market ordersAvailable decremented

## Complete Usage Example

```solidity
// Scenario: Buy 1000 USDC for 0.5 ETH (with 5% fee)
address buyer = 0x123...;
address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
address eth = 0x0000000000000000000000000000000000000000;
address executor = 0x456...;
uint256 orderId = 7;

// Order details: seller offers 1000 USDC, wants 0.5 ETH
// Fee: 0.5 ETH × 5% = 0.025 ETH
// Required: 0.5 + 0.025 = 0.525 ETH

// 1. Get nonce
uint256 nonce = core.getNonce(buyer, address(p2pSwap));

// 2. Generate hash
bytes32 hashPayload = P2PSwapHashUtils.hashDataForDispatchOrder(
    usdc,
    eth,
    orderId
);

// 3. Create signature
string memory message = string.concat(
    Strings.toString(block.chainid), ",",
    Strings.toHexString(address(p2pSwap)), ",",
    Strings.toHexString(uint256(hashPayload)), ",",
    Strings.toHexString(executor), ",",
    Strings.toString(nonce), ",true"
);
bytes memory signature = signMessage(message, buyerPrivateKey);

// 4. Create metadata
MetadataDispatchOrder memory metadata = MetadataDispatchOrder({
    tokenA: usdc,
    tokenB: eth,
    orderId: orderId,
    amountOfTokenBToFill: 0.525 ether,  // 0.5 + 0.025 fee
    originExecutor: executor,
    nonce: nonce,
    signature: signature
});

// 5. Generate payment signature
uint256 nonceEvvm = core.getNonce(buyer, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    buyer,
    eth,
    0.525 ether,
    0.5 ether,         // 0.5 MATE priority fee
    nonceEvvm,
    true
);

// 6. Execute dispatch
p2pSwap.dispatchOrder_fillPropotionalFee(
    buyer,
    metadata,
    0.5 ether,         // Priority fee
    nonceEvvm,
    signatureEvvm
);

// Result:
// - Buyer pays: 0.525 ETH
// - Buyer receives: 1000 USDC
// - Seller receives: 0.5 ETH (order) + 0.0125 ETH (50% fee) = 0.5125 ETH
// - Treasury accumulates: 0.01 ETH (40% fee)
// - Stakers share: 0.0025 ETH (10% fee)
// - Executor receives: 0.5 MATE (priority) + 4-5x MATE (reward)
```

## Gas Costs

| Scenario | Gas Cost | Notes |
|----------|----------|-------|
| **Standard Fill** | ~280,000 gas | No overpayment |
| **With Refund** | ~320,000 gas | Overpayment handled |
| **With Priority** | ~300,000 gas | Includes MATE distribution |

## Economic Model

### Buyer Costs
- **Order Amount**: amountB (what seller requested)
- **Protocol Fee**: amountB × 5% (default)
- **Total**: amountB × 1.05

### Seller Revenue
- **Base**: amountB (100% of requested amount)
- **Fee Bonus**: fee × 50% (liquidity provider reward)
- **Total**: amountB × 1.025

### Staker Revenue
| Component | Amount | Condition |
|-----------|--------|-----------|
| **Priority Fee** | User-defined MATE | If > 0 |
| **Fee Share** | fee × 10% | Distributed to executor |
| **Base Reward** | 4-5x MATE | Standard execution |

**Example Profitability** (100 USDC order, 5% fee):
- Executor receives: ~0.5 USDC (10% of 5 USDC) + priority + 4x MATE
- **Very profitable for large orders**

## Error Handling

### Core.sol Errors
- `Core__InvalidSignature()` - Signature failed
- `Core__NonceAlreadyUsed()` - Nonce consumed
- `Core__InvalidExecutor()` - Wrong executor
- `Core__InsufficientBalance()` - Buyer lacks tokenB

### P2PSwap Errors
- `"Insuficient amountOfTokenToFill"` - Payment < required amount
- Internal validation failures for market/order

## Related Functions

- [makeOrder](./01-makeOrder.md) - Create orders to be filled
- [cancelOrder](./02-cancelOrder.md) - Cancel before filling
- [dispatchOrder (Fixed)](./04-dispatchOrder-fixed.md) - Alternative with capped fees
- [Getter Functions](../03-GetterFunctions.md) - Query available orders

---

**License**: EVVM-NONCOMMERCIAL-1.0  
**Gas Estimate**: 280k-320k gas  
**Staker Reward**: 4-5x MATE + fee share + priority  
**Fee**: 5% proportional (default)

---

## dispatchOrder_fillFixedFee


> **Note: Signature Verification**
dispatchOrder_fillFixedFee uses Core.sol's centralized verification via `validateAndConsumeNonce()` with `P2PSwapHashUtils.hashDataForDispatchOrder()`. Includes `originExecutor` parameter (EOA executor verified with tx.origin).

**Function Signature**:
```solidity
function dispatchOrder_fillFixedFee(
    address user,
    MetadataDispatchOrder memory metadata,
    uint256 priorityFeeEvvm,
    uint256 nonceEvvm,
    bytes memory signatureEvvm,
    uint256 maxFillFixedFee
) external
```

Fills an existing order using a fixed/capped fee model with 10% tolerance. Fee = `min(proportionalFee, maxFillFixedFee)`, allowing buyers to pay anywhere in the range `[amountB + 90% fee, amountB + 100% fee]`.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `address` | Buyer address filling the order |
| `metadata` | `MetadataDispatchOrder` | Dispatch details including originExecutor, nonce, and signature |
| `priorityFeeEvvm` | `uint256` | Optional MATE priority fee for faster execution |
| `nonceEvvm` | `uint256` | Nonce for Core payment transaction (collects tokenB + fee) |
| `signatureEvvm` | `bytes` | Signature for Core payment authorization |
| `maxFillFixedFee` | `uint256` | Fee cap for this execution (default: 0.001 ETH) |

### MetadataDispatchOrder Structure

```solidity
struct MetadataDispatchOrder {
    address tokenA;                // Token buyer will receive
    address tokenB;                // Token buyer will pay
    uint256 orderId;               // Order ID to fill
    uint256 amountOfTokenBToFill;  // Amount to pay (flexible within tolerance)
    address originExecutor;        // EOA that will execute (verified with tx.origin)
    uint256 nonce;                 // Core nonce for P2PSwap service
    bytes signature;               // User's authorization signature
}
```

## Signature Requirements

> **Note: Operation Hash**
```solidity
bytes32 hashPayload = P2PSwapHashUtils.hashDataForDispatchOrder(
    metadata.tokenA,
    metadata.tokenB,
    metadata.orderId
);
```

**Note**: Both proportional and fixed fee variants use the **same hash function**.

**Signature Format**:
```
{evvmId},{p2pSwapAddress},{hashPayload},{originExecutor},{nonce},true
```

**Payment Signature**: Separate signature required for paying tokenB + fee via Core.pay().

## Fee Model

### Calculation with Cap
```solidity
proportionalFee = (orderAmountB × percentageFee) / 10,000
fee = min(proportionalFee, maxFillFixedFee)

// Default cap: 0.001 ETH
// Example: 100 ETH order × 5% = 5 ETH, capped at 0.001 ETH
```

### 10% Tolerance Range
```solidity
fee10 = (fee × 1000) / 10,000  // 10% of fee
minRequired = amountB + fee - fee10
maxRequired = amountB + fee

// Buyer can pay anywhere in: [minRequired, maxRequired]
```

**Purpose**: 
- Protects buyers from excessive fees on large orders
- Allows UI flexibility (can display range)
- Avoids exact rounding issues

### Fee Calculation Based on Payment
```solidity
if (amountPaid >= minRequired && amountPaid < maxRequired) {
    finalFee = amountPaid - amountB  // Use actual amount paid
} else {
    finalFee = fee  // Full fee if paying maximum
}
```

### Distribution (Default: seller 50%, service 40%, staker 10%)

Same as proportional model but with capped fee:

| Recipient | Share | Purpose |
|-----------|-------|---------|
| **Seller** | 50% | amountB + (finalFee × 50%) |
| **Service Treasury** | 40% | finalFee × 40% (accumulated) |
| **MATE Stakers** | 10% | finalFee × 10% (distributed) |

**Example** (10 ETH order, 5% = 0.5 ETH but capped at 0.001 ETH):
- Buyer pays: 10.001 ETH or within [10.0009, 10.001]
- Fee used: 0.001 ETH
- Seller gets: 10 ETH (order) + 0.0005 ETH (50% of fee) = 10.0005 ETH
- Treasury: 0.0004 ETH (40% of fee)
- Stakers: 0.0001 ETH (10% of fee)

## Execution Flow

### 1. Centralized Verification
```solidity
core.validateAndConsumeNonce(
    user,
    P2PSwapHashUtils.hashDataForDispatchOrder(
        metadata.tokenA,
        metadata.tokenB,
        metadata.orderId
    ),
    metadata.originExecutor,
    metadata.nonce,
    true,                          // Always async execution
    metadata.signature
);
```

**Validates**:
- Signature authenticity via EIP-191
- Nonce hasn't been consumed
- Executor is the specified EOA (via `tx.origin`)

**On Failure**:
- `Core__InvalidSignature()` - Invalid signature
- `Core__NonceAlreadyUsed()` - Nonce consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

### 2. Market & Order Lookup
```solidity
uint256 market = findMarket(metadata.tokenA, metadata.tokenB);

Order storage order = _validateMarketAndOrder(market, metadata.orderId);
```

**Validation**: Market and order exist, order is active

### 3. Fee Calculation with Cap & Tolerance
```solidity
(uint256 fee, uint256 fee10) = calculateFillFixedFee(
    order.amountB,
    maxFillFixedFee
);

// Internal calculation:
// proportionalFee = (amountB * percentageFee) / 10_000
// if (proportionalFee > maxFillFixedFee) {
//     fee = maxFillFixedFee
//     fee10 = (fee * 1000) / 10_000
// } else {
//     fee = proportionalFee
//     fee10 = 0  // No tolerance if under cap
// }

uint256 minRequired = order.amountB + fee - fee10;
uint256 fullRequired = order.amountB + fee;

if (metadata.amountOfTokenBToFill < minRequired) {
    revert("Insuficient amountOfTokenBToFill");
}
```

**Tolerance Benefit**: Buyer can pay 90%-100% of fee, not forced to exact amount

### 4. Collect Payment
```solidity
requestPay(
    user,
    metadata.tokenB,
    metadata.amountOfTokenBToFill,
    priorityFeeEvvm,
    nonceEvvm,
    true,                          // Always async
    signatureEvvm
);
```

**Action**: Transfers `amountOfTokenBToFill` from buyer to Core.sol

### 5. Calculate Final Fee
```solidity
uint256 finalFee = _calculateFinalFee(
    metadata.amountOfTokenBToFill,
    order.amountB,
    fee,
    fee10
);

// Internal logic:
// if (amountPaid >= minRequired && amountPaid < fullRequired) {
//     finalFee = amountPaid - order.amountB
// } else {
//     finalFee = fee
// }
```

### 6. Overpayment Refund
```solidity
bool didRefund = _handleOverpaymentRefund(
    user,
    metadata.tokenB,
    metadata.amountOfTokenBToFill,
    fullRequired
);
```

**If overpaid beyond maxRequired**: Refunds excess via makeCaPay()

### 7. Fee Distribution
```solidity
_distributePayments(
    metadata.tokenB,
    order.amountB,
    finalFee,  // Uses calculated final fee
    order.seller,
    msg.sender,
    priorityFeeEvvm
);
```

**Distribution based on finalFee** (not original fee):
- Seller: amountB + (finalFee × 50%)
- Executor: priorityFee + (finalFee × 10%)
- Service: finalFee × 40%

### 8. Transfer TokenA to Buyer
```solidity
makeCaPay(user, metadata.tokenA, order.amountA);
```

**Action**: Releases tokenA to buyer

### 9. Staker Rewards
```solidity
_rewardExecutor(msg.sender, didRefund ? 5 : 4);
```

**Rewards** (MATE tokens):
- **4x**: Standard fill
- **5x**: Fill + handled refund

### 10. Clear Order
```solidity
_clearOrderAndUpdateMarket(market, metadata.orderId);
```

## Complete Usage Example

```solidity
// Scenario: Buy 1000 USDC for 20 ETH (large order)
// Proportional fee: 20 ETH × 5% = 1 ETH
// Capped fee: min(1 ETH, 0.001 ETH) = 0.001 ETH
// 10% tolerance: 0.0001 ETH
// Range: [20.0009 ETH, 20.001 ETH]

address buyer = 0x123...;
address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
address eth = 0x0000000000000000000000000000000000000000;
address executor = 0x456...;
uint256 orderId = 7;

// 1. Get nonce
uint256 nonce = core.getNonce(buyer, address(p2pSwap));

// 2. Generate hash (same as proportional!)
bytes32 hashPayload = P2PSwapHashUtils.hashDataForDispatchOrder(
    usdc,
    eth,
    orderId
);

// 3. Create signature
string memory message = string.concat(
    Strings.toString(block.chainid), ",",
    Strings.toHexString(address(p2pSwap)), ",",
    Strings.toHexString(uint256(hashPayload)), ",",
    Strings.toHexString(executor), ",",
    Strings.toString(nonce), ",true"
);
bytes memory signature = signMessage(message, buyerPrivateKey);

// 4. Create metadata
// User can choose to pay anywhere in [20.0009, 20.001]
MetadataDispatchOrder memory metadata = MetadataDispatchOrder({
    tokenA: usdc,
    tokenB: eth,
    orderId: orderId,
    amountOfTokenBToFill: 20.00095 ether,  // Within tolerance
    originExecutor: executor,
    nonce: nonce,
    signature: signature
});

// 5. Generate payment signature
uint256 nonceEvvm = core.getNonce(buyer, address(core));
bytes memory signatureEvvm = generatePaymentSignature(
    buyer,
    eth,
    20.00095 ether,
    0.5 ether,         // 0.5 MATE priority fee
    nonceEvvm,
    true
);

// 6. Execute dispatch with fee cap
p2pSwap.dispatchOrder_fillFixedFee(
    buyer,
    metadata,
    0.5 ether,         // Priority fee
    nonceEvvm,
    signatureEvvm,
    0.001 ether        // maxFillFixedFee cap
);

// Result:
// - Buyer pays: 20.00095 ETH
// - Buyer receives: 1000 USDC
// - finalFee calculated: 0.00095 ETH (actual paid - 20 ETH)
// - Seller receives: 20 ETH + 0.000475 ETH (50% of 0.00095) = 20.000475 ETH
// - Treasury: 0.00038 ETH (40% of 0.00095)
// - Stakers: 0.000095 ETH (10% of 0.00095)
// - Executor: 0.5 MATE (priority) + 4x MATE (reward)
```

## Gas Costs

| Scenario | Gas Cost | Notes |
|----------|----------|-------|
| **Standard Fill** | ~290,000 gas | Within tolerance |
| **With Refund** | ~330,000 gas | Overpayment beyond max |
| **Min Payment** | ~280,000 gas | 90% fee (minRequired) |
| **Max Payment** | ~300,000 gas | 100% fee (fullRequired) |

## Economic Model

### Buyer Benefits
- **Fee Protection**: Large orders capped at maxFillFixedFee
- **Flexibility**: Can pay 90%-100% of fee
- **Predictability**: Known maximum fee upfront

**Examples**:

| Order Size | 5% Fee | Capped At | Buyer Saves |
|------------|--------|-----------|-------------|
| 1 ETH | 0.05 ETH | 0.05 ETH | 0 (under cap) |
| 5 ETH | 0.25 ETH | 0.25 ETH | 0 (under cap) |
| 10 ETH | 0.5 ETH | 0.001 ETH | **0.499 ETH** |
| 100 ETH | 5 ETH | 0.001 ETH | **4.999 ETH** |

### Seller Impact
- Receives 50% of **actualFee**, not proportional fee
- Large orders = lower fee bonus
- Incentivizes smaller orders or higher base prices

### Staker Revenue
| Component | Amount | Condition |
|-----------|--------|-----------|
| **Priority Fee** | User-defined MATE | If > 0 |
| **Fee Share** | finalFee × 10% | Distributed to executor |
| **Base Reward** | 4-5x MATE | Standard execution |

**Profitability**: Better for small-medium orders. Large orders capped.

## Comparison: Proportional vs Fixed

| Aspect | Proportional | Fixed (Capped) |
|--------|--------------|----------------|
| **Fee Formula** | amountB × 5% | min(amountB × 5%, 0.001 ETH) |
| **Tolerance** | None | ±10% of fee |
| **Buyer Flexibility** | Must pay exact | Range accepted |
| **Large Orders** | Expensive | Protected by cap |
| **Seller Revenue** | Higher on large | Lower on large |
| **Best For** | Small-medium orders | Large orders |

## Error Handling

### Core.sol Errors
- `Core__InvalidSignature()` - Signature failed
- `Core__NonceAlreadyUsed()` - Nonce consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor
- `Core__InsufficientBalance()` - Buyer lacks tokenB

### P2PSwap Errors
- `"Insuficient amountOfTokenBToFill"` - Payment < minRequired
- Internal validation failures for market/order

## Use Cases

### When to Use Fixed Fee
- **Large Orders**: 10+ ETH where 5% would be excessive
- **Predictable Costs**: Need to know max fee upfront
- **Price Sensitivity**: Buyers want fee protection
- **UI Ranges**: Display min-max payment options

### When to Use Proportional
- **Small Orders**: < 0.02 ETH where cap doesn't apply
- **Simplicity**: Exact fee calculation
- **Seller Incentive**: Higher fee bonus
- **Standard Trading**: Most common use case

## Related Functions

- [makeOrder](./01-makeOrder.md) - Create orders to be filled
- [cancelOrder](./02-cancelOrder.md) - Cancel before filling
- [dispatchOrder (Proportional)](./03-dispatchOrder-proportional.md) - Alternative without cap
- [Getter Functions](../03-GetterFunctions.md) - Query orders and calculate fees

---

**License**: EVVM-NONCOMMERCIAL-1.0  
**Gas Estimate**: 280k-330k gas  
**Staker Reward**: 4-5x MATE + capped fee share + priority  
**Fee Cap**: 0.001 ETH (default) with 10% tolerance

---

## Getter Functions(05-P2PSwap)


> **Note: Implementation Note**
View functions remain fully backward compatible for querying market data, orders, and contract state. They do not use signature verification.

The P2P Swap Contract provides a comprehensive set of getter functions for querying order information, market data, user balances, and administrative settings. These functions enable users and applications to interact effectively with the marketplace.

## Order Query Functions

### getAllMarketOrders

**Function Signature**: `getAllMarketOrders(uint256 market) → OrderForGetter[]`

Returns all orders in a specific market, including both active and cancelled orders.

**Parameters:**
- `market` (uint256): The market ID to query

**Returns:**
- Array of `OrderForGetter` structs containing market ID, order ID, seller, and amounts

**Usage Example:**
```solidity
// Get all orders in USDC/ETH market (market ID 1)
OrderForGetter[] memory orders = p2pSwap.getAllMarketOrders(1);
```

### getOrder

**Function Signature**: `getOrder(uint256 market, uint256 orderId) → Order`

Retrieves a specific order by market and order ID.

**Parameters:**
- `market` (uint256): The market ID
- `orderId` (uint256): The order ID within the market

**Returns:**
- `Order` struct containing seller address and token amounts

### getMyOrdersInSpecificMarket

**Function Signature**: `getMyOrdersInSpecificMarket(address user, uint256 market) → OrderForGetter[]`

Returns all orders created by a specific user in a given market.

**Parameters:**
- `user` (address): The user's address
- `market` (uint256): The market ID to query

**Returns:**
- Array of user's orders in the specified market

## Market Information Functions

### findMarket

**Function Signature**: `findMarket(address tokenA, address tokenB) → uint256`

Finds the market ID for a specific token pair.

**Parameters:**
- `tokenA` (address): First token in the pair
- `tokenB` (address): Second token in the pair

**Returns:**
- Market ID (0 if market doesn't exist)

### getMarketMetadata

**Function Signature**: `getMarketMetadata(uint256 market) → MarketInformation`

Retrieves complete metadata for a specific market.

**Parameters:**
- `market` (uint256): The market ID

**Returns:**
- `MarketInformation` struct containing token addresses, max slots, and available orders

### getAllMarketsMetadata

**Function Signature**: `getAllMarketsMetadata() → MarketInformation[]`

Returns metadata for all existing markets.

**Returns:**
- Array of `MarketInformation` structs for all markets

## User State Functions

### checkIfANonceP2PSwapIsUsed

**Function Signature**: `checkIfANonceP2PSwapIsUsed(address user, uint256 nonce) → bool`

Checks if a specific nonce has been used by a user.

**Parameters:**
- `user` (address): The user's address
- `nonce` (uint256): The nonce to check

**Returns:**
- `true` if nonce has been used, `false` otherwise

## Contract Balance Functions

### getBalanceOfContract

**Function Signature**: `getBalanceOfContract(address token) → uint256`

Returns the contract's balance for a specific token.

**Parameters:**
- `token` (address): The token address to query

**Returns:**
- Token balance held by the contract

## Administrative Query Functions

### Owner Management

#### getOwner
**Function Signature**: `getOwner() → address`
Returns the current contract owner address.

#### getOwnerProposal
**Function Signature**: `getOwnerProposal() → address`
Returns the proposed new owner address.

#### getOwnerTimeToAccept
**Function Signature**: `getOwnerTimeToAccept() → uint256`
Returns the timestamp when the owner proposal expires.

### Fee Configuration

#### getPercentageFee
**Function Signature**: `getPercentageFee() → uint256`
Returns the current percentage fee (in basis points, e.g., 500 = 5%).

#### getProposalPercentageFee
**Function Signature**: `getProposalPercentageFee() → uint256`
Returns the proposed percentage fee.

#### getRewardPercentage
**Function Signature**: `getRewardPercentage() → Percentage`
Returns the current fee distribution percentages.

#### getRewardPercentageProposal
**Function Signature**: `getRewardPercentageProposal() → Percentage`
Returns the proposed fee distribution percentages.

### Fixed Fee Limits

#### getMaxLimitFillFixedFee
**Function Signature**: `getMaxLimitFillFixedFee() → uint256`
Returns the current maximum fixed fee limit.

#### getMaxLimitFillFixedFeeProposal
**Function Signature**: `getMaxLimitFillFixedFeeProposal() → uint256`
Returns the proposed maximum fixed fee limit.

### Treasury Management

#### getProposedWithdrawal
**Function Signature**: `getProposedWithdrawal() → (address, uint256, address, uint256)`
Returns details of any pending withdrawal proposal.

**Returns:**
- `tokenToWithdraw` (address): Token to be withdrawn
- `amountToWithdraw` (uint256): Amount to be withdrawn
- `recipientToWithdraw` (address): Recipient of the withdrawal
- `timeToWithdrawal` (uint256): Expiration timestamp of the proposal

## Data Structures

### OrderForGetter
```solidity
struct OrderForGetter {
    uint256 marketId;
    uint256 orderId;
    address seller;
    uint256 amountA;
    uint256 amountB;
}
```

### Order
```solidity
struct Order {
    address seller;
    uint256 amountA;
    uint256 amountB;
}
```

### MarketInformation
```solidity
struct MarketInformation {
    address tokenA;
    address tokenB;
    uint256 maxSlot;
    uint256 ordersAvailable;
}
```

### Percentage
```solidity
struct Percentage {
    uint256 seller;
    uint256 service;
    uint256 mateStaker;
}
```

## Usage Examples

### Finding and Browsing Orders

```solidity
// Find USDC/ETH market
uint256 marketId = p2pSwap.findMarket(usdcAddress, ethAddress);

if (marketId != 0) {
    // Get all orders in this market
    OrderForGetter[] memory orders = p2pSwap.getAllMarketOrders(marketId);
    
    // Check market statistics
    MarketInformation memory marketInfo = p2pSwap.getMarketMetadata(marketId);
    
    // Get specific order details
    Order memory specificOrder = p2pSwap.getOrder(marketId, 1);
}
```

### Checking User Activity

```solidity
// Check if user has orders in a market
OrderForGetter[] memory userOrders = p2pSwap.getMyOrdersInSpecificMarket(
    userAddress, 
    marketId
);

// Verify nonce hasn't been used
bool nonceUsed = p2pSwap.checkIfANonceP2PSwapIsUsed(userAddress, 42);
```

### Monitoring Contract State

```solidity
// Check contract's token balances
uint256 ethBalance = p2pSwap.getBalanceOfContract(ethAddress);
uint256 usdcBalance = p2pSwap.getBalanceOfContract(usdcAddress);

// Get current fee configuration
uint256 currentFee = p2pSwap.getPercentageFee();
Percentage memory feeDistribution = p2pSwap.getRewardPercentage();
```

These getter functions provide complete visibility into the P2P Swap marketplace, enabling users, applications, and administrators to make informed decisions and monitor system state effectively.

---

## Administrative Functions(05-P2PSwap)


> **Note: Implementation Note**
Administrative functions do **not** use Core.sol's `validateAndConsumeNonce()` pattern. They are directly protected by `onlyOwner` modifier and execute through standard transaction authentication via `msg.sender`.

The P2P Swap Contract implements a comprehensive administrative system with time-delayed governance, secure owner management, and flexible configuration options. All administrative changes follow a proposal-acceptance pattern with mandatory waiting periods for security.

## Owner Management

### proposeOwner

**Function Signature**: `proposeOwner(address _owner)`

Proposes a new contract owner with a 1-day acceptance window.

**Access**: Current owner only  
**Parameters:**
- `_owner` (address): Address of the proposed new owner

**Process:**
1. Sets `owner_proposal` to the new address
2. Sets `owner_timeToAccept` to `block.timestamp + 1 days`
3. Proposed owner has 24 hours to accept

### acceptOwner

**Function Signature**: `acceptOwner()`

Accepts the owner proposal and transfers ownership.

**Access**: Proposed owner only, within acceptance window  
**Requirements:**
- Must be called by the proposed owner
- Must be within the 1-day acceptance window

**Process:**
1. Transfers ownership to the proposed owner
2. Clears the proposal state

### rejectProposeOwner

**Function Signature**: `rejectProposeOwner()`

Rejects the owner proposal.

**Access**: Proposed owner only, within acceptance window  
**Process:**
1. Clears the owner proposal
2. Cancels the ownership transfer

## Fee Configuration Management

### Proportional Fee Management

#### proposeFillPropotionalPercentage

**Function Signature**: `proposeFillPropotionalPercentage(uint256 _seller, uint256 _service, uint256 _mateStaker)`

Proposes new fee distribution percentages for proportional fee model.

**Access**: Owner only  
**Parameters:**
- `_seller` (uint256): Percentage for sellers (basis points)
- `_service` (uint256): Percentage for service treasury (basis points)
- `_mateStaker` (uint256): Percentage for MATE stakers (basis points)

**Requirements:**
- Total must equal 10,000 (100%)
- 1-day waiting period before acceptance

#### acceptFillPropotionalPercentage

**Function Signature**: `acceptFillPropotionalPercentage()`

Accepts the proposed proportional fee distribution.

**Access**: Owner only, within acceptance window

#### rejectProposeFillPropotionalPercentage

**Function Signature**: `rejectProposeFillPropotionalPercentage()`

Rejects the proposed proportional fee distribution.

**Access**: Owner only, within acceptance window

### Fixed Fee Management

#### proposeFillFixedPercentage

**Function Signature**: `proposeFillFixedPercentage(uint256 _seller, uint256 _service, uint256 _mateStaker)`

Proposes new fee distribution percentages for fixed fee model.

**Access**: Owner only  
**Parameters:** Same as proportional fee management  
**Requirements:** Same validation rules apply

#### acceptFillFixedPercentage / rejectProposeFillFixedPercentage

Similar pattern to proportional fee management functions.

### Base Fee Rate Management

#### proposePercentageFee

**Function Signature**: `proposePercentageFee(uint256 _percentageFee)`

Proposes a new base percentage fee rate.

**Access**: Owner only  
**Parameters:**
- `_percentageFee` (uint256): New fee percentage in basis points (e.g., 500 = 5%)

#### acceptPercentageFee / rejectProposePercentageFee

Standard proposal-acceptance pattern with 1-day delay.

### Fixed Fee Limit Management

#### proposeMaxLimitFillFixedFee

**Function Signature**: `proposeMaxLimitFillFixedFee(uint256 _maxLimitFillFixedFee)`

Proposes a new maximum limit for fixed fees.

**Access**: Owner only  
**Parameters:**
- `_maxLimitFillFixedFee` (uint256): New maximum fee limit in token units

#### acceptMaxLimitFillFixedFee / rejectProposeMaxLimitFillFixedFee

Standard proposal-acceptance pattern with 1-day delay.

## Treasury Management

### proposeWithdrawal

**Function Signature**: `proposeWithdrawal(address _tokenToWithdraw, uint256 _amountToWithdraw, address _to)`

Proposes withdrawal of accumulated fees from the contract treasury.

**Access**: Owner only  
**Parameters:**
- `_tokenToWithdraw` (address): Token to withdraw
- `_amountToWithdraw` (uint256): Amount to withdraw
- `_to` (address): Recipient address

**Requirements:**
- Amount must not exceed contract balance for the token
- 1-day waiting period before execution

### acceptWithdrawal

**Function Signature**: `acceptWithdrawal()`

Executes the proposed withdrawal.

**Access**: Owner only, within acceptance window  
**Process:**
1. Transfers tokens to the specified recipient
2. Updates contract balance tracking
3. Clears withdrawal proposal state

### rejectProposeWithdrawal

**Function Signature**: `rejectProposeWithdrawal()`

Cancels the proposed withdrawal.

**Access**: Owner only, within acceptance window

## Staking Management

### stake

**Function Signature**: `stake(uint256 amount)`

Stakes MATE tokens on behalf of the contract.

**Access**: Owner only  
**Parameters:**
- `amount` (uint256): Number of staking tokens to purchase

**Requirements:**
- Contract must have sufficient MATE token balance
- Uses current staking price from Staking contract

**Process:**
1. Calculates required MATE tokens (amount × staking price)
2. Calls internal `_makeStakeService` function
3. Contract becomes a service staker

### unstake

**Function Signature**: `unstake(uint256 amount)`

Unstakes MATE tokens from the contract's staking position.

**Access**: Owner only  
**Parameters:**
- `amount` (uint256): Number of staking tokens to unstake

**Process:**
1. Calls internal `_makeUnstakeService` function
2. Follows standard unstaking procedures and timelock

## Balance Management

### addBalance

**Function Signature**: `addBalance(address _token, uint256 _amount)`

Manually adjusts contract balance tracking for a specific token.

**Access**: Owner only  
**Parameters:**
- `_token` (address): Token address
- `_amount` (uint256): Amount to add to balance tracking

**Use Cases:**
- Correcting balance discrepancies
- Accounting for direct token transfers
- Administrative balance adjustments

## Security Features

### Time-Delayed Execution

All administrative changes follow a mandatory 1-day delay pattern:

1. **Proposal Phase**: Owner proposes changes
2. **Waiting Period**: 24-hour delay for transparency
3. **Execution Window**: Limited time to accept or reject
4. **Automatic Expiry**: Proposals expire if not acted upon

### Access Control

- **Owner-Only Functions**: Most administrative functions restricted to contract owner
- **Proposal-Specific Access**: Some functions require being the proposed party
- **Time Window Validation**: All time-sensitive functions validate execution windows

### Validation Checks

- **Balance Verification**: Withdrawal amounts validated against actual balances
- **Percentage Validation**: Fee percentages must sum to exactly 100%
- **Address Validation**: Non-zero address requirements where applicable

## Administrative Workflow Examples

### Changing Fee Structure

```solidity
// 1. Owner proposes new fee distribution (60% seller, 30% service, 10% stakers)
p2pSwap.proposeFillPropotionalPercentage(6000, 3000, 1000);

// 2. Wait 24 hours

// 3. Owner accepts the change
p2pSwap.acceptFillPropotionalPercentage();
```

### Treasury Withdrawal

```solidity
// 1. Owner proposes withdrawal of 100 USDC to treasury address
p2pSwap.proposeWithdrawal(usdcAddress, 100000000, treasuryAddress);

// 2. Wait 24 hours

// 3. Owner executes withdrawal
p2pSwap.acceptWithdrawal();
```

### Owner Transfer

```solidity
// 1. Current owner proposes new owner
p2pSwap.proposeOwner(newOwnerAddress);

// 2. New owner accepts within 24 hours
// (called by newOwnerAddress)
p2pSwap.acceptOwner();
```

## Emergency Procedures

### Proposal Cancellation

Any pending proposal can be cancelled by the appropriate party:
- Owner proposals: Can be rejected by proposed owner
- Administrative proposals: Can be rejected by current owner

### Time Window Management

- All proposals have exactly 24-hour acceptance windows
- Expired proposals must be re-proposed
- No emergency override mechanisms (by design)

The administrative system balances operational flexibility with security through mandatory delays, ensuring all stakeholders have visibility into proposed changes before they take effect.

---

## Testnet Exclusive Functions


> **Warning: Testnet Only Functions**

These functions are exclusively available in testnet deployments and are **NOT** included in mainnet versions of the EVVM ecosystem contracts. They serve as development faucets for testing and demonstration purposes.


> **Note: Testnet Cooldown Configuration**

All cooldown timers in testnet deployments have been reduced to **1 minute** to facilitate faster testing and development. This includes cooldowns for transactions, staking operations, and any other time-locked features that may have longer cooldowns in mainnet.


## addBalance

**Function Type**: `external`  
**Function Signature**: `addBalance(address,address,uint256)`

Testnet faucet function that directly adds token balance to any user's account, bypassing normal deposit flows. This allows developers and testers to quickly obtain tokens for testing EVVM functionality.

### Parameters

| Field      | Type      | Description                                              |
| ---------- | --------- | -------------------------------------------------------- |
| `user`     | `address` | The address of the user to receive the balance          |
| `token`    | `address` | The address of the token contract to add balance for    |
| `quantity` | `uint256` | The amount of tokens to add to the user's balance       |

### Workflow

1. **Direct Balance Addition**: Adds the specified `quantity` directly to `balances[user][token]` mapping
2. **No Authorization**: No checks or validations - anyone can call this function on testnet
3. **Immediate Effect**: Balance is available instantly for testing transactions

## setPointStaker

**Function Type**: `external`  
**Function Signature**: `setPointStaker(address,bytes1)`

Testnet faucet function that directly configures a user's staker status for testing purposes, bypassing normal staking registration and token requirements. This allows developers to quickly test staker-specific functionality.

### Parameters

| Field    | Type      | Description                                                 |
| -------- | --------- | ----------------------------------------------------------- |
| `user`   | `address` | The address of the user to set as staker                   |
| `answer` | `bytes1`  | The bytes1 value representing the staker status            |

### Workflow

1. **Direct Status Assignment**: Sets the staker status directly in `stakerList[user]` mapping to the provided `answer` value
2. **No Token Requirements**: No validation or token deposit checks - bypasses normal staking process
3. **Immediate Effect**: Staker status is active instantly for testing staker-specific features

### Staker Status Values

| Value  | Type           | Description                              |
| ------ | -------------- | ---------------------------------------- |
| `0x00` | Non-Staker     | Removes staker status (default state)   |
| `0x01` | Regular Staker | Standard staker with basic rewards       |
| `0x02` | Premium Staker | Enhanced staker with additional benefits |

---

## EIP-191 Signed Data Standard


This document provides the complete EIP-191 specification that underpins all EVVM signature operations.

## Abstract

EIP-191 defines a specification for handling signed data in Ethereum contracts. By defining a standard prefix, signed messages become distinguishable from valid Ethereum transactions, preventing signature reuse attacks.

## Motivation

Several multisignature wallet implementations use `ecrecover` to verify signatures. Without a standard format, signed data could be confused with valid Ethereum transactions. EIP-191 solves this by introducing a prefix that makes signed messages distinguishable.

Key issues addressed:

1. **RLP Collision Risk**: Without syntactical constraints, standard Ethereum transactions could be submitted as presigned data, since transaction components follow RLP encoding patterns.

2. **Validator Binding**: Presigned transactions weren't tied to specific validators, enabling attack scenarios where signatures from one multisig wallet could be replayed against another wallet with overlapping signers.

## Specification

### Signed Data Format

```
0x19 <1 byte version> <version specific data> <data to sign>
```

The initial `0x19` byte is chosen because:
- Valid RLP-encoded transactions never start with `0x19`
- This prevents collision between signed messages and valid transactions

### Version Bytes

| Version | EIP | Description |
|---------|-----|-------------|
| `0x00` | [191](https://eips.ethereum.org/EIPS/eip-191) | Data with intended validator |
| `0x01` | [712](https://eips.ethereum.org/EIPS/eip-712) | Structured data (typed data) |
| `0x45` | [191](https://eips.ethereum.org/EIPS/eip-191) | `personal_sign` messages |

### Version 0x00: Data with Intended Validator

```
0x19 <0x00> <intended validator address (20 bytes)> <data to sign>
```

- Used when data should only be valid for a specific contract
- Validator address binds the signature to a specific verifier

### Version 0x01: Structured Data (EIP-712)

```
0x19 <0x01> <domainSeparator (32 bytes)> <hashStruct (32 bytes)>
```

- Provides human-readable signing for complex data structures
- Domain separator includes contract address, chain ID, version
- Enables type-safe, structured signing

### Version 0x45: personal_sign (0x45 = 'E')

```
0x19 <0x45> "thereum Signed Message:\n" <message length> <message>
```

This expands to:
```
"\x19Ethereum Signed Message:\n" + len(message) + message
```

**This is the version used by EVVM** for all signature operations.

## EVVM Implementation

EVVM uses Version 0x45 (`personal_sign`) for all signature operations. The complete signing process:

### 1. Message Construction

Messages follow the format:
```
{evvmId},{functionName},{param1},{param2},...,{paramN}
```

Example for a payment:
```
1,pay,0x742c7b6b472c8f4bd58e6f9f6c82e8e6e7c82d8c,0x0000000000000000000000000000000000000000,50000000000000000,1000000000000000,42,false,0x0000000000000000000000000000000000000000
```

### 2. EIP-191 Prefix Application

The message is prefixed according to EIP-191:
```solidity
keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        Strings.toString(bytes(message).length),
        message
    )
)
```

### 3. Signature Generation

The user signs the prefixed hash using their Ethereum wallet (MetaMask, etc.), producing a 65-byte signature:
- `r` (32 bytes): X-coordinate of random elliptic curve point
- `s` (32 bytes): Signature proof
- `v` (1 byte): Recovery ID (27 or 28)

### 4. On-Chain Verification

```solidity
// Reconstruct the hash
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        Strings.toString(bytes(message).length),
        message
    )
);

// Recover signer using ecrecover precompile
address signer = ecrecover(messageHash, v, r, s);

// Verify signer matches expected address
require(signer == expectedSigner, "Invalid signature");
```

## Security Properties

### Transaction Collision Prevention

The `0x19` prefix ensures that signed messages can never be valid RLP-encoded transactions:
- RLP lists start with `0xc0-0xff` (length prefix)
- RLP strings start with `0x00-0xbf` (length prefix)
- `0x19` indicates an RLP string of length 25, which cannot represent a valid transaction structure

### Signature Domain Separation

EIP-191 provides domain separation through:
1. **Version byte**: Distinguishes different signature schemes
2. **Message prefix**: Creates unique hash domain
3. **Chain/contract binding**: Version 0x01 binds to specific contracts

### Replay Protection

While EIP-191 prevents transaction collision, replay protection requires additional measures (implemented by EVVM through nonces):
- **Nonces**: Each signature includes a unique nonce
- **Chain binding**: EVVM ID included in message

## Code Examples

### Solidity Verification

```solidity
library SignatureRecover {
    function recoverSigner(
        string memory message,
        bytes memory signature
    ) internal pure returns (address) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                Strings.toString(bytes(message).length),
                message
            )
        );

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(messageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal pure returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid v value");
    }
}
```

### JavaScript/TypeScript Signing

```typescript

// Using ethers.js (v5)
async function signEIP191Message(
    signer: ethers.Signer,
    message: string
): Promise<string> {
    // signMessage automatically applies EIP-191 prefix
    return await signer.signMessage(message);
}

// Example: Sign EVVM payment
const message = "1,pay,0x742c...,0x0000...,50000000000000000,1000000000000000,42,false,0x0000...";
const signature = await signEIP191Message(wallet, message);
```

### Viem Signing

```typescript

const account = privateKeyToAccount('0x...');
const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
});

// Sign with EIP-191 prefix
const signature = await client.signMessage({
    message: "1,pay,0x742c...,0x0000...,50000000000000000,1000000000000000,42,false,0x0000..."
});
```

### Off-Chain Verification

```typescript

function verifyEIP191Signature(
    message: string,
    signature: string,
    expectedAddress: string
): boolean {
    const recovered = ethers.utils.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
}
```

```typescript

const valid = await verifyMessage({
    address: '0x...',
    message: "1,pay,0x742c...",
    signature: '0x...'
});
```

## References

- [EIP-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)
- [EIP-712: Typed Structured Data Hashing and Signing](https://eips.ethereum.org/EIPS/eip-712)
- [Ethereum Yellow Paper - Appendix F (Signing Transactions)](https://ethereum.github.io/yellowpaper/paper.pdf)

---

## Single Payment Signature Structure


> **Note: Centralized Verification**
Payment signatures are **verified by Core.sol** using `validateAndConsumeNonce()`.

To authorize payment operations, the user must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification is centralized in Core.sol, which validates the signature, checks nonce validity, and handles executor authorization in a single atomic operation.

## Signature Format

```
{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}
```

**Components:**
1. **evvmId**: Network identifier (uint256, typically `1`)
2. **serviceAddress**: Core.sol contract address
3. **hashPayload**: Hash of payment parameters (bytes32, from CoreHashUtils)
4. **executor**: Address authorized to execute (address, `0x0...0` for unrestricted)
5. **nonce**: User's centralized nonce from Core.sol (uint256)
6. **isAsyncExec**: Execution mode - `true` for async, `false` for sync (boolean)

## Hash Payload Generation

The `hashPayload` is generated using **CoreHashUtils.hashDataForPay()**:

```solidity

bytes32 hashPayload = CoreHashUtils.hashDataForPay(
    receiver,      // address or username (bytes32 hash)
    token,         // ERC20 token address (0x0...0 for ETH)
    amount,        // Amount in wei
    priorityFee    // Fee amount in wei
);
```

### Hash Generation Process

CoreHashUtils creates a deterministic hash:

```solidity
// Internal implementation (simplified)
function hashDataForPay(
    bytes32 receiver,
    address token,
    uint256 amount,
    uint256 priorityFee
) internal pure returns (bytes32) {
    return keccak256(
        abi.encodePacked(receiver, token, amount, priorityFee)
    );
}
```

**Key Points:**
- `receiver` is **bytes32** (use `0x0...0` prefix for address, or username hash)
- Hash is deterministic: same parameters → same hash
- No function name embedded

## Centralized Verification

Core.sol verifies the signature using `validateAndConsumeNonce()`:

```solidity
// Called by services (internal to Core.sol payment functions)
Core(coreAddress).validateAndConsumeNonce(
    user,          // Signer's address
    hashPayload,   // From CoreHashUtils
    executor,      // Who can execute
    nonce,         // User's nonce
    isAsyncExec,   // Execution mode
    signature      // EIP-191 signature
);
```

**What validateAndConsumeNonce() Does:**
1. Constructs full signature message with all 6 components
2. Applies EIP-191 wrapping and hashing
3. Recovers signer from signature using ecrecover
4. Validates signer matches `user` parameter
5. Checks nonce status (must be available for sync, reserved for async)
6. Validates executor authorization (if not `0x0...0`)
7. Marks nonce as consumed
8. Optionally delegates to UserValidator contract

## Message Construction

The signature message is constructed internally by Core.sol:

```solidity
// Internal Core.sol message construction (simplified)
string memory message = string.concat(
    AdvancedStrings.uintToString(evvmId),              // "1"
    ",",
    AdvancedStrings.addressToString(address(this)),    // Core.sol address
    ",",
    AdvancedStrings.bytes32ToString(hashPayload),      // Hash from CoreHashUtils
    ",",
    AdvancedStrings.addressToString(executor),         // Authorized executor
    ",",
    AdvancedStrings.uintToString(nonce),               // User's nonce
    ",",
    isAsyncExec ? "true" : "false"                     // Execution mode
);
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

This creates the final hash that the user signs with their private key.

## Complete Example: Send 0.05 ETH

**Scenario:** User wants to send 0.05 ETH to `0x742d...82d8c` with synchronous execution

### Step 1: Generate Hash Payload

```solidity

address receiver = 0x742d7b6b472c8f4bd58e6f9f6c82e8e6e7c82d8c;
address token = address(0);  // ETH
uint256 amount = 50000000000000000;  // 0.05 ETH
uint256 priorityFee = 1000000000000000;  // 0.001 ETH

// Convert address to bytes32 (left-padded)
bytes32 receiverBytes = bytes32(uint256(uint160(receiver)));

bytes32 hashPayload = CoreHashUtils.hashDataForPay(
    receiverBytes,
    token,
    amount,
    priorityFee
);

// Result: 0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
```

### Step 2: Construct Signature Message

**Parameters:**
- `evvmId`: `1`
- `serviceAddress`: `0xCoreContractAddress` (deployed Core.sol)
- `hashPayload`: `0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1`
- `executor`: `0x0000000000000000000000000000000000000000` (unrestricted)
- `nonce`: `42`
- `isAsyncExec`: `false`

**Final Message:**
```
1,0xCoreContractAddress,0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1,0x0000000000000000000000000000000000000000,42,false
```

### Step 3: EIP-191 Formatted Hash

```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n138",
    "1,0xCoreContractAddress,0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1,0x0000000000000000000000000000000000000000,42,false"
))
```

### Step 4: User Signs Message

The user signs the message using MetaMask or another EIP-191 compatible wallet:

```javascript
// Frontend example (ethers.js)
const message = "1,0xCoreAddress,0xa7f3...a0b1,0x0000...0000,42,false";
const signature = await signer.signMessage(message);
```

### Step 5: Submit Transaction

```solidity
// Call Core.sol payment function
Core(coreAddress).pay(
    receiver,
    receiverIdentity,  // Empty bytes32 when using address
    token,
    amount,
    priorityFee,
    executor,
    nonce,
    isAsyncExec,
    signature
);
```

Core.sol internally calls `validateAndConsumeNonce()` to verify the signature before processing payment.

## Example with Username

**Scenario:** Send 0.05 ETH to username `alice` with async execution

### Step 1: Convert Username to Bytes32

```solidity
bytes32 usernameHash = keccak256(abi.encodePacked("alice"));
// Result: 0x2b3e82d9a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1
```

### Step 2: Generate Hash Payload

```solidity
bytes32 hashPayload = CoreHashUtils.hashDataForPay(
    usernameHash,  // Username as bytes32
    address(0),    // ETH
    50000000000000000,   // 0.05 ETH
    2000000000000000     // 0.002 ETH fee
);
```

### Step 3: Construct Signature Message

**Parameters:**
- `evvmId`: `1`
- `serviceAddress`: `0xCoreContractAddress`
- `hashPayload`: `0xb4c2d8e9f1a6c5d8...` (from Step 2)
- `executor`: `0x0000000000000000000000000000000000000000`
- `nonce`: `15`
- `isAsyncExec`: `true` (async)

**Final Message:**
```
1,0xCoreContractAddress,0xb4c2d8e9f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3,0x0000000000000000000000000000000000000000,15,true
```

### Step 4: Sign and Submit

```solidity
Core(coreAddress).pay(
    address(0),         // No direct address
    usernameHash,       // Username identifier
    address(0),         // ETH
    50000000000000000,
    2000000000000000,
    address(0),         // Unrestricted
    15,
    true,               // Async
    signature
);
```

## Parameter Formatting

Use `AdvancedStrings` library for proper conversions:

```solidity

// Convert types to strings
AdvancedStrings.uintToString(42);                    // "42"
AdvancedStrings.addressToString(0x742d...);          // "0x742d7b6b..."
AdvancedStrings.bytes32ToString(0xa7f3...);          // "0xa7f3c2d8..."
```

## Signature Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: 27 or 28 (automatically adjusted by wallets)
- **Standard**: EIP-191 compliant

## Best Practices

### Security
- **Never reuse nonces**: Each signature must have a unique nonce
- **Validate parameters**: Check receiver, amount, token before signing
- **Use async cautiously**: Async execution requires nonce reservation

### Development
- **Use CoreHashUtils**: Don't manually construct `hashPayload`
- **Test signature generation**: Verify message format matches expected structure
- **Track nonces**: Query Core.sol for next available nonce
- **Handle executor properly**: Use `0x0...0` for public, specific address for restricted

### Gas Optimization
- **Prefer sync execution**: Async costs more gas due to nonce reservation
- **Batch payments**: Use `batchPay()` for multiple recipients
- **Cache hash payload**: Reuse for multiple signatures with same parameters

## Related Operations

- **[Batch Payment Signatures](./02-DispersePaySignatureStructure.md)** - Multiple recipients
- **[Withdrawal Signatures](./03-WithdrawalPaymentSignatureStructure.md)** - Withdraw from Core balance
- **[Core.sol Payment Functions](../../04-Contracts/01-EVVM/04-PaymentFunctions/01-pay.md)** - Function reference

---

> **Tip: Key Takeaway**
Signatures use **hash-based payload encoding** and centralized verification in Core.sol for improved security and gas efficiency.

---

## Disperse Payment Signature Structure


> **Note: Centralized Verification**
dispersePay signatures are **verified by Core.sol** using `validateAndConsumeNonce()`. The signature format uses hash-based payload encoding instead of individual parameters.

To authorize disperse payment operations (splitting payments to multiple recipients), the user must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

Disperse payments allow distributing a total amount of tokens to multiple recipients in a single transaction, with individual amounts specified for each recipient.

## Signature Format

```
{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}
```

**Components:**
1. **evvmId**: Network identifier (uint256, typically `1`)
2. **serviceAddress**: Core.sol contract address
3. **hashPayload**: Hash of disperse payment parameters (bytes32, from CoreHashUtils)
4. **executor**: Address authorized to execute (address, `0x0...0` for unrestricted)
5. **nonce**: User's centralized nonce from Core.sol (uint256)
6. **isAsyncExec**: Execution mode - `true` for async, `false` for sync (boolean)

## Hash Payload Generation

The `hashPayload` is generated using **CoreHashUtils.hashDataForDispersePay()**:

```solidity

bytes32 hashPayload = CoreHashUtils.hashDataForDispersePay(
    toData,        // Array of recipients and amounts
    token,         // ERC20 token address (0x0...0 for ETH)
    amount,        // Total amount (must equal sum of individual amounts)
    priorityFee    // Fee amount in wei
);
```

### Hash Generation Process

CoreHashUtils creates a deterministic hash that includes the recipient array:

```solidity
// Internal implementation (simplified)
function hashDataForDispersePay(
    CoreStructs.DispersePayMetadata[] memory toData,
    address token,
    uint256 amount,
    uint256 priorityFee
) internal pure returns (bytes32) {
    return keccak256(
        abi.encode("dispersePay", toData, token, amount, priorityFee)
    );
}
```

**Key Points:**
- `toData` is an array of `DispersePayMetadata` structs
- Hash includes the action identifier `"dispersePay"`
- Total `amount` must equal sum of individual recipient amounts
- Hash is deterministic: same parameters → same hash

### DispersePayMetadata Struct

Each recipient is defined by:

```solidity
struct DispersePayMetadata {
    uint256 amount;       // Amount to send to this recipient
    bytes32 to;           // Recipient identifier (address or username hash)
}
```

## Centralized Verification

Core.sol verifies the signature using `validateAndConsumeNonce()`:

```solidity
// Called internally by Core.sol.dispersePay()
Core(coreAddress).validateAndConsumeNonce(
    user,          // Signer's address
    hashPayload,   // From CoreHashUtils
    executor,      // Who can execute
    nonce,         // User's nonce
    isAsyncExec,   // Execution mode
    signature      // EIP-191 signature
);
```

**Verification Steps:**
1. Constructs signature message with all 6 components
2. Applies EIP-191 wrapping and hashing
3. Recovers signer from signature
4. Validates signer matches `user` parameter
5. Checks nonce status
6. Validates executor authorization
7. Marks nonce as consumed

## Complete Example: Disperse 0.1 ETH to 3 Recipients

**Scenario:** User distributes 0.1 ETH to three recipients (0.03 + 0.05 + 0.02 ETH)

### Step 1: Prepare Recipient Data

```solidity

CoreStructs.DispersePayMetadata[] memory toData = 
    new CoreStructs.DispersePayMetadata[](3);

// Recipient 1: Address recipient (0.03 ETH)
toData[0] = CoreStructs.DispersePayMetadata({
    amount: 30000000000000000,
    to: bytes32(uint256(uint160(0x742d7b6b472c8f4bd58e6f9f6c82e8e6e7c82d8c)))
});

// Recipient 2: Username recipient (0.05 ETH)
bytes32 aliceHash = keccak256(abi.encodePacked("alice"));
toData[1] = CoreStructs.DispersePayMetadata({
    amount: 50000000000000000,
    to: aliceHash
});

// Recipient 3: Address recipient (0.02 ETH)
toData[2] = CoreStructs.DispersePayMetadata({
    amount: 20000000000000000,
    to: bytes32(uint256(uint160(0x8e3f2b4c5d6a7f8e9c1b2a3d4e5f6c7d8e9f0a1b)))
});
```

### Step 2: Generate Hash Payload

```solidity
address token = address(0);  // ETH
uint256 amount = 100000000000000000;  // 0.1 ETH total
uint256 priorityFee = 5000000000000000;  // 0.005 ETH

bytes32 hashPayload = CoreHashUtils.hashDataForDispersePay(
    toData,
    token,
    amount,
    priorityFee
);

// Result: 0xb7c3f2e9a4d5c8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4
```

### Step 3: Construct Signature Message

**Parameters:**
- `evvmId`: `1`
- `serviceAddress`: `0xCoreContractAddress` (deployed Core.sol)
- `hashPayload`: `0xb7c3f2e9a4d5c8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4`
- `executor`: `0x0000000000000000000000000000000000000000` (unrestricted)
- `nonce`: `25`
- `isAsyncExec`: `false`

**Final Message:**
```
1,0xCoreContractAddress,0xb7c3f2e9a4d5c8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4,0x0000000000000000000000000000000000000000,25,false
```

### Step 4: EIP-191 Formatted Hash

```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n138",
    "1,0xCoreContractAddress,0xb7c3f2e9a4d5c8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4,0x0000000000000000000000000000000000000000,25,false"
))
```

### Step 5: User Signs Message

```javascript
// Frontend example (ethers.js)
const message = "1,0xCoreAddress,0xb7c3...d3e4,0x0000...0000,25,false";
const signature = await signer.signMessage(message);
```

### Step 6: Submit Transaction

```solidity
// Call Core.sol dispersePay function
Core(coreAddress).dispersePay(
    toData,        // Recipient array
    token,         // ETH
    amount,        // 0.1 ETH
    priorityFee,   // 0.005 ETH
    executor,      // Unrestricted
    nonce,         // 25
    isAsyncExec,   // false (sync)
    signature      // User's signature
);
```

## Amount Validation

The dispersePay function validates that the total matches sum of individual amounts:

```solidity
// Internal validation in Core.sol
uint256 sum = 0;
for (uint i = 0; i < toData.length; i++) {
    sum += toData[i].amount;
}
require(sum == amount, "Amount mismatch");
```

**Critical:** Always ensure `amount` parameter equals the sum of all recipient amounts.

## Username Resolution

Recipients can be specified as addresses or usernames:

**Address Recipient:**
```solidity
bytes32 recipient = bytes32(uint256(uint160(0x742d...)));  // Left-pad address
```

**Username Recipient:**
```solidity
bytes32 recipient = keccak256(abi.encodePacked("alice"));  // Hash username
```

Core.sol resolves usernames via NameService integration during payment processing.

## Gas Efficiency

Disperse payments are more gas-efficient than multiple individual payments:

**Multiple pay() Calls:**
- Gas cost: ~52,000 per payment
- 3 payments = ~156,000 gas

**Single dispersePay() Call:**
- Gas cost: ~80,000 base + ~25,000 per recipient
- 3 recipients = ~155,000 gas (similar but atomic)

**Benefits:**
- Atomic execution (all or nothing)
- Single signature required
- Single nonce consumption
- Better UX for multi-recipient payments

## Best Practices

### Security
- **Validate recipient count**: Check array length before signing
- **Verify amounts**: Ensure individual amounts sum to total
- **Check recipients**: Validate each recipient address/username
- **Never reuse nonces**: Each signature needs unique nonce

### Development
- **Use CoreHashUtils**: Don't manually construct `hashPayload`
- **Test recipient arrays**: Verify data structure before signing
- **Handle username resolution**: Ensure usernames exist in NameService
- **Track nonces**: Query Core.sol for next available nonce

### Gas Optimization
- **Batch when possible**: Use dispersePay instead of multiple pay() calls
- **Prefer sync execution**: Async costs more due to nonce reservation
- **Optimize recipient count**: Balance atomic execution vs. gas costs
- **Consider payment size**: Large recipient arrays may hit gas limits

## Error Handling

Common validation failures:

```solidity
// Total amount mismatch
require(sum == amount, "Amount mismatch");

// Empty recipient array
require(toData.length > 0, "Empty recipients");

// Insufficient balance
require(balance >= amount + priorityFee, "Insufficient funds");

// Invalid recipient
// Checked during username resolution
```

## Related Operations

- **[Single Payment Signatures](./01-SinglePaymentSignatureStructure.md)** - One-to-one payments
- **[Withdrawal Signatures](./03-WithdrawalPaymentSignatureStructure.md)** - Withdraw from Core balance
- **[Core.sol Payment Functions](../../04-Contracts/01-EVVM/04-PaymentFunctions/03-dispersePay.md)** - Function reference

---

> **Tip: Key Takeaway**
dispersePay provides **atomic multi-recipient payments** with centralized verification, hash-based payload encoding, and improved gas efficiency compared to multiple individual payments.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                              // EVVM ID as uint256
    "dispersePay",                       // Action type
    string.concat(                       // Concatenated parameters
        AdvancedStrings.bytes32ToString(hashList),
        ",",
        AdvancedStrings.addressToString(_token),
        ",",
        AdvancedStrings.uintToString(_amount),
        ",",
        AdvancedStrings.uintToString(_priorityFee),
        ",",
        AdvancedStrings.uintToString(_nonce),
        ",",
        _priorityFlag ? "true" : "false",
        ",",
        AdvancedStrings.addressToString(_executor)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(
    AdvancedStrings.uintToString(evvmID), 
    ",", 
    functionName, 
    ",", 
    inputs
)
```

This results in a message format:
```
"{evvmID},dispersePay,{hashList},{token},{amount},{priorityFee},{nonce},{priorityFlag},{executor}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

This creates the final hash that the user must sign with their private key.

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"dispersePay"`
- *Purpose*: Identifies this as a disperse payment operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Hash List (String):**
- The result of `AdvancedStrings.bytes32ToString(hashList)`
- Where `hashList = sha256(abi.encode(toData))`
- *Purpose*: Ensures signature covers the specific recipient list and amounts

**3.2. Token Address (String):**
- The result of `AdvancedStrings.addressToString(_token)`
- *Purpose*: Identifies the token being distributed

**3.3. Total Amount (String):**
- The result of `AdvancedStrings.uintToString(_amount)`
- *Purpose*: Specifies the total amount being distributed across all recipients

**3.4. Priority Fee (String):**
- The result of `AdvancedStrings.uintToString(_priorityFee)`
- *Purpose*: Specifies the fee paid to staking holders

**3.5. Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nonce)`
- *Purpose*: Provides replay protection for the transaction

**3.6. Priority Flag (String):**
- `"true"`: If `_priorityFlag` is `true` (asynchronous)
- `"false"`: If `_priorityFlag` is `false` (synchronous)
- *Purpose*: Explicitly includes the execution mode in the signed message

**3.7. Executor Address (String):**
- The result of `AdvancedStrings.addressToString(_executor)`
- *Purpose*: Specifies the address authorized to submit this payment request


- `AdvancedStrings.bytes32ToString` converts a bytes32 hash to **lowercase hexadecimal** string with "0x" prefix
- `AdvancedStrings.addressToString` converts an address to a lowercase string
- `Strings.toString` converts a number to a string
- `_priorityFlag` indicates whether the payment will be executed asynchronously (`true`) or synchronously (`false`)
- The signature verification uses the `SignatureRecover.signatureVerification` function with structured parameters


## Hash List Structure

The `hashList` component within the signature message is derived by ABI-encoding the entire `toData` array and then computing its `sha256` hash:

```solidity
bytes32 hashList = sha256(abi.encode(toData));
```

This ensures that the signature covers the specific recipient list and amounts.

## Example

Here's a practical example of constructing a signature message for distributing 0.1 ETH to multiple recipients:

**Scenario:** User wants to distribute 0.1 ETH to three recipients using synchronous processing

**Recipients (`toData` array):**
```solidity
DispersePayMetadata[] memory toData = new DispersePayMetadata[](3);
toData[0] = DispersePayMetadata({
    amount: 30000000000000000,  // 0.03 ETH
    to_address: 0x742c7b6b472c8f4bd58e6f9f6c82e8e6e7c82d8c,
    to_identity: ""
});
toData[1] = DispersePayMetadata({
    amount: 50000000000000000,  // 0.05 ETH
    to_address: address(0),
    to_identity: "alice"
});
toData[2] = DispersePayMetadata({
    amount: 20000000000000000,  // 0.02 ETH
    to_address: 0x8e3f2b4c5d6a7f8e9c1b2a3d4e5f6c7d8e9f0a1b,
    to_identity: ""
});
```

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `hashList`: `sha256(abi.encode(toData))` = `0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b`
- `_token`: `address(0)` (ETH)
- `_amount`: `100000000000000000` (0.1 ETH total)
- `_priorityFee`: `5000000000000000` (0.005 ETH)
- `_nonce`: `25`
- `_priorityFlag`: `false` (synchronous)
- `_executor`: `address(0)` (unrestricted)

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "dispersePay", // action type
    "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b,0x0000000000000000000000000000000000000000,100000000000000000,5000000000000000,25,false,0x0000000000000000000000000000000000000000",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,dispersePay,0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b,0x0000000000000000000000000000000000000000,100000000000000000,5000000000000000,25,false,0x0000000000000000000000000000000000000000
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n188",
    "1,dispersePay,0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b,0x0000000000000000000000000000000000000000,100000000000000000,5000000000000000,25,false,0x0000000000000000000000000000000000000000"
))
```

**Concatenated parameters breakdown:**
1. `0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b` - Hash of recipient data
2. `0x0000000000000000000000000000000000000000` - Token address (ETH)
3. `100000000000000000` - Total amount in wei (0.1 ETH)
4. `5000000000000000` - Priority fee in wei (0.005 ETH)
5. `25` - Nonce
6. `false` - Priority flag (synchronous)
7. `0x0000000000000000000000000000000000000000` - Executor (unrestricted)

## Signature Implementation Details

The `SignatureUtil` library performs signature verification in the following steps:

1. **Message Construction**: Concatenates `evvmID`, `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` via `SignatureRecover.recoverSigner` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **String Conversion**:
  - `AdvancedStrings.addressToString` converts addresses to lowercase hex with "0x" prefix
  - `AdvancedStrings.bytes32ToString` converts bytes32 hash to **lowercase hexadecimal** with "0x" prefix
  - `Strings.toString` converts numbers to decimal strings
- **Hash List Integrity**: `hashList = sha256(abi.encode(toData))` ensures signature covers specific recipients
- **Amount Validation**: Total `_amount` should equal sum of all individual amounts in `toData` array
- **Priority Flag**: Determines execution mode (async=`true`, sync=`false`)
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


## `DispersePayMetadata` Struct

Defines the payment details for a single recipient within the `toData` array.

```solidity
struct DispersePayMetadata {
    uint256 amount;
    address to_address;
    string to_identity;
}
```

- **amount**: The amount to send to this specific recipient
- **to_address**: Direct address (use `address(0)` if using identity)
- **to_identity**: Username/identity string (empty if using address)

---

## Withdrawal Signature Structure

# Withdrawal Signature Structure (Coming Soon)

> **Warning: Not Yet Implemented**
**Withdrawal functionality is planned for a future release.**

Withdrawal signatures will follow the centralized verification pattern when implemented, using Core.sol's `validateAndConsumeNonce()` system.

Withdrawal operations will allow users to withdraw funds from their Core.sol balance to external addresses. When implemented, withdrawals will use the same signature architecture as other EVVM operations.

## Expected Signature Format

When implemented, withdrawal signatures will follow the standard format:

```
{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}
```

**Components:**
1. **evvmId**: Network identifier (uint256, typically `1`)
2. **serviceAddress**: Core.sol contract address
3. **hashPayload**: Hash of withdrawal parameters (bytes32, from CoreHashUtils)
4. **executor**: Address authorized to execute (address, `0x0...0` for unrestricted)
5. **nonce**: User's centralized nonce from Core.sol (uint256)
6. **isAsyncExec**: Execution mode - `true` for async, `false` for sync (boolean)

## Expected Hash Payload Generation

A future `CoreHashUtils.hashDataForWithdraw()` function will likely generate the hash payload:

```solidity
// Expected implementation (not yet available)
bytes32 hashPayload = CoreHashUtils.hashDataForWithdraw(
    recipient,      // External address to receive withdrawal
    token,          // ERC20 token address (0x0...0 for ETH)
    amount,         // Amount to withdraw
    priorityFee     // Fee amount
);
```

## Expected Verification

Core.sol will verify withdrawal signatures using the standard `validateAndConsumeNonce()` function:

```solidity
// Expected implementation
Core(coreAddress).validateAndConsumeNonce(
    user,          // Signer's address
    hashPayload,   // From CoreHashUtils
    executor,      // Who can execute
    nonce,         // User's nonce
    isAsyncExec,   // Execution mode
    signature      // EIP-191 signature
);
```

## Implementation Status

**Current Status:** Not yet implemented

**Planned Features:**
- Withdraw from Core.sol balance to external addresses
- Centralized signature verification via Core.sol
- Integration with cross-chain bridges (Axelar, LayerZero)
- Support for both ETH and ERC20 tokens
- Username resolution for withdrawal destinations

## Related Operations

- **[Single Payment Signatures](./01-SinglePaymentSignatureStructure.md)** - Standard payments
- **[Disperse Payment Signatures](./02-DispersePaySignatureStructure.md)** - Multi-recipient payments
- **[Core.sol Payment Functions](../../04-Contracts/01-EVVM/04-PaymentFunctions/01-pay.md)** - Current payment operations

---

> **Note: Stay Updated**
This documentation will be updated when withdrawal functionality is implemented in a future EVVM release. The signature format will follow the centralized verification architecture.

**This structure is speculative** and based on the pattern used in the implemented payment functions:

- **Expected Message Format**: `"{evvmID},{functionName},{parameters}"`
- **Expected EIP-191 Compliance**: Would use `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Expected Hash Function**: `keccak256` would be used for the final message hash before signing
- **Expected Signature Recovery**: Would use `ecrecover` to verify the signature against the expected signer
- **String Conversion**:
  - `AdvancedStrings.addressToString` converts addresses to lowercase hex with "0x" prefix
  - `Strings.toString` converts numbers to decimal strings
- **Priority Flag**: Would determine execution mode (async=`true`, sync=`false`)
- **EVVM ID**: Would identify the specific EVVM instance for signature verification
- **Bridge Integration**: `addressToReceive` would specify the destination on external network

**Note**: The actual implementation may differ from this expected structure when withdrawal functionality is added to SignatureUtils.sol.


---

## Username Pre-Registration Signature Structure


> **Note: Centralized Verification**
NameService signatures are **verified by Core.sol** using `validateAndConsumeNonce()`. This applies to the commit phase of username registration.

To authorize the `preRegistrationUsername` operation (commit phase of username registration), the user must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard.

Pre-registration uses a **commit-reveal scheme** to prevent front-running: users first commit a hash of their desired username + secret lock number, then reveal it within 30 minutes.

## Signature Format

```
{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}
```

**Components:**
1. **evvmId**: Network identifier (uint256, typically `1`)
2. **serviceAddress**: NameService.sol contract address
3. **hashPayload**: Hash of pre-registration parameters (bytes32, from NameServiceHashUtils)
4. **executor**: Address authorized to execute (address, `0x0...0` for unrestricted)
5. **nonce**: User's centralized nonce from Core.sol (uint256)
6. **isAsyncExec**: Execution mode - `true` for async, `false` for sync (boolean)

## Hash Payload Generation

The `hashPayload` is generated using **NameServiceHashUtils.hashDataForPreRegistrationUsername()**:

```solidity

// Step 1: Create username commitment
bytes32 hashUsername = keccak256(abi.encodePacked(username, lockNumber));

// Step 2: Generate hash payload
bytes32 hashPayload = NameServiceHashUtils.hashDataForPreRegistrationUsername(
    hashUsername  // Commitment hash
);
```

### Hash Generation Process

NameServiceHashUtils creates a deterministic hash:

```solidity
// Internal implementation (simplified)
function hashDataForPreRegistrationUsername(
    bytes32 hashUsername
) internal pure returns (bytes32) {
    return keccak256(abi.encode("preRegistrationUsername", hashUsername));
}
```

**Key Points:**
- `hashUsername` is `keccak256(username + lockNumber)` - prevents front-running
- Lock number must be kept secret until reveal phase (registration)
- Pre-registration valid for 30 minutes
- Hash includes operation identifier `"preRegistrationUsername"`

## Commit-Reveal Scheme

### Phase 1: Commit (Pre-Registration)
```solidity
// Secret values (kept private)
string memory username = "alice";
uint256 lockNumber = 123456789;  // Random secret

// Create commitment
bytes32 hashUsername = keccak256(abi.encodePacked(username, lockNumber));

// Generate hash payload
bytes32 hashPayload = NameServiceHashUtils.hashDataForPreRegistrationUsername(
    hashUsername
);

// Sign and submit pre-registration
// (signature includes hashPayload, but NOT username or lockNumber)
```

### Phase 2: Reveal (Registration - within 30 minutes)
```solidity
// Reveal secret values
NameService.registrationUsername(
    username,      // "alice" (revealed)
    lockNumber,    // 123456789 (revealed)
    ...signature params...
);

// Contract verifies: keccak256(username, lockNumber) == stored hashUsername
```

**Security:** Front-runners see only the hash during commit phase, not the actual username.

## Centralized Verification

Core.sol verifies the signature using `validateAndConsumeNonce()`:

```solidity
// Called internally by NameService.sol.preRegistrationUsername()
Core(coreAddress).validateAndConsumeNonce(
    user,          // Signer's address
    hashPayload,   // From NameServiceHashUtils
    executor,      // Who can execute
    nonce,         // User's nonce
    isAsyncExec,   // Execution mode
    signature      // EIP-191 signature
);
```

## Complete Example: Pre-Register "alice"

**Scenario:** User wants to reserve username "alice" with commit-reveal

### Step 1: Generate Commitment

```solidity
string memory username = "alice";
uint256 lockNumber = 987654321;  // Keep this secret!

bytes32 hashUsername = keccak256(abi.encodePacked(username, lockNumber));
// Result: 0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
```

### Step 2: Generate Hash Payload

```solidity
bytes32 hashPayload = NameServiceHashUtils.hashDataForPreRegistrationUsername(
    hashUsername
);
// Result: 0xb4c2d8e9f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3
```

### Step 3: Construct Signature Message

**Parameters:**
- `evvmId`: `1`
- `serviceAddress`: `0xNameServiceAddress` (deployed NameService.sol)
- `hashPayload`: `0xb4c2d8e9f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3`
- `executor`: `0x0000000000000000000000000000000000000000` (unrestricted)
- `nonce`: `15`
- `isAsyncExec`: `false`

**Final Message:**
```
1,0xNameServiceAddress,0xb4c2d8e9f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3,0x0000000000000000000000000000000000000000,15,false
```

### Step 4: Sign and Submit

```javascript
// Frontend (ethers.js)
const message = "1,0xNameServiceAddress,0xb4c2...c2d3,0x0000...0000,15,false";
const signature = await signer.signMessage(message);
```

```solidity
// Submit pre-registration
NameService(nameServiceAddress).preRegistrationUsername(
    hashUsername,   // Commitment (not the username!)
    executor,       // Unrestricted
    nonce,          // 15
    isAsyncExec,    // false (sync)
    signature       // User's signature
);
```

### Step 5: Reveal (Within 30 Minutes)

After pre-registration is confirmed, reveal the username and lock number:

```solidity
// Now reveal the actual values
NameService(nameServiceAddress).registrationUsername(
    username,       // "alice" (revealed)
    lockNumber,     // 987654321 (revealed)
    executor,
    nonce + 1,      // New nonce
    isAsyncExec,
    registrationSignature  // New signature for registration
);
```

## Security Considerations

### Front-Running Protection
- **Commit phase**: Only hash is public, actual username is hidden
- **Reveal phase**: Must match commitment within 30 minutes
- **Attack prevention**: Front-runners can't steal username without lock number

### Time Window
```solidity
// Pre-registration expires after 30 minutes
require(block.timestamp <= preRegTime + 30 minutes, "Expired");
```

**Important:** Complete registration within 30 minutes or pre-registration expires.

### Lock Number Requirements
- **Randomness**: Use cryptographically random lock number
- **Secrecy**: Never share lock number before reveal phase
- **Storage**: Store securely client-side until registration
- **Size**: uint256 (0 to 2^256-1)

## Gas Costs

**Pre-Registration:**
- Base cost: ~50,000 gas
- Signature verification: ~5,000 gas
- Storage: ~20,000 gas
- **Total:** ~75,000 gas

**Registration (Reveal):**
- Base cost: ~100,000 gas
- Username storage: ~40,000 gas
- Payment: 100x EVVM reward
- **Total:** ~140,000 gas + payment

## Best Practices

### Security
- **Generate random lock numbers**: Use `crypto.randomBytes(32)` or equivalent
- **Never reuse lock numbers**: Each username needs unique lock number
- **Store safely**: Keep lock number in secure local storage
- **Complete quickly**: Register within 30-minute window

### Development
- **Use NameServiceHashUtils**: Don't manually construct hashes
- **Validate username**: Check format before committing
- **Track expiration**: Monitor 30-minute countdown
- **Handle failures**: Implement retry logic for expired pre-registrations

### UX Optimization
- **Show countdown**: Display time remaining for reveal
- **Warn before expiry**: Alert user when < 5 minutes remain
- **Auto-proceed**: Automatically trigger registration after commit
- **Cache lock number**: Store encrypted in browser local storage

## Error Handling

Common validation failures:

```solidity
// Pre-registration expired
require(block.timestamp <= preRegTime + 30 minutes, "Expired");

// Username already taken
require(!isUsernameTaken(username), "Username exists");

// Commitment mismatch (during reveal)
require(
    keccak256(abi.encodePacked(username, lockNumber)) == storedHash,
    "Invalid reveal"
);
```

## Related Operations

- **[Registration Signature](./02-registrationUsernameStructure.md)** - Reveal phase (complete registration)
- **[NameService Functions](../../04-Contracts/02-NameService/01-Overview.md)** - Complete NameService reference
- **[Core.sol Verification](../../04-Contracts/01-EVVM/03-SignatureAndNonceManagement.md)** - Signature verification system

---

> **Tip: Key Takeaway**
Pre-registration uses **commit-reveal with centralized verification**. The hash-based approach prevents front-running while Core.sol handles signature validation.

> **Note: All NameService Signatures**
All 10 NameService operations follow this pattern:
- preRegistrationUsername (commit phase)
- registrationUsername (reveal phase)
- makeOffer, withdrawOffer, acceptOffer (marketplace)
- renewUsername (extend expiration)
- addCustomMetadata, removeCustomMetadata, flushCustomMetadata
- flushUsername (delete account)

Each uses its respective `NameServiceHashUtils.hashDataFor...()` function.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "preRegistrationUsername",                          // Action type
    string.concat(                                      // Concatenated parameters
        AdvancedStrings.bytes32ToString(_hashUsername),
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(evvmID, ",", functionName, ",", inputs)
```

This results in a message format:
```
"{evvmID},preRegistrationUsername,{hashUsername},{nameServiceNonce}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

This creates the final hash that the user must sign with their private key.

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"preRegistrationUsername"`
- *Purpose*: Identifies this as a username pre-registration operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Username Hash (String):**
- The result of `AdvancedStrings.bytes32ToString(_hashUsername)`
- *Purpose*: String representation of the `bytes32` hash commitment being pre-registered

**3.2. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for pre-registration actions by the user

## Example

Here's a practical example of constructing a signature message for pre-registering a username:

**Scenario:** User wants to pre-register the username "alice" with a secret clowNumber

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- Username: `"alice"`
- ClowNumber: `123456789` (secret value)
- `_hashUsername`: `keccak256(abi.encodePacked("alice", 123456789))` = `0xa1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcdef`
- `_nameServiceNonce`: `15`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "preRegistrationUsername", // action type
    "0xa1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcdef,15",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,preRegistrationUsername,0xa1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcdef,15
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n97",
    "1,preRegistrationUsername,0xa1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcdef,15"
))
```

**Concatenated parameters breakdown:**
1. `0xa1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcdef` - Hash of username and clowNumber
2. `15` - Name Service nonce

## Signature Implementation Details

The `SignatureUtil` library performs signature verification in the following steps:

1. **Message Construction**: Concatenates `evvmID`, `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **String Conversion**:
  - `AdvancedStrings.bytes32ToString` converts bytes32 values to **lowercase hexadecimal** with "0x" prefix
  - `Strings.toString` converts numbers to decimal strings
- **Username Hash**: Must be calculated as `keccak256(abi.encodePacked(_username, _clowNumber))`
- **Commit-Reveal Scheme**: The `_clowNumber` is secret during pre-registration and revealed during registration
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


## Hash Username Structure

For pre-registration of a username, users must provide a hash of the username. The hash is calculated using keccak256 with the following structure:

```solidity
keccak256(abi.encodePacked(_username, _clowNumber));
```

Where:

- `_username` is the desired username (string)
- `_clowNumber` is the secret key number (uint256) that will be used in the `registrationUsername` function

**Important:** The `_clowNumber` must be kept secret during pre-registration and revealed during the actual registration process.

---

## Registration of username Signature Structure


To authorize the `registrationUsername` operation (the reveal phase following pre-registration), the user must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library which implements the standard Ethereum message signing protocol. This signature proves ownership of the pre-registration commit by revealing the original username and the secret `clowNumber`. The message is constructed by concatenating the EVVM ID, action type (`"registrationUsername"`), and parameters, then wrapped with the EIP-191 prefix.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "registrationUsername",                             // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_clowNumber),
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(evvmID, ",", functionName, ",", inputs)
```

This results in a message format:
```
"{evvmID},registrationUsername,{username},{clowNumber},{nameServiceNonce}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"registrationUsername"`
- *Purpose*: Identifies this as a username registration operation (reveal phase)

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Username (String):**
- The `_username` string itself
- *Purpose*: The actual, plain-text username that the user intends to register. This must match the username used to generate the hash during pre-registration

**3.2. Clow Number (String):**
- The result of `AdvancedStrings.uintToString(_clowNumber)`
- *Purpose*: The string representation of the secret `uint256` number chosen by the user during the pre-registration phase

**3.3. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for registration actions by the user

## Example

Here's a practical example of constructing a signature message for registering a username:

**Scenario:** User wants to register the username "alice" revealing the secret clowNumber from pre-registration

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `_username`: `"alice"`
- `_clowNumber`: `123456789` (secret value from pre-registration)
- `_nameServiceNonce`: `5`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "registrationUsername", // action type
    "alice,123456789,5",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,registrationUsername,alice,123456789,5
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n37",
    "1,registrationUsername,alice,123456789,5"
))
```

**Concatenated parameters breakdown:**
1. `alice` - The username to register
2. `123456789` - The secret clowNumber used during pre-registration
3. `5` - The user's name service nonce

**Commit-Reveal Verification:**
The system will verify that `keccak256(abi.encodePacked("alice", 123456789))` matches the hash that was pre-registered.

## Signature Implementation Details

The `SignatureUtil` library performs signature verification in the following steps:

1. **Message Construction**: Concatenates `evvmID`, `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **String Conversion**: `Strings.toString` converts numbers to decimal strings
- **Commit-Reveal Scheme**: The `clowNumber` and username combination must match what was used during pre-registration
- **Hash Verification**: System verifies `keccak256(abi.encodePacked(_username, _clowNumber))` matches pre-registration hash
- **EVVM ID**: Identifies the specific EVVM instance for signature verification
- **Replay Protection**: `_nameServiceNonce` prevents replay attacks for registration actions


---

## Make Offer Signature Structure


To authorize the `makeOffer` operation within the Name Service, the user (the offeror) must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library. This signature proves the offeror's intent and authorization to place a specific offer on a target username under the specified terms (amount, expiration).

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "makeOffer",                                        // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_dateExpire),
        ",",
        AdvancedStrings.uintToString(_amount),
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},makeOffer,{username},{dateExpire},{amount},{nameServiceNonce}"
```

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"makeOffer"`
- *Purpose*: Identifies this as a make offer operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Target Username (String):**
- The `_username` string itself
- *Purpose*: Specifies the username on which the offer is being placed

**3.2. Offer Expiration Date (String):**
- The result of `AdvancedStrings.uintToString(_dateExpire)`
- *Purpose*: Unix timestamp indicating when this offer expires

**3.3. Offer Amount (String):**
- The result of `AdvancedStrings.uintToString(_amount)`
- *Purpose*: The quantity of tokens being offered in exchange for the username

**3.4. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for make offer actions

## Example

Here's a practical example of constructing a signature message for making an offer:

**Scenario:** User wants to make an offer on username "alice"

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `_username`: `"alice"`
- `_dateExpire`: `1735689600` (Unix timestamp for January 1, 2025)
- `_amount`: `1000` (tokens)
- `_nameServiceNonce`: `5`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "makeOffer", // action type
    "alice,1735689600,1000,5",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,makeOffer,alice,1735689600,1000,5
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n36",
    "1,makeOffer,alice,1735689600,1000,5"
))
```

**Concatenated parameters breakdown:**
1. `alice` - The username being offered on
2. `1735689600` - Unix timestamp when the offer expires
3. `1000` - Amount of tokens being offered
4. `5` - The offeror's name service nonce

> **Tip: Technical Details**

- **Message Format**: `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Expiration Logic**: `_dateExpire` must be a future Unix timestamp
- **Token Amount**: `_amount` represents the total tokens offered for the username
- **Replay Protection**: `_nameServiceNonce` prevents replay attacks for offer actions
- **EVVM ID**: Identifies the specific EVVM instance for signature verification



- The function selector `d82e5d8b` is the first 4 bytes of the keccak256 hash of the function signature for `verifyMessageSignedForMakeOffer`
- `Strings.toString` converts a number to a string (standard OpenZeppelin utility)
- The signature verification uses the EIP-191 standard for message signing
- The `_dateExpire` parameter should be a Unix timestamp representing when the offer expires
- The `_amount` represents the total amount of tokens being offered for the username


---

## Withdraw Offer Signature Structure


To authorize the `withdrawOffer` operation within the Name Service, the user (the original offeror) must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library. This signature proves the offeror's intent and authorization to withdraw a specific, previously placed offer from a target username.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "withdrawOffer",                                    // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_offerId),
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},withdrawOffer,{username},{offerId},{nameServiceNonce}"
```

## Message Components

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"withdrawOffer"`
- *Purpose*: Identifies this as a withdraw offer operation

**3. Concatenated Parameters (String):**

**3.1. Target Username (String):**
- The `_username` string itself
- *Purpose*: Specifies the username associated with the offer being withdrawn

**3.2. Offer ID (String):**
- The result of `AdvancedStrings.uintToString(_offerId)`
- *Purpose*: The unique identifier assigned to the specific offer when created

**3.3. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for withdraw offer actions

## Example

**Scenario:** User wants to withdraw their offer on username "alice"

**Parameters:**
- `evvmID`: `1`
- `_username`: `"alice"`
- `_offerId`: `42`
- `_nameServiceNonce`: `7`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "withdrawOffer",
    "alice,42,7",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,withdrawOffer,alice,42,7
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n27",
    "1,withdrawOffer,alice,42,7"
))
```

> **Tip: Technical Details**

- **Message Format**: `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Offer ID Validation**: `_offerId` must correspond to an existing offer made by the same user
- **Authorization**: Only the original offeror can withdraw their own offers
- **Replay Protection**: `_nameServiceNonce` prevents replay attacks
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


---

## Accept Offer Signature Structure


To authorize the `acceptOffer` operation within the Name Service, the user who **currently owns the username** must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library. This signature proves the current username owner's intent and authorization to accept a specific offer (`_offerId`), thereby agreeing to transfer ownership of their username (`_username`) in exchange for the offered amount.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "acceptOffer",                                      // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_offerId),
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},acceptOffer,{username},{offerId},{nameServiceNonce}"
```

## Message Components

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"acceptOffer"`
- *Purpose*: Identifies this as an accept offer operation

**3. Concatenated Parameters (String):**

**3.1. Target Username (String):**
- The `_username` string itself
- *Purpose*: Specifies the username that the owner is agreeing to sell

**3.2. Offer ID (String):**
- The result of `AdvancedStrings.uintToString(_offerId)`
- *Purpose*: The unique identifier of the specific offer being accepted

**3.3. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for accept offer actions

## Example

**Scenario:** Current owner of username "alice" wants to accept an offer

**Parameters:**
- `evvmID`: `1`
- `_username`: `"alice"`
- `_offerId`: `123`
- `_nameServiceNonce`: `3`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "acceptOffer",
    "alice,123,3",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,acceptOffer,alice,123,3
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n25",
    "1,acceptOffer,alice,123,3"
))
```

> **Tip: Technical Details**

- **Message Format**: `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Authorization**: Only the current owner of the username can accept offers
- **Offer Validation**: `_offerId` must correspond to a valid, non-expired offer
- **Ownership Transfer**: Accepting an offer transfers username ownership to the offeror
- **Replay Protection**: `_nameServiceNonce` prevents replay attacks
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


---

## Renew Username Signature Structure


To authorize the `renewUsername` operation within the Name Service, the user (the current username owner) must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library. This signature proves the owner's intent and authorization to extend the validity period of their username registration.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "renewUsername",                                    // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},renewUsername,{username},{nameServiceNonce}"
```

## Message Components

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"renewUsername"`
- *Purpose*: Identifies this as a username renewal operation

**3. Concatenated Parameters (String):**

**3.1. Target Username (String):**
- The `_username` string itself
- *Purpose*: Specifies the username whose registration is being renewed

**3.2. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for renewal actions

## Example

**Scenario:** Current owner wants to renew their username "alice"

**Parameters:**
- `evvmID`: `1`
- `_username`: `"alice"`
- `_nameServiceNonce`: `8`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "renewUsername",
    "alice,8",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,renewUsername,alice,8
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n22",
    "1,renewUsername,alice,8"
))
```

> **Tip: Technical Details**

- **Message Format**: `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Authorization**: Only the current owner of the username can renew their own username
- **Renewal Logic**: Extends the username's expiration period and may involve a renewal fee
- **Replay Protection**: `_nameServiceNonce` prevents replay attacks
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


---

## Add Custom Metadata Signature Structure


To authorize the `addCustomMetadata` operation within the Name Service, the user who **currently owns the username** must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library. This signature proves the current username owner's intent and authorization to add or update a specific custom metadata field (`_value`) associated with their identity (`_identity`).

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "addCustomMetadata",                                // Action type
    string.concat(                                      // Concatenated parameters
        _identity,
        ",",
        _value,
        ",",
        AdvancedStrings.uintToString(_nameServiceNonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},addCustomMetadata,{identity},{value},{nameServiceNonce}"
```

## Message Components

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"addCustomMetadata"`
- *Purpose*: Identifies this as an add custom metadata operation

**3. Concatenated Parameters (String):**

**3.1. Target Identity (String):**
- The `_identity` string itself
- *Purpose*: Specifies the identity (username) to which this custom metadata applies

**3.2. Metadata Value (String):**
- The `_value` string itself, exactly as provided by the user
- *Purpose*: Represents the custom data being associated with the identity

**3.3. Name Service Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nameServiceNonce)`
- *Purpose*: Provides replay protection for metadata operations

## Example

**Scenario:** Owner wants to add custom metadata to their identity "alice"

**Parameters:**
- `evvmID`: `1`
- `_identity`: `"alice"`
- `_value`: `"https://alice.example.com/profile"`
- `_nameServiceNonce`: `12`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "addCustomMetadata",
    "alice,https://alice.example.com/profile,12",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,addCustomMetadata,alice,https://alice.example.com/profile,12
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n59",
    "1,addCustomMetadata,alice,https://alice.example.com/profile,12"
))
```

> **Tip: Technical Details**

- **Message Format**: `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Authorization**: Only the current owner of the identity can add custom metadata
- **Flexible Data**: `_value` can contain any string data (URLs, descriptions, custom information)
- **Metadata Management**: Allows users to associate additional information with their identities
- **Replay Protection**: `_nameServiceNonce` prevents replay attacks
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


---

## Remove Custom Metadata Signature Structure


To authorize the `removeCustomMetadata` operation within the MNS service, the user who **currently owns the username** must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard.

The signature verification process uses the `SignatureUtil` library. This signature proves the current username owner's intent and authorization to remove a specific custom metadata entry (identified by its key/index `_key`) associated with their username (`_username`).

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "removeCustomMetadata",                             // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_key),
        ",",
        AdvancedStrings.uintToString(_nonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},removeCustomMetadata,{username},{key},{nonce}"
```

## Message Components

**1. EVVM ID (String):**
- The result of `AdvancedStrings.uintToString(evvmID)`
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"removeCustomMetadata"`
- *Purpose*: Identifies this as a remove custom metadata operation

**3. Concatenated Parameters (String):**

**3.1. Target Username (String):**
- The `_username` string itself
- *Purpose*: Specifies the username from which the custom metadata entry will be removed

**3.2. Metadata Key/Index (String):**
- The result of `AdvancedStrings.uintToString(_key)`
- *Purpose*: The identifier for the specific metadata entry targeted for removal

**3.3. Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nonce)`
- *Purpose*: Provides replay protection for metadata removal operations

## Example

**Scenario:** Owner wants to remove custom metadata from their username "alice"

**Parameters:**
- `evvmID`: `1`
- `_username`: `"alice"`
- `_key`: `3` (metadata entry identifier)
- `_nonce`: `15`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "removeCustomMetadata",
    "alice,3,15",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,removeCustomMetadata,alice,3,15
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n33",
    "1,removeCustomMetadata,alice,3,15"
))
```

**Message Breakdown:**
- `8adf3927`: Function selector for remove custom metadata verification
- `alice`: The username from which the metadata will be removed
- `3`: The key/index of the specific metadata entry to remove
- `15`: The current username owner's nonce

This message would then be signed using EIP-191 standard, and the resulting signature would be used to verify the metadata removal request in the `verifyMessageSignedForRemoveCustomMetadata` function.
   

- The function selector `8adf3927` is the first 4 bytes of the keccak256 hash of the function signature for `verifyMessageSignedForRemoveCustomMetadata`
- `Strings.toString` converts a number to a string (standard OpenZeppelin utility)
- The signature verification uses the EIP-191 standard for message signing
- Only the current owner of the username can remove custom metadata from their username
- The `_key` parameter identifies which specific metadata entry to remove by its index/identifier
- The `_nonce` parameter is the user's general nonce, not specifically the name service nonce


---

## Flush Custom Metadata Signature Structure


To authorize the `flushCustomMetadata` operation within the MNS service, the user who **currently owns the username** must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard.

The signature verification process uses the `SignatureUtil` library. This signature proves the current username owner's intent and authorization to remove **all** custom metadata entries associated with their username (`_username`).

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "flushCustomMetadata",                              // Action type
    string.concat(                                      // Concatenated parameters
        _identity,
        ",",
        AdvancedStrings.uintToString(_nonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},flushCustomMetadata,{identity},{nonce}"
```

## Example

**Scenario:** Owner wants to flush all custom metadata from their identity "alice"

**Parameters:**
- `evvmID`: `1`
- `_identity`: `"alice"`
- `_nonce`: `20`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "flushCustomMetadata",
    "alice,20",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,flushCustomMetadata,alice,20
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n31",
    "1,flushCustomMetadata,alice,20"
))
```

**Message Breakdown:**
- `3ca44e54`: Function selector for flush custom metadata verification
- `alice`: The identity (username) from which all metadata will be removed
- `20`: The current identity owner's nonce

This message would then be signed using EIP-191 standard, and the resulting signature would be used to verify the metadata flush request in the `verifyMessageSignedForFlushCustomMetadata` function.
   

- The function selector `3ca44e54` is the first 4 bytes of the keccak256 hash of the function signature for `verifyMessageSignedForFlushCustomMetadata`
- `Strings.toString` converts a number to a string (standard OpenZeppelin utility)
- The signature verification uses the EIP-191 standard for message signing
- Only the current owner of the identity can flush all custom metadata from their identity
- This operation removes **all** custom metadata entries at once, unlike `removeCustomMetadata` which removes specific entries
- The `_nonce` parameter is the user's general nonce, similar to the remove function


---

## Flush Username Signature Structure


To authorize the `flushUsername` operation within the Name Service, the user who **currently owns the username** must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library. This signature proves the current username owner's intent and authorization to completely remove and "flush" their username registration from the system.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "flushUsername",                                    // Action type
    string.concat(                                      // Concatenated parameters
        _username,
        ",",
        AdvancedStrings.uintToString(_nonce)
    ),
    signature,
    signer
);
```

### Internal Message Construction

This results in a message format:
```
"{evvmID},flushUsername,{username},{nonce}"
```

## Example

**Scenario:** Owner wants to permanently delete their username "alice"

**Parameters:**
- `evvmID`: `1`
- `_username`: `"alice"`
- `_nonce`: `25`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,
    "flushUsername",
    "alice,25",
    signature,
    signer
);
```

**Final message to be signed:**
```
1,flushUsername,alice,25
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n23",
    "1,flushUsername,alice,25"
))
```

⚠️ **Warning**: This operation is **irreversible** and will permanently delete the username registration and all associated data.


- The function selector `044695cb` is the first 4 bytes of the keccak256 hash of the function signature for `verifyMessageSignedForFlushUsername`
- `Strings.toString` converts a number to a string (standard OpenZeppelin utility)
- The signature verification uses the EIP-191 standard for message signing
- Only the current owner of the username can flush their own username
- This operation is **irreversible** and permanently deletes the username registration and all associated data
- The `_nonce` parameter is the user's general nonce, similar to other deletion operations


---

## Standard Staking/Unstaking Signature Structure


> **Note: Signature Verification**
Staking operations use **Core.sol's centralized signature verification** via `validateAndConsumeNonce()`. The signature format follows the universal EVVM pattern with `StakingHashUtils` for hash generation.

To authorize standard staking operations like `presaleStaking` or `publicStaking`, or their corresponding unstaking actions, the user must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard.

## Signature Format

### Complete Message Structure

```
{evvmId},{stakingAddress},{hashPayload},{originExecutor},{nonce},true
```

**Components:**
- `evvmId`: Chain ID (e.g., `1` for Ethereum mainnet)
- `stakingAddress`: Staking contract address (hexadecimal)
- `hashPayload`: Operation hash from StakingHashUtils (hexadecimal)
- `originExecutor`: EOA that will execute (verified with tx.origin), hexadecimal
- `nonce`: User's Core nonce for this signature
- `true`: Always async execution

### Hash Payload Generation

**Presale Staking:**
```solidity
bytes32 hashPayload = StakingHashUtils.hashDataForPresaleStake(
    isStaking,      // true = stake, false = unstake
    1               // Fixed amount: 1 token
);
// Hash: keccak256(abi.encode("presaleStaking", isStaking, 1))
```

**Public Staking:**
```solidity
bytes32 hashPayload = StakingHashUtils.hashDataForPublicStake(
    isStaking,          // true = stake, false = unstake
    amountOfStaking     // Variable amount
);
// Hash: keccak256(abi.encode("publicStaking", isStaking, amountOfStaking))
```

## Examples

### Public Staking Example (Stake 1000 tokens)

**Scenario:** User wants to stake 1000 tokens in public staking

**Parameters:**
- `evvmId`: `11155111` (Sepolia testnet)
- `stakingAddress`: `0x1234567890123456789012345678901234567890`
- `isStaking`: `true`
- `amountOfStaking`: `1000`
- `originExecutor`: `0xABCDEF1234567890ABCDEF1234567890ABCDEF12`
- `nonce`: `42`

**Step 1: Generate hash payload**
```solidity
bytes32 hashPayload = StakingHashUtils.hashDataForPublicStake(true, 1000);
// Result: 0x7a8b9c...def (example hash)
```

**Step 2: Construct message**
```
11155111,0x1234567890123456789012345678901234567890,0x7a8b9c...def,0xABCDEF1234567890ABCDEF1234567890ABCDEF12,42,true
```

**Step 3: Sign with EIP-191**
```javascript
const message = "11155111,0x1234567890123456789012345678901234567890,0x7a8b9c...def,0xABCDEF1234567890ABCDEF1234567890ABCDEF12,42,true";
const signature = await signer.signMessage(message);
```

### Presale Staking Example (Stake 1 token)

**Scenario:** Presale user wants to stake 1 token (fixed amount)

**Parameters:**
- `evvmId`: `11155111` (Sepolia testnet)
- `stakingAddress`: `0x1234567890123456789012345678901234567890`
- `isStaking`: `true`
- `amountOfStaking`: `1` (always 1 for presale)
- `originExecutor`: `0xABCDEF1234567890ABCDEF1234567890ABCDEF12`
- `nonce`: `7`

**Step 1: Generate hash payload**
```solidity
bytes32 hashPayload = StakingHashUtils.hashDataForPresaleStake(true, 1);
// Result: 0x3c4d5e...abc (example hash)
```

**Step 2: Construct message**
```
11155111,0x1234567890123456789012345678901234567890,0x3c4d5e...abc,0xABCDEF1234567890ABCDEF1234567890ABCDEF12,7,true
```

**Step 3: Sign with EIP-191**
```javascript
const message = "11155111,0x1234567890123456789012345678901234567890,0x3c4d5e...abc,0xABCDEF1234567890ABCDEF1234567890ABCDEF12,7,true";
const signature = await signer.signMessage(message);
```

### Public Unstaking Example (Unstake 500 tokens)

**Scenario:** User wants to unstake 500 tokens

**Parameters:**
- `evvmId`: `11155111`
- `stakingAddress`: `0x1234567890123456789012345678901234567890`
- `isStaking`: `false` (unstaking)
- `amountOfStaking`: `500`
- `originExecutor`: `0xABCDEF1234567890ABCDEF1234567890ABCDEF12`
- `nonce`: `43`

**Step 1: Generate hash payload**
```solidity
bytes32 hashPayload = StakingHashUtils.hashDataForPublicStake(false, 500);
// Result: 0x9e8f7a...123 (example hash)
```

**Step 2: Construct message**
```
11155111,0x1234567890123456789012345678901234567890,0x9e8f7a...123,0xABCDEF1234567890ABCDEF1234567890ABCDEF12,43,true
```

**Step 3: Sign with EIP-191**
```javascript
const message = "11155111,0x1234567890123456789012345678901234567890,0x9e8f7a...123,0xABCDEF1234567890ABCDEF1234567890ABCDEF12,43,true";
const signature = await signer.signMessage(message);
```

## Verification Process

### Core.validateAndConsumeNonce()

All staking operations use Core.sol's centralized verification:

```solidity
core.validateAndConsumeNonce(
    user,               // Signer address
    hashPayload,        // From StakingHashUtils
    originExecutor,     // EOA executor (verified with tx.origin)
    nonce,              // User's Core nonce
    true,               // Always async execution
    signature           // EIP-191 signature
);
```

**Validation Steps:**
1. **Message Construction**: Concatenates all components with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + length
3. **Hashing**: Applies `keccak256` to formatted message
4. **Signature Recovery**: Uses `ecrecover` to recover signer address
5. **Verification**: Compares recovered address with `user`
6. **Nonce Check**: Ensures nonce hasn't been used
7. **Executor Check**: Verifies `tx.origin == originExecutor`
8. **Consume Nonce**: Marks nonce as used to prevent replay

**On Failure:**
- `Core__InvalidSignature()` - Invalid signature
- `Core__NonceAlreadyUsed()` - Nonce already consumed
- `Core__InvalidExecutor()` - Executing EOA doesn't match originExecutor

> **Tip: Technical Details**

- **Universal Format**: All EVVM services now use the same signature format
- **Centralized Nonces**: Core.sol manages all nonces across services
- **Hash Security**: StakingHashUtils generates collision-resistant hashes
- **EOA Verification**: originExecutor ensures only specific EOA can execute
- **Always Async**: Staking operations always use async execution mode
- **Replay Protection**: Core.sol's nonce system prevents replay attacks
- **Operation Types**: `presaleStaking` (1 token fixed) vs `publicStaking` (variable)


---

## Fisher Bridge Signature Structure


To authorize cross-chain treasury operations through the Fisher Bridge system, users must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library which implements the standard Ethereum message signing protocol. The signature authorizes fisher executors to process cross-chain deposits and withdrawals on behalf of users, enabling gasless transactions and seamless multi-chain asset management.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                                             // EVVM ID as uint256
    "fisherBridge",                                     // Action type
    string.concat(                                      // Concatenated parameters
        AdvancedStrings.addressToString(addressToReceive),
        ",",
        AdvancedStrings.uintToString(nonce),
        ",",
        AdvancedStrings.addressToString(tokenAddress),
        ",",
        AdvancedStrings.uintToString(priorityFee),
        ",",
        AdvancedStrings.uintToString(amount)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(AdvancedStrings.uintToString(evvmID), ",", functionName, ",", inputs)
```

This results in a message format:
```
"{evvmID},fisherBridge,{addressToReceive},{nonce},{tokenAddress},{priorityFee},{amount}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (uint256):**
- Direct uint256 value (converted to string internally)
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"fisherBridge"`
- *Purpose*: Identifies this as a Fisher Bridge cross-chain operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Recipient Address (String):**
- The result of `AdvancedStrings.addressToString(addressToReceive)`
- *Purpose*: Specifies the address that will receive the assets or EVVM balance credit
- *Note*: This can be different from the signer address, allowing flexible recipient designation

**3.2. Nonce (String):**
- The result of `AdvancedStrings.uintToString(nonce)`
- *Purpose*: Provides replay protection for the transaction
- *Source*: Current value from `nextFisherExecutionNonce[signer]` mapping

**3.3. Token Address (String):**
- The result of `AdvancedStrings.addressToString(tokenAddress)`
- *Purpose*: Identifies the token being transferred
- *Special Case*: `address(0)` represents native blockchain coins (ETH, MATIC, BNB, etc.)

**3.4. Priority Fee (String):**
- The result of `AdvancedStrings.uintToString(priorityFee)`
- *Purpose*: Specifies the fee paid to the fisher executor for processing the transaction
- *Note*: Can be `0` if no priority fee is offered

**3.5. Amount (String):**
- The result of `AdvancedStrings.uintToString(amount)`
- *Purpose*: Specifies the quantity of tokens/coins to be transferred

## Usage Scenarios

### External Chain to EVVM Deposit
Users on external chains sign messages to authorize fisher executors to deposit their assets into EVVM.

### EVVM to External Chain Withdrawal
Users sign messages to authorize fisher executors to withdraw assets from EVVM to external chains.

## Example Scenarios

### Example 1: USDC Deposit from Ethereum to EVVM

**Scenario:** User wants to deposit 100 USDC from Ethereum to EVVM with 1 USDC priority fee

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `addressToReceive`: `0x742d35Cc6634C0532925a3b8D43C1C16bE8c9123` (recipient in EVVM)
- `nonce`: `5` (current fisher execution nonce for user)
- `tokenAddress`: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (USDC contract)
- `priorityFee`: `1000000` (1 USDC with 6 decimals)
- `amount`: `100000000` (100 USDC with 6 decimals)

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,              // evvmID as uint256
    "fisherBridge", // action type
    "0x742d35cc6634c0532925a3b8d43c1c16be8c9123,5,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,1000000,100000000",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,fisherBridge,0x742d35cc6634c0532925a3b8d43c1c16be8c9123,5,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,1000000,100000000
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n119",
    "1,fisherBridge,0x742d35cc6634c0532925a3b8d43c1c16be8c9123,5,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,1000000,100000000"
))
```

**Concatenated parameters breakdown:**
1. `0x742d35cc6634c0532925a3b8d43c1c16be8c9123` - Recipient address (lowercase with 0x prefix)
2. `5` - Current nonce
3. `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` - USDC token address (lowercase with 0x prefix)
4. `1000000` - Priority fee (1 USDC)
5. `100000000` - Amount (100 USDC)

### Example 2: ETH Withdrawal from EVVM to Ethereum

**Scenario:** User wants to withdraw 0.5 ETH from EVVM to Ethereum with 0.01 ETH priority fee

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `addressToReceive`: `0x9876543210987654321098765432109876543210` (recipient on Ethereum)
- `nonce`: `12` (current fisher execution nonce for user)
- `tokenAddress`: `0x0000000000000000000000000000000000000000` (native ETH)
- `priorityFee`: `10000000000000000` (0.01 ETH in wei)
- `amount`: `500000000000000000` (0.5 ETH in wei)

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,              // evvmID as uint256
    "fisherBridge", // action type
    "0x9876543210987654321098765432109876543210,12,0x0000000000000000000000000000000000000000,10000000000000000,500000000000000000",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,fisherBridge,0x9876543210987654321098765432109876543210,12,0x0000000000000000000000000000000000000000,10000000000000000,500000000000000000
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n129",
    "1,fisherBridge,0x9876543210987654321098765432109876543210,12,0x0000000000000000000000000000000000000000,10000000000000000,500000000000000000"
))
```

**Concatenated parameters breakdown:**
1. `0x9876543210987654321098765432109876543210` - Recipient address (lowercase with 0x prefix)
2. `12` - Current nonce
3. `0x0000000000000000000000000000000000000000` - Native coin representation (address(0))
4. `10000000000000000` - Priority fee (0.01 ETH)
5. `500000000000000000` - Amount (0.5 ETH)

## Security Considerations

### Nonce Management
- **Sequential Processing**: Nonces must be used in sequential order
- **Cross-Chain Synchronization**: Both host and external chain stations track the same nonce sequence
- **Replay Protection**: Each nonce can only be used once per user

### Signature Binding
- **Parameter Integrity**: All transaction parameters are included in the signed message
- **Address Verification**: Signer address is cryptographically verified during signature validation
- **Message Format**: Exact message format must be maintained for successful verification

### Priority Fee Security
- **Optional Fee**: Priority fee can be set to `0` if no incentive is offered
- **Fisher Incentive**: Higher priority fees may result in faster processing
- **Fee Distribution**: Priority fees are typically credited to fisher executor's balance

## Implementation Notes

### Address Formatting
- Uses `AdvancedStrings.addressToString()` for consistent address representation
- Addresses are converted to lowercase hex strings **with** `0x` prefix (lowercased)
- Ensures compatibility across different blockchain environments

### Nonce Tracking
- Each user has an independent nonce sequence tracked in `nextFisherExecutionNonce` mapping
- Nonces increment after each successful fisher bridge operation
- Both host and external chain stations must maintain synchronized nonce values

### Cross-Chain Coordination
- Same signature format used on both host and external chains
- Enables verification on both sides of the cross-chain transaction
- Supports multiple interoperability protocols (Hyperlane, LayerZero, Axelar)

## Verification Function

The signature verification is performed using the `SignatureUtils.verifyMessageSignedForFisherBridge()` function:

```solidity
function verifyMessageSignedForFisherBridge(
    uint256 evvmID,
    address signer,
    address addressToReceive,
    uint256 nonce,
    address tokenAddress,
    uint256 priorityFee,
    uint256 amount,
    bytes memory signature
) internal pure returns (bool)
```

This function uses the higher-level `SignatureUtil.verifySignature()` (which internally uses `SignatureRecover` primitives) to reconstruct the message string using the provided parameters and verifies that the signature was created by the specified signer address using EIP-191 standard verification.

## Signature Implementation Details

The lower-level `SignatureRecover` primitives (used internally by `SignatureUtil`) perform signature recovery in the following steps:

1. **Message Construction**: Concatenates `evvmID`, `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **Address Format**: `AdvancedStrings.addressToString` converts addresses to lowercase hex with "0x" prefix
- **Cross-Chain Compatibility**: Same signature format used on both host and external chains
- **Fisher Incentives**: Higher priority fees may result in faster processing by fisher executors
- **Flexible Recipients**: `addressToReceive` can differ from signer for flexible asset management
- **Native Token Support**: `address(0)` represents native blockchain coins (ETH, MATIC, BNB, etc.)
- **Nonce Management**: Sequential nonce processing prevents replay attacks across chains
- **EVVM ID**: Identifies the specific EVVM instance for signature verification


> **Note: EIP-191 Compliance**
All Fisher Bridge signatures follow the EIP-191 "Signed Data Standard" ensuring compatibility with standard Ethereum wallets and signing tools. The message is prefixed with `"\x19Ethereum Signed Message:\n"` during the signing process.

> **Warning: Exact Format Required**
The message format must be followed exactly for signature verification to succeed. Any deviation in parameter ordering, formatting, or separators will cause verification failures and transaction rejection.

---

## Make Order Signature Structure


To authorize order creation operations, users must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library which implements the standard Ethereum message signing protocol. The message is constructed by concatenating the EVVM ID, action type, and parameters, then wrapped with the EIP-191 prefix: `"\x19Ethereum Signed Message:\n"` + message length + message content.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                          // EVVM ID as uint256
    "makeOrder",                     // Action type
    string.concat(                   // Concatenated parameters
        AdvancedStrings.uintToString(_nonce),
        ",",
        AdvancedStrings.addressToString(_tokenA),
        ",",
        AdvancedStrings.addressToString(_tokenB),
        ",",
        AdvancedStrings.uintToString(_amountA),
        ",",
        AdvancedStrings.uintToString(_amountB)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(AdvancedStrings.uintToString(evvmID), ",", functionName, ",", inputs)
```

This results in a message format:
```
"{evvmID},makeOrder,{nonce},{tokenA},{tokenB},{amountA},{amountB}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

This creates the final hash that the user must sign with their private key.

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (uint256):**
- Direct uint256 value (converted to string internally)
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"makeOrder"`
- *Purpose*: Identifies this as an order creation operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nonce)`
- *Purpose*: Provides replay protection for the P2P Swap transaction

**3.2. Token A Address (String):**
- The result of `AdvancedStrings.addressToString(_tokenA)`
- *Purpose*: Identifies the token being offered by the order creator

**3.3. Token B Address (String):**
- The result of `AdvancedStrings.addressToString(_tokenB)`
- *Purpose*: Identifies the token being requested in exchange

**3.4. Amount A (String):**
- The result of `AdvancedStrings.uintToString(_amountA)`
- *Purpose*: Specifies the quantity of tokenA being offered

**3.5. Amount B (String):**
- The result of `AdvancedStrings.uintToString(_amountB)`
- *Purpose*: Specifies the quantity of tokenB being requested

## Example

Here's a practical example of constructing a signature message for creating a swap order:

**Scenario:** User wants to create an order offering 100 USDC for 0.05 ETH

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `_nonce`: `15`
- `_tokenA`: `0xA0b86a33E6441e6e80D0c4C6C7527d72E1d00000` (USDC)
- `_tokenB`: `0x0000000000000000000000000000000000000000` (ETH)
- `_amountA`: `100000000` (100 USDC with 6 decimals)
- `_amountB`: `50000000000000000` (0.05 ETH in wei)

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "makeOrder", // action type
    "15,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,100000000,50000000000000000",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,makeOrder,15,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,100000000,50000000000000000
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n149",
    "1,makeOrder,15,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,100000000,50000000000000000"
))
```

**Concatenated parameters breakdown:**
1. `15` - P2P Swap nonce for replay protection
2. `0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000` - USDC token address (tokenA)
3. `0x0000000000000000000000000000000000000000` - ETH address (tokenB)
4. `100000000` - Amount of USDC being offered (100 USDC with 6 decimals)
5. `50000000000000000` - Amount of ETH being requested (0.05 ETH in wei)

## Signature Implementation Details

The `SignatureUtil` library performs signature verification in the following steps:

1. **Message Construction**: Concatenates `evvmID` (converted to string), `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **String Conversion**: 
  - `AdvancedStrings.addressToString` converts addresses to lowercase hex with "0x" prefix
  - `Strings.toString` converts numbers to decimal strings
- **EVVM ID**: Identifies the specific EVVM instance for signature verification
- **Nonce Purpose**: P2P Swap specific nonce prevents replay attacks within the swap system


---

## Cancel Order Signature Structure


To authorize order cancellation operations, users must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library which implements the standard Ethereum message signing protocol. The message is constructed by concatenating the EVVM ID, action type, and parameters, then wrapped with the EIP-191 prefix.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                          // EVVM ID as uint256
    "cancelOrder",                   // Action type
    string.concat(                   // Concatenated parameters
        AdvancedStrings.uintToString(_nonce),
        ",",
        AdvancedStrings.addressToString(_tokenA),
        ",",
        AdvancedStrings.addressToString(_tokenB),
        ",",
        AdvancedStrings.uintToString(_orderId)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(AdvancedStrings.uintToString(evvmID), ",", functionName, ",", inputs)
```

This results in a message format:
```
"{evvmID},cancelOrder,{nonce},{tokenA},{tokenB},{orderId}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

This creates the final hash that the user must sign with their private key.

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (uint256):**
- Direct uint256 value (converted to string internally)
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"cancelOrder"`
- *Purpose*: Identifies this as an order cancellation operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nonce)`
- *Purpose*: Provides replay protection for the P2P Swap transaction

**3.2. Token A Address (String):**
- The result of `AdvancedStrings.addressToString(_tokenA)`
- *Purpose*: Identifies the token that was offered in the original order

**3.3. Token B Address (String):**
- The result of `AdvancedStrings.addressToString(_tokenB)`
- *Purpose*: Identifies the token that was requested in the original order

**3.4. Order ID (String):**
- The result of `AdvancedStrings.uintToString(_orderId)`
- *Purpose*: Specifies the unique ID of the order to be cancelled

## Example

Here's a practical example of constructing a signature message for cancelling a swap order:

**Scenario:** User wants to cancel their order #3 in the USDC/ETH market

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `_nonce`: `25`
- `_tokenA`: `0xA0b86a33E6441e6e80D0c4C6C7527d72E1d00000` (USDC)
- `_tokenB`: `0x0000000000000000000000000000000000000000` (ETH)
- `_orderId`: `3`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "cancelOrder", // action type
    "25,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,3",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,cancelOrder,25,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,3
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n134",
    "1,cancelOrder,25,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,3"
))
```

**Concatenated parameters breakdown:**
1. `25` - P2P Swap nonce for replay protection
2. `0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000` - USDC token address (tokenA from original order)
3. `0x0000000000000000000000000000000000000000` - ETH address (tokenB from original order)
4. `3` - Order ID to be cancelled

## Example with Different Token Pair

**Scenario:** User wants to cancel their order #7 in the MATE/USDC market

**Parameters:**
- `evvmID`: `1`
- `_nonce`: `42`
- `_tokenA`: `0x0000000000000000000000000000000000000001` (MATE)
- `_tokenB`: `0xA0b86a33E6441e6e80D0c4C6C7527d72E1d00000` (USDC)
- `_orderId`: `7`

**Final message to be signed:**
```
1,cancelOrder,42,0x0000000000000000000000000000000000000001,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,7
```

**Concatenated parameters breakdown:**
1. `42` - P2P Swap nonce
2. `0x0000000000000000000000000000000000000001` - MATE token address
3. `0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000` - USDC token address
4. `7` - Order ID to cancel

## Signature Implementation Details

The `SignatureRecover` library performs signature verification in the following steps:

1. **Message Construction**: Concatenates `evvmID`, `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

## Security Considerations

### Order Ownership Validation

The signature alone does not prove order ownership. The contract performs additional validation:

1. **Signature Verification**: Confirms the user signed the cancellation request
2. **Order Existence**: Verifies the order exists in the specified market
3. **Ownership Check**: Confirms the signer is the original order creator
4. **Nonce Validation**: Ensures the nonce hasn't been used before

### Market Identification

The token pair (tokenA, tokenB) must match the original order exactly:
- **Token Addresses**: Must be identical to the original order
- **Market Resolution**: Used to find the correct market for the order
- **Order Lookup**: Combined with orderId to locate the specific order

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **String Conversion**: 
  - `AdvancedStrings.addressToString` converts addresses to lowercase hex with "0x" prefix
  - `Strings.toString` converts numbers to decimal strings
- **Order Identification**: Requires both token pair and order ID to uniquely identify the order
- **Nonce Independence**: P2P Swap nonces are separate from EVVM payment nonces


---

## Dispatch Order Signature Structure


To authorize order fulfillment operations, users must generate a cryptographic signature compliant with the [EIP-191](https://eips.ethereum.org/EIPS/eip-191) standard using the Ethereum Signed Message format.

The signature verification process uses the `SignatureUtil` library which implements the standard Ethereum message signing protocol. This signature is used for both `dispatchOrder_fillPropotionalFee` and `dispatchOrder_fillFixedFee` functions.

## Signed Message Format

The signature verification uses the `SignatureUtil.verifySignature` function with the following structure:

```solidity
SignatureUtil.verifySignature(
    evvmID,                          // EVVM ID as uint256
    "dispatchOrder",                 // Action type
    string.concat(                   // Concatenated parameters
        AdvancedStrings.uintToString(_nonce),
        ",",
        AdvancedStrings.addressToString(_tokenA),
        ",",
        AdvancedStrings.addressToString(_tokenB),
        ",",
        AdvancedStrings.uintToString(_orderId)
    ),
    signature,
    signer
);
```

### Internal Message Construction

Internally, the `SignatureUtil.verifySignature` function constructs the final message by concatenating:

```solidity
string.concat(AdvancedStrings.uintToString(evvmID), ",", functionName, ",", inputs)
```

This results in a message format:
```
"{evvmID},dispatchOrder,{nonce},{tokenA},{tokenB},{orderId}"
```

### EIP-191 Message Hashing

The message is then hashed according to EIP-191 standard:

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        AdvancedStrings.uintToString(bytes(message).length),
        message
    )
);
```

This creates the final hash that the user must sign with their private key.

## Message Components

The signature verification takes three main parameters:

**1. EVVM ID (uint256):**
- Direct uint256 value (converted to string internally)
- *Purpose*: Identifies the specific EVVM instance

**2. Action Type (String):**
- Fixed value: `"dispatchOrder"`
- *Purpose*: Identifies this as an order fulfillment operation

**3. Concatenated Parameters (String):**
The parameters are concatenated with comma separators:

**3.1. Nonce (String):**
- The result of `AdvancedStrings.uintToString(_nonce)`
- *Purpose*: Provides replay protection for the P2P Swap transaction

**3.2. Token A Address (String):**
- The result of `AdvancedStrings.addressToString(_tokenA)`
- *Purpose*: Identifies the token offered in the target order

**3.3. Token B Address (String):**
- The result of `AdvancedStrings.addressToString(_tokenB)`
- *Purpose*: Identifies the token requested in the target order

**3.4. Order ID (String):**
- The result of `AdvancedStrings.uintToString(_orderId)`
- *Purpose*: Specifies the unique ID of the order to be fulfilled

## Example

Here's a practical example of constructing a signature message for fulfilling a swap order:

**Scenario:** User wants to fulfill order #3 in the USDC/ETH market (buying 100 USDC for 0.05 ETH)

**Parameters:**
- `evvmID`: `1` (EVVM instance ID)
- `_nonce`: `33`
- `_tokenA`: `0xA0b86a33E6441e6e80D0c4C6C7527d72E1d00000` (USDC - token being offered by seller)
- `_tokenB`: `0x0000000000000000000000000000000000000000` (ETH - token being requested by seller)
- `_orderId`: `3`

**Signature verification call:**
```solidity
SignatureUtil.verifySignature(
    1,  // evvmID as uint256
    "dispatchOrder", // action type
    "33,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,3",
    signature,
    signer
);
```

**Final message to be signed (after internal concatenation):**
```
1,dispatchOrder,33,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,3
```

**EIP-191 formatted message hash:**
```
keccak256(abi.encodePacked(
    "\x19Ethereum Signed Message:\n136",
    "1,dispatchOrder,33,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,0x0000000000000000000000000000000000000000,3"
))
```

**Concatenated parameters breakdown:**
1. `33` - P2P Swap nonce for replay protection
2. `0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000` - USDC token address (tokenA from target order)
3. `0x0000000000000000000000000000000000000000` - ETH address (tokenB from target order)
4. `3` - Order ID to be fulfilled

## Example with Reverse Token Pair

**Scenario:** User wants to fulfill order #12 in the ETH/USDC market (buying ETH with USDC)

**Parameters:**
- `evvmID`: `1`
- `_nonce`: `55`
- `_tokenA`: `0x0000000000000000000000000000000000000000` (ETH - offered by seller)
- `_tokenB`: `0xA0b86a33E6441e6e80D0c4C6C7527d72E1d00000` (USDC - requested by seller)
- `_orderId`: `12`

**Final message to be signed:**
```
1,dispatchOrder,55,0x0000000000000000000000000000000000000000,0xa0b86a33e6441e6e80d0c4c6c7527d72e1d00000,12
```

**Transaction Flow:**
- Buyer provides USDC (tokenB) + fees
- Buyer receives ETH (tokenA) from the order
- Seller receives USDC payment + fee bonus

## Usage in Both Dispatch Functions

This signature structure is used by both dispatch functions:

### dispatchOrder_fillPropotionalFee
- Uses the same signature verification
- Applies percentage-based fee calculation
- Distributes fees according to configured percentages

### dispatchOrder_fillFixedFee
- Uses identical signature verification
- Applies capped fee calculation with maximum limits
- Provides fee protection for large orders

## Signature Implementation Details

The `SignatureRecover` library performs signature verification in the following steps:

1. **Message Construction**: Concatenates `evvmID`, `functionName`, and `inputs` with commas
2. **EIP-191 Formatting**: Prepends `"\x19Ethereum Signed Message:\n"` + message length
3. **Hashing**: Applies `keccak256` to the formatted message
4. **Signature Parsing**: Splits the 65-byte signature into `r`, `s`, and `v` components
5. **Recovery**: Uses `ecrecover` to recover the signer's address
6. **Verification**: Compares recovered address with expected signer

### Signature Format Requirements

- **Length**: Exactly 65 bytes
- **Structure**: `[r (32 bytes)][s (32 bytes)][v (1 byte)]`
- **V Value**: Must be 27 or 28 (automatically adjusted if < 27)

## Security Considerations

### Order Validation

The signature authorizes the dispatch attempt, but the contract performs additional validation:

1. **Signature Verification**: Confirms the user signed the dispatch request
2. **Order Existence**: Verifies the order exists and is active
3. **Market Validation**: Confirms the token pair matches an existing market
4. **Nonce Validation**: Ensures the nonce hasn't been used before
5. **Payment Sufficiency**: Validates the user provided enough tokens to cover order + fees

### Token Direction Understanding

The signature includes tokenA and tokenB from the **seller's perspective**:
- **tokenA**: What the seller is offering (buyer will receive)
- **tokenB**: What the seller wants (buyer must provide)
- **Order ID**: Identifies the specific order within the market

### Fee Model Independence

The same signature works for both fee models:
- **Proportional Fee**: Percentage-based calculation
- **Fixed Fee**: Capped fee with maximum limits
- **Fee Choice**: Determined by which function is called, not the signature

> **Tip: Technical Details**

- **Message Format**: The final message follows the pattern `"{evvmID},{functionName},{parameters}"`
- **EIP-191 Compliance**: Uses `"\x19Ethereum Signed Message:\n"` prefix with message length
- **Hash Function**: `keccak256` is used for the final message hash before signing
- **Signature Recovery**: Uses `ecrecover` to verify the signature against the expected signer
- **String Conversion**: 
  - `AdvancedStrings.addressToString` converts addresses to lowercase hex with "0x" prefix
  - `Strings.toString` converts numbers to decimal strings
- **Universal Signature**: Same signature structure works for both proportional and fixed fee dispatch functions
- **Order Identification**: Token pair and order ID uniquely identify the target order
- **Buyer Authorization**: Signature proves the buyer authorizes the specific order fulfillment


---

## EVVM Signature Structures Overview


All EVVM operations require EIP-191 cryptographic signatures for security. The platform uses **centralized signature verification** where Core.sol validates all operations using a unified signature format.

## Universal Signature Format

```
{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}
```

**Components:**
- `{evvmId}`: Network identifier (uint256, typically `1`)
- `{serviceAddress}`: Address of the service contract being called
- `{hashPayload}`: Service-specific hash of operation parameters (bytes32)
- `{executor}`: Authorized executor address (address, `0x0...0` for unrestricted)
- `{nonce}`: User's centralized nonce from Core.sol (uint256)
- `{isAsyncExec}`: Execution mode - `true` for async, `false` for sync (boolean)

## Two-Layer Signature Architecture

EVVM uses a **two-layer hashing system** for deterministic and gas-efficient signatures:

### Layer 1: Hash Payload Generation

Each service uses a dedicated HashUtils library to generate `hashPayload`:

```solidity
// Example: CoreHashUtils for payment operations
bytes32 hashPayload = CoreHashUtils.hashDataForPay(
    receiver,
    token,
    amount,
    priorityFee
);
```

**Available HashUtils Libraries:**
- **CoreHashUtils**: Payment operations (pay, batchPay, dispersePay)
- **NameServiceHashUtils**: Username operations (register, transfer, metadata)
- **StakingHashUtils**: Staking operations (stake, unstake, claim)
- **P2PSwapHashUtils**: Swap operations (makeOrder, dispatch, cancel)
- **TreasuryCrossChainHashUtils**: Cross-chain bridge operations

### Layer 2: Signature Construction

The `hashPayload` is combined with execution context to create the final message:

```solidity
// Signature message construction (simplified)
string memory message = string.concat(
    uintToString(evvmId),                    // Network ID
    ",",
    addressToString(serviceAddress),         // Service contract
    ",",
    bytes32ToString(hashPayload),            // Service-specific hash
    ",",
    addressToString(executor),               // Authorized executor
    ",",
    uintToString(nonce),                     // User's nonce
    ",",
    isAsyncExec ? "true" : "false"          // Execution mode
);
```

### Layer 3: EIP-191 Wrapping

The message is signed using the EIP-191 standard (same as MetaMask):

```solidity
bytes32 messageHash = keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        uintToString(bytes(message).length),
        message
    )
);
```

## Centralized Verification Process

All signatures are verified by **Core.sol** using `validateAndConsumeNonce()`:

```solidity
// Service calls Core.sol for verification
Core(coreAddress).validateAndConsumeNonce(
    user,              // Signer address
    hashPayload,       // Service-specific hash
    executor,          // Who can execute
    nonce,             // User's nonce
    isAsyncExec,       // Execution mode
    signature          // EIP-191 signature
);
```

**What Core.sol Does:**
1. Verifies signature matches the signer (EIP-191 recovery)
2. Validates nonce (checks status, consumes if valid)
3. Checks executor authorization (if specified)
4. Optionally delegates to UserValidator (if configured)

## Example: Payment Signature

**Scenario:** Send 0.05 ETH to `0x742d...82d8c` with sync execution

**Step 1: Generate Hash Payload**
```solidity
bytes32 hashPayload = CoreHashUtils.hashDataForPay(
    0x742d7b6b472c8f4bd58e6f9f6c82e8e6e7c82d8c,  // receiver
    0x0000000000000000000000000000000000000000,  // token (ETH)
    50000000000000000,                            // amount (0.05 ETH)
    1000000000000000                              // priorityFee (0.001 ETH)
);
// Result: 0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
```

**Step 2: Construct Signature Message**
```
1,0xCoreContractAddress,0xa7f3c2d8e9b4f1a6c5d8e7f9b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1,0x0000000000000000000000000000000000000000,42,false
```

Components:
- `evvmId`: `1`
- `serviceAddress`: `0xCoreContractAddress` (Core.sol)
- `hashPayload`: `0xa7f3...` (from Step 1)
- `executor`: `0x0000...` (unrestricted)
- `nonce`: `42`
- `isAsyncExec`: `false` (sync)

**Step 3: Sign with Wallet**
User signs the message using MetaMask or another EIP-191 compatible wallet.

## Parameter Formatting Rules

### String Conversion
- **Numbers**: `"50000000000000000"` (decimal string, no scientific notation)
- **Addresses**: `"0x742c7b6b472c8f4bd58e6f9f6c82e8e6e7c82d8c"` (lowercase hex with `0x`)
- **Bytes32**: `"0xa7f3c2d8e9b4f1a6..."` (64-character hex with `0x`)
- **Booleans**: `"true"` or `"false"` (lowercase)
- **Strings**: As provided (e.g., `"alice"`)

### Formatting Utilities

Use `AdvancedStrings` library:
```solidity

AdvancedStrings.uintToString(42);          // "42"
AdvancedStrings.addressToString(addr);     // "0x742c..."
AdvancedStrings.bytes32ToString(hash);     // "0xa7f3..."
```

## EVVM Services Overview

### Core.sol
**Payment operations:**
- `pay()`: Single payment to addresses or usernames
- `batchPay()`: Multiple payments in one transaction
- `dispersePay()`: Split payment to multiple recipients
- `caPay()`: Contract-only payments

### NameService
**Username management:**
- Registration (pre-register → register flow)
- Marketplace (offers, transfers)
- Metadata (custom fields)
- Renewals and cleanup

### Staking
**Token staking:**
- Presale and public staking
- Unstaking with time locks
- Reward distribution

### Treasury
**Cross-chain operations:**
- Bridge transfers (Axelar, LayerZero)
- Multi-chain asset management

### P2PSwap
**Decentralized exchange:**
- Order creation and cancellation
- Order dispatch (fills)
- Fee management

## Best Practices

### Security
- **Never reuse nonces**: Each signature must have a unique nonce
- **Validate executor**: Use `0x0...0` for public operations, specific address for restricted
- **Async for time-sensitive**: Use `isAsyncExec=true` for operations needing specific timing
- **Service address precision**: Always use the correct deployed service address

### Gas Optimization
- **Batch operations**: Use `batchPay()` instead of multiple `pay()` calls
- **Sync when possible**: Async execution costs more gas
- **Reuse hash payloads**: Cache `hashPayload` if making multiple signatures

### Development
- **Use HashUtils libraries**: Don't manually construct hashes
- **Test signature generation**: Verify message format matches expected structure
- **Handle nonce management**: Track used nonces client-side
- **Validate before signing**: Check parameters before generating signature

## Next Steps

Explore service-specific signature structures:

- **[Core Payment Signatures](./01-EVVM/01-SinglePaymentSignatureStructure.md)** - Payment operation signatures
- **[NameService Signatures](./02-NameService/01-preRegistrationUsernameStructure.md)** - Username and metadata operations
- **[Staking Signatures](./03-Staking/01-StandardStakingStructure.md)** - Staking and reward operations
- **[Treasury Signatures](./04-Treasury/01-FisherBridgeSignatureStructure.md)** - Cross-chain bridge operations
- **[P2PSwap Signatures](./05-P2PSwap/01-MakeOrderSignatureStructure.md)** - DEX order operations

---

## Overview

# evvm-js

`@evvm/evvm-js` is the official TypeScript/JavaScript client library for building and signing EVVM actions, interacting with EVVM services, and executing signed actions on-chain.

This section covers how to use the library from a developer perspective: creating signers, constructing signed actions (payments, disperse, staking, name service), and executing those actions.

## Install

```bash
npm install @evvm/evvm-js
# or
bun add @evvm/evvm-js
# or
yarn add @evvm/evvm-js
```

## High-level concepts

- **Services** — classes (e.g., `EVVM`, `NameService`, `Staking`, `P2PSwap`) that build and sign actions. They do not send transactions directly; they produce `SignedAction` objects.
- **Signers** — adapters that wrap `ethers` or `viem` wallets and expose a consistent `ISigner` interface used by the services.
- **SignedAction** — a serializable object containing ABI args, evvmId, signature, and metadata required to execute the call anywhere.
- **execute()** — helper to push a `SignedAction` through a signer (writes the transaction using the signer’s `writeContract`).

Use the following pages for practical examples: Services, Signers, Types, Utilities.

## Quick Start

Here's a quick example of how to use EVVM JS to sign a payment action:

**With Ethers.js**

```typescript

// 1. Create a signer
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const privateKey = "YOUR_PRIVATE_KEY";
const wallet = new ethers.Wallet(privateKey, provider);
const signer = await createSignerWithEthers(wallet);

// 2. Instantiate the Core service
const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
  // evvmId: 1 // optional
});

// 3. Call a method to create a signed action
const signedAction = await core.pay({
  toAddress: "RECIPIENT_ADDRESS",
  tokenAddress: "TOKEN_ADDRESS",
  amount: 100n, // Use BigInt for amounts
  priorityFee: 0n,
  nonce: 1n,
  isAsyncExec: false,
});

// 4. Execute the signed action
const result = await execute(signer, signedAction);
console.log(result);
```

**With Viem**

```typescript

// 1. Create a signer
const account = privateKeyToAccount("YOUR_PRIVATE_KEY");
const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http("YOUR_RPC_URL"),
});
const signer = await createSignerWithViem(client);

// 2. Instantiate the Core service
const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});

// Continue with steps 3 and 4 exactly as shown in the ethers.js example
```

---

## Custom Services


`@evvm/evvm-js` allows users to create their own services interacting with the evvm, they must initially follow the [evvm service spec](/docs/HowToMakeAEVVMService); this documentation focuses on building the signature creation tool that users can then use in their own dapps.

## Creation of custom services

Creating a custom service using the `@evvm/evvm-js` involves creating a class for your service that inherits from `BaseService` abstract class, extending it with your custom actions, they all must return `SignedActions`:

```ts

interface ICustomActionData {
  /* params as desribed in your service smart contract function */
}

export class MyCustomService extends BaseService {
  async myCustomAction(
      /* params required to build the SignedAction */
  ): Promise<SignedAction<ICustomActionData>> {
    const evvmId = await this.getEvvmID();
    const functionName = "myCustomAction";

    const signature = await this.signer.signGenericEvvmMessage(
      evvmId,
      functionName,
      /* inputs string */,
    );

    return new SignedAcion(this, evvmId, functionName, {
      /* params as described in ICustomActionData */
    });
  }
}
```

So that you can use `MyCustomService` as follows:

```ts

const signer = createSignerWithEthers(ethersSigner);
const myCustomService = new MyCustomService(
  signer,
  "CUSTOM_SERVICE_ADDRESS",
  MyCustomServiceABI as IAbi,
);

const signedAction = await myCustomService.myCustomAction(/* params */);

// an then execute it with:
const txHash = await execute(signer, signedAction);
```

---

## Core Service


The `Core` service provides helper methods for core payment actions.

## `pay`

Creates and signs a `pay` action to transfer tokens to a recipient.

### Parameters

- `toAddress` (HexString, optional): Recipient address (`0x...`). Use either `toAddress` **or** `toIdentity`.
- `toIdentity` (string, optional): Recipient identity string. Use either `toAddress` **or** `toIdentity`.
- `tokenAddress` (HexString): The contract address of the token to be transferred.
- `amount` (bigint): The amount of tokens to send.
- `priorityFee` (bigint): The priority fee for the transaction.
- `nonce` (bigint): The EVVM nonce for this action.
- `isAsyncExec` (boolean): `true` for asynchronous execution, `false` for synchronous.
- `senderExecutor` (HexString, optional): Optional senderExecutor address used in the signed message.

### Returns

- `Promise<SignedAction<IPayData>>`: A signed action ready for execution.

### Example

```ts

const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});

const action = await core.pay({
  toAddress: "0xRecipient",
  tokenAddress: "0xToken",
  amount: 100n,
  priorityFee: 0n,
  nonce: 1n,
  isAsyncExec: false,
});

// The 'action' can be passed to the execute() function
```

## `dispersePay`

Creates and signs a `dispersePay` action to send tokens to multiple recipients in a single transaction.

### Parameters

- `toData` (array): An array of objects, each specifying a recipient and an amount.
  - `amount` (bigint): Amount for the recipient.
  - `toAddress` (HexString, optional): Recipient's address. (required if no toIdentity is provided)
  - `toIdentity` (string, optional): Recipient's identity. (required if no toAddress is provided)
- `tokenAddress` (HexString): The contract address of the token.
- `amount` (bigint): The total amount to be dispersed.
- `priorityFee` (bigint): The priority fee.
- `nonce` (bigint): The EVVM nonce.
- `isAsyncExec` (boolean): Whether the action is asynchronous (`true`) or synchronous (`false`).
- `senderExecutor` (HexString): The senderExecutor address used in the signed message.

### Returns

- `Promise<SignedAction<IDispersePayData>>`: A signed disperse action.

### Example

```ts
const toData = [
  { amount: 50n, toAddress: "0xRecipient1" },
  { amount: 50n, toIdentity: "identity2" },
];

const action = await core.dispersePay({
  toData,
  tokenAddress: "0xToken",
  amount: 100n,
  priorityFee: 0n,
  nonce: 2n,
  isAsyncExec: false,
  senderExecutor: "0xExecutorAddress",
});
```

---

## Services Overview

# Services

`evvm-js` exposes service classes that help you construct and sign EVVM actions. Services are focused on building correct payloads and signatures — they return `SignedAction` objects which can be executed via `execute()`.

Common services:

- `Core` — core payment helpers: `pay()` and `dispersePay()`.
- `NameService` — identity creation and management helpers.
- `Staking` — stake/unstake and reward helpers.
- `P2PSwap` — utilities for peer-to-peer swaps.

## Using services

In order to use services, the user must first create a signer, please refer to the [signers documentation](/docs/Libraries/npmLibraries/evvmJs/signers) to learn how to create signers using either ethersjs or viem.
After successfully creating a signer, a new service instance can be created, and used to create [SignedActions](#signed-actions) and use [nonces](#nonce-management).

Example: create a `Core` service and sign a payment

```ts

const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});

const action = await core.pay({
  toAddress: "0xRecipient",
  tokenAddress: "0xToken",
  amount: 100n,
  priorityFee: 0n,
  nonce: 1n,
  isAsyncExec: false,
});

// `action` is a SignedAction — serialize or pass to `execute()`
```

Notes:

- Services call the read-only contract methods (e.g., `getEvvmID`) via the provided signer to include id/chain context in signatures.
- Services build EIP-191 style messages for signing: `"<evvmId>,<functionName>,<inputs>"`.

## Nonce management

It is up to the user to provide the nonce in every signature creation function call, that's why every service have an utility to either get the current sync nonce, or to validate an arbitrary async nonce, please refer to the [nonces documentation](/docs/ProcessOfATransaction#nonce-verification) to learn more about nonces in the EVVM.

### Sync nonce

Example: get the next sync nonce for the Core service

```ts

const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});

const nonce = await core.getSyncNonce();

const signedAction = await core.pay({
  toAddress: "0xRecipient",
  tokenAddress: "0xToken",
  amount: 100n,
  priorityFee: 0n,
  nonce,
  isAsyncExec: false, // false, because we are using sync nonces
});
```

### Async nonce

Example: use an arbitrary async nonce

```ts

const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});
const nonce = BigInt(getRandomNumber());
const isValidNonce = await core.isValidAsyncNonce(nonce);

if (!isValidNonce) throw new Error("Nonce invalid, has been used before");

const signedAction = await core.pay({
  toAddress: "0xRecipient",
  tokenAddress: "0xToken",
  amount: 100n,
  priorityFee: 0n,
  nonce,
  isAsyncExec: true, // true, because we are using async nonces
});
```

> Every service has it's own nonce records, thus, every service described in this documentation includes the methods `getSyncNonce()` and `isValidAsyncNonce()`

## Signed Actions

Signed actions are designed to encapsulate everything needed to send and [execute](/docs/Libraries/npmLibraries/evvmJs/utils#execute) an EVVM transaction anywhere, this could be the same application where the signature was built, or a [fisher](/docs/HowToMakeAEVVMService#who-are-fishers) that caugh the tx from whatever [fishing spot](/docs/ProcessOfATransaction#3-broadcast-to-fishing-spot) the user decided to use.

---

## NameService


The `NameService` class helps with identity creation and management.

## Methods

### `makeOffer`

Creates and signs a `makeOffer` action for a username.

- **Parameters:**
  - `username` (string): The username for which the offer is being made.
  - `expirationDate` (bigint): Offer expiration timestamp.
  - `amount` (bigint): Offer amount.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IMakeOfferData>>`

> Note: the action is signed by the provided `signer` — there is no `user` parameter; the `user` field in the resulting `SignedAction` will be the signer's address.

### `withdrawOffer`

Creates and signs a `withdrawOffer` action.

- **Parameters:**
  - `username` (string): The username associated with the offer.
  - `offerID` (bigint): The ID of the offer to withdraw.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IWithdrawOfferData>>`

### `acceptOffer`

Creates and signs an `acceptOffer` action.

- **Parameters:**
  - `username` (string): The username for which to accept an offer.
  - `offerID` (bigint): The ID of the offer to accept.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IAcceptOfferData>>`

### `preRegistrationUsername`

Creates and signs a `preRegistrationUsername` action with a hashed username.

- **Parameters:**
  - `hashPreRegisteredUsername` (string): The hashed username to pre-register.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IPreRegistrationUsernameData>>`

### `registrationUsername`

Creates and signs a `registrationUsername` action.

- **Parameters:**
  - `username` (string): The username to register.
  - `lockNumber` (bigint): A random lock number used for the pre-registration hash (named `lockNumber` in the API).
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IRegistrationUsernameData>>`

### `addCustomMetadata`

Creates and signs an `addCustomMetadata` action for an identity.

- **Parameters:**
  - `identity` (string): The identity to which metadata will be added.
  - `value` (string): The metadata value.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IAddCustomMetadataData>>`

### `removeCustomMetadata`

Creates and signs a `removeCustomMetadata` action.

- **Parameters:**
  - `identity` (string): The identity from which to remove metadata.
  - `key` (bigint): The key of the metadata to remove.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IRemoveCustomMetadataData>>`

### `flushCustomMetadata`

Creates and signs a `flushCustomMetadata` action.

- **Parameters:**
  - `identity` (string): The identity whose metadata will be flushed.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IFlushCustomMetadataData>>`

### `flushUsername`

Creates and signs a `flushUsername` action.

- **Parameters:**
  - `username` (string): The username to flush.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IFlushUsernameData>>`

### `renewUsername`

Creates and signs a `renewUsername` action.

- **Parameters:**
  - `username` (string): The username to renew.
  - `nonce` (bigint): NameService nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): Optional EVVM `pay` signed action used to pay fees.
- **Returns:** `Promise<SignedAction<IRenewUsernameData>>`

---

## P2PSwap Service


The `P2PSwap` service provides helpers for creating signed actions related to peer-to-peer swaps.

## `makeOrder`

Creates and signs a `makeOrder` action for a peer-to-peer swap.

- **Parameters:**
  - `nonce` (bigint): Order nonce.
  - `tokenA` (HexString): Address of Token A.
  - `tokenB` (HexString): Address of Token B.
  - `amountA` (bigint): Amount of Token A to be swapped.
  - `amountB` (bigint): Amount of Token B to be received.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`): The underlying EVVM `pay` signed action (used to pay fees).
- **Returns:** ``Promise<SignedAction<IMakeOrderData>>``

## `cancelOrder`

Creates and signs a `cancelOrder` action.

- **Parameters:**
  - `nonce` (bigint): Order nonce.
  - `tokenA` (HexString): Address of Token A.
  - `tokenB` (HexString): Address of Token B.
  - `orderId` (bigint): The ID of the order to be cancelled.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): An optional EVVM `pay` signed action.
- **Returns:** ``Promise<SignedAction<ICancelOrderData>>``

## `dispatchOrder_fillPropotionalFee`

Creates and signs a `dispatchOrder` action with a proportional fee.

- **Parameters:**
  - `nonce` (bigint): Order nonce.
  - `tokenA` (HexString): Address of Token A.
  - `tokenB` (HexString): Address of Token B.
  - `orderId` (bigint): The ID of the order to be dispatched.
  - `amountOfTokenBToFill` (bigint): The amount of Token B to fill.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`): The underlying EVVM `pay` signed action.
- **Returns:** ``Promise<SignedAction<IDispatchOrderData>>``

## `dispatchOrder_fillFixedFee`

Creates and signs a `dispatchOrder` action with a fixed fee.

- **Parameters:**
  - `nonce` (bigint): Order nonce.
  - `tokenA` (HexString): Address of Token A.
  - `tokenB` (HexString): Address of Token B.
  - `orderId` (bigint): The ID of the order to be dispatched.
  - `amountOfTokenBToFill` (bigint): The amount of Token B to fill.
  - `maxFillFixedFee` (bigint): The maximum fixed fee for filling the order.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`): The underlying EVVM `pay` signed action.
- **Returns:** ``Promise<SignedAction<IDispatchOrderFixedFeeData>>``

---

## Staking Service


The `Staking` service provides helpers to build signed staking-related actions.

## `presaleStaking`

Creates and signs a `presaleStaking` action.

- **Parameters:**
  - `isStaking` (boolean): Whether the user is staking or unstaking.
  - `nonce` (bigint): The stake nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): An optional EVVM `pay` signed action.
- **Returns:** `Promise<SignedAction<IPresaleStakingData>>`

## `publicStaking`

Creates and signs a `publicStaking` action.

- **Parameters:**
  - `isStaking` (boolean): Whether the user is staking or unstaking.
  - `amountOfStaking` (bigint): The amount to stake.
  - `nonce` (bigint): The stake nonce.
  - `originExecutor` (HexString, optional): Optional executor address included in the signed message (defaults to zero address).
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): An optional EVVM `pay` signed action.
- **Returns:** `Promise<SignedAction<IPublicStakingData>>`

## `goldenStaking`

Creates a `goldenStaking` action, typically used by a golden fisher. This action packages the staking amount and an optional EVVM signature. The on-chain verification is expected to use the EVVM signature provided in `evvmSignedAction`.

- **Parameters:**
  - `isStaking` (boolean): Whether the action is for staking or unstaking.
  - `amountOfStaking` (bigint): The amount to stake.
  - `evvmSignedAction` (`SignedAction<IPayData>`, optional): An optional EVVM `pay` signed action containing the user's signature.
- **Returns:** `Promise<SignedAction<IGoldenStakingData>>`

---

## Signers


`evvm-js` provides signer factory helpers that adapt popular wallet libraries into the library's [ISigner](#signer-interface) interface.

Available helpers:

- `createSignerWithEthers(signer)` — wraps an `ethers` Signer (v6).
- `createSignerWithViem(walletClient)` — wraps a `viem` `WalletClient`.

## Ethers

```ts

// 1. Create ethers signer
const provider = new ethers.BrowserProvider(window.ethereum);
const ethersSigner = await provider.getSigner();

// 2. Create evvm signer
const signer = await createSignerWithEthers(ethersSigner);

// 3. Instantiate a service
const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});
// ...
```

> Refer to the official [ethers](https://docs.ethers.org/v6/) documentation for more about signer usage and creation.

## Viem

```ts

// 1. Create a viem walletClient
const account = privateKeyToAccount("YOUR_PRIVATE_KEY");
const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http("YOUR_RPC_URL"),
});
// 2. Create evvm signer
const signer = await createSignerWithViem(client);

// 3. Instantiate a service
const core = new Core({
  signer,
  address: "EVVM_CONTRACT_ADDRESS",
  chainId: 1,
});
```

> Refer to the official [viem](https://viem.sh/) documentation for more about wallet usage and creation.

## Signer interface

Returned from `createSignerWithViem()` and `createSignerWithEthers()` utilities. It includes:

- `address` and `chainId` properties
- `signMessage(message)` — low-level message sign
- `signGenericEvvmMessage(evvmId, functionName, inputs)` — convenience
- `readContract()` and `writeContract()` — adapter methods to interact with contracts

Signers intentionally normalize return types (e.g., BigInt conversion for numeric ABI inputs when using `viem`).

```ts
interface ISendTransactionParams {
  contractAddress: HexString;
  contractAbi: IAbi;
  functionName: string;
  args: any[];
}

interface ISigner {
  address: HexString;
  chainId: number;
  signMessage(message: string): Promise<string>; // signature
  signGenericEvvmMessage(
    evvmId: bigint,
    functionName: string,
    inputs: string,
  ): Promise<string>;
  writeContract(params: ISendTransactionParams): Promise<HexString>; // txHash
  readContract<T>(params: ISendTransactionParams): Promise<T>;
}
```

> These interfaces can be imported from `@evvm/evvm-js`

---

## Utilities


`evvm-js` exposes useful helpers to run signed actions and serialize/execute results.

## execute()

Executes a `SignedAction` using the signer's `writeContract` adapter.

Example:

```ts

const signedAction = await core.pay({
  /* params */
});

// execute directly
const txHash = await execute(signer, signedAction);

// or

const serializedSignedAction = JSON.stringify(signedAction);

// when serialized for transport (through http for example)
const txHash = await execute(signer, serializedSignedAction);
```

---

## @evvm/testnet-contracts

# Testnet Contracts

The `@evvm/testnet-contracts` package provides Solidity interfaces and implementations for all EVVM smart contracts documented in this site. This package enables developers to integrate EVVM functionality directly into their smart contracts.

## Package Structure

### Interfaces  

Ready-to-use interfaces for all EVVM contracts:

- **`ICore.sol`** - Core payment and transaction functions
- **`INameService.sol`** - Identity management and username operations
- **`IStaking.sol`** - Staking and reward distribution functions
- **`IEstimator.sol`** - Economic calculation and estimation functions
- **`ITreasury.sol`** - Treasury management operations
- **`ITreasuryHostChainStation.sol`** - Cross-chain treasury host functions
- **`ITreasuryExternalChainStation.sol`** - Cross-chain treasury external functions

### Contracts 
Full contract implementations organized by service:

#### **evvm/**

- `Core.sol` - Main EVVM Core contract implementation
- `EvvmLegacy.sol` - Legacy version compatibility
- `lib/` - Supporting libraries

#### **nameService/**

- `NameService.sol` - Identity service implementation
- `lib/` - Username and metadata utilities

#### **staking/**

- `Staking.sol` - Staking contract implementation
- `Estimator.sol` - Economic estimation contract
- `lib/` - Staking calculation libraries

#### **treasury/**

- `Treasury.sol` - Single-chain treasury implementation
- `lib/` - Treasury management utilities

#### **treasuryTwoChains/**

- `TreasuryHostChainStation.sol` - Host chain treasury operations
- `TreasuryExternalChainStation.sol` - External chain treasury operations
- `lib/` - Cross-chain communication utilities

### Library 

Utility libraries for contract development:

- **`EvvmService.sol`** - Base contract for EVVM service development with built-in helpers
- **`SignatureRecover.sol`** - EIP-191 signature verification utilities
- **`SignatureUtil.sol`** - High-level signature verification for EVVM messages
- **`AdvancedStrings.sol`** - String manipulation and type conversion utilities
- **`Erc191TestBuilder.sol`** - Testing utilities for signature construction in Foundry
- **`AsyncNonceService.sol`** - Async nonce management for services
- **`SyncNonceService.sol`** - Sequential nonce management for services
- **`MakeServicePaymentOnEvvm.sol`** - Payment processing helpers
- **`StakingServiceUtils.sol`** - Service staking integration utilities
- **`Math.sol`** - Mathematical operations with overflow protection (OpenZeppelin)

## Usage for Service Developers

### Recommended Approach: Use Interfaces

For developers creating EVVM services, we strongly recommend using the interfaces rather than full contract implementations:

```solidity

contract MyService {
    IEvvm public immutable evvm;
    INameService public immutable nameService;

    constructor(address _evvm, address _nameService) {
        evvm = IEvvm(_evvm);
        nameService = INameService(_nameService);
    }

    function makePayment(address to, uint256 amount) external {
        // Use EVVM interface for payments
        evvm.pay(/* parameters */);
    }
}
```

### Benefits of Using Interfaces

- **Lighter Dependencies**: Only import what you need
- **Future Compatibility**: Interfaces remain stable across contract upgrades
- **Gas Efficiency**: No unnecessary code deployment
- **Clean Integration**: Focus on functionality, not implementation details

## Installation

```bash
npm install @evvm/testnet-contracts
```

## Generic Service Implementation Pattern

Here's a complete template demonstrating best practices for EVVM service integration using `EvvmService`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MyEVVMService is EvvmService {
    // State variables
    address public serviceOwner;

    error Unauthorized();

    constructor(
        address _evvmAddress,
        address _stakingAddress,
        address _serviceOwner
    ) EvvmService(_evvmAddress, _stakingAddress) {
        serviceOwner = _serviceOwner;
    }

    modifier onlyOwner() {
        if (msg.sender != serviceOwner) revert Unauthorized();
        _;
    }

    /**
     * @notice Execute service with EVVM payment
     * @param clientAddress Address of the client
     * @param serviceData Service-specific data
     * @param serviceAmount Amount to charge for the service
     * @param nonce Service nonce for replay protection
     * @param signature Client's signature authorizing the service
     * @param priorityFee_EVVM Fee for fisher executing payment
     * @param nonce_EVVM EVVM payment nonce
     * @param priorityFlag_EVVM Async (true) or sync (false) nonce
     * @param signature_EVVM Payment authorization signature
     */
    function executeService(
        address clientAddress,
        string memory serviceData,
        uint256 serviceAmount,
        uint256 nonce,
        bytes memory signature,
        uint256 priorityFee_EVVM,
        uint256 nonce_EVVM,
        bool priorityFlag_EVVM,
        bytes memory signature_EVVM
    ) external {
        // 1. Verify client signature for service authorization
        validateServiceSignature(
            "executeService",
            string.concat(
                serviceData,
                ",",
                AdvancedStrings.uintToString(serviceAmount),
                ",",
                AdvancedStrings.uintToString(nonce)
            ),
            signature,
            clientAddress
        );

        // 2. Check nonce hasn't been used (replay protection)
        verifyAsyncServiceNonce(clientAddress, nonce);

        // 3. Process payment from client to this service
        requestPay(
            clientAddress,
            getEtherAddress(),      // ETH token
            serviceAmount,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            signature_EVVM
        );

        // 4. Execute service logic
        _performServiceLogic(clientAddress, serviceData);

        // 5. Reward fisher if service is staker
        if (evvm.isAddressStaker(address(this))) {
            makeCaPay(msg.sender, getEtherAddress(), priorityFee_EVVM);
            makeCaPay(msg.sender, getPrincipalTokenAddress(), evvm.getRewardAmount() / 2);
        }

        // 6. Mark nonce as used
        markAsyncServiceNonceAsUsed(clientAddress, nonce);
    }

    function _performServiceLogic(
        address client,
        string memory data
    ) internal {
        // Implement your service logic here
        // Example: Store data, perform computation, emit events, etc.
    }

    // Owner functions

    function stakeService(uint256 amount) external onlyOwner {
        _makeStakeService(amount);
    }

    function unstakeService(uint256 amount) external onlyOwner {
        _makeUnstakeService(amount);
    }

    function withdrawFunds(address to) external onlyOwner {
        uint256 ethBalance = evvm.getBalance(address(this), getEtherAddress());
        makeCaPay(to, getEtherAddress(), ethBalance);
    }

    function withdrawRewards(address to) external onlyOwner {
        uint256 mateBalance = evvm.getBalance(address(this), getPrincipalTokenAddress());
        makeCaPay(to, getPrincipalTokenAddress(), mateBalance);
    }
}
```

### Manual Implementation Pattern (Without EvvmService)

For developers who need more control or want to use individual utilities:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ManualEVVMService is AsyncNonceService {
    IEvvm public immutable evvm;
    address public serviceOwner;

    constructor(address _evvm, address _owner) {
        evvm = IEvvm(_evvm);
        serviceOwner = _owner;
    }

    function executeService(
        address clientAddress,
        string memory serviceData,
        uint256 serviceAmount,
        uint256 nonce,
        bytes memory signature,
        uint256 priorityFee_EVVM,
        uint256 nonce_EVVM,
        bool priorityFlag_EVVM,
        bytes memory signature_EVVM
    ) external {
        // 1. Verify client signature for service authorization
        require(
            SignatureUtil.verifySignature(
                address(evvm),
                "executeService",
                string.concat(
                    serviceData, ",",
                    AdvancedStrings.uintToString(serviceAmount), ",",
                    AdvancedStrings.uintToString(nonce)
                ),
                signature,
                clientAddress
            ),
            "Invalid signature"
        );

        // 2. Check nonce hasn't been used (replay protection)
        require(verifyAsyncServiceNonce(clientAddress, nonce), "Nonce already used");

        // 3. Process payment from client to this service
        evvm.pay(
            clientAddress,      // from
            address(this),      // to_address
            "",                 // to_identity
            address(0),         // ETH token
            serviceAmount,      // amount
            priorityFee_EVVM,   // priorityFee
            nonce_EVVM,         // nonce
            priorityFlag_EVVM,  // priority
            address(this),      // executor
            signature_EVVM      // signature
        );

        // 4. Execute service logic
        _performServiceLogic(clientAddress, serviceData, serviceAmount);

        // 5. Reward fisher if service is staker
        if (evvm.isAddressStaker(address(this))) {
            evvm.caPay(msg.sender, address(0), priorityFee_EVVM);
            evvm.caPay(msg.sender, address(1), evvm.getRewardAmount() / 2);
        }

        // 6. Mark nonce as used
        markAsyncServiceNonceAsUsed(clientAddress, nonce);
    }

    function _performServiceLogic(
        address client,
        string memory data,
        uint256 amount
    ) internal {
        // Implement your service logic here
    }

    function stakeService(uint256 amount) external {
        require(msg.sender == serviceOwner, "Unauthorized");
        // Approve and stake MATE tokens
        // Implementation depends on your staking contract integration
    }

    function withdrawFunds() external {
        require(msg.sender == serviceOwner, "Unauthorized");
        uint256 ethBalance = evvm.getBalance(address(this), address(0));
        evvm.caPay(serviceOwner, address(0), ethBalance);
    }
}
```

### Key Implementation Patterns

1. **Interface Integration**: Use `IEvvm` interface for all EVVM operations
2. **Dual Signature Pattern**: Service authorization + payment signatures
3. **Nonce Management**: Use `AsyncNonceService` for replay protection
4. **Signature Verification**: Use `SignatureUtil.verifySignature()` for validating client signatures
5. **Fisher Incentives**: Reward fishers who execute transactions
6. **Modular Design**: Separate service logic from EVVM integration

### Universal Message Format

Service signatures follow the standard EVVM pattern:

```
"<evvmID>,<functionName>,<param1>,<param2>,...,<paramN>"
```

Example for a generic service:

```
"1,executeService,serviceData,1000000000000000000,100"
```

This template can be adapted for any service type by:

- Changing function names and parameters
- Implementing custom service logic in `_performServiceLogic`
- Adding service-specific state variables and functions

This package provides everything needed to integrate with the EVVM ecosystem documented throughout this site, offering both flexibility for advanced use cases and simplicity for standard service development.

---

## Library Overview

# EVVM Library Overview

The EVVM library ecosystem provides reusable components and utility contracts designed to simplify EVVM service development. These libraries handle common operations like signature verification, nonce management, string conversions, and service staking.

> **Note: Import Path**
All libraries are imported from `@evvm/testnet-contracts/library/` followed by the specific library path.

## Library Architecture

### Core Service Contract

- **EvvmService**: Base contract providing complete EVVM service functionality with built-in helpers for payments, signatures, and staking

### Primitive Libraries

- **Math**: Standard mathematical operations with overflow protection (OpenZeppelin-based)
- **SignatureRecover**: EIP-191 signature recovery and verification primitives
- **IERC20**: Standard ERC20 token interface

### Utility Libraries

#### String & Type Conversion
- **AdvancedStrings**: Type conversion utilities (uint/address/bytes to string)

#### Signature Verification
- **SignatureUtil**: High-level signature verification for EVVM messages

#### Hash Generation
- **CoreHashUtils**: Hash generation for Core.sol payment operations
- **NameServiceHashUtils**: Hash generation for NameService operations
- **StakingHashUtils**: Hash generation for Staking operations
- **P2PSwapHashUtils**: Hash generation for P2PSwap operations
- **TreasuryCrossChainHashUtils**: Hash generation for cross-chain Treasury operations

#### Contract Utilities
- **CAUtils**: Contract address verification utilities (distinguishes CAs from EOAs)

#### Governance
- **Admin**: Time-delayed admin governance with propose/accept pattern
- **ProposalStructs**: Data structures for governance proposals

> **Note: HashUtils Libraries**
The HashUtils libraries generate deterministic `hashPayload` values for the centralized signature verification architecture. Each service has its own HashUtils library.

### Service Utilities

- **CoreExecution**: Abstract contract providing Core.sol payment processing interface
- **StakingServiceUtils**: Service staking integration utilities

### Error Libraries

- **CoreError**: Error definitions for Core.sol operations
- **CrossChainTreasuryError**: Errors for cross-chain treasury operations
- **NameServiceError**: Errors for NameService operations
- **StakingError**: Errors for Staking operations
- **TreasuryError**: Errors for Treasury operations

### Struct Libraries

Data structure definitions for EVVM services:
- **CoreStructs**: Core.sol data structures
- **ExternalChainStationStructs**: External chain treasury structures
- **HostChainStationStructs**: Host chain treasury structures
- **NameServiceStructs**: NameService data structures
- **P2PSwapStructs**: P2PSwap data structures
- **StakingStructs**: Staking data structures

## Quick Start

### Using EvvmService (Recommended)

The `EvvmService` abstract contract is the recommended way to build EVVM services. It combines all essential utilities:

```solidity

contract MyService is EvvmService {
    constructor(
        address coreAddress,
        address stakingAddress
    ) EvvmService(coreAddress, stakingAddress) {}

    function myFunction(
        address user,
        string memory data,
        bytes memory signature
    ) external {
        // Validate signature
        validateServiceSignature("myFunction", data, signature, user);

        // Your service logic here
    }
}
```

### Using Individual Utilities

For more granular control, use individual libraries:

```solidity

contract MyCustomService is CoreExecution {
    
    constructor(address coreAddress) CoreExecution(coreAddress) {}
    
    function verifyUser(address user, bytes memory sig) internal view {
        bool valid = SignatureUtil.verifySignature(
            evvmId,
            "myFunction",
            AdvancedStrings.uintToString(someValue),
            sig,
            user
        );
        require(valid, "Invalid signature");
    }
}
```

## Library Categories

### 1. Service Development (EvvmService)

Complete all-in-one solution for building EVVM services with:

- Signature validation
- Payment processing via Core.sol
- Service staking integration
- EVVM/Staking contract references

**Best for**: New services, quick prototyping, standard use cases

### 2. Primitive Operations

Low-level utilities for fundamental operations:

- Signature recovery (EIP-191)
- Mathematical operations
- Type conversions

**Best for**: Building custom validation logic, advanced cryptographic operations

### 3. Service Utilities

Modular helpers for specific service functionalities:

- Core.sol payment processing (CoreExecution)
- Staking integration (StakingServiceUtils)
- Admin governance (Admin)

**Best for**: Custom service architectures, mixing and matching functionality

### 4. Hash Utilities

Service-specific hash generation for signature payloads:

- CoreHashUtils, NameServiceHashUtils, StakingHashUtils, P2PSwapHashUtils, TreasuryCrossChainHashUtils

**Best for**: Creating deterministic hash payloads for EVVM's centralized signature system
    constructor(address coreAddress, address stakingAddress) 
        EvvmService(coreAddress, stakingAddress) {}
}
```

### Pattern 2: Modular Composition
```solidity

contract Service is CoreExecution, StakingServiceUtils {
    // Mix utilities as needed - granular control
    constructor(address coreAddress, address stakingAddress) 
        CoreExecution(coreAddress)
        StakingServiceUtils(stakingAddress) {}
}
```

### Pattern 3: Library-Only Usage
```solidity

contract Service {
    // Pure library usage - maximum flexibility
    function verify(bytes memory data, bytes memory sig, address user) internal pure {
        bytes32 hash = CoreHashUtils.hashDataForPay(...);
        // Use libraries as needed
    }

contract Service {
    using SignatureUtil for bytes;
    using AdvancedStrings for uint256;
    constructor(address coreAddress, address stakingAddress)
        EvvmService(coreAddress, stakingAddress) {}
        
    function orderCoffee(
        string memory order,
        bytes memory signature
    ) external {
        validateServiceSignature("orderCoffee", order, signature, msg.sender);
        // Process order...
    }
}
```

### Read-Only Service
Use `SignatureUtil` for signature verification only:

```solidity

contract Validator {
    uint256 evvmId;
    
    function isValidSignature(
        bytes memory sig,
        address user,
        string memory action
    ) public view returns (bool) {
        return SignatureUtil.verifySignature(evvmId, action, "", sig, user);
    }
}
```

### Payment Processing Service
Use `CoreExecution` for Core.sol integration:

```solidity

contract PaymentService is CoreExecution {
    constructor(address coreAddress) CoreExecution(coreAddress) {}
    
    function processPayment(address from, address token, uint256 amount) external {
        // Request payment via Core.sol
        requestPay(
            from,
            token,
            amount,
            0, // priority fee
            msg.sender,
            0, // nonce
            false, // async
            "" // signature
        stnet-contracts/library/utils/service/SyncNonceService.sol";

contract HybridService is AsyncNonce, SyncNonceService {
    function actionWithSyncNonce(...) external {
        uint256 expectedNonce = getNextSyncServiceNonce(user);
        require(nonce == expectedNonce, "Invalid nonce");
        _incrementSyncServiceNonce(user);
    }

    function actionWithAsyncNonce(...) external {
        verifyAsyncNonce(user, nonce);
        markAsyncNonceAsUsed(user, nonce);
    }
}
```

## Installation3-StakingServiceUtils.md)** - Modular service components for Core.sol and Staking integration

**Essential Libraries**: 
- [CoreHashUtils](./04-Utils/05-CoreHashUtils.md) - Hash generation for Core.sol signatures
- [CAUtils](./04-Utils/07-CAUtils.md) - Contract address detection
- [SignatureUtil](./04-Utils/02-SignatureUtil.md) - High-level signature verification
# Clone repository
git clone --recursive https://github.com/EVVM-org/Testnet-Contracts.git

# Install via Forge
forge install EVVM-org/Testnet-Contracts
```

**Foundry Configuration** (`foundry.toml`):

```toml
remappings = [
    "@evvm/testnet-contracts/=lib/Testnet-Contracts/src/"
]
```

## Next Steps

Explore individual library documentation:

1. **[EvvmService](./02-EvvmService.md)** - Complete service development framework
2. **[Primitives](./03-Primitives/01-Math.md)** - Low-level mathematical and cryptographic operations
3. **[Utils](./04-Utils/01-AdvancedStrings.md)** - String conversions, hash generation, signature verification, and contract detection
4. **[Service Utilities](./04-Utils/03-Service/02-StakingServiceUtils.md)** - Modular service components for staking integration

**Essential Libraries**: [CoreHashUtils](./04-Utils/05-CoreHashUtils.md), [CAUtils](./04-Utils/07-CAUtils.md) - Essential for understanding the centralized signature system

---

**Recommendation**: Start with `EvvmService` for fastest development, then explore individual utilities as you need more customization.

---

## EvvmService


The `EvvmService` abstract contract is the recommended foundation for building EVVM services. It combines `CoreExecution` for Core.sol payment processing and `StakingServiceUtils` for simplified service staking into a single, production-ready base contract.

## Overview

**Contract Type**: Abstract base contract  
**Inheritance**: `CoreExecution`, `StakingServiceUtils`  
**License**: EVVM-NONCOMMERCIAL-1.0  
**Import Path**: `@evvm/testnet-contracts/library/EvvmService.sol`

### Key Features

- **Direct Core.sol integration** for payment processing (via CoreExecution)
- **Simplified service staking** in single function calls (via StakingServiceUtils)
- **EVVM ID access** for signature generation
- **Principal Token queries** for MATE operations
- **Minimal dependencies** - no nonce management or redundant abstractions

## Contract Structure

```solidity
abstract contract EvvmService is CoreExecution, StakingServiceUtils {
    error InvalidServiceSignature();

    // NOTE: `core` and `staking` are provided by base contracts:
    // - `CoreExecution` defines `Core public core;`
    // - `StakingServiceUtils` defines `IStaking internal staking;`

    constructor(address coreAddress, address stakingAddress)
        StakingServiceUtils(stakingAddress)
        CoreExecution(coreAddress)
    {}

    // Helper functions
    function getEvvmID() internal view returns (uint256);
    function getPrincipalTokenAddress() internal view returns (address);
}
```

## Inherited State Variables

The `EvvmService` relies on state variables declared in its base contracts:

### From `CoreExecution`
```solidity
Core public core;
```
A `Core` handle for payment processing, nonce validation, and balance operations.

### From `StakingServiceUtils`
```solidity
IStaking internal staking;
```
A `IStaking` handle for service staking operations.

## Functions

EvvmService provides two helper functions for accessing Core.sol metadata:

### `getEvvmID`
```solidity
function getEvvmID() internal view returns (uint256)
```

**Description**: Gets the unique EVVM instance identifier for signature validation

**Returns**: Unique blockchain instance identifier from Core.sol

**Usage**: Prevents cross-chain replay attacks by including this ID in signatures

**Example**:
```solidity
function generateMessage(string memory action) internal view returns (string memory) {
    return string.concat(
        Strings.toString(getEvvmID()), ",",
        Strings.toHexString(address(this)), ",",
        action
    );
}
```

### `getPrincipalTokenAddress`
```solidity
function getPrincipalTokenAddress() internal view returns (address)
```

**Description**: Gets the Principal Token (MATE) address

**Returns**: Address of the MATE token contract

**Usage**: Required for MATE payment operations and staking

**Example**:
```solidity
function stakeMate(uint256 amount) external {
    address mate = getPrincipalTokenAddress();
    // Use MATE address for operations
}
```

## Inherited Functions

### From CoreExecution

The following payment functions are available through `CoreExecution` inheritance:

#### `requestPay`
```solidity
function requestPay(
    address from,
    address token,
    uint256 amount,
    uint256 priorityFee,
    uint256 nonce,
    bool isAsyncExec,
    bytes memory signature
) internal
```

Requests payment from a user via Core.sol with signature validation.

**Documentation**: See [CoreExecution](./04-Utils/03-Service/01-CoreExecution.md)

**Example**:
```solidity
requestPay(
    customerAddress,
    address(0),             // ETH
    1 ether,
    0.001 ether,            // Priority fee
    nonce,
    true,                   // isAsyncExec
    paymentSignature
);
```

#### `makeCaPay`
```solidity
function makeCaPay(
    address to,
    address token,
    uint256 amount
) internal
```

Sends tokens from service's balance to recipient via contract authorization (no signature required).

**Documentation**: See [CoreExecution](./04-Utils/03-Service/01-CoreExecution.md)

**Example**:
```solidity
// Withdraw ETH balance
makeCaPay(owner, address(0), balance);

// Reward user
makeCaPay(msg.sender, getPrincipalTokenAddress(), rewardAmount);
```

#### `makeCaBatchPay`
```solidity
function makeCaBatchPay(
    address[] memory to,
    address token,
    uint256[] memory amounts
) internal
```

Sends tokens to multiple recipients via contract authorization (batch version).

**Documentation**: See [CoreExecution](./04-Utils/03-Service/01-CoreExecution.md)

### From StakingServiceUtils

The following staking functions are available through `StakingServiceUtils` inheritance:

#### `_makeStakeService`
```solidity
function _makeStakeService(uint256 amountToStake) internal
```

Stakes MATE tokens to make this service contract a staker in one transaction.

**Documentation**: See [StakingServiceUtils](./04-Utils/03-Service/02-StakingServiceUtils.md)

**Example**:
```solidity
function stake(uint256 amount) external onlyAdmin {
    _makeStakeService(amount);
}
```

#### `_makeUnstakeService`
```solidity
function _makeUnstakeService(uint256 amountToUnstake) internal
```

Unstakes MATE tokens from the service staking position.

**Documentation**: See [StakingServiceUtils](./04-Utils/03-Service/02-StakingServiceUtils.md)

**Example**:
```solidity
function unstake(uint256 amount) external onlyAdmin {
    _makeUnstakeService(amount);
}
```

### Helper Functions

#### `getPrincipalTokenAddress`
```solidity
function getPrincipalTokenAddress() internal pure virtual returns (address)
```

Returns the MATE token address used in EVVM.

**Returns**: `address(1)` (MATE token representation)

#### `getEtherAddress`
```solidity
function getEtherAddress() internal pure virtual returns (address)
```

Returns the ETH token address used in EVVM.

**Returns**: `address(0)` (ETH representation)

## Complete Usage Example

```solidity
// SPDX-License-Identifier: EVVM-NONCOMMERCIAL-1.0
pragma solidity ^0.8.0;

contract CoffeeShop is EvvmService, Admin {
    // Events
    event CoffeeOrdered(address indexed customer, string coffeeType, uint256 quantity);
    
    uint256 public constant COFFEE_PRICE = 0.001 ether;
    
    constructor(
        address coreAddress,
        address stakingAddress,
        address initialAdmin
    ) 
        EvvmService(coreAddress, stakingAddress) 
        Admin(initialAdmin)
    {}
    
    /**
     * @notice Process coffee order with Core.sol payment
     * @param customer Customer address
     * @param coffeeType Type of coffee (e.g., "latte")
     * @param quantity Number of coffees
     * @param priorityFee Fee for fisher (in MATE)
     * @param originExecutor EOA that will execute (verified with tx.origin)
     * @param nonce Core.sol nonce for customer
     * @param signature Customer's payment authorization signature
     */
    function orderCoffee(
        address customer,
        string memory coffeeType,
        uint256 quantity,
        uint256 priorityFee,
        uint256 nonce,
        bytes memory signature
    ) external {
        uint256 totalPrice = COFFEE_PRICE * quantity;
        
        // Request payment via Core.sol (validates signature and consumes nonce)
        requestPay(
            customer,
            address(0),             // ETH payment
            totalPrice,
            priorityFee,
            nonce,
            true,                   // Always async
            signature
        );
        
        // Emit event for off-chain processing
        emit CoffeeOrdered(customer, coffeeType, quantity);
    }
    
    /**
     * @notice Refund a customer (admin only)
     * @param customer Customer to refund
     * @param amount Amount to refund
     */
    function refundCustomer(address customer, uint256 amount) external onlyAdmin {
        // Send refund from service balance (no signature needed)
        makeCaPay(customer, address(0), amount);
    }
    
    /**
     * @notice Stake service to earn rewards (admin only)
     * @param amount Number of stake units
     */
    function stake(uint256 amount) external onlyAdmin {
        _makeStakeService(amount);
    }
    
    /**
     * @notice Unstake service tokens (admin only)
     * @param amount Number of stake units
     */
    function unstake(uint256 amount) external onlyAdmin {
        _makeUnstakeService(amount);
    }
    
    /**
     * @notice Withdraw ETH earnings (admin only)
     * @param to Recipient address
     */
    function withdrawFunds(address to) external onlyAdmin {
        uint256 balance = core.getBalance(address(this), address(0));
        makeCaPay(to, address(0), balance);
    }
    
    /**
     * @notice Withdraw MATE rewards (admin only)
     * @param to Recipient address
     */
    function withdrawRewards(address to) external onlyAdmin {
        address mate = getPrincipalTokenAddress();
        uint256 balance = core.getBalance(address(this), mate);
        makeCaPay(to, mate, balance);
    }
    
    /**
     * @notice Update Core.sol address (admin only)
     * @param newCoreAddress New Core contract address
     */
    function updateCoreAddress(address newCoreAddress) external override onlyAdmin {
        core = Core(newCoreAddress);
    }
}
```

## Best Practices

### 1. Always Use Core.sol for Payment Validation
```solidity
// Good - Core.sol validates signature and nonce
```solidity
// Good - Core.sol validates signature and nonce
requestPay(user, token, amount, priorityFee, nonce, true, signature);

// Bad - Manual validation is redundant and error-prone
// Don't implement your own signature/nonce validation
```

// Bad - no validation
// Process without checking signature
```

### 2. Let Core.sol Handle Nonce Management
```solidity
// Good - Core.sol validates and consumes nonce
requestPay(user, token, amount, priorityFee, nonce, true, signature);

// Bad - Don't implement your own nonce tracking
// Core.sol manages nonces centrally
```

### 3. Use isAsyncExec Appropriately
```solidity
// Good - async for most operations
requestPay(user, token, amount, priorityFee, nonce, true, signature);

// Sync only when sequential order matters
requestPay(user, token, amount, priorityFee, nonce, false, signature);
```

### 4. Protect Admin Functions
```solidity
// Good - require authorization (using Admin pattern)
function stake(uint256 amount) external onlyAdmin {
    _makeStakeService(amount);
}

// Bad - anyone can stake
function stake(uint256 amount) external {
    _makeStakeService(amount);
}
```

### 5. Override updateCoreAddress with Access Control
```solidity
// Good - admin-protected override
function updateCoreAddress(address newCoreAddress) external override onlyAdmin {
    core = Core(newCoreAddress);
}

// Bad - exposed to anyone (security risk)
function updateCoreAddress(address newCoreAddress) external override {
    core = Core(newCoreAddress);
}
```

## Security Considerations

### Centralized Validation via Core.sol
- **Core.sol validates signatures**: Uses `validateAndConsumeNonce()` on every `requestPay()`
- **Automatic nonce management**: Core.sol marks nonces as consumed (no manual tracking needed)
- **Replay protection**: Nonces are one-time use, enforced by Core.sol
- **Origin executor verification**: Core.sol uses `tx.origin` to verify EOA caller

### Access Control
- **Staking functions**: Always protect `_makeStakeService()` and `_makeUnstakeService()`
- **Withdrawal functions**: Protect `makeCaPay()` calls for owner withdrawals
- **Address updates**: Override `updateCoreAddress()` with admin-only access

### Payment Authorization
- `requestPay()` requires valid user signature - Core.sol validates it
- Service cannot forge payments on behalf of users
- Users must explicitly sign payment authorization messages

## Gas Optimization Tips

1. **Batch operations**: Use `makeCaBatchPay()` for multiple recipients
2. **Cache balances**: Store `core.getBalance()` results if used multiple times
3. **Avoid redundant checks**: Core.sol already validates signatures/nonces
4. **Use events**: Emit events instead of storing unnecessary data on-chain

## Architecture Benefits

### Compared to Manual Implementation

**Before (Manual):**
```solidity
contract OldService {
    IEvvm evvm;
    mapping(address => mapping(uint256 => bool)) nonces;  // Manual nonce tracking
    
    function action(...) external {
        // 1. Manual signature verification
        bytes32 hash = keccak256(...);
        address signer = ecrecover(hash, v, r, s);
        require(signer == expectedSigner, "Invalid");
        
        // 2. Manual nonce check
        require(!nonces[user][nonce], "Used");
        
        // 3. Manual payment call
        evvm.pay(user, address(this), "", token, amount, ...);
        
        // 4. Manual nonce marking
        nonces[user][nonce] = true;
    }
}
```

**After (EvvmService):**
```solidity
contract NewService is EvvmService, Admin {
    function action(
        address user,
        address token,
        uint256 amount,
        uint256 priorityFee,
        uint256 nonce,
        bytes memory signature
    ) external {
        // Single call - Core.sol validates signature, verifies executor, consumes nonce
        requestPay(user, token, amount, priorityFee, nonce, true, signature);
    }
}
```

**Benefits**:
- **Less code**: No manual signature/nonce management
- **Fewer bugs**: Battle-tested Core.sol validation
- **Gas efficient**: No redundant nonce storage in service
- **Centralized security**: Core.sol enforces all rules
- **Automatic upgrades**: Core.sol improvements benefit all services
- **Consistent patterns**: All services use same validation logic

---

## See Also

- **[CoreExecution](./04-Utils/03-Service/01-CoreExecution.md)** - Base payment processing contract
- **[StakingServiceUtils](./04-Utils/03-Service/02-StakingServiceUtils.md)** - Service staking utilities
- **[Admin](./04-Utils/04-GovernanceUtils.md)** - Governance pattern for access control
- **[How to Make an EVVM Service](../../06-HowToMakeAEVVMService.md)** - Complete service development guide
- **[Core.sol Overview](../../04-Contracts/01-EVVM/01-Overview.md)** - Centralized validation details

---

## Math Library


The `Math` library provides standard mathematical utilities missing in Solidity, based on OpenZeppelin's implementation. It includes safe arithmetic operations, rounding functions, and advanced mathematical operations with overflow protection.

## Overview

**Library Type**: Pure functions  
**License**: MIT (OpenZeppelin)  
**Import Path**: `@evvm/testnet-contracts/library/primitives/Math.sol`  
**Version**: Based on OpenZeppelin v5.0.0

### Key Features

- **Overflow-safe operations** with try* functions
- **Rounding control** for division operations
- **Min/max comparisons**
- **Advanced operations** (sqrt, log, mulDiv)
- **Gas-optimized** implementations

## Enums

### `Rounding`
```solidity
enum Rounding {
    Floor,   // Toward negative infinity
    Ceil,    // Toward positive infinity
    Trunc,   // Toward zero
    Expand   // Away from zero
}
```

Controls rounding behavior for division and advanced operations.

## Basic Arithmetic (Try Functions)

These functions return `(bool success, uint256 result)` to handle overflows gracefully.

### `tryAdd`
```solidity
function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

**Description**: Safe addition with overflow check

**Returns**: 
- `success`: `true` if no overflow, `false` otherwise
- `result`: Sum if successful, `0` if overflow

**Example**:
```solidity
(bool success, uint256 sum) = Math.tryAdd(100, 50);
if (success) {
    // sum = 150
}

(bool overflow, uint256 invalid) = Math.tryAdd(type(uint256).max, 1);
// overflow = false, invalid = 0
```

### `trySub`
```solidity
function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

**Description**: Safe subtraction with underflow check

**Returns**:
- `success`: `true` if `a >= b`, `false` otherwise
- `result`: Difference if successful, `0` if underflow

**Example**:
```solidity
(bool success, uint256 diff) = Math.trySub(100, 50);
// success = true, diff = 50

(bool underflow, uint256 invalid) = Math.trySub(50, 100);
// underflow = false, invalid = 0
```

### `tryMul`
```solidity
function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

**Description**: Safe multiplication with overflow check

**Example**:
```solidity
(bool success, uint256 product) = Math.tryMul(10, 20);
// success = true, product = 200

(bool overflow, ) = Math.tryMul(type(uint256).max, 2);
// overflow = false
```

### `tryDiv`
```solidity
function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

**Description**: Safe division with zero-check

**Returns**:
- `success`: `true` if `b != 0`, `false` if division by zero
- `result`: Quotient if successful, `0` if division by zero

**Example**:
```solidity
(bool success, uint256 quotient) = Math.tryDiv(100, 5);
// success = true, quotient = 20

(bool divByZero, ) = Math.tryDiv(100, 0);
// divByZero = false
```

### `tryMod`
```solidity
function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

**Description**: Safe modulo with zero-check

**Example**:
```solidity
(bool success, uint256 remainder) = Math.tryMod(100, 30);
// success = true, remainder = 10
```

## Comparison Functions

### `max`
```solidity
function max(uint256 a, uint256 b) internal pure returns (uint256)
```

**Description**: Returns the larger of two numbers

**Example**:
```solidity
uint256 maxValue = Math.max(100, 200);
// maxValue = 200
```

### `min`
```solidity
function min(uint256 a, uint256 b) internal pure returns (uint256)
```

**Description**: Returns the smaller of two numbers

**Example**:
```solidity
uint256 minValue = Math.min(100, 200);
// minValue = 100
```

### `average`
```solidity
function average(uint256 a, uint256 b) internal pure returns (uint256)
```

**Description**: Returns the average of two numbers, rounded towards zero

**Implementation**: `(a & b) + (a ^ b) / 2` (prevents overflow)

**Example**:
```solidity
uint256 avg = Math.average(100, 200);
// avg = 150

uint256 avgOdd = Math.average(100, 201);
// avgOdd = 150 (rounded down)
```

## Advanced Operations

### `sqrt`
```solidity
function sqrt(uint256 a) internal pure returns (uint256)
function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256)
```

**Description**: Calculates the square root with optional rounding

**Example**:
```solidity
uint256 root = Math.sqrt(144);
// root = 12

uint256 rootFloor = Math.sqrt(150, Math.Rounding.Floor);
// rootFloor = 12

uint256 rootCeil = Math.sqrt(150, Math.Rounding.Ceil);
// rootCeil = 13
```

### `log10`
```solidity
function log10(uint256 value) internal pure returns (uint256)
function log10(uint256 value, Rounding rounding) internal pure returns (uint256)
```

**Description**: Calculates log₁₀(value) with optional rounding

**Example**:
```solidity
uint256 log = Math.log10(1000);
// log = 3

uint256 logFloor = Math.log10(1500, Math.Rounding.Floor);
// logFloor = 3

uint256 logCeil = Math.log10(1500, Math.Rounding.Ceil);
// logCeil = 4
```

### `log2`
```solidity
function log2(uint256 value) internal pure returns (uint256)
function log2(uint256 value, Rounding rounding) internal pure returns (uint256)
```

**Description**: Calculates log₂(value) with optional rounding

**Example**:
```solidity
uint256 log = Math.log2(256);
// log = 8

uint256 log = Math.log2(100);
// log = 6 (2^6 = 64, 2^7 = 128)
```

### `log256`
```solidity
function log256(uint256 value) internal pure returns (uint256)
function log256(uint256 value, Rounding rounding) internal pure returns (uint256)
```

**Description**: Calculates log₂₅₆(value) with optional rounding

### `mulDiv`
```solidity
function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256)
function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256)
```

**Description**: Calculates `(x * y) / denominator` with full precision (512-bit intermediate result)

**Reverts**: `MathOverflowedMulDiv()` if result overflows or denominator is zero

**Use Case**: Prevents overflow in `(a * b) / c` calculations

**Example**:
```solidity
// Calculate percentage: (amount * 15) / 100
uint256 result = Math.mulDiv(1000 ether, 15, 100);
// result = 150 ether

// With rounding
uint256 resultCeil = Math.mulDiv(1000 ether, 15, 100, Math.Rounding.Ceil);
```

## Common Use Cases

### Use Case 1: Safe Arithmetic in Services
```solidity
contract Service {
    function calculateReward(uint256 baseReward, uint256 multiplier) public pure returns (uint256) {
        (bool success, uint256 reward) = Math.tryMul(baseReward, multiplier);
        require(success, "Reward overflow");
        return reward;
    }
}
```

### Use Case 2: Percentage Calculations
```solidity
function calculateFee(uint256 amount, uint256 feePercentage) internal pure returns (uint256) {
    // Calculate fee with precision: (amount * feePercentage) / 10000
    // Supports up to 0.01% precision
    return Math.mulDiv(amount, feePercentage, 10000);
}

// Example: 2.5% fee on 1000 tokens
uint256 fee = calculateFee(1000, 250); // 250 = 2.5% * 100
// fee = 25
```

### Use Case 3: Finding Min/Max Values
```solidity
function clampValue(uint256 value, uint256 minVal, uint256 maxVal) internal pure returns (uint256) {
    return Math.min(Math.max(value, minVal), maxVal);
}

uint256 clamped = clampValue(150, 100, 120);
// clamped = 120 (capped at max)
```

### Use Case 4: Logarithmic Scaling
```solidity
function calculateTier(uint256 amount) internal pure returns (uint256) {
    if (amount == 0) return 0;
    
    // Tier increases logarithmically with amount
    return Math.log10(amount, Math.Rounding.Floor);
}

uint256 tier1 = calculateTier(100);    // tier = 2
uint256 tier2 = calculateTier(1000);   // tier = 3
uint256 tier3 = calculateTier(10000);  // tier = 4
```

## Error Handling

### `MathOverflowedMulDiv`
```solidity
error MathOverflowedMulDiv();
```

**Thrown by**: `mulDiv` functions  
**Reason**: Result overflows uint256 or denominator is zero

**Example**:
```solidity
try Math.mulDiv(type(uint256).max, 2, 1) returns (uint256) {
    // Won't reach here
} catch {
    // Catches MathOverflowedMulDiv
}
```

## Best Practices

### 1. Use Try Functions for User Input
```solidity
// Good - handle overflow gracefully
function addUserAmounts(uint256 a, uint256 b) external pure returns (uint256) {
    (bool success, uint256 sum) = Math.tryAdd(a, b);
    require(success, "Amount overflow");
    return sum;
}

// Bad - unchecked addition can overflow
function addUserAmounts(uint256 a, uint256 b) external pure returns (uint256) {
    return a + b; // Can silently overflow
}
```

### 2. Use mulDiv for Precision
```solidity
// Good - maintains precision
uint256 result = Math.mulDiv(largeAmount, percentage, 100);

// Bad - can overflow or lose precision
uint256 result = (largeAmount * percentage) / 100; // Overflow risk
```

### 3. Choose Appropriate Rounding
```solidity
// For user-favorable rounding (fees)
uint256 fee = Math.mulDiv(amount, feeRate, 10000, Math.Rounding.Floor);

// For protocol-favorable rounding (rewards)
uint256 reward = Math.mulDiv(stake, rate, 10000, Math.Rounding.Ceil);
```

## Gas Considerations

- **Try functions**: ~50-100 gas overhead vs unchecked operations
- **mulDiv**: More expensive than simple division but prevents overflow
- **log functions**: ~200-500 gas depending on input size
- **sqrt**: ~150-300 gas depending on input size

## Integration with EVVM

The Math library is used internally by:
- **AdvancedStrings**: `log10` for uint to string conversion
- **Staking**: `mulDiv` for reward calculations
- **Treasury**: Safe arithmetic for fee calculations

---

## See Also

- **[AdvancedStrings](../04-Utils/01-AdvancedStrings.md)** - Uses Math.log10
- **[Staking Contract](../../../04-Contracts/03-Staking/01-Overview.md)** - Uses Math for reward calculations
- [OpenZeppelin Math Documentation](https://docs.openzeppelin.com/contracts/5.x/api/utils#Math)

---

## SignatureRecover Library


The `SignatureRecover` library provides low-level EIP-191 signature recovery and validation. It handles the cryptographic operations needed to verify that a message was signed by a specific address.

## Overview

**Library Type**: Pure functions  
**License**: EVVM-NONCOMMERCIAL-1.0  
**Import Path**: `@evvm/testnet-contracts/library/primitives/SignatureRecover.sol`  
**Standard**: EIP-191 (Ethereum Signed Message)

### Key Features

- **EIP-191 compliant** signature recovery
- **Address extraction** from signatures
- **Signature validation** (length and v value checks)
- **Gas-optimized** assembly operations

## Functions

### `recoverSigner`
```solidity
function recoverSigner(
    string memory message,
    bytes memory signature
) internal pure returns (address)
```

**Description**: Recovers the signer address from a message and its signature

**Parameters**:
- `message`: The original message that was signed
- `signature`: 65-byte ECDSA signature (r, s, v components)

**Returns**: Address that created the signature

**EIP-191 Format**: 
```
"\x19Ethereum Signed Message:\n" + len(message) + message
```

**Example**:
```solidity
string memory message = "123,orderCoffee,latte,1,1000000000000000";
bytes memory signature = hex"..."; // User's signature

address signer = SignatureRecover.recoverSigner(message, signature);
// signer = address who signed the message
```

**Detailed Process**:
1. Constructs EIP-191 prefix with message length
2. Hashes the prefixed message with keccak256
3. Splits signature into r, s, v components
4. Calls `ecrecover` to extract signer address

### `splitSignature`
```solidity
function splitSignature(
    bytes memory signature
) internal pure returns (bytes32 r, bytes32 s, uint8 v)
```

**Description**: Splits a 65-byte signature into its cryptographic components

**Parameters**:
- `signature`: 65-byte signature (r: 32 bytes, s: 32 bytes, v: 1 byte)

**Returns**:
- `r`: First 32 bytes (signature component)
- `s`: Next 32 bytes (signature component)
- `v`: Last byte (recovery id, normalized to 27 or 28)

**Validation**:
- Requires signature length exactly 65 bytes
- Normalizes v to 27 or 28 (adds 27 if v < 27)
- Validates v is either 27 or 28

**Example**:
```solidity
bytes memory sig = userSignature; // 65 bytes

(bytes32 r, bytes32 s, uint8 v) = SignatureRecover.splitSignature(sig);
// r = first 32 bytes
// s = next 32 bytes
// v = 27 or 28
```

**Reverts**:
- `"Invalid signature length"` if signature is not exactly 65 bytes
- `"Invalid signature value"` if v is not 27 or 28 after normalization

## EIP-191 Standard

### Message Format
```solidity
keccak256(
    abi.encodePacked(
        "\x19Ethereum Signed Message:\n",
        length_as_string,
        message
    )
)
```

**Components**:
1. **Prefix**: `"\x19Ethereum Signed Message:\n"`
2. **Length**: String representation of message byte length
3. **Message**: The actual message content

**Example Message Construction**:
```solidity
// Message: "123,orderCoffee,latte,1,1000000000000000"
// Length: 40 characters
// Full format: "\x19Ethereum Signed Message:\n40123,orderCoffee,latte,1,1000000000000000"
```

### Why EIP-191?

1. **Prevents signature reuse** across different contexts
2. **User-friendly** wallet integration (MetaMask, etc.)
3. **Clear signing intent** for users
4. **Industry standard** for Ethereum signatures

## Signature Components

### ECDSA Signature Structure
```
[r (32 bytes)][s (32 bytes)][v (1 byte)] = 65 bytes total
```

- **r**: X-coordinate of random point on elliptic curve
- **s**: Signature proof
- **v**: Recovery id (which of 4 possible points was used)

### Recovery ID (v)
- **Original range**: 0-3
- **Ethereum standard**: 27-28 (adds 27 to original)
- **Purpose**: Determines which public key to recover

## Common Use Cases

### Use Case 1: Direct Signature Verification
```solidity
contract MessageValidator {
    function verifyMessage(
        string memory message,
        bytes memory signature,
        address expectedSigner
    ) public pure returns (bool) {
        address recovered = SignatureRecover.recoverSigner(message, signature);
        return recovered == expectedSigner;
    }
}

// Usage
bool isValid = verifyMessage(
    "Hello, World!",
    userSignature,
    userAddress
);
```

### Use Case 2: Multi-Signature Validation
```solidity
function verifyMultiSig(
    string memory message,
    bytes[] memory signatures,
    address[] memory signers
) public pure returns (bool) {
    require(signatures.length == signers.length, "Length mismatch");
    
    for (uint256 i = 0; i < signatures.length; i++) {
        address recovered = SignatureRecover.recoverSigner(
            message,
            signatures[i]
        );
        if (recovered != signers[i]) {
            return false;
        }
    }
    return true;
}
```

### Use Case 3: Signature Component Analysis
```solidity
function analyzeSignature(bytes memory sig) public pure returns (
    bytes32 r,
    bytes32 s,
    uint8 v,
    bool isValid
) {
    if (sig.length != 65) {
        return (0, 0, 0, false);
    }
    
    (r, s, v) = SignatureRecover.splitSignature(sig);
    isValid = (v == 27 || v == 28);
}
```

### Use Case 4: Building Higher-Level Verification
```solidity
library CustomSignatureUtil {
    function verifyActionSignature(
        uint256 evvmId,
        string memory action,
        string memory params,
        bytes memory signature,
        address signer
    ) internal pure returns (bool) {
        // Construct EVVM-style message
        string memory message = string.concat(
            AdvancedStrings.uintToString(evvmId),
            ",",
            action,
            ",",
            params
        );
        
        // Use SignatureRecover
        address recovered = SignatureRecover.recoverSigner(message, signature);
        return recovered == signer;
    }
}
```

## Frontend Integration

### JavaScript/TypeScript Example
```typescript

// Sign message (frontend)
async function signMessage(signer: ethers.Signer, message: string): Promise<string> {
    // Wallet automatically adds EIP-191 prefix
    const signature = await signer.signMessage(message);
    return signature;
}

// Example usage
const message = "123,orderCoffee,latte,1,1000000000000000";
const signature = await signMessage(wallet, message);

// Smart contract can now verify with SignatureRecover.recoverSigner()
```

### ethers.js Verification (Off-Chain)
```typescript

function verifySignature(
    message: string,
    signature: string,
    expectedAddress: string
): boolean {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}
```

## Security Considerations

### 1. Signature Malleability
**Issue**: ECDSA signatures can be malleated (different valid signatures for same message)

**Impact**: Not relevant for EVVM (we verify signer, not signature uniqueness)

**Note**: If you need signature uniqueness, use nonces (handled centrally by Core.sol)

### 2. Message Prefix
**Important**: Always use EIP-191 prefix (automatic with this library)

```solidity
// Good - uses EIP-191
address signer = SignatureRecover.recoverSigner(message, signature);

// Bad - direct ecrecover without prefix
bytes32 hash = keccak256(abi.encodePacked(message));
address signer = ecrecover(hash, v, r, s); // Vulnerable!
```

### 3. Signature Validation
**Always validate**:
- Signature length (65 bytes)
- v value (27 or 28)
- Recovered address is not zero

```solidity
// Good - validation included
address signer = SignatureRecover.recoverSigner(message, signature);
require(signer != address(0), "Invalid signature");
require(signer == expectedSigner, "Wrong signer");

// Bad - no zero address check
address signer = SignatureRecover.recoverSigner(message, signature);
require(signer == expectedSigner); // signer could be address(0)
```

### 4. Replay Protection
**SignatureRecover alone does NOT prevent replays**

```solidity
// Good - add nonce
string memory message = string.concat(
    "action,param1,param2,",
    AdvancedStrings.uintToString(nonce)
);
address signer = SignatureRecover.recoverSigner(message, signature);

// Bad - no nonce, signature can be reused
string memory message = "action,param1,param2";
address signer = SignatureRecover.recoverSigner(message, signature);
```

## Error Messages

### "Invalid signature length"
**Cause**: Signature is not exactly 65 bytes  
**Solution**: Ensure signature from wallet is complete ECDSA signature

### "Invalid signature value"
**Cause**: v component is not 27 or 28 after normalization  
**Solution**: Check signature generation process

## Gas Costs

| Operation | Gas Cost | Notes |
|-----------|----------|-------|
| `recoverSigner` | ~3,000-5,000 | Includes keccak256 + ecrecover |
| `splitSignature` | ~200-300 | Mostly assembly operations |
| `ecrecover` (precompile) | ~3,000 | Ethereum precompiled contract |

## Integration with EVVM Libraries

This library is used by:

### SignatureUtil
```solidity
library SignatureUtil {
    function verifySignature(...) internal pure returns (bool) {
        return SignatureRecover.recoverSigner(
            constructedMessage,
            signature
        ) == expectedSigner;
    }
}
```

### EvvmService
```solidity
abstract contract EvvmService {
    function validateServiceSignature(...) internal view {
        if (!SignatureUtil.verifySignature(...)) {
            revert InvalidServiceSignature();
        }
    }
}
```

## Best Practices

### 1. Always Use EIP-191
```solidity
// Good - EIP-191 via SignatureRecover
address signer = SignatureRecover.recoverSigner(message, signature);

// Bad - raw keccak256 (vulnerable)
bytes32 hash = keccak256(bytes(message));
address signer = ecrecover(hash, v, r, s);
```

### 2. Validate Zero Address
```solidity
// Good
address recovered = SignatureRecover.recoverSigner(msg, sig);
require(recovered != address(0) && recovered == expected, "Invalid");

// Bad - missing zero check
address recovered = SignatureRecover.recoverSigner(msg, sig);
require(recovered == expected); // Could match if both are zero
```

### 3. Use Higher-Level Libraries When Possible
```solidity
// Better - use SignatureUtil
bool valid = SignatureUtil.verifySignature(evvmId, "action", params, sig, user);

// Works but more code - direct SignatureRecover
string memory message = string.concat(
    AdvancedStrings.uintToString(evvmId),
    ",action,",
    params
);
address signer = SignatureRecover.recoverSigner(message, sig);
bool valid = (signer == user);
```

### 4. Cache Recovered Addresses
```solidity
// Good - recover once
address signer = SignatureRecover.recoverSigner(message, signature);
require(signer == expectedSigner, "Invalid signer");
require(signer != owner, "Owner cannot call");

// Bad - recover multiple times
require(
    SignatureRecover.recoverSigner(message, signature) == expectedSigner,
    "Invalid signer"
);
require(
    SignatureRecover.recoverSigner(message, signature) != owner,
    "Owner cannot call"
); // Wastes ~3000 gas
```

---

## See Also

- **[SignatureUtil](../04-Utils/02-SignatureUtil.md)** - Higher-level signature verification
- **[EvvmService](../02-EvvmService.md)** - Service contract using signature verification
- **[AdvancedStrings](../04-Utils/01-AdvancedStrings.md)** - Message construction utilities
- [EIP-191 Specification](https://eips.ethereum.org/EIPS/eip-191)
- [ECDSA Signature Standard](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)

---

## AdvancedStrings Library


The `AdvancedStrings` library provides efficient type conversion utilities, primarily for converting Solidity types to their string representations. This is essential for constructing human-readable messages for signature verification.

## Overview

**Library Type**: Pure functions  
**License**: EVVM-NONCOMMERCIAL-1.0  
**Import Path**: `@evvm/testnet-contracts/library/utils/AdvancedStrings.sol`

### Key Features

- **uint256 to string** conversion
- **Address to checksummed string**
- **Bytes to hex string** conversion
- **String equality** comparison
- **Gas-optimized** implementations

## Functions

### `uintToString`
```solidity
function uintToString(uint256 value) internal pure returns (string memory)
```

**Description**: Converts a uint256 to its decimal string representation

**Parameters**:
- `value`: The uint256 number to convert

**Returns**: String representation (e.g., `"12345"`)

**Example**:
```solidity
string memory str = AdvancedStrings.uintToString(12345);
// str = "12345"

string memory zero = AdvancedStrings.uintToString(0);
// zero = "0"

string memory large = AdvancedStrings.uintToString(type(uint256).max);
// large = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
```

**Implementation Details**:
- Uses `Math.log10` to calculate string length
- Builds string from right to left
- Gas-optimized with assembly memory operations

**Use Cases**:
- Constructing signature messages
- Building event data
- Creating human-readable identifiers

### `addressToString`
```solidity
function addressToString(address _address) internal pure returns (string memory)
```

**Description**: Converts an address to its hex string representation with `0x` prefix

**Parameters**:
- `_address`: The address to convert

**Returns**: Hex string in format `"0x..."` (42 characters)

**Example**:
```solidity
address user = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2;
string memory str = AdvancedStrings.addressToString(user);
// str = "0x742d35cc6634c0532925a3b844bc9e7595f0beb2"

address zero = address(0);
string memory zeroStr = AdvancedStrings.addressToString(zero);
// zeroStr = "0x0000000000000000000000000000000000000000"
```

**Format**:
- Always 42 characters (2 for "0x" + 40 for address)
- Lowercase hex representation
- Zero-padded to full length

**Use Cases**:
- Converting addresses for signature messages
- Logging and debugging
- Creating readable address representations

### `equal`
```solidity
function equal(string memory a, string memory b) internal pure returns (bool)
```

**Description**: Compares two strings for equality

**Parameters**:
- `a`: First string
- `b`: Second string

**Returns**: `true` if strings are identical, `false` otherwise

**Example**:
```solidity
bool same = AdvancedStrings.equal("hello", "hello");
// same = true

bool different = AdvancedStrings.equal("hello", "world");
// different = false

bool empty = AdvancedStrings.equal("", "");
// empty = true
```

**Implementation**:
1. Compares lengths first (gas optimization)
2. If lengths match, compares keccak256 hashes

**Use Cases**:
- String validation
- Command/action matching
- Input verification

### `bytesToString`
```solidity
function bytesToString(bytes memory data) internal pure returns (string memory)
```

**Description**: Converts bytes to hex string representation with `0x` prefix

**Parameters**:
- `data`: Bytes array to convert

**Returns**: Hex string in format `"0x..."` (2 + data.length * 2 characters)

**Example**:
```solidity
bytes memory data = hex"deadbeef";
string memory str = AdvancedStrings.bytesToString(data);
// str = "0xdeadbeef"

bytes memory empty = "";
string memory emptyStr = AdvancedStrings.bytesToString(empty);
// emptyStr = "0x"
```

**Format**:
- Starts with "0x"
- Each byte becomes 2 hex characters
- Lowercase hex representation

**Use Cases**:
- Converting signature bytes to readable format
- Logging transaction data
- Debugging byte arrays

### `bytes32ToString`
```solidity
function bytes32ToString(bytes32 data) internal pure returns (string memory)
```

**Description**: Converts bytes32 to hex string representation with `0x` prefix

**Parameters**:
- `data`: bytes32 value to convert

**Returns**: Hex string in format `"0x..."` (66 characters: 2 + 32 * 2)

**Example**:
```solidity
bytes32 hash = keccak256("hello");
string memory str = AdvancedStrings.bytes32ToString(hash);
// str = "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8"
```

**Format**:
- Always 66 characters (2 for "0x" + 64 for bytes32)
- Lowercase hex representation
- Zero-padded

**Use Cases**:
- Converting hash values to strings
- Logging bytes32 data
- Creating readable hash representations

## Common Use Cases

### Use Case 1: Constructing Signature Messages
```solidity
function buildSignatureMessage(
    uint256 evvmId,
    string memory action,
    uint256 param1,
    uint256 param2,
    uint256 nonce
) internal pure returns (string memory) {
    return string.concat(
        AdvancedStrings.uintToString(evvmId),
        ",",
        action,
        ",",
        AdvancedStrings.uintToString(param1),
        ",",
        AdvancedStrings.uintToString(param2),
        ",",
        AdvancedStrings.uintToString(nonce)
    );
}

// Example: "123,orderCoffee,2,1000000000000000000,456789"
string memory message = buildSignatureMessage(123, "orderCoffee", 2, 1 ether, 456789);
```

### Use Case 2: Address-Based Messages
```solidity
function createTransferMessage(
    address from,
    address to,
    uint256 amount
) internal pure returns (string memory) {
    return string.concat(
        "Transfer from ",
        AdvancedStrings.addressToString(from),
        " to ",
        AdvancedStrings.addressToString(to),
        " amount: ",
        AdvancedStrings.uintToString(amount)
    );
}

// Example: "Transfer from 0x742d...beb2 to 0x123a...def4 amount: 1000000000000000000"
```

### Use Case 3: String Comparison for Commands
```solidity
function executeCommand(string memory command, bytes memory data) external {
    if (AdvancedStrings.equal(command, "deposit")) {
        handleDeposit(data);
    } else if (AdvancedStrings.equal(command, "withdraw")) {
        handleWithdraw(data);
    } else if (AdvancedStrings.equal(command, "transfer")) {
        handleTransfer(data);
    } else {
        revert("Unknown command");
    }
}
```

### Use Case 4: Debugging and Logging
```solidity
event DebugInfo(string message);

function debugTransaction(
    address user,
    bytes32 txHash,
    uint256 amount,
    bytes memory signature
) internal {
    emit DebugInfo(
        string.concat(
            "User: ",
            AdvancedStrings.addressToString(user),
            " TxHash: ",
            AdvancedStrings.bytes32ToString(txHash),
            " Amount: ",
            AdvancedStrings.uintToString(amount),
            " Sig: ",
            AdvancedStrings.bytesToString(signature)
        )
    );
}
```

## Integration with EVVM

### Used by SignatureUtil
```solidity
library SignatureUtil {
    function verifySignature(
        uint256 evvmID,
        string memory functionName,
        string memory inputs,
        bytes memory signature,
        address expectedSigner
    ) internal pure returns (bool) {
        return SignatureRecover.recoverSigner(
            string.concat(
                AdvancedStrings.uintToString(evvmID), // Uses AdvancedStrings
                ",",
                functionName,
                ",",
                inputs
            ),
            signature
        ) == expectedSigner;
    }
}
```

### Used by EvvmService
```solidity
abstract contract EvvmService {
    function validateServiceSignature(
        string memory functionName,
        string memory inputs,
        bytes memory signature,
        address expectedSigner
    ) internal view virtual {
        if (!SignatureUtil.verifySignature(
            evvm.getEvvmID(), // Converted with AdvancedStrings internally
            functionName,
            inputs,
            signature,
            expectedSigner
        )) revert InvalidServiceSignature();
    }
}
```

## Gas Optimization Tips

### 1. Cache String Conversions
```solidity
// Good - convert once
string memory amountStr = AdvancedStrings.uintToString(amount);
string memory message1 = string.concat("Message1: ", amountStr);
string memory message2 = string.concat("Message2: ", amountStr);

// Bad - convert multiple times
string memory message1 = string.concat("Message1: ", AdvancedStrings.uintToString(amount));
string memory message2 = string.concat("Message2: ", AdvancedStrings.uintToString(amount));
```

### 2. Use Constants for Fixed Strings
```solidity
// Good - use string literals for fixed values
string memory token0 = getEtherAddress() == address(0) ? "ETH" : "TOKEN";

// Bad - unnecessary conversion
string memory token0 = AdvancedStrings.addressToString(address(0)); // "0x0000..."
```

### 3. Minimize String Concatenations
```solidity
// Good - single concat
string memory message = string.concat(
    AdvancedStrings.uintToString(a),
    ",",
    AdvancedStrings.uintToString(b),
    ",",
    AdvancedStrings.uintToString(c)
);

// Bad - multiple operations
string memory message = AdvancedStrings.uintToString(a);
message = string.concat(message, ",");
message = string.concat(message, AdvancedStrings.uintToString(b));
// ... more concats
```

## Gas Costs

| Function | Typical Gas Cost | Notes |
|----------|-----------------|-------|
| `uintToString` | ~500-2,000 | Depends on number size |
| `addressToString` | ~1,000 | Fixed cost |
| `equal` | ~200-500 | Depends on length |
| `bytesToString` | ~500-5,000 | Depends on data length |
| `bytes32ToString` | ~1,500 | Fixed cost |

## Best Practices

### 1. Use Type-Appropriate Functions
```solidity
// Good - use addressToString for addresses
string memory addrStr = AdvancedStrings.addressToString(userAddress);

// Bad - converting address to uint (loses information)
string memory wrongStr = AdvancedStrings.uintToString(uint256(uint160(userAddress)));
```

### 2. Pre-Compute Static Strings
```solidity
// Good - compute once in constructor or constant
string public constant ACTION_NAME = "orderCoffee";

function buildMessage(uint256 nonce) internal pure returns (string memory) {
    return string.concat(
        ACTION_NAME, // Use pre-defined
        ",",
        AdvancedStrings.uintToString(nonce)
    );
}

// Bad - re-create string each time
function buildMessage(uint256 nonce) internal pure returns (string memory) {
    return string.concat(
        "orderCoffee", // Creates new string each call
        ",",
        AdvancedStrings.uintToString(nonce)
    );
}
```

### 3. Validate Before Converting
```solidity
// Good - validate first
require(amount > 0, "Invalid amount");
string memory amountStr = AdvancedStrings.uintToString(amount);

// Bad - convert then validate (wastes gas on failure)
string memory amountStr = AdvancedStrings.uintToString(amount);
require(amount > 0, "Invalid amount");
```

## Common Patterns

### Pattern 1: EVVM Signature Message Format
```solidity
string memory message = string.concat(
    AdvancedStrings.uintToString(evvmID),
    ",",
    functionName,
    ",",
    params // Pre-formatted parameter string
);
```

### Pattern 2: Transaction Receipt String
```solidity
string memory receipt = string.concat(
    "From: ", AdvancedStrings.addressToString(from),
    " To: ", AdvancedStrings.addressToString(to),
    " Amount: ", AdvancedStrings.uintToString(amount),
    " TxHash: ", AdvancedStrings.bytes32ToString(txHash)
);
```

### Pattern 3: Parameter String Builder
```solidity
function buildParams(
    string memory param1,
    uint256 param2,
    address param3
) internal pure returns (string memory) {
    return string.concat(
        param1,
        ",",
        AdvancedStrings.uintToString(param2),
        ",",
        AdvancedStrings.addressToString(param3)
    );
}
```

---

## See Also

- **[SignatureUtil](./02-SignatureUtil.md)** - Uses AdvancedStrings for message construction
- **[EvvmService](../02-EvvmService.md)** - Relies on signature message formatting
- **[Math Library](../03-Primitives/01-Math.md)** - Used internally for log10 calculation

---

## SignatureUtil Library


The `SignatureUtil` library provides high-level signature verification specifically designed for EVVM message formats. It combines `SignatureRecover` and `AdvancedStrings` to offer a simple, one-function verification solution.

## Overview

**Library Type**: Pure functions  
**License**: EVVM-NONCOMMERCIAL-1.0  
**Import Path**: `@evvm/testnet-contracts/library/utils/SignatureUtil.sol`

### Key Features

- **One-function verification** for EVVM messages
- **Automatic message formatting** with EVVM ID
- **Built-in EIP-191 compliance** via SignatureRecover
- **Type-safe** parameter handling

## Function

### `verifySignature`
```solidity
function verifySignature(
    uint256 evvmID,
    string memory functionName,
    string memory inputs,
    bytes memory signature,
    address expectedSigner
) internal pure returns (bool)
```

**Description**: Verifies that a signature matches the EVVM message format and was signed by the expected address

**Parameters**:
- `evvmID`: The EVVM blockchain ID (from `IEvvm.getEvvmID()`)
- `functionName`: Name of the function being called (e.g., "orderCoffee")
- `inputs`: Comma-separated parameter string (e.g., "latte,2,1000000000000000,12345")
- `signature`: 65-byte ECDSA signature
- `expectedSigner`: Address that should have signed the message

**Returns**: `true` if signature is valid and from expected signer, `false` otherwise

**Message Format**: `"<evvmID>,<functionName>,<inputs>"`

**Example**:
```solidity
// Verify a coffee order signature
bool isValid = SignatureUtil.verifySignature(
    123,                    // evvmID
    "orderCoffee",         // function name
    "latte,2,1000000000000000,12345",  // inputs (coffee type, quantity, price, nonce)
    userSignature,         // signature bytes
    customerAddress        // expected signer
);

if (isValid) {
    // Process order
} else {
    revert("Invalid signature");
}
```

## Message Construction

### Standard EVVM Format
```
"<evvmID>,<functionName>,<inputs>"
```

**Components**:
1. **evvmID**: Unique identifier for the EVVM blockchain instance
2. **functionName**: Action being performed
3. **inputs**: Function-specific parameters (comma-separated)

### Examples

#### Example 1: Coffee Order
```solidity
// Message: "123,orderCoffee,latte,2,1000000000000000,12345"
bool valid = SignatureUtil.verifySignature(
    123,                                    // evvmID
    "orderCoffee",                         // function
    "latte,2,1000000000000000,12345",     // coffee type, quantity, price, nonce
    signature,
    customer
);
```

#### Example 2: Token Transfer
```solidity
// Message: "123,transfer,0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2,500,67890"
bool valid = SignatureUtil.verifySignature(
    123,                                                      // evvmID
    "transfer",                                              // function
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2,500,67890", // to, amount, nonce
    signature,
    sender
);
```

#### Example 3: Username Registration
```solidity
// Message: "123,registerUsername,alice,100"
bool valid = SignatureUtil.verifySignature(
    123,                        // evvmID
    "registerUsername",        // function
    "alice,100",               // username, nonce
    signature,
    userAddress
);
```

## Implementation Details

### Internal Process
```solidity
function verifySignature(...) internal pure returns (bool) {
    // 1. Convert evvmID to string
    string memory evvmIdStr = AdvancedStrings.uintToString(evvmID);
    
    // 2. Construct full message
    string memory fullMessage = string.concat(
        evvmIdStr,
        ",",
        functionName,
        ",",
        inputs
    );
    
    // 3. Recover signer from signature
    address recovered = SignatureRecover.recoverSigner(
        fullMessage,
        signature
    );
    
    // 4. Compare with expected signer
    return recovered == expectedSigner;
}
```

### Dependencies
- **AdvancedStrings**: For evvmID uint to string conversion
- **SignatureRecover**: For EIP-191 signature recovery

## Common Use Cases

### Use Case 1: Service Action Verification
```solidity
contract CoffeeShop {
    IEvvm evvm;
    
    function orderCoffee(
        address customer,
        string memory coffeeType,
        uint256 quantity,
        uint256 price,
        uint256 nonce,
        bytes memory signature
    ) external {
        // Verify customer signed this order
        bool validSignature = SignatureUtil.verifySignature(
            evvm.getEvvmID(),
            "orderCoffee",
            string.concat(
                coffeeType,
                ",",
                AdvancedStrings.uintToString(quantity),
                ",",
                AdvancedStrings.uintToString(price),
                ",",
                AdvancedStrings.uintToString(nonce)
            ),
            signature,
            customer
        );
        
        require(validSignature, "Invalid customer signature");
        
        // Process order...
    }
}
```

### Use Case 2: Multi-Sig Verification
```solidity
function verifyMultipleSignatures(
    uint256 evvmID,
    string memory action,
    string memory params,
    bytes[] memory signatures,
    address[] memory signers
) internal pure returns (bool) {
    require(signatures.length == signers.length, "Length mismatch");
    
    for (uint256 i = 0; i < signatures.length; i++) {
        if (!SignatureUtil.verifySignature(
            evvmID,
            action,
            params,
            signatures[i],
            signers[i]
        )) {
            return false;
        }
    }
    return true;
}
```

### Use Case 3: Conditional Verification
```solidity
function processAction(
    address actor,
    string memory action,
    string memory params,
    bytes memory signature
) external {
    uint256 evvmID = evvm.getEvvmID();
    
    // Verify signature if not from trusted executor
    if (msg.sender != trustedExecutor) {
        require(
            SignatureUtil.verifySignature(
                evvmID,
                action,
                params,
                signature,
                actor
            ),
            "Invalid signature"
        );
    }
    
    // Execute action...
}
```

### Use Case 4: Batch Verification Optimization
```solidity
function verifyBatch(
    uint256 evvmID,
    string memory functionName,
    string[] memory inputsList,
    bytes[] memory signatures,
    address[] memory signers
) internal pure returns (bool[] memory) {
    bool[] memory results = new bool[](signatures.length);
    
    for (uint256 i = 0; i < signatures.length; i++) {
        results[i] = SignatureUtil.verifySignature(
            evvmID,
            functionName,
            inputsList[i],
            signatures[i],
            signers[i]
        );
    }
    
    return results;
}
```

## Frontend Integration

### JavaScript/TypeScript Example
```typescript

// Build EVVM message
function buildEvvmMessage(
    evvmId: number,
    functionName: string,
    inputs: string
): string {
    return `${evvmId},${functionName},${inputs}`;
}

// Sign message
async function signEvvmMessage(
    signer: ethers.Signer,
    evvmId: number,
    functionName: string,
    inputs: string
): Promise<string> {
    const message = buildEvvmMessage(evvmId, functionName, inputs);
    return await signer.signMessage(message);
}

// Example usage
const signature = await signEvvmMessage(
    wallet,
    123,                                   // evvmID
    "orderCoffee",                        // function
    "latte,2,1000000000000000,12345"     // inputs
);

// Now call smart contract with signature
await contract.orderCoffee(
    customerAddress,
    "latte",
    2,
    "1000000000000000",
    12345,
    signature
);
```

### React Hook Example
```typescript

function useEvvmSignature() {
    const { signMessageAsync } = useSignMessage();
    
    async function signEvvmAction(
        evvmId: number,
        functionName: string,
        params: Record<string, any>
    ): Promise<string> {
        // Convert params to comma-separated string
        const inputs = Object.values(params).join(',');
        
        // Build message
        const message = `${evvmId},${functionName},${inputs}`;
        
        // Sign
        return await signMessageAsync({ message });
    }
    
    return { signEvvmAction };
}

// Usage in component
const { signEvvmAction } = useEvvmSignature();

const signature = await signEvvmAction(
    123,
    "orderCoffee",
    {
        coffeeType: "latte",
        quantity: 2,
        price: "1000000000000000",
        nonce: 12345
    }
);
```

## Security Considerations

### 1. Always Include EVVM ID
**Why**: Prevents signature reuse across different EVVM deployments

```solidity
// Good - includes evvmID
bool valid = SignatureUtil.verifySignature(
    evvm.getEvvmID(), // Unique per deployment
    "action",
    params,
    sig,
    user
);

// Bad - missing evvmID (signatures work across deployments!)
// Don't construct messages without evvmID
```

### 2. Include Nonce in Inputs
**Why**: Prevents replay attacks

```solidity
// Good - nonce in inputs
string memory inputs = string.concat(
    "latte,2,",
    AdvancedStrings.uintToString(price),
    ",",
    AdvancedStrings.uintToString(nonce) // Include nonce
);

// Bad - no nonce (signature can be replayed!)
string memory inputs = string.concat("latte,2,", AdvancedStrings.uintToString(price));
```

### 3. Validate Function Name
**Why**: Prevents signature reuse across different functions

```solidity
// Good - specific function name
bool valid = SignatureUtil.verifySignature(
    evvmID,
    "orderCoffee", // Specific action
    inputs,
    sig,
    user
);

// Bad - generic function name (allows cross-function reuse)
bool valid = SignatureUtil.verifySignature(
    evvmID,
    "action", // Too generic
    inputs,
    sig,
    user
);
```

### 4. Check Return Value
**Why**: Signature might be invalid

```solidity
// Good - check result
bool valid = SignatureUtil.verifySignature(...);
require(valid, "Invalid signature");

// Bad - ignore result (allows invalid signatures!)
SignatureUtil.verifySignature(...); // Return value ignored
// Continue execution...
```

## Gas Optimization

### Strategy 1: Cache evvmID
```solidity
// Good - read once
uint256 evvmID = evvm.getEvvmID();

bool valid1 = SignatureUtil.verifySignature(evvmID, "action1", params1, sig1, user1);
bool valid2 = SignatureUtil.verifySignature(evvmID, "action2", params2, sig2, user2);

// Bad - read multiple times
bool valid1 = SignatureUtil.verifySignature(evvm.getEvvmID(), "action1", params1, sig1, user1);
bool valid2 = SignatureUtil.verifySignature(evvm.getEvvmID(), "action2", params2, sig2, user2);
```

### Strategy 2: Pre-Build Input Strings
```solidity
// Good - build once
string memory inputs = buildInputString(params);
bool valid = SignatureUtil.verifySignature(evvmID, "action", inputs, sig, user);

// Bad - inline building (if used multiple times)
bool valid = SignatureUtil.verifySignature(
    evvmID,
    "action",
    string.concat(...), // Expensive
    sig,
    user
);
```

### Strategy 3: Early Validation
```solidity
// Good - verify signature first (fails fast)
require(SignatureUtil.verifySignature(...), "Invalid signature");
// Expensive operations here...

// Bad - expensive operations before verification
// Expensive operations here...
require(SignatureUtil.verifySignature(...), "Invalid signature");
```

## Gas Costs

| Operation | Approximate Gas | Notes |
|-----------|----------------|-------|
| `verifySignature` | ~5,000-7,000 | Includes string concat + ecrecover |
| evvmID conversion | ~500-1,000 | Depends on number size |
| Message concat | ~500-2,000 | Depends on input length |
| Signature recovery | ~3,000 | EIP-191 + ecrecover |

## Best Practices

### 1. Use Consistent Input Formatting
```solidity
// Good - consistent comma-separated format
string memory inputs = string.concat(
    param1String,
    ",",
    AdvancedStrings.uintToString(param2),
    ",",
    AdvancedStrings.uintToString(param3)
);

// Bad - inconsistent formatting
string memory inputs = string.concat(param1String, "-", param2String, "_", param3String);
```

### 2. Document Message Format
```solidity
/**
 * @notice Orders coffee with customer signature
 * @dev Message format: "<evvmID>,orderCoffee,<coffeeType>,<quantity>,<price>,<nonce>"
 * @param signature Customer's EIP-191 signature of the message
 */
function orderCoffee(..., bytes memory signature) external {
    // ...
}
```

### 3. Create Helper Functions
```solidity
function buildOrderInputs(
    string memory coffeeType,
    uint256 quantity,
    uint256 price,
    uint256 nonce
) internal pure returns (string memory) {
    return string.concat(
        coffeeType,
        ",",
        AdvancedStrings.uintToString(quantity),
        ",",
        AdvancedStrings.uintToString(price),
        ",",
        AdvancedStrings.uintToString(nonce)
    );
}

function verifyOrderSignature(
    address customer,
    string memory inputs,
    bytes memory signature
) internal view returns (bool) {
    return SignatureUtil.verifySignature(
        evvm.getEvvmID(),
        "orderCoffee",
        inputs,
        signature,
        customer
    );
}
```

---

## See Also

- **[SignatureRecover](../03-Primitives/02-SignatureRecover.md)** - Underlying signature recovery
- **[AdvancedStrings](./01-AdvancedStrings.md)** - String conversion utilities
- **[EvvmService](../02-EvvmService.md)** - Uses SignatureUtil for service verification
- **[Core.sol Nonce Management](../../../04-Contracts/01-EVVM/03-SignatureAndNonceManagement.md)** - Centralized nonce tracking

---

## CoreExecution


`CoreExecution` is an abstract contract that provides a convenient interface for services to process payments through Core.sol. It handles both user-initiated payments (via signatures) and contract-authorized payments.

## Overview

**Contract Type**: Abstract Contract
**License**: EVVM-NONCOMMERCIAL-1.0
**Import Path**: `@evvm/testnet-contracts/library/utils/service/CoreExecution.sol`

### Key Features

- Direct integration with Core.sol for payment processing
- Support for both signed and contract-authorized payments
- Batch payment capabilities
- Governance-controlled Core.sol address updates

## State Variables

```solidity
Core public core;
```

Reference to the EVVM Core.sol contract for balance operations.

## Functions

### requestPay

```solidity
function requestPay(
    address from,
    address token,
    uint256 amount,
    uint256 priorityFee,
    uint256 nonce,
    bool isAsyncExec,
    bytes memory signature
) internal
```

Requests payment from a user via Core.sol with signature validation.

**Parameters**:
- `from` - User address making the payment
- `token` - Token address (or `address(0)` for native token)
- `amount` - Payment amount
- `priorityFee` - Optional MATE priority fee
- `nonce` - User's nonce for Core.sol
- `isAsyncExec` - Whether to use async (`true`) or sync (`false`) nonce system
- `signature` - User's EIP-191 signature authorizing the payment

**Implementation**: Calls `core.pay(from, address(this), "", token, amount, priorityFee, address(this), nonce, isAsyncExec, signature)`

**Executor**: Always `address(this)` (the service contract itself)

**Usage**: Call this from your service function when a user needs to pay.

### makeCaPay

```solidity
function makeCaPay(
    address to,
    address token,
    uint256 amount
) internal
```

Sends tokens from service's balance to recipient via contract authorization (no signature required).

**Parameters**:
- `to` - Recipient address
- `token` - Token address (or `address(0)` for native token)
- `amount` - Amount to send

**Usage**: Use this when your service needs to pay users from its own balance (e.g., rewards, refunds).

### makeCaBatchPay

```solidity
function makeCaBatchPay(
    address[] memory to,
    address token,
    uint256[] memory amounts
) internal
```

Sends tokens to multiple recipients via contract authorization (batch version).

**Parameters**:
- `to` - Array of recipient addresses
- `token` - Token address (or `address(0)` for native token)
- `amounts` - Array of amounts corresponding to each recipient

**Usage**: Efficient way to distribute payments to multiple users in a single transaction.

### updateCoreAddress (Admin only)

```solidity
function updateCoreAddress(address newCoreAddress) external virtual
```

Updates the Core.sol contract address. **Must be overridden** with proper access control (e.g., `onlyAdmin` modifier).

**Parameters**:
- `newCoreAddress` - New Core.sol contract address

**Security**: Always restrict this function to admin-only access in your implementation.

## Usage Example

```solidity

contract CoffeeShop is CoreExecution, Admin {
    uint256 public constant COFFEE_PRICE = 0.001 ether;
    
    constructor(address coreAddress, address initialAdmin) 
        CoreExecution(coreAddress)
        Admin(initialAdmin) 
    {}
    
    function buyCoffee(
        address buyer,
        uint256 priorityFee,
        uint256 nonce,
        bool isAsyncExec,
        bytes memory signature
    ) external {
        // Request payment from buyer
        requestPay(
            buyer,
            address(0), // ETH payment
            COFFEE_PRICE,
            priorityFee,
            nonce,
            isAsyncExec,
            signature
        );
        
        // Process coffee order...
    }
    
    function refundCustomer(address customer, uint256 amount) external onlyAdmin {
        // Send refund from service balance
        makeCaPay(customer, address(0), amount);
    }
    
    function distributeRewards(
        address[] memory winners,
        uint256[] memory amounts
    ) external onlyAdmin {
        // Batch payment to multiple users
        makeCaBatchPay(winners, address(0), amounts);
    }
    
    // Override with admin protection
    function updateCoreAddress(address newCoreAddress) external override onlyAdmin {
        core = Core(newCoreAddress);
    }
}
```

## Integration with EvvmService

`EvvmService` internally inherits from `CoreExecution`, providing these payment functions automatically:

```solidity

contract MyService is EvvmService {
    // Inherits requestPay, makeCaPay, makeCaBatchPay automatically
}
```

## Payment Flow

### User-to-Service Payment (requestPay)

1. User signs payment authorization with Core.sol nonce
2. Service calls `requestPay()` with signature
3. Core.sol validates signature and nonce
4. Core.sol transfers tokens from user to service
5. Nonce is marked as consumed

### Service-to-User Payment (makeCaPay)

1. Service calls `makeCaPay()` (no signature needed)
2. Core.sol transfers from service balance to user
3. Uses contract address authorization (msg.sender)

## Security Considerations

1. **Nonce Management**: Always use correct nonce from `core.getNonce(user, serviceAddress)`
2. **Signature Validation**: Core.sol validates signatures - don't bypass this
3. **Origin Executor**: Set `originExecutor` to actual EOA calling the transaction
4. **Balance Checks**: Ensure service has sufficient balance before `makeCaPay()`
5. **Admin Protection**: Always override `updateCoreAddress()` with access control

## Related Components

- **[Core.sol](../../../../04-Contracts/01-EVVM/01-Overview.md)** - Main payment contract
- **[EvvmService](../../02-EvvmService.md)** - Includes CoreExecution functionality
- **[SignatureUtil](../02-SignatureUtil.md)** - For manual signature verification
- **[CoreHashUtils](../05-CoreHashUtils.md)** - For generating payment hashes

---

**Recommendation**: Use `CoreExecution` when building services that need Core.sol payment integration without the full `EvvmService` stack.

---

## StakingServiceUtils


The `StakingServiceUtils` abstract contract provides simplified helpers for service staking operations. It wraps the multi-step staking process into single-function calls, making it easier for services to stake and earn rewards.

## Overview

**Contract Type**: Abstract contract  
**License**: EVVM-NONCOMMERCIAL-1.0  
**Import Path**: `@evvm/testnet-contracts/library/utils/service/StakingServiceUtils.sol`

### Key Features

- **One-call staking** - stake in single transaction
- **One-call unstaking** - unstake with single function
- **Address management** for upgrades
- **Automatic EVVM integration** via staking contract

## Contract Structure

```solidity
abstract contract StakingServiceUtils {
    IStaking internal staking;

    constructor(address stakingAddress) {
        staking = IStaking(stakingAddress);
    }
    
    // Staking functions
    // Address management
}
```

## State Variables

### `staking`
```solidity
IStaking internal staking;
```

**Description**: Internal interface to the Staking contract

**Visibility**: Internal

**Initialized**: In constructor

## Functions

### `_makeStakeService`
```solidity
function _makeStakeService(uint256 amountToStake) internal
```

**Description**: Stakes tokens for the service in a single transaction

**Parameters**:
- `amountToStake`: Number of stake units to purchase

**Process** (Automated):
1. Calls `prepareServiceStaking(amountToStake)` on Staking contract
2. Transfers `priceOfStaking * amountToStake` MATE tokens to Staking contract via EVVM
3. Calls `confirmServiceStaking()` to finalize stake

**Requirements**:
- Service must have sufficient MATE token balance in EVVM
- Service must not have pending staking operations
- `amountToStake` must be greater than 0

**Effects**:
- Service becomes (or increases position as) a staker
- Service can earn automatic rewards on payment processing
- MATE tokens locked in staking contract

**Example**:
```solidity
contract MyService is StakingServiceUtils {
    address public owner;
    
    constructor(address _stakingAddress) 
        StakingServiceUtils(_stakingAddress) 
    {}
    
    function stake(uint256 amount) external {
        require(msg.sender == owner, "Not owner");
        _makeStakeService(amount);
    }
}
```

**Gas Cost**: ~100,000-150,000 (includes prepareServiceStaking + caPay + confirmServiceStaking)

### `_makeUnstakeService`
```solidity
function _makeUnstakeService(uint256 amountToUnstake) internal
```

**Description**: Unstakes tokens from the service staking position

**Parameters**:
- `amountToUnstake`: Number of stake units to release

**Process** (Automated):
1. Calls `serviceUnstaking(amountToUnstake)` on Staking contract
2. Staking contract releases MATE tokens back to service's EVVM balance

**Requirements**:
- Service must have staked tokens
- `amountToUnstake` must be ≤ current stake amount
- Unstaking may have cooldown periods (see Staking contract)

**Effects**:
- Reduces or removes service staker status
- MATE tokens returned to service's EVVM balance
- Service stops earning automatic rewards if fully unstaked

**Example**:
```solidity
function unstake(uint256 amount) external {
    require(msg.sender == owner, "Not owner");
    _makeUnstakeService(amount);
}
```

**Gas Cost**: ~50,000-80,000

### `_changeStakingAddress`
```solidity
function _changeStakingAddress(address newStakingAddress) internal virtual
```

**Description**: Updates the Staking contract address

**Parameters**:
- `newStakingAddress`: New Staking contract address

**Process**:
1. Updates `staking` interface to new address

**Use Case**: When Staking contract is upgraded via proxy

**Example**:
```solidity
function updateStakingAddress(address newAddr) external {
    require(msg.sender == owner, "Not owner");
    _changeStakingAddress(newAddr);
}
```

## Usage Patterns

### Pattern 1: Basic Service Staking
```solidity
contract CoffeeShop is StakingServiceUtils {
    address public owner;
    
    constructor(address stakingAddress, address _owner) 
        StakingServiceUtils(stakingAddress) 
    {
        owner = _owner;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Owner can stake to earn rewards
    function stakeShop(uint256 amount) external onlyOwner {
        _makeStakeService(amount);
    }
    
    // Owner can unstake to withdraw
    function unstakeShop(uint256 amount) external onlyOwner {
        _makeUnstakeService(amount);
    }
}
```

### Pattern 2: Gradual Staking
```solidity
contract GradualStaker is StakingServiceUtils {
    uint256 public currentStake;
    uint256 public targetStake;
    
    function increaseStake(uint256 additionalAmount) external {
        _makeStakeService(additionalAmount);
        currentStake += additionalAmount;
    }
    
    function reachTarget() external {
        require(currentStake < targetStake, "Already at target");
        uint256 toStake = targetStake - currentStake;
        _makeStakeService(toStake);
        currentStake = targetStake;
    }
}
```

### Pattern 3: Automatic Restaking
```solidity
contract AutoRestaker is StakingServiceUtils {
    uint256 public autoRestakeThreshold;
    
    function checkAndRestake() external {
        // Get current MATE balance
        uint256 balance = ICore(staking.getCoreAddress()).getBalance(
            address(this),
            ICore(staking.getCoreAddress()).getPrincipalTokenAddress()
        );
        
        if (balance >= autoRestakeThreshold) {
            uint256 stakeUnits = balance / getStakePrice();
            if (stakeUnits > 0) {
                _makeStakeService(stakeUnits);
            }
        }
    }
    
    function getStakePrice() internal view returns (uint256) {
        return staking.priceOfStaking();
    }
}
```

### Pattern 4: Emergency Unstake
```solidity
contract ServiceWithEmergency is StakingServiceUtils {
    address public owner;
    bool public emergencyMode;
    
    function emergencyUnstake() external {
        require(msg.sender == owner, "Not owner");
        require(emergencyMode, "Not in emergency mode");
        
        // Unstake all
        uint256 currentStake = getCurrentStake();
        if (currentStake > 0) {
            _makeUnstakeService(currentStake);
        }
    }
    
    function getCurrentStake() internal view returns (uint256) {
        return staking.getUserAmountStaked(address(this));
    }
}
```

## Integration with EvvmService

`EvvmService` includes equivalent functionality:

### StakingServiceUtils
```solidity
abstract contract StakingServiceUtils {
    function _makeStakeService(uint256 amount) internal { }
    function _makeUnstakeService(uint256 amount) internal { }
}
```

### EvvmService (More Complete)
```solidity
abstract contract EvvmService is AsyncNonce {
    IEvvm evvm;
    IStaking staking;
    
    function _makeStakeService(uint256 amount) internal { }
    function _makeUnstakeService(uint256 amount) internal { }
    
    // Plus: payment helpers, signature validation, nonce management
}
```

**Recommendation**: Use `EvvmService` for complete services, `StakingServiceUtils` for staking-only utilities

## Manual Staking Process (For Reference)

If you want to implement staking manually without this utility:

```solidity
// Step 1: Prepare staking
IStaking(stakingAddress).prepareServiceStaking(amountToStake);

// Step 2: Transfer MATE tokens
uint256 cost = IStaking(stakingAddress).priceOfStaking() * amountToStake;
ICore(staking.getCoreAddress()).caPay(
    address(stakingAddress),
    ICore(staking.getCoreAddress()).getPrincipalTokenAddress(),
    cost
);

// Step 3: Confirm staking
IStaking(stakingAddress).confirmServiceStaking();
```

**StakingServiceUtils simplifies this to**:
```solidity
_makeStakeService(amountToStake);
```

## Security Considerations

### 1. Protect Staking Functions
```solidity
// Good - access control
address public owner;

function stake(uint256 amount) external {
    require(msg.sender == owner, "Not owner");
    _makeStakeService(amount);
}

// Bad - anyone can stake (drains your MATE!)
function stake(uint256 amount) external {
    _makeStakeService(amount);
}
```

### 2. Check Balance Before Staking
```solidity
// Good - verify sufficient balance
uint256 mateBalance = IEvvm(evvmHookAddress).getBalance(
    address(this),
    address(1)
);
uint256 cost = getStakeCost(amount);
require(mateBalance >= cost, "Insufficient MATE");
_makeStakeService(amount);

// Bad - stake without checking (reverts, wastes gas)
_makeStakeService(amount);
```

### 3. Validate Unstake Amount
```solidity
// Good - check current stake
uint256 currentStake = IStaking(stakingHookAddress).getUserAmountStaked(address(this));
require(amount <= currentStake, "Insufficient stake");
_makeUnstakeService(amount);

// Bad - unstake without checking (reverts)
_makeUnstakeService(amount);
```

### 4. Protect Address Updates
```solidity
// Good - only owner can update
function updateStakingAddress(address newAddr) external {
    require(msg.sender == owner, "Not owner");
    require(newAddr != address(0), "Invalid address");
    _changeStakingAddress(newAddr);
}

// Bad - no protection
function updateStakingAddress(address newAddr) external {
    _changeStakingAddress(newAddr);
}
```

## Gas Optimization

### Tip 1: Batch Stake Operations
```solidity
// Good - stake once with total
uint256 totalToStake = calculateTotalStake();
_makeStakeService(totalToStake);

// Bad - multiple small stakes
_makeStakeService(10);
_makeStakeService(20);
_makeStakeService(30);
// Each call costs ~100k gas vs single 100k call
```

### Tip 2: Cache Addresses
```solidity
// Good - use state variable
function getStakePrice() internal view returns (uint256) {
    return IStaking(stakingHookAddress).priceOfStaking();
}

// Acceptable but redundant - requery address
function getStakePrice() internal view returns (uint256) {
    address core = IStaking(stakingHookAddress).getCoreAddress();
    return IStaking(stakingHookAddress).priceOfStaking();
}
```

### Tip 3: Unstake Strategically
```solidity
// Good - unstake all at once if leaving
uint256 allStake = IStaking(stakingHookAddress).getUserAmountStaked(address(this));
_makeUnstakeService(allStake);

// Bad - unstake in small increments unnecessarily
for (uint256 i = 0; i < 10; i++) {
    _makeUnstakeService(1);
}
```

## Common Patterns

### With Events
```solidity
event Staked(uint256 amount, uint256 totalStake);
event Unstaked(uint256 amount, uint256 remainingStake);

function stake(uint256 amount) external onlyOwner {
    _makeStakeService(amount);
    
    uint256 total = IStaking(stakingHookAddress).getUserAmountStaked(address(this));
    emit Staked(amount, total);
}

function unstake(uint256 amount) external onlyOwner {
    _makeUnstakeService(amount);
    
    uint256 remaining = IStaking(stakingHookAddress).getUserAmountStaked(address(this));
    emit Unstaked(amount, remaining);
}
```

### With Rewards Tracking
```solidity
uint256 public totalRewardsEarned;

function claimRewards() external {
    uint256 rewardBalance = IEvvm(evvmHookAddress).getBalance(
        address(this),
        address(1)
    );
    
    totalRewardsEarned += rewardBalance;
    
    // Transfer to owner or restake
    IEvvm(evvmHookAddress).caPay(owner, address(1), rewardBalance);
}
```

## Error Handling

Common errors when staking:

### "Insufficient MATE balance"
**Cause**: Service doesn't have enough MATE tokens  
**Solution**: Ensure service earns or receives MATE before staking

### "Pending staking operation"
**Cause**: Previous `prepareServiceStaking` not confirmed  
**Solution**: Call `confirmServiceStaking()` or wait for operation to clear

### "Insufficient stake"
**Cause**: Trying to unstake more than staked amount  
**Solution**: Check `getUserAmountStaked()` before unstaking

## Best Practices

### 1. Check Staking Status
```solidity
function getStakingInfo() external view returns (
    uint256 currentStake,
    uint256 stakingCost,
    bool isStaker
) {
    currentStake = IStaking(stakingHookAddress).getUserAmountStaked(address(this));
```

### 2. Implement Minimum Stake
```solidity
uint256 public constant MINIMUM_STAKE = 10; // 10 stake units

function stake(uint256 amount) external onlyOwner {
    require(amount >= MINIMUM_STAKE, "Below minimum");
    _makeStakeService(amount);
}
```

### 3. Create View Functions
```solidity
function canStake(uint256 amount) external view returns (bool) {
    uint256 cost = IStaking(stakingHookAddress).priceOfStaking() * amount;
    uint256 balance = IEvvm(evvmHookAddress).getBalance(
        address(this),
        address(1)
    );
    return balance >= cost;
}

function canUnstake(uint256 amount) external view returns (bool) {
    uint256 current = IStaking(stakingHookAddress).getUserAmountStaked(address(this));
    return current >= amount;
}
```

---

## See Also

- **[Staking Overview](../../../../04-Contracts/03-Staking/01-Overview.md)** - Complete staking system documentation
- **[EvvmService](../../02-EvvmService.md)** - Includes staking utilities plus more
- **[Service Staking Functions](../../../../04-Contracts/03-Staking/02-StakingContract/01-StakingFunctions/04-serviceStaking/01-Introduction.md)** - Underlying staking contract functions

---

## Governance (Admin & ProposalStructs)

# Governance Libraries

The governance libraries provide reusable primitives for time-delayed governance and safe admin handover. The package surface is intentionally minimal and focuses on the common pattern of proposing a new value, waiting a configured delay, and then accepting the proposal.

## Overview

**Contract Types**: Abstract contract (Admin) and Struct library (ProposalStructs)
**License**: EVVM-NONCOMMERCIAL-1.0
**Import Paths**: 
- `@evvm/testnet-contracts/library/utils/governance/Admin.sol`
- `@evvm/testnet-contracts/library/utils/governance/ProposalStructs.sol`

### Key Features

- Time-delayed proposals for addresses and uint values
- Simple boolean-flag proposals with delay
- Built-in events to track proposals and acceptances
- Small, audit-friendly surface

## ProposalStructs

`ProposalStructs` exposes simple structs used by governance-enabled contracts:

```solidity
struct AddressTypeProposal {
    address current;
    address proposal;
    uint256 timeToAccept;
}

struct UintTypeProposal {
    uint256 current;
    uint256 proposal;
    uint256 timeToAccept;
}

struct BoolTypeProposal {
    bool flag;
    uint256 timeToAcceptChange;
}
```

They are designed to store the current value, the proposed new value and the earliest timestamp when the proposal can be accepted.

## Admin Contract

`Admin` is an abstract contract that uses the `AddressTypeProposal` pattern to manage admin handovers with a time delay.

### Events

- `event AdminProposed(address indexed newAdmin, uint256 timeToAccept);`
- `event AdminAccepted(address indexed newAdmin);`

### Errors

- `error SenderIsNotAdmin();` — thrown when a non-admin attempts to perform admin-only actions
- `error ProposalNotReady();` — thrown when attempting to accept a proposal before `timeToAccept`

### Functions

#### proposeAdmin
```solidity
function proposeAdmin(address newAdmin, uint256 delay) external onlyAdmin
```
Proposes a new admin; sets `admin.proposal` and `admin.timeToAccept = block.timestamp + delay`, emits `AdminProposed`

#### acceptAdmin
```solidity
function acceptAdmin() external
```
Accepts the pending proposal; requires caller to be the proposed admin and `block.timestamp >= admin.timeToAccept`; sets `admin.current = admin.proposal` and clears the proposal fields; emits `AdminAccepted`

### Modifier

- `onlyAdmin()` — restricts execution to the currently active admin address

## Usage Example

```solidity

contract MyService is Admin {
    constructor(address initialAdmin) Admin(initialAdmin) {}

    function proposeNewAdmin(address candidate, uint256 delay) external onlyAdmin {
        proposeAdmin(candidate, delay);
    }

    function acceptNewAdmin() external {
        acceptAdmin();
    }
    
    // Other admin-controlled functions
    function updateServiceParameter(uint256 value) external onlyAdmin {
        // Only current admin can call this
    }
}
```

## Usage in EVVM Contracts

Many EVVM contracts use the `Admin` base contract for governance:

- **TreasuryHostChainStation**: Uses `Admin` for admin management
- **TreasuryExternalChainStation**: Uses `Admin` for admin management
- **NameService**: Uses `Admin` patterns
- **Staking**: Uses `Admin` for governance
- **P2PSwap**: Uses `Admin` patterns

**Typical Pattern**:
```solidity
contract EVVMContract is Admin {
    ProposalStructs.AddressTypeProposal public someAddress;
    
    function proposeSomeAddress(address newAddress, uint256 delay) external onlyAdmin {
        someAddress.proposal = newAddress;
        someAddress.timeToAccept = block.timestamp + delay;
    }
    
    function acceptSomeAddress() external onlyAdmin {
        require(block.timestamp >= someAddress.timeToAccept, "Too early");
        someAddress.current = someAddress.proposal;
        someAddress.proposal = address(0);
        someAddress.timeToAccept = 0;
    }
}
```

## Best Practices

1. **Delay Duration**: Use 1 day (86400 seconds) minimum for production contracts
2. **Proposal Validation**: Check `newAdmin != address(0)` and `newAdmin != admin.current`
3. **Event Monitoring**: Listen for `AdminProposed` and `AdminAccepted` events
4. **Multi-sig Recommended**: Use multi-sig wallets for admin addresses

---

**Recommendation**: Inherit from `Admin` for any contract requiring admin governance with time-delayed changes.

**Note**: `delay` should be chosen according to governance risk model. For development and testing, short delays (minutes) are convenient. For production deployments consider multi-day delays.

## Best Practices

- Require `onlyAdmin` for functions that change critical configuration
- Use events to record proposal and acceptance timestamps for off-chain monitoring
- Keep proposals minimal (one field at a time) to simplify reasoning and audits

## Tests

Add unit tests that:
- Verify `proposeAdmin()` sets the proposal and emits `AdminProposed`
- Verify `acceptAdminProposal()` reverts before `timeToAccept` and succeeds after
- Verify `onlyAdmin` prevents unauthorized callers

## See Also

- **EvvmService** — services typically protect admin functions using `AdminControlled` or similar patterns
- **Governance processes** — consider adding documentation of expected delay values for testnets vs production

---

## CoreHashUtils Library


The `CoreHashUtils` library provides standardized hash generation for Core.sol payment operations. These hashes are used as the `hashPayload` parameter in the centralized signature verification system.

## Overview

**Package**: `@evvm/testnet-contracts`  
**Import Path**: `@evvm/testnet-contracts/library/utils/signature/CoreHashUtils.sol`  
**Solidity Version**: `^0.8.0`

**Purpose**: Generate deterministic `hashPayload` values for Core.sol operations that are used in EIP-191 signature construction.

## Signature Architecture

EVVM signatures follow a two-layer hashing pattern:

1. **Service-Specific Hash** (this library): `keccak256(abi.encode(functionName, param1, param2, ...))`
2. **Signature Payload**: `{evvmId},{serviceAddress},{hashPayload},{executor},{nonce},{isAsyncExec}`

The function-specific hash (`hashPayload`) ensures signatures are unique to each operation and its parameters.

## Functions

### hashDataForPay

**Function Type**: `public pure`  
**Function Signature**: `hashDataForPay(address,string,address,uint256,uint256)`

Generates a deterministic hash for single payment operations (`pay` function).

#### Parameters

| Parameter      | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `to_address`   | `address` | Direct recipient address                 |
| `to_identity`  | `string`  | Username for NameService resolution      |
| `token`        | `address` | Token address                            |
| `amount`       | `uint256` | Token amount                             |
| `priorityFee`  | `uint256` | Fee for executor                         |

#### Return Value

| Type      | Description                                  |
| --------- | -------------------------------------------- |
| `bytes32` | Deterministic hash for signature validation  |

#### Hash Construction

```solidity
keccak256(abi.encode(
    "pay",
    to_address,
    to_identity,
    token,
    amount,
    priorityFee
))
```

#### Usage Example

```solidity

// Generate hash for payment signature
bytes32 hashPayload = CoreHashUtils.hashDataForPay(
    recipientAddress,
    "alice", // username
    tokenAddress,
    1000000000000000000, // 1 token
    100000000000000000   // 0.1 token fee
);

// This hash is then used in signature construction:
// {evvmId},{coreAddress},{hashPayload},{executor},{nonce},{isAsyncExec}
```

---

### hashDataForDispersePay

**Function Type**: `internal pure`  
**Function Signature**: `hashDataForDispersePay((uint256,address,string)[],address,uint256,uint256)`

Generates a deterministic hash for multi-recipient distribution operations (`dispersePay` function).

#### Parameters

| Parameter      | Type                          | Description                          |
| -------------- | ----------------------------- | ------------------------------------ |
| `toData`       | `CoreStructs.DispersePayMetadata[]` | Array of recipients and amounts |
| `token`        | `address`                     | Token address                        |
| `amount`       | `uint256`                     | Total amount (must equal sum)        |
| `priorityFee`  | `uint256`                     | Fee for executor                     |

#### Return Value

| Type      | Description                                  |
| --------- | -------------------------------------------- |
| `bytes32` | Deterministic hash for signature validation  |

#### Hash Construction

```solidity
keccak256(abi.encode(
    "dispersePay",
    toData,
    token,
    amount,
    priorityFee
))
```

#### Usage Example

```solidity

// Prepare recipient data
CoreStructs.DispersePayMetadata[] memory toData = 
    new CoreStructs.DispersePayMetadata[](2);

toData[0] = CoreStructs.DispersePayMetadata({
    amount: 500000000000000000,  // 0.5 tokens
    to_address: address(0x123...),
    to_identity: ""
});

toData[1] = CoreStructs.DispersePayMetadata({
    amount: 500000000000000000,  // 0.5 tokens
    to_address: address(0),
    to_identity: "bob"
});

// Generate hash for dispersePay signature
bytes32 hashPayload = CoreHashUtils.hashDataForDispersePay(
    toData,
    tokenAddress,
    1000000000000000000, // 1 token total
    100000000000000000   // 0.1 token fee
);
```

---

## Integration with Core.sol

Core.sol uses these hash functions internally during signature verification:

```solidity
// In Core.pay():
if (
    SignatureRecover.recoverSigner(
        AdvancedStrings.buildSignaturePayload(
            evvmMetadata.EvvmID,
            address(this),
            Hash.hashDataForPay(         // Uses CoreHashUtils
                to_address,
                to_identity,
                token,
                amount,
                priorityFee
            ),
            senderExecutor,
            nonce,
            isAsyncExec
        ),
        signature
    ) != from
) revert Error.InvalidSignature();
```

## Complete Signature Flow

For a `pay` operation:

1. **Generate Hash**:
   ```solidity
   bytes32 hash = CoreHashUtils.hashDataForPay(to, identity, token, amount, fee);
   ```

2. **Build Signature Payload**:
   ```solidity
   string payload = AdvancedStrings.buildSignaturePayload(
       evvmId, coreAddress, hash, executor, nonce, isAsyncExec
   );
   // Result: "1,0xCore...,0xhash...,0xexec...,42,true"
   ```

3. **Apply EIP-191**:
   ```
   "\x19Ethereum Signed Message:\n" + len(payload) + payload
   ```

4. **Sign with Private Key** → 65-byte signature

## Security Properties

**Deterministic Hashing:**
- Same inputs always produce same hash
- Ensures signature verification consistency
- Prevents parameter tampering

**Function Isolation:**
- Each function type has unique hash pattern
- `"pay"` vs `"dispersePay"` string prevents cross-function replay
- Parameter encoding ensures type safety

**Replay Protection:**
- Hash doesn't include nonce (handled at signature payload level)
- Allows signature reuse across nonces if intentional
- Nonce management handled by Core.sol centrally

## Related Documentation

- [Signature & Nonce Management](../../../04-Contracts/01-EVVM/03-SignatureAndNonceManagement.md) - Centralized signature system
- [AdvancedStrings Library](./01-AdvancedStrings.md) - String utilities for signature construction

## See Also

**Other HashUtils Libraries:**
- **NameServiceHashUtils** - Hash generation for NameService operations
- **StakingHashUtils** - Hash generation for Staking operations  
- **P2PSwapHashUtils** - Hash generation for P2PSwap operations
- **TreasuryCrossChainHashUtils** - Hash generation for Treasury operations

All HashUtils libraries follow the same pattern of generating deterministic `hashPayload` values for their respective service operations.

---

## CAUtils Library


The `CAUtils` library provides utilities for detecting whether an address is a smart contract (CA - Contract Address) or an Externally Owned Account (EOA). This is essential for Core.sol functions that should only be callable by contracts.

## Overview

**Package**: `@evvm/testnet-contracts`  
**Import Path**: `@evvm/testnet-contracts/library/utils/CAUtils.sol`  
**Solidity Version**: `^0.8.0`

**Purpose**: Distinguish between smart contracts and EOAs using the `extcodesize` opcode.

## Functions

### verifyIfCA

**Function Type**: `internal view`  
**Function Signature**: `verifyIfCA(address)`

Checks if an address is a smart contract by examining its code size using the `extcodesize` opcode.

#### Parameters

| Parameter | Type      | Description            |
| --------- | --------- | ---------------------- |
| `from`    | `address` | Address to check       |

#### Return Value

| Type   | Description                                             |
| ------ | ------------------------------------------------------- |
| `bool` | `true` if contract (codesize > 0), `false` if EOA       |

#### Implementation

```solidity
function verifyIfCA(address from) internal view returns (bool) {
    uint256 size;
    
    assembly {
        /// @dev check the size of the opcode of the address
        size := extcodesize(from)
    }
    
    return (size != 0);
}
```

#### How It Works

The function uses the `extcodesize` EVM opcode which:
- Returns `> 0` for addresses containing contract bytecode
- Returns `0` for EOA addresses (no code)
- Returns `0` during contract construction (before code is stored)
- Returns `0` for addresses that had contracts which self-destructed

## Usage in Core.sol

Core.sol uses `CAUtils` to restrict certain functions to contract-only execution:

### caPay Function

```solidity
function caPay(address to, address token, uint256 amount) external {
    address from = msg.sender;
    
    if (!CAUtils.verifyIfCA(from)) revert Error.NotAnCA();
    
    _updateBalance(from, to, token, amount);
    
    if (isAddressStaker(msg.sender)) _giveReward(msg.sender, 1);
}
```

**Purpose**: Only smart contracts can call `caPay`, preventing EOAs from bypassing signature requirements.

### validateAndConsumeNonce Function

```solidity
function validateAndConsumeNonce(
    address user,
    bytes32 hashPayload,
    address originExecutor,
    uint256 nonce,
    bool isAsyncExec,
    bytes memory signature
) external {
    address servicePointer = msg.sender;
    
    if (!CAUtils.verifyIfCA(servicePointer))
        revert Error.MsgSenderIsNotAContract();
    
    // ... signature verification and nonce consumption
}
```

**Purpose**: Only EVVM service contracts can validate and consume nonces for users.

## Security Considerations

### Edge Cases

#### 1. Contract Construction Phase

```solidity
contract Example {
    constructor() {
        // During construction, CAUtils.verifyIfCA(address(this)) returns FALSE
        // The contract code hasn't been stored yet
    }
}
```

**Impact**: Constructors cannot reliably use `CAUtils` for self-checks.

#### 2. Self-Destruct

```solidity
contract Destructible {
    function destroy() external {
        selfdestruct(payable(msg.sender));
    }
}

// After selfdestruct, CAUtils.verifyIfCA(address) returns FALSE
```

**Impact**: Self-destructed contract addresses appear as EOAs.

#### 3. Create2 Pre-Deployment

```solidity
// Address can be computed before deployment
address futureContract = computeCreate2Address(...);

// CAUtils.verifyIfCA(futureContract) returns FALSE until deployed
```

**Impact**: Pre-computed addresses cannot be verified until deployment.

### Not a Complete Security Solution

> **Warning: Security Limitations**
`CAUtils.verifyIfCA()` should **not** be the sole security mechanism:

1. **Construction Bypass**: Contracts under construction appear as EOAs
2. **Proxy Confusion**: Proxies may not have code themselves
3. **Delegatecall Issues**: Calls through proxies have different `msg.sender`

For critical security, combine with:
- Whitelist/blacklist systems
- Role-based access control
- Signature verification
- Multi-factor authorization

## Best Practices

### ✅ Good Use Cases

**Access Control for System Functions:**
```solidity
function systemOperation() external {
    require(CAUtils.verifyIfCA(msg.sender), "Contracts only");
    // ... system logic
}
```

**Preventing EOA Bypass:**
```solidity
function privilegedFunction() external {
    if (!CAUtils.verifyIfCA(msg.sender)) revert NotAContract();
    // Ensures EOAs can't call directly
}
```

### ❌ Avoid These Patterns

**Don't Use as Sole Security:**
```solidity
// ❌ BAD: Too permissive
function dangerousFunction() external {
    if (CAUtils.verifyIfCA(msg.sender)) {
        // ANY contract can call this!
    }
}
```

**Don't Use for Reentrancy Protection:**
```solidity
// ❌ BAD: Doesn't prevent reentrancy
function withdrawAll() external {
    require(!CAUtils.verifyIfCA(msg.sender), "EOAs only");
    // An EOA can still trigger reentrancy via malicious contract
}
```

## Usage Examples

### Basic Contract Detection

```solidity

contract MyContract {
    function requireContract() external view {
        require(CAUtils.verifyIfCA(msg.sender), "Must be contract");
    }
    
    function requireEOA() external view {
        require(!CAUtils.verifyIfCA(msg.sender), "Must be EOA");
    }
}
```

### Combined with Access Control

```solidity

contract SecureSystem {
    mapping(address => bool) public authorizedContracts;
    
    modifier onlyAuthorizedContract() {
        require(CAUtils.verifyIfCA(msg.sender), "Not a contract");
        require(authorizedContracts[msg.sender], "Not authorized");
        _;
    }
    
    function systemFunction() external onlyAuthorizedContract {
        // Secured by both CA check AND whitelist
    }
}
```

### Check External Address

```solidity
function validateRecipient(address recipient) internal view returns (bool) {
    if (CAUtils.verifyIfCA(recipient)) {
        // It's a contract - might need special handling
        return isApprovedContract(recipient);
    } else {
        // It's an EOA - standard handling
        return true;
    }
}
```

## Gas Costs

The `extcodesize` opcode has the following gas costs:

- **Warm address** (already accessed): ~100 gas
- **Cold address** (first access): ~2600 gas

**Optimization Tip**: If checking the same address multiple times, cache the result:

```solidity
bool isSenderContract = CAUtils.verifyIfCA(msg.sender);

// Use cached value multiple times
if (isSenderContract) { /* ... */ }
if (isSenderContract) { /* ... */ }
```

## Related Documentation

- [Core.sol caPay Function](../../../04-Contracts/01-EVVM/04-PaymentFunctions/04-caPay.md) - Contract payment function
- [Core.sol validateAndConsumeNonce](../../../04-Contracts/01-EVVM/03-SignatureAndNonceManagement.md) - Nonce validation function
- [disperseCaPay Function](../../../04-Contracts/01-EVVM/04-PaymentFunctions/05-disperseCaPay.md) - Multi-recipient contract payment

## Alternative Approaches

For more robust contract detection, consider:

**1. Interface Detection (ERC-165):**
```solidity
interface IMyContract {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
```

**2. Whitelisting:**
```solidity
mapping(address => bool) public approvedContracts;
```

**3. Role-Based Access Control:**
```solidity
bytes32 public constant CONTRACT_ROLE = keccak256("CONTRACT_ROLE");
hasRole(CONTRACT_ROLE, msg.sender);
```

## Summary

`CAUtils` provides simple contract detection but should be part of a defense-in-depth strategy. For EVVM, it effectively restricts service functions to contract execution while preventing EOAs from bypassing signature requirements.

---

## Erc191TestBuilder


The `Erc191TestBuilder` library provides utility functions for building ERC-191 compliant message hashes in Foundry test scripts. It simplifies the process of creating signed messages for testing all EVVM system contracts.

## Overview

**Library Type**: Pure functions for testing  
**License**: EVVM-NONCOMMERCIAL-1.0  
**Import Path**: `@evvm/testnet-contracts/library/Erc191TestBuilder.sol`  
**Author**: jistro.eth

### Key Features

- **ERC-191 compliant** message hash generation
- **Pre-built functions** for all EVVM contract signatures
- **Foundry integration** compatible
- **Type-safe** parameter handling

### Use Cases

- **Unit testing** contract functions with signatures
- **Integration testing** multi-contract workflows
- **Signature verification** testing
- **Gas optimization** testing with realistic signatures

## Core Functions

### `buildHashForSign`
```solidity
function buildHashForSign(
    string memory messageToSign
) internal pure returns (bytes32)
```

**Description**: Creates an ERC-191 compliant message hash from a string

**Parameters**:
- `messageToSign`: The message string to hash

**Returns**: `bytes32` hash ready for signing with Foundry's `vm.sign()`

**Format**: `keccak256("\x19Ethereum Signed Message:\n" + length + message)`

**Example**:
```solidity

function testMessageHash() public {
    string memory message = "123,action,param1,param2";
    bytes32 hash = Erc191TestBuilder.buildHashForSign(message);
    
    // Use with Foundry
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, hash);
    bytes memory signature = Erc191TestBuilder.buildERC191Signature(v, r, s);
}
```

### `buildERC191Signature`
```solidity
function buildERC191Signature(
    uint8 v,
    bytes32 r,
    bytes32 s
) internal pure returns (bytes memory)
```

**Description**: Combines signature components into a 65-byte signature

**Parameters**:
- `v`: Recovery id (27 or 28)
- `r`: First 32 bytes of signature
- `s`: Last 32 bytes of signature

**Returns**: 65-byte signature in format `abi.encodePacked(r, s, v)`

**Example**:
```solidity
(uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, messageHash);
bytes memory signature = Erc191TestBuilder.buildERC191Signature(v, r, s);
```

## EVVM Functions

### `buildMessageSignedForPay`
```solidity
function buildMessageSignedForPay(
    uint256 evvmID,
    address _receiverAddress,
    string memory _receiverIdentity,
    address _token,
    uint256 _amount,
    uint256 _priorityFee,
    uint256 _nonce,
    bool _priority_boolean,
    address _executor
) internal pure returns (bytes32 messageHash)
```

**Description**: Builds message hash for EVVM `pay()` function

**Message Format**: `"<evvmID>,pay,<receiver>,<token>,<amount>,<priorityFee>,<nonce>,<flag>,<executor>"`

**Example**:
```solidity
bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(
    123,                    // evvmID
    recipientAddress,       // receiver address
    "",                     // receiver identity (empty if address used)
    address(0),            // token (ETH)
    1 ether,               // amount
    0.001 ether,           // priority fee
    1,                     // nonce
    true,                  // async nonce
    fisherAddress          // executor
);
```

### `buildMessageSignedForDispersePay`
```solidity
function buildMessageSignedForDispersePay(
    uint256 evvmID,
    bytes32 hashList,
    address _token,
    uint256 _amount,
    uint256 _priorityFee,
    uint256 _nonce,
    bool _priority_boolean,
    address _executor
) public pure returns (bytes32 messageHash)
```

**Description**: Builds message hash for EVVM `dispersePay()` function

**Message Format**: `"<evvmID>,dispersePay,<hashList>,<token>,<amount>,<priorityFee>,<nonce>,<flag>,<executor>"`

## Name Service Functions

### `buildMessageSignedForPreRegistrationUsername`
```solidity
function buildMessageSignedForPreRegistrationUsername(
    uint256 evvmID,
    bytes32 _hashUsername,
    uint256 _nameServiceNonce
) internal pure returns (bytes32 messageHash)
```

**Message Format**: `"<evvmID>,preRegistrationUsername,<hashUsername>,<nonce>"`

### `buildMessageSignedForRegistrationUsername`
```solidity
function buildMessageSignedForRegistrationUsername(
    uint256 evvmID,
    string memory _username,
    uint256 _clowNumber,
    uint256 _nameServiceNonce
) internal pure returns (bytes32 messageHash)
```

**Message Format**: `"<evvmID>,registrationUsername,<username>,<clowNumber>,<nonce>"`

### Username Marketplace Functions

**Available functions**:
- `buildMessageSignedForMakeOffer` - Create username offer
- `buildMessageSignedForWithdrawOffer` - Cancel offer
- `buildMessageSignedForAcceptOffer` - Accept offer
- `buildMessageSignedForRenewUsername` - Renew username

### Custom Metadata Functions

**Available functions**:
- `buildMessageSignedForAddCustomMetadata` - Add metadata
- `buildMessageSignedForRemoveCustomMetadata` - Remove metadata entry
- `buildMessageSignedForFlushCustomMetadata` - Clear all metadata
- `buildMessageSignedForFlushUsername` - Delete username

## Staking Functions

### `buildMessageSignedForPublicStaking`
```solidity
function buildMessageSignedForPublicStaking(
    uint256 evvmID,
    bool _isStaking,
    uint256 _amountOfStaking,
    uint256 _nonce
) internal pure returns (bytes32 messageHash)
```

**Message Format**: `"<evvmID>,publicStaking,<isStaking>,<amount>,<nonce>"`

**Example**:
```solidity
// Staking
bytes32 stakeHash = Erc191TestBuilder.buildMessageSignedForPublicStaking(
    123,
    true,      // is staking
    100 ether, // amount
    1          // nonce
);

// Unstaking
bytes32 unstakeHash = Erc191TestBuilder.buildMessageSignedForPublicStaking(
    123,
    false,     // is unstaking
    50 ether,  // amount
    2          // nonce
);
```

### `buildMessageSignedForPresaleStaking`
```solidity
function buildMessageSignedForPresaleStaking(
    uint256 evvmID,
    bool _isStaking,
    uint256 _amountOfStaking,
    uint256 _nonce
) internal pure returns (bytes32 messageHash)
```

**Message Format**: `"<evvmID>,presaleStaking,<isStaking>,<amount>,<nonce>"`

### `buildMessageSignedForPublicServiceStake`
```solidity
function buildMessageSignedForPublicServiceStake(
    uint256 evvmID,
    address _serviceAddress,
    bool _isStaking,
    uint256 _amountOfStaking,
    uint256 _nonce
) internal pure returns (bytes32 messageHash)
```

**Message Format**: `"<evvmID>,publicServiceStaking,<serviceAddress>,<isStaking>,<amount>,<nonce>"`

## P2P Swap Functions

### `buildMessageSignedForMakeOrder`
```solidity
function buildMessageSignedForMakeOrder(
    uint256 evvmID,
    uint256 _nonce,
    address _tokenA,
    address _tokenB,
    uint256 _amountA,
    uint256 _amountB
) internal pure returns (bytes32 messageHash)
```

**Message Format**: `"<evvmID>,makeOrder,<nonce>,<tokenA>,<tokenB>,<amountA>,<amountB>"`

### Order Management Functions

**Available functions**:
- `buildMessageSignedForCancelOrder` - Cancel an order
- `buildMessageSignedForDispatchOrder` - Execute an order

## Complete Testing Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvvmPaymentTest is Test {
    Evvm evvm;
    
    address alice;
    uint256 alicePrivateKey;
    address bob;
    
    function setUp() public {
        // Create test wallets
        alicePrivateKey = 0xA11CE;
        alice = vm.addr(alicePrivateKey);
        bob = makeAddr("bob");
        
        // Deploy EVVM
        evvm = new Evvm();
        
        // Setup balances
        evvm.addBalance(alice, address(0), 10 ether);
    }
    
    function testPayWithSignature() public {
        uint256 evvmID = evvm.getEvvmID();
        
        // Build message hash
        bytes32 messageHash = Erc191TestBuilder.buildMessageSignedForPay(
            evvmID,
            bob,              // receiver
            "",               // identity (empty)
            address(0),       // ETH
            1 ether,          // amount
            0.001 ether,      // priority fee
            0,                // nonce
            true,             // async
            address(this)     // executor (test contract)
        );
        
        // Sign message
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePrivateKey, messageHash);
        bytes memory signature = Erc191TestBuilder.buildERC191Signature(v, r, s);
        
        // Execute payment
        evvm.pay(
            alice,
            bob,
            "",
            address(0),
            1 ether,
            0.001 ether,
            0,
            true,
            address(this),
            signature
        );
        
        // Verify
        assertEq(evvm.getBalance(bob, address(0)), 1 ether);
    }
}
```

## Best Practices

### 1. Use Foundry Cheatcodes
```solidity
// Good - create wallets with vm.createWallet()
(address user, uint256 pk) = makeAddrAndKey("user");
bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(...);
(uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, hash);

// Bad - hardcoded private keys
uint256 pk = 0x123456; // Don't use in production!
```

### 2. Test Both Valid and Invalid Signatures
```solidity
function testInvalidSignature() public {
    bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(...);
    
    // Sign with wrong key
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongPrivateKey, hash);
    bytes memory badSig = Erc191TestBuilder.buildERC191Signature(v, r, s);
    
    // Should revert
    vm.expectRevert();
    evvm.pay(..., badSig);
}
```

### 3. Cache Message Hashes for Multiple Tests
```solidity
bytes32 paymentHash;

function setUp() public {
    paymentHash = Erc191TestBuilder.buildMessageSignedForPay(...);
}

function testPayment() public {
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPk, paymentHash);
    // Test payment...
}

function testReplayProtection() public {
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPk, paymentHash);
    // Test replay...
}
```

### 4. Test Edge Cases
```solidity
function testZeroAddress() public {
    bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(
        evvmID,
        address(0),  // Zero address
        "alice",     // Use identity instead
        address(0),
        1 ether,
        0,
        0,
        true,
        executor
    );
    // Test handling...
}
```

## Integration with Foundry

### Basic Workflow
```solidity
// 1. Create wallet
(address user, uint256 pk) = makeAddrAndKey("user");

// 2. Build message hash
bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(...);

// 3. Sign with Foundry
(uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, hash);

// 4. Build signature
bytes memory sig = Erc191TestBuilder.buildERC191Signature(v, r, s);

// 5. Use in contract call
contract.functionWithSignature(..., sig);
```

### Testing Multiple Signers
```solidity
function testMultiSig() public {
    address[] memory signers = new address[](3);
    uint256[] memory keys = new uint256[](3);
    
    for (uint i = 0; i < 3; i++) {
        (signers[i], keys[i]) = makeAddrAndKey(
            string.concat("signer", vm.toString(i))
        );
    }
    
    bytes32 hash = Erc191TestBuilder.buildHashForSign("action");
    
    for (uint i = 0; i < 3; i++) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(keys[i], hash);
        // Verify each signature...
    }
}
```

## Common Patterns

### Pattern 1: Testing Nonce Validation
```solidity
function testNonceReplay() public {
    bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(
        evvmID, bob, "", address(0), 1 ether, 0, 5, true, executor
    );
    
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePk, hash);
    bytes memory sig = Erc191TestBuilder.buildERC191Signature(v, r, s);
    
    // First call succeeds
    evvm.pay(alice, bob, "", address(0), 1 ether, 0, 5, true, executor, sig);
    
    // Second call with same nonce should fail
    vm.expectRevert();
    evvm.pay(alice, bob, "", address(0), 1 ether, 0, 5, true, executor, sig);
}
```

### Pattern 2: Testing Username Functions
```solidity
function testUsernameRegistration() public {
    // Pre-registration
    bytes32 preHash = Erc191TestBuilder.buildMessageSignedForPreRegistrationUsername(
        evvmID,
        keccak256(bytes("alice")),
        0
    );
    (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(userPk, preHash);
    bytes memory preSig = Erc191TestBuilder.buildERC191Signature(v1, r1, s1);
    
    nameService.preRegistrationUsername(keccak256(bytes("alice")), 0, preSig);
    
    // Registration
    bytes32 regHash = Erc191TestBuilder.buildMessageSignedForRegistrationUsername(
        evvmID,
        "alice",
        12345,
        1
    );
    (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(userPk, regHash);
    bytes memory regSig = Erc191TestBuilder.buildERC191Signature(v2, r2, s2);
    
    nameService.registrationUsername("alice", 12345, 1, regSig);
}
```

### Pattern 3: Testing Staking Operations
```solidity
function testStakeUnstakeCycle() public {
    // Stake
    bytes32 stakeHash = Erc191TestBuilder.buildMessageSignedForPublicStaking(
        evvmID, true, 100 ether, 0
    );
    (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(userPk, stakeHash);
    bytes memory stakeSig = Erc191TestBuilder.buildERC191Signature(v1, r1, s1);
    
    staking.publicStaking(true, 100 ether, 0, stakeSig);
    assertEq(staking.getUserAmountStaked(user), 100 ether);
    
    // Unstake
    vm.warp(block.timestamp + 30 days);
    bytes32 unstakeHash = Erc191TestBuilder.buildMessageSignedForPublicStaking(
        evvmID, false, 50 ether, 1
    );
    (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(userPk, unstakeHash);
    bytes memory unstakeSig = Erc191TestBuilder.buildERC191Signature(v2, r2, s2);
    
    staking.publicStaking(false, 50 ether, 1, unstakeSig);
    assertEq(staking.getUserAmountStaked(user), 50 ether);
}
```

## Gas Optimization in Tests

```solidity
// Cache frequently used hashes
bytes32[] hashes;

function setUp() public {
    // Pre-compute hashes
    for (uint i = 0; i < 100; i++) {
        hashes.push(
            Erc191TestBuilder.buildMessageSignedForPay(
                evvmID, recipients[i], "", address(0), 1 ether, 0, i, true, executor
            )
        );
    }
}

function testBatchPayments() public {
    for (uint i = 0; i < 100; i++) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(senderPk, hashes[i]);
        bytes memory sig = Erc191TestBuilder.buildERC191Signature(v, r, s);
        // Execute payment...
    }
}
```

## Troubleshooting

### Common Issues

**Issue**: Signature verification fails
```solidity
// Check message format matches contract expectations
string memory expected = "123,pay,0x...,0x...,1000000000000000000,0,0,true,0x...";
bytes32 hash = Erc191TestBuilder.buildHashForSign(expected);
```

**Issue**: Nonce mismatch
```solidity
// Ensure nonce in message matches function parameter
uint256 nonce = 5;
bytes32 hash = Erc191TestBuilder.buildMessageSignedForPay(
    evvmID, bob, "", address(0), 1 ether, 0, nonce, true, executor
);
evvm.pay(alice, bob, "", address(0), 1 ether, 0, nonce, true, executor, sig);
//                                                      ^^^^^ Must match
```

**Issue**: Wrong signer
```solidity
// Verify you're signing with the correct private key
address expectedSigner = alice;
uint256 correctKey = alicePrivateKey; // Not bobPrivateKey!
(uint8 v, bytes32 r, bytes32 s) = vm.sign(correctKey, hash);
```

---

## See Also

- **[SignatureRecover](./03-Primitives/02-SignatureRecover.md)** - EIP-191 signature recovery
- **[SignatureUtil](./04-Utils/02-SignatureUtil.md)** - Runtime signature verification
- **[AdvancedStrings](./04-Utils/01-AdvancedStrings.md)** - String utilities used internally
- [Foundry Book - Cheatcodes](https://book.getfoundry.sh/cheatcodes/) - Foundry testing utilities

---

## EVVM Frontend Tooling


The EVVM Signature Constructor Frontend provides a comprehensive web application infrastructure for constructing, signing, and executing EVVM transactions. Built on Next.js with TypeScript, it implements the complete EIP-191 signature specification and transaction lifecycle management for the EVVM ecosystem.

This frontend infrastructure directly supports the transaction process described in [Process of a Transaction](../03-ProcessOfATransaction.md) by providing user interfaces for transaction creation, EIP-191 signing, and fisher interaction through various fishing spots.

### Deployed Frontend
If you want to test the deployed contracts you can use this
[live version](https://evvm.dev/)

## Quick Start

### Prerequisites

Before using the EVVM Signature Constructor Frontend, ensure you have:

- A deployed EVVM instance (follow the [QuickStart](../02-QuickStart.md) guide)
- A compatible wallet (MetaMask, WalletConnect-compatible wallets)
- Access to supported networks (Sepolia or Arbitrum Sepolia for testnet)

### Setup and Installation

```bash
# Clone the frontend repository
git clone https://github.com/EVVM-org/EVVM-Signature-Constructor-Front
cd EVVM-Signature-Constructor-Front

# Install dependencies
npm install
# or
pnpm install

# Configure environment
cp .env.example .env
# Add your Reown Project ID from https://cloud.reown.com
echo "NEXT_PUBLIC_PROJECT_ID=your_project_id_here" >> .env

# Run development server
npm run dev
# or
pnpm dev
```

### Basic Usage

1. **Connect Wallet**: Click the connect button and select your wallet
2. **Choose Function Type**: Select from available transaction types:
   - **Faucet Functions**: Get testnet tokens (testnet only)
   - **Payment Signatures**: Single and batch payments
   - **Staking Signatures**: Staking operations
   - **Name Service Signatures**: Username and metadata operations
3. **Fill Parameters**: Enter transaction parameters in the forms
4. **Sign Transaction**: Generate EIP-191 signatures
5. **Execute Transaction**: Submit to fishers for processing

For detailed deployment and EVVM setup, refer to the [QuickStart](../02-QuickStart.md) documentation.

---

## Infrastructure Overview

The frontend application serves as a critical infrastructure component that bridges user interactions with the EVVM protocol through standardized signature construction and transaction execution pipelines. It implements the complete transaction lifecycle from the [EVVM transaction process](../03-ProcessOfATransaction.md), enabling users to interact with the abstract blockchain infrastructure without managing traditional blockchain complexity.

### Core Architecture

```
EVVM-Signature-Constructor-Front/
├── public/                         # Static assets and branding
├── src/
│   ├── app/                        # Next.js application layer
│   │   ├── layout.tsx              # Application shell and providers
│   │   ├── page.tsx                # Main application entry point
│   │   ├── globals.css             # Global styling framework
│   │   └── fonts/                  # Typography assets
│   ├── components/                 # React component library
│   │   ├── ConnectButton.tsx       # Wallet connection interface
│   │   ├── ActionButtonList.tsx    # Action dispatch interface
│   │   ├── InfoList.tsx            # Account information display
│   │   └── SigConstructors/        # Signature construction modules
│   │       ├── SigMenu.tsx         # Navigation and routing logic
│   │       ├── FaucetFunctions/    # Testnet token distribution
│   │       ├── PaymentFunctions/   # Payment signature construction
│   │       ├── StakingFunctions/   # Staking operation signatures
│   │       ├── NameServiceFunctions/   # Name service signatures
│   │       └── InputsAndModules/   # Reusable UI components
│   ├── config/                     # Application configuration
│   │   └── index.ts                # Wagmi and network configuration
│   ├── constants/                  # Protocol constants and ABIs
│   │   ├── address.tsx             # Contract address registry
│   │   └── abi/                    # Smart contract interfaces
│   │       ├── Evvm.json           # Core EVVM contract ABI
│   │       ├── NameService.json    # Name service contract ABI
│   │       ├── Staking.json        # Staking contract ABI
│   │       └── Estimator.json      # Fee estimation contract ABI
│   ├── context/                    # React context providers
│   │   └── index.tsx               # Application state management
│   ├── hooks/                      # Custom React hooks
│   │   └── useClientMount.ts       # Client-side mounting logic
│   └── utils/                      # Core utility libraries
│       ├── SignatureBuilder/       # EIP-191 signature construction
│       ├── TransactionExecuter/    # Smart contract interaction
│       ├── TransactionVerify/      # Pre-execution validation
│       ├── TypeInputStructures/    # TypeScript type definitions
│       └── [utility functions]     # Supporting utilities
├── docs/                           # Documentation
├── package.json                    # Dependency management
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── .eslintrc.json                  # Code quality configuration
└── .env.example                    # Environment template
```

### Technology Stack

**Core Framework:**
- Next.js 15.3.0 with App Router architecture
- React 19.0.0 with modern concurrent features
- TypeScript 5 for type safety and developer experience

**Blockchain Integration:**
- Wagmi 2.12.31 for Ethereum wallet integration
- Viem 2.21.44 for low-level blockchain interactions
- Reown AppKit 1.7.5 for wallet connection management

**State Management:**
- TanStack Query 5.59.20 for server state management
- React Context for application state
- Cookie storage for session persistence

**Development Tools:**
- ESLint for code quality enforcement
- TypeScript strict mode for type safety
- Next.js development tools for debugging

---

## Signature Construction Infrastructure

The application implements the complete EIP-191 signature specification as defined in the EVVM Signature Structures documentation section. All signature construction follows the standardized message formats for cryptographic security and replay protection, ensuring compatibility with the fisher-based validation system described in [Process of a Transaction](../03-ProcessOfATransaction.md).

### EIP-191 Implementation

The frontend implements the exact EIP-191 signature specification as documented in the Signature Structures section, with function selectors and message construction matching the protocol requirements precisely.

```typescript
// Core signature construction pattern
const constructMessage = (
  functionSelector: string,
  ...parameters: string[]
): string => {
  return [functionSelector, ...parameters].join(',');
};

// Example: Single payment signature
const buildMessageSignedForPay = (
  from: string,
  to_address: string,
  to_identity: string,
  token: string,
  amount: string,
  priorityFee: string,
  nonce: string,
  priority: boolean,
  executor: string
): string => {
  const priorityFlag = priority ? "f4e1895b" : "4faa1fa2";
  const recipient = to_address === "0x0000000000000000000000000000000000000000" 
    ? to_identity 
    : to_address;
    
  return constructMessage(
    priorityFlag,
    recipient,
    token,
    amount,
    priorityFee,
    nonce,
    priority.toString(),
    executor
  );
};
```

### Signature Builder Hooks

The application provides specialized React hooks for each transaction type, implementing the exact signature structures defined in the protocol specification.

#### EVVM Payment Signatures

The payment signature implementation follows the exact specifications from [Single Payment Signature Structure](../05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md) and [Disperse Payment Signature Structure](../05-SignatureStructures/01-EVVM/02-DispersePaySignatureStructure.md).

```typescript
export const useEVVMSignatureBuilder = () => {
  const { signMessage } = useSignMessage();
  
  const signPay = (
    amount: string,
    to: string,
    tokenAddress: string,
    priorityFee: string,
    nonce: string,
    priority: boolean,
    executor: string,
    onSuccess: (signature: string) => void,
    onError: (error: Error) => void
  ) => {
    const message = buildMessageSignedForPay(
      // Message construction parameters
    );
    
    signMessage({ message }, {
      onSuccess: (signature) => onSuccess(signature),
      onError: (error) => onError(error)
    });
  };
  
  const signDispersePay = (
    toData: DispersePayMetadata[],
    tokenAddress: string,
    amount: string,
    priorityFee: string,
    nonce: string,
    priority: boolean,
    executor: string,
    onSuccess: (signature: string) => void,
    onError: (error: Error) => void
  ) => {
    const message = buildMessageSignedForDispersePay(
      // Disperse payment construction parameters
    );
    
    signMessage({ message }, {
      onSuccess: (signature) => onSuccess(signature),
      onError: (error) => onError(error)
    });
  };
  
  return { signPay, signDispersePay };
};
```

#### Name Service Signatures

The Name Service signature implementation follows the exact specifications from the [Name Service Signature Structures](../05-SignatureStructures/02-NameService/01-preRegistrationUsernameStructure.md), implementing all functions including pre-registration, registration, offers, and metadata management.

```typescript
export const useNameServiceSignatureBuilder = () => {
  const { signMessage } = useSignMessage();
  
  // Pre-registration signature (Function Selector: 5d232a55)
  // Implements the exact structure from PreRegistrationUsernameStructure documentation
  const signPreRegistrationUsername = (
    hashUsername: string,
    nameServiceNonce: string,
    onSuccess: (signature: string) => void,
    onError: (error: Error) => void
  ) => {
    const message = constructMessage(
      "5d232a55",
      hashUsername,
      nameServiceNonce
    );
    
    signMessage({ message }, { onSuccess, onError });
  };
  
  // Registration signature (Function Selector: a5ef78b2)
  // Implements the exact structure from RegistrationUsernameStructure documentation
  const signRegistrationUsername = (
    username: string,
    clowNumber: string,
    nameServiceNonce: string,
    onSuccess: (signature: string) => void,
    onError: (error: Error) => void
  ) => {
    const message = constructMessage(
      "a5ef78b2",
      username,
      clowNumber,
      nameServiceNonce
    );
    
    signMessage({ message }, { onSuccess, onError });
  };
  
  return { 
    signPreRegistrationUsername,
    signRegistrationUsername,
    // ... other name service signatures
  };
};
```

#### Staking Signatures

The Staking signature implementation follows the specifications from [Staking Signature Structures](../05-SignatureStructures/03-Staking/01-StandardStakingStructure.md), supporting all staking operations including golden staking, presale staking, and public staking functions.

```typescript
export const useStakingSignatureBuilder = () => {
  const { signMessage } = useSignMessage();
  
  // Standard staking signature construction
  const signStaking = (
    stakingType: string,
    amount: string,
    stakingNonce: string,
    additionalData: string,
    onSuccess: (signature: string) => void,
    onError: (error: Error) => void
  ) => {
    const functionSelector = getFunctionSelectorForStaking(stakingType);
    const message = constructMessage(
      functionSelector,
      amount,
      stakingNonce,
      additionalData
    );
    
    signMessage({ message }, { onSuccess, onError });
  };
  
  return { signStaking };
};
```

---

## Transaction Execution Infrastructure

The transaction execution layer provides standardized interfaces for interacting with EVVM smart contracts using the constructed signatures. This implementation directly supports the execution phase described in [Process of a Transaction](../03-ProcessOfATransaction.md), where fishers execute validated transactions and distribute rewards.

### Contract Interaction Patterns

```typescript
// Generic transaction execution pattern
const executeTransaction = async (
  contractAddress: `0x${string}`,
  abi: any[],
  functionName: string,
  args: any[],
  config: Config
): Promise<void> => {
  try {
    const result = await writeContract(config, {
      abi,
      address: contractAddress,
      functionName,
      args
    });
    
    return result;
  } catch (error) {
    throw new Error(`Transaction execution failed: ${error.message}`);
  }
};

// EVVM payment execution
// Supports both staker and non-staker payment functions as defined in EVVM Core
export const executePay = async (
  inputData: PayInputData,
  evvmAddress: `0x${string}`,
  asStaker: boolean
): Promise<void> => {
  // Function name selection follows EVVM Core contract specifications
  // payMateStaking_* for stakers, payNoMateStaking_* for non-stakers
  // _async for priority transactions, _sync for standard processing
  const functionName = inputData.priority
    ? (asStaker ? "payMateStaking_async" : "payNoMateStaking_async")
    : (asStaker ? "payMateStaking_sync" : "payNoMateStaking_sync");
    
  return executeTransaction(
    evvmAddress,
    EvvmABI.abi,
    functionName,
    [
      inputData.from,
      inputData.to_address,
      inputData.to_identity,
      inputData.token,
      inputData.amount,
      inputData.priorityFee,
      inputData.nonce,
      inputData.executor,
      inputData.signature
    ],
    config
  );
};
```

### Type System Infrastructure

The application implements comprehensive TypeScript types that correspond exactly to the smart contract interfaces and signature requirements defined in the EVVM protocol documentation.

```typescript
// Core EVVM transaction types
interface PayInputData {
  from: `0x${string}`;
  to_address: `0x${string}`;
  to_identity: string;
  token: `0x${string}`;
  amount: bigint;
  priorityFee: bigint;
  nonce: bigint;
  priority: boolean;
  executor: string;
  signature: string;
}

interface DispersePayMetadata {
  amount: bigint;
  to_address: `0x${string}`;
  to_identity: string;
}

interface DispersePayInputData {
  from: `0x${string}`;
  toData: DispersePayMetadata[];
  token: `0x${string}`;
  amount: bigint;
  priorityFee: bigint;
  priority: boolean;
  nonce: bigint;
  executor: string;
  signature: string;
}

// Name Service transaction types
interface PreRegistrationUsernameInputData {
  user: `0x${string}`;
  hashUsername: string;
  nameServiceNonce: bigint;
  signature: string;
}

interface RegistrationUsernameInputData {
  user: `0x${string}`;
  username: string;
  clowNumber: bigint;
  nameServiceNonce: bigint;
  signature: string;
}

// Staking transaction types
interface StakingInputData {
  user: `0x${string}`;
  amount: bigint;
  stakingNonce: bigint;
  additionalData: string;
  signature: string;
}
```

---

## Network Configuration Infrastructure

The application supports multiple blockchain networks with configurable contract addresses and network parameters. The supported networks align with the EVVM deployment strategy described in [QuickStart](../02-QuickStart.md).

### Network Registry

```typescript
// Network configuration
export const networks = [
  sepolia,          // Ethereum Sepolia Testnet
  arbitrumSepolia   // Arbitrum Sepolia Testnet
] as [AppKitNetwork, ...AppKitNetwork[]];

// Contract address registry by network
export const contractAddress = {
  11155111: {  // Sepolia
    evvm: "0x5c66EB3CAAD38851C9c6291D77510b0Eaa8B3c84",
    nameService: "0x7F41487e77D092BA53c980171C4ebc71d68DC5AE",
    staking: "0x0fb1aD66636411bB50a33458a8De6507D9b270E8",
    estimator: "0xF66464ccf2d0e56DFA15572c122C6474B0A1c82C"
  },
  421614: {    // Arbitrum Sepolia
    evvm: "0xaBee6F8014468e88035041E94d530838d2ce025C",
    nameService: "0xfd54B984637AC288B8bd24AD0915Ef6fBaEA5400",
    staking: "0xb39a3134D1714AcFa6d0Bc3C9235C09918bbe2a6",
    estimator: "0xA319d1Ba0Eb0bd8aaeb7Fe931F3Ef70383fAA3A5"
  }
};

// Token address constants matching EVVM protocol specifications
// MATE token uses address 0x0000000000000000000000000000000000000001
// ETH uses zero address as per EVVM conventions
export const tokenAddress = {
  mate: "0x0000000000000000000000000000000000000001",
  ether: "0x0000000000000000000000000000000000000000"
};
```

### Wagmi Configuration

```typescript
// Wagmi adapter configuration for SSR compatibility
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
```

---

## User Interface Architecture

The UI layer provides modular components for each transaction type, following the signature structure specifications exactly.

### Component Architecture Pattern

```typescript
// Generic signature constructor component pattern
interface SignatureConstructorProps {
  title: string;
  functionSelector: string;
  onSignatureComplete: (signature: string, data: any) => void;
  onExecutionComplete: () => void;
}

const SignatureConstructorComponent: React.FC<SignatureConstructorProps> = ({
  title,
  functionSelector,
  onSignatureComplete,
  onExecutionComplete
}) => {
  const [formData, setFormData] = useState({});
  const [signedData, setSignedData] = useState(null);
  
  const handleSignature = async () => {
    // Construct signature using appropriate builder
    // Call onSignatureComplete with results
  };
  
  const handleExecution = async () => {
    // Execute transaction using signed data
    // Call onExecutionComplete on success
  };
  
  return (
    
      {title}
      {/* Form inputs for transaction parameters */}
      <button onClick={handleSignature}>Sign Transaction</button>
      {signedData && (
        <button onClick={handleExecution}>Execute Transaction</button>
      )}
    
  );
};
```

### Input Validation Infrastructure

```typescript
// Address validation
const validateEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Amount validation
const validateAmount = (amount: string): boolean => {
  try {
    const parsed = BigInt(amount);
    return parsed > 0n;
  } catch {
    return false;
  }
};

// Nonce validation
const validateNonce = (nonce: string): boolean => {
  try {
    const parsed = BigInt(nonce);
    return parsed >= 0n;
  } catch {
    return false;
  }
};
```

---

## Error Handling and Resilience

The infrastructure implements comprehensive error handling and retry mechanisms for robust operation in production environments.

### Retry Mechanisms

```typescript
// Account retrieval with retry
export const getAccountWithRetry = async (
  config: Config, 
  maxRetries: number = 3,
  delay: number = 1000
): Promise<GetAccountReturnType | null> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const account = getAccount(config);
      if (account.address) {
        return account;
      }
    } catch (error) {
      console.warn(`Account retrieval attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        console.error("Max retries reached for account retrieval");
        return null;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  return null;
};

// Transaction execution with retry
const executeTransactionWithRetry = async (
  transactionFn: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await transactionFn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### Error Classification

```typescript
// Error types for proper handling
enum TransactionErrorType {
  USER_REJECTED = "USER_REJECTED",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  NETWORK_ERROR = "NETWORK_ERROR",
  CONTRACT_ERROR = "CONTRACT_ERROR",
  SIGNATURE_ERROR = "SIGNATURE_ERROR"
}

const classifyError = (error: any): TransactionErrorType => {
  if (error.code === 4001) return TransactionErrorType.USER_REJECTED;
  if (error.message?.includes("insufficient funds")) return TransactionErrorType.INSUFFICIENT_FUNDS;
  if (error.message?.includes("network")) return TransactionErrorType.NETWORK_ERROR;
  if (error.message?.includes("execution reverted")) return TransactionErrorType.CONTRACT_ERROR;
  return TransactionErrorType.SIGNATURE_ERROR;
};
```

---

## Development and Deployment Infrastructure

### Build Configuration

```typescript
// Next.js configuration for production optimization
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
```

### Environment Configuration

```bash
# Production environment variables
NEXT_PUBLIC_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_NETWORK_MODE=mainnet
```

### Deployment Pipeline

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:e2e": "playwright test"
  }
}
```

---

## Integration Patterns

### API Integration

```typescript
// External service integration pattern
interface ExternalServiceConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

class EVVMServiceClient {
  constructor(private config: ExternalServiceConfig) {}
  
  async validateTransaction(transactionData: any): Promise<boolean> {
    // Validate transaction against external service
  }
  
  async estimateFees(transactionType: string, amount: bigint): Promise<bigint> {
    // Get fee estimation from external service
  }
}
```

### Monitoring Integration

```typescript
// Transaction monitoring
const monitorTransaction = async (
  txHash: string,
  onUpdate: (status: TransactionStatus) => void
) => {
  const receipt = await waitForTransaction({
    hash: txHash,
    confirmations: 2
  });
  
  onUpdate({
    status: receipt.status === "success" ? "confirmed" : "failed",
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed
  });
};
```

---

### Security Considerations

The frontend implements multiple security layers as required by the EVVM ecosystem:

### Signature Security

- All signatures implement EIP-191 standard for security as specified in Signature Structures section
- Nonce-based replay protection for all transaction types following EVVM protocol requirements
- Function selector validation for transaction integrity
- Message format validation before signing ensures compatibility with fisher validation

### Input Sanitization

- Address validation using regex patterns
- Amount validation with BigInt conversion
- Nonce validation for sequential integrity
- String sanitization for identity fields

### Session Management

- Cookie-based session persistence with security flags
- Wallet connection state management
- Automatic session cleanup on disconnect

---

## Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for large components
const PaymentComponent = dynamic(
  () => import('./PaymentFunctions/PaySignaturesComponent'),
  { loading: () => Loading payment interface... }
);

const StakingComponent = dynamic(
  () => import('./StakingFunctions/GoldenStakingComponent'),
  { loading: () => Loading staking interface... }
);
```

### Caching Strategy

```typescript
// React Query configuration for optimal caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

## Extension and Customization

### Adding New Transaction Types

1. **Define Type Structure:**
```typescript
// Add to TypeInputStructures
interface CustomTransactionData {
  customField: string;
  amount: bigint;
  nonce: bigint;
  signature: string;
}
```

2. **Implement Signature Builder:**
```typescript
// Add to SignatureBuilder
const signCustomTransaction = (data: CustomTransactionParams, onSuccess, onError) => {
  const message = constructMessage(
    "custom_selector",
    data.customField,
    data.amount.toString(),
    data.nonce.toString()
  );
  
  signMessage({ message }, { onSuccess, onError });
};
```

3. **Create UI Component:**
```typescript
// Add to SigConstructors
export const CustomTransactionComponent = () => {
  // Implementation following established patterns
};
```

4. **Add Transaction Executor:**
```typescript
// Add to TransactionExecuter
export const executeCustomTransaction = async (
  inputData: CustomTransactionData,
  contractAddress: `0x${string}`
) => {
  return executeTransaction(
    contractAddress,
    CustomContractABI.abi,
    "customFunction",
    [inputData.customField, inputData.amount, inputData.nonce, inputData.signature],
    config
  );
};
```

### Network Extension

```typescript
// Add new network support

export const networks = [
  sepolia,
  arbitrumSepolia,
  polygon,    // New network
  bsc         // New network
];

// Update contract addresses
const contractAddress = {
  // ... existing networks
  137: {      // Polygon Mainnet
    evvm: "0x...",
    nameService: "0x...",
    staking: "0x...",
    estimator: "0x..."
  },
  56: {       // BSC Mainnet
    evvm: "0x...",
    nameService: "0x...",
    staking: "0x...",
    estimator: "0x..."
  }
};
```

---

## Documentation and Maintenance

### Code Documentation Standards

```typescript
/**
 * Constructs and signs an EVVM payment transaction
 * 
 * @param amount - Payment amount in token units
 * @param to - Recipient address or identity string
 * @param tokenAddress - Token contract address
 * @param priorityFee - Priority fee for transaction processing
 * @param nonce - Unique nonce for replay protection
 * @param priority - Priority flag for async/sync processing
 * @param executor - Executor address for transaction execution
 * @param onSuccess - Success callback with signature
 * @param onError - Error callback with error details
 * 
 * @example
 * ```typescript
 * signPay(
 *   "1000000000000000000", // 1 token
 *   "0x123...",            // Recipient address
 *   "0x000...001",         // MATE token
 *   "100000000000000",     // Priority fee
 *   "12345",               // Nonce
 *   true,                  // High priority
 *   "0x000...000",         // No executor
 *   (signature) => console.log("Signed:", signature),
 *   (error) => console.error("Error:", error)
 * );
 * ```
 */
const signPay = (/* parameters */) => {
  // Implementation
};
```

### Testing Infrastructure

```typescript
// Unit test example
describe('SignatureBuilder', () => {
  describe('buildMessageSignedForPay', () => {
    it('should construct correct message format for high priority payment', () => {
      const message = buildMessageSignedForPay(
        "0x1234567890123456789012345678901234567890",
        "0x0987654321098765432109876543210987654321",
        "",
        "0x0000000000000000000000000000000000000001",
        "1000000000000000000",
        "100000000000000",
        "12345",
        true,
        "0x0000000000000000000000000000000000000000"
      );
      
      expect(message).toBe(
        "f4e1895b,0x0987654321098765432109876543210987654321,0x0000000000000000000000000000000000000001,1000000000000000000,100000000000000,12345,true,0x0000000000000000000000000000000000000000"
      );
    });
  });
});
```

---

## References and Related Documentation

### EVVM Core Documentation
- [Introduction](../intro) - EVVM abstract blockchain overview
- [QuickStart](../02-QuickStart.md) - Deploy your EVVM instance
- [Process of a Transaction](../03-ProcessOfATransaction.md) - Complete transaction lifecycle
- [EVVM Core Contract](../04-Contracts/01-EVVM/01-Overview.md) - Payment processing and token management

### Service Documentation
- [Staking System](../04-Contracts/03-Staking/01-Overview.md) - Staking infrastructure and rewards
- [Name Service](../04-Contracts/02-NameService/01-Overview.md) - Username and identity management
- [Treasury System](../04-Contracts/04-Treasury/01-Overview.md) - Cross-chain operations and bridging

### Development Resources
- [How to Create an EVVM Service](../06-HowToMakeAEVVMService.md) - Service development guide
- [Testnet Functions](../04-Contracts/06-TestnetExclusiveFunctions.md) - Testing and faucet functions

### External Libraries
- [Wagmi Documentation](https://wagmi.sh/) - React hooks for Ethereum
- [Viem Documentation](https://viem.sh/) - TypeScript Ethereum client
- [Reown AppKit](https://docs.reown.com/appkit/overview) - Wallet connection infrastructure
- [Next.js Documentation](https://nextjs.org/docs) - React framework
- [EIP-191 Specification](https://eips.ethereum.org/EIPS/eip-191) - Signed message standard

---

This infrastructure documentation provides comprehensive technical details for developers implementing, extending, or integrating with the EVVM Signature Constructor Frontend. The modular architecture ensures maintainability and extensibility while adhering to the EVVM protocol specifications for secure transaction processing.

---

## Registry EVVM Contract Overview


The Registry EVVM Contract is the central registry for EVVM deployments across testnets, implementing a dual-tier registration system with time-delayed governance.

## Registration System

### Public Registration (IDs 1000+)
- **Open Access**: Anyone can register EVVM instances
- **Auto-Incrementing IDs**: Sequential assignment starting from 1000
- **Chain Whitelisting**: Only whitelisted testnet chain IDs allowed
- **Duplicate Prevention**: Same address can't register twice on same chain

### Whitelisted Registration (IDs 1-999)
- **SuperUser Only**: Reserved for official EVVM deployments
- **Custom ID Assignment**: Specific IDs within reserved range
- **Enhanced Control**: Additional validation for official instances

## Governance

- **7-Day Time Delays**: Critical operations require proposal and acceptance periods
- **SuperUser Changes**: Changing superUser requires time-delayed proposal
- **Contract Upgrades**: Implementation upgrades require proposals
- **Security Layer**: Prevents immediate changes, allows community review

## Key Features

### Registration
- `registerEvvm()`: Public registration with auto-incrementing IDs
- `sudoRegisterEvvm()`: SuperUser registration with custom IDs
- `registerChainId()`: Chain ID whitelisting management

### Governance
- `proposeSuperUser()`: Propose new superUser
- `acceptSuperUser()`: Accept pending proposal
- `proposeUpgrade()`: Propose contract upgrade
- `acceptProposalUpgrade()`: Accept upgrade proposal

### Query Functions
- `getEvvmIdMetadata()`: Retrieve EVVM registration metadata
- `getWhiteListedEvvmIdActive()`: List all active whitelisted registrations
- `getPublicEvvmIdActive()`: List all active public registrations
- `isChainIdRegistered()`: Check if chain ID is whitelisted
- `isAddressRegistered()`: Check if address is already registered

## Security Model

### Access Control
- **SuperUser Privileges**: Reserved functions for administrative control
- **Public Access**: Open registration within defined parameters
- **Time Delays**: 7-day waiting period for critical changes

### Input Validation
- **Address Validation**: Prevents zero addresses in registrations
- **Chain ID Validation**: Ensures only valid chain IDs are used
- **Duplicate Prevention**: Prevents multiple registrations of same address

### Upgrade Safety
- **UUPS Pattern**: Implements OpenZeppelin's upgradeable proxy pattern
- **Initialization Protection**: Prevents direct initialization of implementation
- **Governance Controls**: Time-delayed upgrades with proposal system

## Data Structure

### Metadata Structure
```solidity
struct Metadata {
    uint256 chainId;      // Chain ID where EVVM is deployed
    address evvmAddress;  // Contract address of the EVVM
}
```

### Governance Proposal Structure
```solidity
struct AddressTypeProposal {
    address current;        // Currently active address
    address proposal;       // Proposed new address
    uint256 timeToAccept;   // Timestamp when proposal can be accepted
}
```

## Use Cases

### For dApp Developers
- Discover available EVVM instances across different testnets
- Verify official vs community EVVM deployments
- Query metadata for specific EVVM instances

### For EVVM Operators
- Register new EVVM deployments for community use
- Track and manage multiple EVVM instances
- Participate in decentralized EVVM ecosystem

### For Ecosystem Governance
- Manage official EVVM deployments through reserved IDs
- Control testnet access through chain ID whitelisting
- Implement secure governance changes with time delays

This registry system enables a decentralized yet controlled approach to EVVM deployment management, balancing open access with security and quality control.

---

## registerEvvm Function


**Function Type**: `external`  
**Function Signature**: `registerEvvm(uint256,address)`

Public registration function for EVVM instances that allows anyone to register an EVVM deployment on whitelisted testnet chains. The function implements automatic ID assignment starting from 1000, ensuring no conflicts with the reserved range (1-999) used for official deployments managed by the superUser.

### Parameters

| Field         | Type      | Description                                              |
|---------------|-----------|----------------------------------------------------------|
| `chainId`     | `uint256` | The chain ID of the testnet where the EVVM is deployed  |
| `evvmAddress` | `address` | The contract address of the EVVM instance               |

### Workflow

1. **Access Control**: Validates that the caller is authorized using the appropriate modifier. Reverts with `InvalidUser` if not authorized.
2. **Input Validation**: Checks that the provided EVVM address is not the zero address and the chain ID is registered. Reverts with `InvalidInput` on validation failure.
3. **ID Assignment**: Assigns the next available ID from the public range (starting at 1000) to the new EVVM registration.
4. **Metadata Storage**: Stores the chain ID and EVVM address in the contract's metadata mapping for the assigned ID.
5. **State Update**: Updates the public EVVM ID counter and marks the registration as active.

---

---

## sudoRegisterEvvm Function


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `sudoRegisterEvvm(uint256,uint256,address)`

SuperUser registration function for whitelisted EVVM IDs that allows the superUser to register EVVMs with specific IDs in the reserved range (1-999). These IDs are intended for official EVVM deployments that have been vetted and approved by the ecosystem governance. Only the current superUser can call this function, which is managed through a time-delayed governance system.

### Parameters

| Field         | Type      | Description                                              |
|---------------|-----------|----------------------------------------------------------|
| `evvmId`      | `uint256` | The specific reserved ID (1-999) to assign             |
| `chainId`     | `uint256` | The chain ID where the EVVM is deployed                |
| `evvmAddress` | `address` | The contract address of the EVVM instance              |

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Input Validation**: Checks that `evvmId` is within the reserved range (1-999), that both `chainId` and `evvmAddress` are not zero, and that the chain ID is registered. Reverts with `InvalidInput` on validation failure.
3. **Duplicate Prevention**: Verifies that the `evvmAddress` is not already registered for the specified `chainId` and that the `evvmId` is not already in use. Reverts with `AlreadyRegistered` or `EvvmIdAlreadyRegistered` respectively.
4. **Registration Storage**: Stores the metadata in the registry mapping and marks the address as registered for the chain.
5. **Return Assignment**: Returns the assigned EVVM ID (same as the input `evvmId`).

---

## proposeSuperUser Function


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `proposeSuperUser(address)`

Proposes a new superUser address with a mandatory 7-day time delay before the proposal can be accepted. This function initiates the first step of the time-delayed governance process for changing the superUser, providing a security buffer against malicious or hasty changes. Only the current superUser can propose a new superUser.

### Parameters

| Field            | Type      | Description                                    |
|------------------|-----------|------------------------------------------------|
| `_newSuperUser`  | `address` | Address of the proposed new superUser         |

### Requirements

- Only callable by the current superUser
- The proposed address must not be the zero address
- The proposed address must be different from the current superUser

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Input Validation**: Checks that `_newSuperUser` is not the zero address and is different from the current superUser. Reverts on validation failure.
3. **Proposal Creation**: Sets the `superUser.proposal` to the new address and `superUser.timeToAccept` to current timestamp plus 7 days.
4. **Governance State Update**: Updates the proposal state to allow for later acceptance or rejection.

---

## rejectProposalSuperUser


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `rejectProposalSuperUser()`

Cancels a pending superUser change proposal, resetting the governance state to allow for new proposals.

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Proposal Reset**: Clears the proposed superUser address immediately.
3. **State Cleanup**: Resets the timeToAccept timestamp to 0.
4. **Governance Security**: Prevents unwanted superUser changes and maintains current governance structure.

---

## acceptSuperUser


**Function Type**: `external`  
**Function Signature**: `acceptSuperUser()`

Accepts a pending superUser proposal and completes the superUser transition, transferring governance control to the proposed address.

### Workflow

1. **Access Control**: Validates that the caller is the proposed superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not the proposed superUser.
2. **Time Validation**: Checks that the 7-day acceptance period has elapsed using the `timeElapsed` modifier. Reverts with `TimeNotElapsed` if called too early.
3. **State Update**: Sets the caller as the new superUser and clears the proposal data.
4. **Governance Transition**: Completes the superUser transition process and updates system governance.

### Governance Lifecycle
- [`proposeSuperUser()`](./01-proposeSuperUser.md) - Initiate superUser change
- [`rejectProposalSuperUser()`](./02-rejectProposalSuperUser.md) - Cancel proposals

### State Queries
- [`getSuperUserData()`](../../05-GetterFunctions/04-getSuperUserData.md) - Monitor proposal status
- [`getSuperUser()`](../../05-GetterFunctions/05-getSuperUser.md) - Verify current superUser

The `acceptSuperUser` function represents the final, irreversible step in the governance transition process, emphasizing the importance of careful consideration and preparation before execution.

---

## proposeUpgrade


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `proposeUpgrade(address _newImplementation)`

Proposes a new implementation address for contract upgrade with a mandatory 7-day time delay before the upgrade can be executed.

## Parameters

| Parameter             | Type      | Description                                    |
| --------------------- | --------- | ---------------------------------------------- |
| `_newImplementation`  | `address` | Address of the proposed new implementation     |

## Description

This function initiates the first step of the time-delayed governance process for upgrading the contract implementation. It follows the UUPS (Universal Upgradeable Proxy Standard) pattern with additional security through time delays.

## Access Control

**Modifier**: `isSuperUser`

Only the current superUser can propose contract upgrades, ensuring that only authorized governance can initiate system changes.

## Security Features

### Time Delay Protection
- **7-day waiting period**: Provides time for community review and security audits
- **Proposal transparency**: The proposed implementation address is publicly visible
- **Cancellation capability**: SuperUser can reject the proposal at any time

### Implementation Validation
The function validates that:
- The proposed implementation address is not the zero address
- Basic input validation prevents obvious errors

## Upgrade Workflow

### 1. Implementation Preparation
Before proposing an upgrade:
- New implementation contract must be deployed
- Security audits should be completed
- Compatibility testing should be performed

### 2. Proposal Submission
```solidity
// SuperUser proposes new implementation
address newImplementation = 0x1234567890123456789012345678901234567890;
registryContract.proposeUpgrade(newImplementation);
```

### 3. Waiting Period (7 Days)
- Community can review the proposed implementation
- Security researchers can audit the new code
- SuperUser can cancel if issues are discovered

### 4. Upgrade Execution
After 7 days, superUser can execute the upgrade:
```solidity
registryContract.acceptProposalUpgrade();
```

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Input Validation**: Checks that `_implementation` is not the zero address and is different from the current implementation. Reverts on validation failure.
3. **Proposal Creation**: Sets the `upgradeProposal.implementation` to the new address and `upgradeProposal.timeToAccept` to current timestamp plus 7 days.
4. **State Update**: Updates the upgrade proposal state to allow for later acceptance or rejection.

## Implementation Requirements

### UUPS Compatibility
The new implementation must:
- Inherit from `UUPSUpgradeable`
- Implement required upgrade authorization
- Maintain storage layout compatibility
- Include proper initialization functions

### Security Considerations
- Storage layout must be compatible with current version
- New functions should not break existing functionality
- Proper access controls must be maintained

## Usage Example

```solidity
// Deploy new implementation
RegistryEvvmV2 newImplementation = new RegistryEvvmV2();

// Propose the upgrade (superUser only)
registryContract.proposeUpgrade(address(newImplementation));

// Query proposal status
AddressTypeProposal memory proposal = registryContract.getUpgradeProposalData();
console.log("Proposed Implementation:", proposal.proposal);
console.log("Can execute after:", proposal.timeToAccept);
```

## Integration Examples

### Governance Dashboard
```javascript
// Monitor upgrade proposals
const monitorUpgradeProposals = async () => {
    const proposalData = await registryContract.getUpgradeProposalData();
    
    if (proposalData.proposal !== "0x0000000000000000000000000000000000000000") {
        const timeToAccept = new Date(proposalData.timeToAccept * 1000);
        const now = new Date();
        
        if (now >= timeToAccept) {
            console.log("Upgrade proposal ready for execution");
        } else {
            const remainingTime = timeToAccept - now;
            console.log(`Upgrade proposal pending: ${formatTime(remainingTime)} remaining`);
        }
    }
};
```

### Automated Testing Pipeline
```javascript
// Automated testing of proposed implementations
const testProposedImplementation = async (implementationAddress) => {
    // Deploy test proxy with new implementation
    const testProxy = await deployTestProxy(implementationAddress);
    
    // Run compatibility tests
    const compatibilityResults = await runCompatibilityTests(testProxy);
    
    // Run functional tests
    const functionalResults = await runFunctionalTests(testProxy);
    
    // Generate test report
    const report = {
        implementation: implementationAddress,
        compatibility: compatibilityResults,
        functionality: functionalResults,
        recommendation: determineRecommendation(compatibilityResults, functionalResults)
    };
    
    return report;
};
```

## Pre-Upgrade Checklist

### Technical Validation
- [ ] New implementation deployed and verified
- [ ] Storage layout compatibility confirmed
- [ ] All existing functions maintain compatibility
- [ ] New functionality properly tested
- [ ] Security audit completed

### Governance Process
- [ ] Community notification sent
- [ ] Proposal rationale documented
- [ ] Timeline communicated
- [ ] Feedback collection period established

### Risk Assessment
- [ ] Rollback plan prepared
- [ ] Impact analysis completed
- [ ] Communication plan ready
- [ ] Monitoring systems prepared

## Security Considerations

### Implementation Security
- New implementation should be thoroughly audited
- Storage layout changes must be carefully managed
- Access control patterns must be preserved

### Proposal Security
- Validate implementation address before proposing
- Ensure implementation source code is available
- Verify implementation deployment was successful

### Community Security
- Allow sufficient time for community review
- Provide clear documentation of changes
- Enable feedback and concern reporting

## Related Functions

### Upgrade Lifecycle
- [`rejectProposalUpgrade()`](./02-rejectProposalUpgrade.md) - Cancel pending upgrade proposals
- [`acceptProposalUpgrade()`](./03-acceptProposalUpgrade.md) - Execute pending upgrades

### State Queries
- [`getUpgradeProposalData()`](../../05-GetterFunctions/08-getUpgradeProposalData.md) - Query upgrade proposal status
- [`getVersion()`](../../05-GetterFunctions/09-getVersion.md) - Check current contract version

## Best Practices

### Proposal Timing
- Coordinate with other governance activities
- Avoid conflicts with superUser transitions
- Consider community engagement schedules

### Communication
- Announce upgrade proposals publicly
- Provide detailed change documentation
- Maintain transparency throughout process

### Testing
- Comprehensive testing on testnets
- Load testing for performance impact
- Integration testing with dependent systems

---

## rejectProposalUpgrade


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `rejectProposalUpgrade()`

Cancels a pending upgrade proposal, resetting the upgrade governance state to allow for new proposals.

## Description

This function allows the current superUser to cancel any pending upgrade proposal at any time during the 7-day waiting period. It provides a critical safety mechanism to reject upgrades that may have security issues, compatibility problems, or are no longer desired.

## Access Control

**Modifier**: `isSuperUser`

Only the current superUser can reject pending upgrade proposals, ensuring that only the current governance authority can cancel proposed changes.

## Security Features

### Immediate Cancellation
- No time delay required for rejection
- Immediate effect upon successful execution
- Allows for rapid response to discovered issues

### Clean State Reset
- Completely clears the pending upgrade proposal
- Resets the acceptance timestamp
- Allows for immediate new proposals with different implementations

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Proposal Reset**: Clears the proposed implementation address immediately.
3. **State Cleanup**: Resets the timeToAccept timestamp to 0.
4. **Security Measure**: Prevents unwanted contract upgrades and maintains current implementation.

```javascript
// Governance interface for upgrade management
const renderUpgradeManagement = async () => {
    const proposalData = await registryContract.getUpgradeProposalData();
    
    if (proposalData.proposal !== "0x0000000000000000000000000000000000000000") {
        return `
            
                Pending Upgrade Proposal
                Implementation: ${proposalData.proposal}
                Can execute after: ${new Date(proposalData.timeToAccept * 1000)}
                
                <button onclick="rejectUpgrade()" class="reject-btn">
                    Reject Proposal
                </button>
                
                
                    Security Analysis
                    Loading...
                
            
        `;
    }
};

const rejectUpgrade = async () => {
    if (confirm("Are you sure you want to reject this upgrade proposal?")) {
        try {
            await registryContract.rejectProposalUpgrade();
            console.log("Upgrade proposal rejected successfully");
            // Refresh interface
            location.reload();
        } catch (error) {
            console.error("Failed to reject upgrade proposal:", error);
        }
    }
};
```

## Workflow Integration

### Standard Rejection Workflow
1. **Issue Identification**: Discover problems with proposed implementation
2. **Impact Assessment**: Evaluate severity of issues
3. **Stakeholder Communication**: Inform community of rejection
4. **Execute Rejection**: Call `rejectProposalUpgrade()`
5. **Plan Resolution**: Determine next steps for addressing issues

## Related Functions

### Upgrade Lifecycle
- [`proposeUpgrade()`](./01-proposeUpgrade.md) - Create new upgrade proposals
- [`acceptProposalUpgrade()`](./03-acceptProposalUpgrade.md) - Execute pending upgrades

### State Management
- [`getUpgradeProposalData()`](../../05-GetterFunctions/08-getUpgradeProposalData.md) - Query current proposal state
- [`getVersion()`](../../05-GetterFunctions/09-getVersion.md) - Verify current implementation version

The `rejectProposalUpgrade` function serves as a critical safety valve in the upgrade governance system, ensuring that problematic upgrades can be quickly canceled while maintaining the integrity of the time-delayed governance process.

---

## acceptProposalUpgrade


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `acceptProposalUpgrade()`

Accepts a pending upgrade proposal and executes the contract upgrade after the mandatory 7-day waiting period has elapsed.

## Description

This function completes the final step of the time-delayed governance process for contract upgrades. It validates the time delay, executes the upgrade to the new implementation, and cleans up the proposal state.

## Access Control

**Modifier**: `isSuperUser`

Only the current superUser can execute pending upgrade proposals, maintaining governance authority over system changes.

## Requirements

### Time Delay Validation
- Current timestamp must be greater than or equal to `upgradeProposal.timeToAccept`
- The full 7-day waiting period must have elapsed

### Proposal State Validation
- A valid proposal must exist (proposal address cannot be zero)
- Proposal must not have been rejected or expired

## Security Features

### Time Delay Enforcement
- Mandatory 7-day waiting period cannot be bypassed
- Provides community oversight and intervention opportunity
- Allows for thorough security review

### Atomic Execution
- Upgrade and state cleanup happen in single transaction
- Prevents partial state issues
- Ensures clean governance transition

### UUPS Pattern Compliance
- Uses OpenZeppelin's `upgradeToAndCall` for secure upgrades
- Maintains proxy pattern integrity
- Preserves storage layout and state

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Time Validation**: Checks that the 7-day acceptance period has elapsed using the `timeElapsed` modifier. Reverts with `TimeNotElapsed` if called too early.
3. **Upgrade Execution**: Calls the internal `_authorizeUpgrade` function to perform the contract upgrade.
4. **State Cleanup**: Clears the proposal data after successful upgrade execution.

## Related Functions

### Upgrade Lifecycle
- [`proposeUpgrade()`](./01-proposeUpgrade.md) - Initiate upgrade proposals
- [`rejectProposalUpgrade()`](./02-rejectProposalUpgrade.md) - Cancel proposals

### State Queries
- [`getUpgradeProposalData()`](../../05-GetterFunctions/08-getUpgradeProposalData.md) - Monitor proposal status
- [`getVersion()`](../../05-GetterFunctions/09-getVersion.md) - Verify upgrade success

The `acceptProposalUpgrade` function represents the culmination of the upgrade governance process, executing irreversible system changes with appropriate safeguards and validation.

---

## registerChainId


**Function Type**: `external`  
**Access Control**: `isSuperUser`  
**Function Signature**: `registerChainId(uint256[] memory chainIds)`

Registers multiple chain IDs to the whitelist, enabling EVVM registration on those specific blockchain networks.

## Parameters

| Parameter  | Type        | Description                                              |
| ---------- | ----------- | -------------------------------------------------------- |
| `chainIds` | `uint256[]` | Array of chain IDs to whitelist for EVVM registration   |

## Description

This function allows the superUser to add multiple chain IDs to the whitelist in a single transaction. Only whitelisted chain IDs can be used for EVVM registration, providing control over which networks are supported and preventing accidental or malicious registration on inappropriate networks (such as mainnet).

## Access Control

**Modifier**: `isSuperUser`

Only the current superUser can add chain IDs to the whitelist, ensuring that network support decisions remain under governance control.

## Security Features

### Batch Operations
- Efficiently adds multiple chain IDs in a single transaction
- Reduces gas costs for managing multiple networks
- Atomic operation - all additions succeed or fail together

### Input Validation
- Validates that no chain ID in the array is zero
- Prevents registration of invalid networks
- Ensures data integrity in the whitelist

### Network Control
- Prevents mainnet registration by controlling which chains are supported
- Enables support for new testnets as they become available
- Provides fine-grained control over supported networks

### Workflow

1. **Access Control**: Validates that the caller is the current superUser using the `isSuperUser` modifier. Reverts with `InvalidUser` if not authorized.
2. **Input Validation**: Iterates through the provided chain IDs array and validates each ID is not zero. Reverts with `InvalidInput` if any chain ID is zero.
3. **Registration Loop**: For each valid chain ID, sets `isThisChainIdRegistered[chainId] = true` to enable support.
4. **State Update**: Updates the registry to support EVVM deployments on the newly registered chain IDs.

---

## _authorizeUpgrade


**Function Type**: `internal`  
**Access Control**: `isSuperUser`  
**Function Signature**: `_authorizeUpgrade(address newImplementation)`

Internal authorization function required by the UUPS (Universal Upgradeable Proxy Standard) pattern, ensuring only authorized parties can upgrade the contract implementation.

## Parameters

| Parameter            | Type      | Description                                    |
| -------------------- | --------- | ---------------------------------------------- |
| `newImplementation`  | `address` | Address of the new implementation (unused)     |

## Description

This function is an internal override required by OpenZeppelin's `UUPSUpgradeable` contract. It serves as the authorization gate for contract upgrades, but in this implementation, the actual authorization logic is handled by the time-delayed governance system in `acceptProposalUpgrade()`.

## Access Control

**Modifier**: `isSuperUser`

Only the current superUser can authorize upgrades, maintaining governance control over the upgrade process.

## Implementation Details

### Workflow

1. **Internal Access Control**: Called internally by `acceptProposalUpgrade()` which already validates the caller is the current superUser.
2. **Proposal Validation**: Verifies that a valid upgrade proposal exists with a non-zero implementation address.
3. **Time Delay Check**: Confirms that the 7-day waiting period has elapsed through the `timeElapsed` modifier.
4. **Upgrade Authorization**: Authorizes the UUPS proxy upgrade to proceed with the proposed implementation.

---

## getEvvmIdMetadata


**Function Type**: `view`  
**Function Signature**: `getEvvmIdMetadata(uint256 evvmID) returns (Metadata memory)`

Retrieves the complete metadata for a specific EVVM ID, including the chain ID and contract address where the EVVM is deployed.

## Parameters

| Parameter | Type      | Description                        |
| --------- | --------- | ---------------------------------- |
| `evvmID`  | `uint256` | The EVVM ID to query metadata for |

## Return Value

| Type       | Description                                            |
| ---------- | ------------------------------------------------------ |
| `Metadata` | Struct containing chainId and evvmAddress information |

### Metadata Structure

```solidity
struct Metadata {
    uint256 chainId;      // Chain ID where the EVVM is deployed
    address evvmAddress;  // Contract address of the EVVM instance
}
```

---

## getWhiteListedEvvmIdActive


**Function Type**: `view`  
**Function Signature**: `getWhiteListedEvvmIdActive() returns (uint256[] memory)`

Retrieves all active whitelisted EVVM IDs in the reserved range (1-999), providing a complete list of official EVVM deployments.

## Return Value

| Type        | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `uint256[]` | Array of active EVVM IDs in the whitelisted range (1-999)     |

---

## getPublicEvvmIdActive


**Function Type**: `view`  
**Function Signature**: `getPublicEvvmIdActive() returns (uint256[] memory)`

Retrieves all active public EVVM IDs in the public range (1000+), providing a complete list of community-deployed EVVM instances.

## Return Value

| Type        | Description                                                |
| ----------- | ---------------------------------------------------------- |
| `uint256[]` | Array of active EVVM IDs in the public range (1000+)     |

## Description

This function returns all EVVM IDs that have been registered through the public registration system with auto-incrementing IDs starting from 1000. It serves as a discovery mechanism for community-deployed EVVM instances that anyone can register on whitelisted testnets.

---

## getSuperUserData


**Function Type**: `view`  
**Function Signature**: `getSuperUserData() returns (AddressTypeProposal memory)`

Retrieves complete superUser governance data including current superUser, proposed superUser, and acceptance timestamp information.

## Return Value

| Type                   | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `AddressTypeProposal`  | Struct containing current superUser, proposed superUser, and timing data     |

### AddressTypeProposal Structure

```solidity
struct AddressTypeProposal {
    address current;        // Currently active superUser address
    address proposal;       // Proposed new superUser address (0x0 if none)
    uint256 timeToAccept;   // Timestamp when proposal can be accepted (0 if none)
}
```

## Description

This function provides comprehensive information about the superUser governance state, including any pending proposals and their acceptance timelines. It's essential for governance interfaces and monitoring systems that need to track superUser transitions.

---

## getSuperUser


**Function Type**: `view`  
**Function Signature**: `getSuperUser() returns (address)`

Retrieves the current superUser address - the active governance authority for the Registry EVVM contract.

## Return Value

| Type      | Description                           |
| --------- | ------------------------------------- |
| `address` | Address of the current superUser      |

## Description

This function provides a simple way to query the current superUser address without the additional governance proposal data. It's useful for quick access control checks and basic governance queries.

---

## isChainIdRegistered


**Function Type**: `view`  
**Function Signature**: `isChainIdRegistered(uint256 chainId) returns (bool)`

Checks if a specific chain ID is whitelisted for EVVM registration, determining whether registrations are allowed on that blockchain network.

## Parameters

| Parameter | Type      | Description                              |
| --------- | --------- | ---------------------------------------- |
| `chainId` | `uint256` | The chain ID to check for whitelisting  |

## Return Value

| Type   | Description                                                     |
| ------ | --------------------------------------------------------------- |
| `bool` | `true` if the chain ID is whitelisted, `false` otherwise       |

## Description

This function provides a way to verify if EVVM registrations are allowed on a specific blockchain network. Only whitelisted chain IDs can be used for both public and superUser EVVM registrations, providing control over which testnets are supported.

---

## isAddressRegistered


**Function Type**: `view`  
**Function Signature**: `isAddressRegistered(uint256 chainId, address evvmAddress) returns (bool)`

Checks if a specific EVVM address is already registered on a given chain, preventing duplicate registrations and verifying existing registrations.

## Parameters

| Parameter     | Type      | Description                                              |
| ------------- | --------- | -------------------------------------------------------- |
| `chainId`     | `uint256` | The chain ID to check for the address registration      |
| `evvmAddress` | `address` | The EVVM address to check for existing registration     |

## Return Value

| Type   | Description                                                           |
| ------ | --------------------------------------------------------------------- |
| `bool` | `true` if the address is already registered on this chain, `false` otherwise |

## Description

This function provides duplicate prevention and registration verification by checking if a specific EVVM address has already been registered on a particular blockchain. It's essential for maintaining registry integrity and preventing multiple registrations of the same address.

## Usage Examples

### Basic Registration Check
```solidity
// Check if address is already registered on Sepolia
bool isRegistered = registryContract.isAddressRegistered(
    11155111, // Sepolia chain ID
    0x1234567890123456789012345678901234567890
);

if (isRegistered) {
    console.log("EVVM address is already registered on Sepolia");
} else {
    console.log("EVVM address is available for registration");
}
```

### Pre-Registration Validation
```javascript
// Complete validation before registration attempt
const validateRegistration = async (chainId, evvmAddress) => {
    const validation = {
        isValid: true,
        errors: []
    };
    
    try {
        // Check if chain is supported
        const isChainSupported = await registryContract.isChainIdRegistered(chainId);
        if (!isChainSupported) {
            validation.isValid = false;
            validation.errors.push(`Chain ID ${chainId} is not whitelisted`);
        }
        
        // Check if address is already registered
        const isAlreadyRegistered = await registryContract.isAddressRegistered(
            chainId, 
            evvmAddress
        );
        if (isAlreadyRegistered) {
            validation.isValid = false;
            validation.errors.push('EVVM address is already registered on this chain');
        }
        
        // Additional validations
        if (!evvmAddress || evvmAddress === "0x0000000000000000000000000000000000000000") {
            validation.isValid = false;
            validation.errors.push('Invalid EVVM address');
        }
        
    } catch (error) {
        validation.isValid = false;
        validation.errors.push(`Validation failed: ${error.message}`);
    }
    
    return validation;
};
```

### Registration Status Dashboard
```javascript
// Check registration status across multiple chains
const checkMultiChainRegistration = async (evvmAddress, chainIds) => {
    const registrationStatus = {};
    
    for (const chainId of chainIds) {
        try {
            const isRegistered = await registryContract.isAddressRegistered(
                chainId, 
                evvmAddress
            );
            
            registrationStatus[chainId] = {
                chainId,
                isRegistered,
                networkName: await getNetworkName(chainId)
            };
            
        } catch (error) {
            registrationStatus[chainId] = {
                chainId,
                isRegistered: false,
                error: error.message
            };
        }
    }
    
    return registrationStatus;
};
```

## Integration Patterns

### Registration Conflict Detection
```javascript
// Service to detect and handle registration conflicts
class RegistrationConflictDetector {
    constructor(registryContract) {
        this.registry = registryContract;
    }
    
    async checkForConflicts(chainId, evvmAddress) {
        const conflicts = {
            hasConflict: false,
            conflictType: null,
            details: {}
        };
        
        try {
            // Check current chain
            const isRegistered = await this.registry.isAddressRegistered(chainId, evvmAddress);
            
            if (isRegistered) {
                conflicts.hasConflict = true;
                conflicts.conflictType = 'SAME_CHAIN_DUPLICATE';
                conflicts.details.chainId = chainId;
                conflicts.details.address = evvmAddress;
            }
            
            return conflicts;
            
        } catch (error) {
            return {
                hasConflict: true,
                conflictType: 'VALIDATION_ERROR',
                details: { error: error.message }
            };
        }
    }
    
    async suggestAlternatives(chainId, evvmAddress) {
        const suggestions = {
            canRegisterOnOtherChains: [],
            isAlreadyRegistered: await this.registry.isAddressRegistered(chainId, evvmAddress)
        };
        
        // Check other supported chains
        const supportedChains = await this.getSupportedChains();
        
        for (const otherChainId of supportedChains) {
            if (otherChainId !== chainId) {
                const isRegisteredElsewhere = await this.registry.isAddressRegistered(
                    otherChainId, 
                    evvmAddress
                );
                
                suggestions.canRegisterOnOtherChains.push({
                    chainId: otherChainId,
                    isAvailable: !isRegisteredElsewhere,
                    networkName: await getNetworkName(otherChainId)
                });
            }
        }
        
        return suggestions;
    }
    
    async getSupportedChains() {
        // This would need to be implemented based on known chains
        const knownChains = [11155111, 421614, 11155420, 80001, 84532];
        const supported = [];
        
        for (const chainId of knownChains) {
            const isSupported = await this.registry.isChainIdRegistered(chainId);
            if (isSupported) {
                supported.push(chainId);
            }
        }
        
        return supported;
    }
}
```

### Address Registry Scanner
```javascript
// Scan for existing registrations of an address
const scanAddressRegistrations = async (evvmAddress) => {
    const knownChains = [
        { id: 11155111, name: 'Sepolia' },
        { id: 421614, name: 'Arbitrum Sepolia' },
        { id: 11155420, name: 'Optimism Sepolia' },
        { id: 80001, name: 'Polygon Mumbai' },
        { id: 84532, name: 'Base Sepolia' }
    ];
    
    const registrations = [];
    
    for (const chain of knownChains) {
        try {
            // First check if chain is supported
            const isChainSupported = await registryContract.isChainIdRegistered(chain.id);
            
            if (isChainSupported) {
                const isRegistered = await registryContract.isAddressRegistered(
                    chain.id, 
                    evvmAddress
                );
                
                registrations.push({
                    chainId: chain.id,
                    chainName: chain.name,
                    isRegistered,
                    isSupported: true
                });
            } else {
                registrations.push({
                    chainId: chain.id,
                    chainName: chain.name,
                    isRegistered: false,
                    isSupported: false
                });
            }
            
        } catch (error) {
            registrations.push({
                chainId: chain.id,
                chainName: chain.name,
                isRegistered: false,
                isSupported: false,
                error: error.message
            });
        }
    }
    
    return {
        address: evvmAddress,
        totalRegistrations: registrations.filter(r => r.isRegistered).length,
        availableChains: registrations.filter(r => r.isSupported && !r.isRegistered).length,
        registrations
    };
};
```

### Smart Registration Form
```javascript
// Real-time registration form with conflict detection
const createSmartRegistrationForm = () => {
    return {
        async validateInput(chainId, evvmAddress) {
            const validation = {
                chainId: { isValid: true, message: '' },
                evvmAddress: { isValid: true, message: '' },
                overall: { isValid: true, canProceed: false }
            };
            
            // Validate chain ID
            if (!chainId || chainId <= 0) {
                validation.chainId.isValid = false;
                validation.chainId.message = 'Chain ID is required';
            } else {
                const isChainSupported = await registryContract.isChainIdRegistered(chainId);
                if (!isChainSupported) {
                    validation.chainId.isValid = false;
                    validation.chainId.message = 'Chain ID is not whitelisted';
                }
            }
            
            // Validate EVVM address
            if (!evvmAddress || evvmAddress === "0x0000000000000000000000000000000000000000") {
                validation.evvmAddress.isValid = false;
                validation.evvmAddress.message = 'EVVM address is required';
            } else if (!/^0x[a-fA-F0-9]{40}$/.test(evvmAddress)) {
                validation.evvmAddress.isValid = false;
                validation.evvmAddress.message = 'Invalid address format';
            } else if (validation.chainId.isValid) {
                // Check for duplicate registration
                const isAlreadyRegistered = await registryContract.isAddressRegistered(
                    chainId, 
                    evvmAddress
                );
                
                if (isAlreadyRegistered) {
                    validation.evvmAddress.isValid = false;
                    validation.evvmAddress.message = 'Address already registered on this chain';
                }
            }
            
            validation.overall.isValid = validation.chainId.isValid && validation.evvmAddress.isValid;
            validation.overall.canProceed = validation.overall.isValid;
            
            return validation;
        },
        
        async getRegistrationSuggestions(evvmAddress) {
            const suggestions = await scanAddressRegistrations(evvmAddress);
            
            return {
                availableChains: suggestions.registrations
                    .filter(r => r.isSupported && !r.isRegistered)
                    .map(r => ({ chainId: r.chainId, name: r.chainName })),
                    
                alreadyRegistered: suggestions.registrations
                    .filter(r => r.isRegistered)
                    .map(r => ({ chainId: r.chainId, name: r.chainName }))
            };
        }
    };
};
```

## Performance Optimization

### Batch Address Checking
```javascript
// Check multiple addresses efficiently
const batchCheckAddresses = async (chainId, addresses) => {
    const promises = addresses.map(async (address) => {
        try {
            const isRegistered = await registryContract.isAddressRegistered(chainId, address);
            return { address, isRegistered, error: null };
        } catch (error) {
            return { address, isRegistered: false, error: error.message };
        }
    });
    
    const results = await Promise.all(promises);
    
    return {
        chainId,
        total: addresses.length,
        registered: results.filter(r => r.isRegistered).length,
        available: results.filter(r => !r.isRegistered && !r.error).length,
        errors: results.filter(r => r.error).length,
        details: results
    };
};
```

### Cached Registration Status
```javascript
// Cache registration status to reduce contract calls
class RegistrationStatusCache {
    constructor(registryContract, ttl = 60000) { // 1 minute cache
        this.registry = registryContract;
        this.ttl = ttl;
        this.cache = new Map();
    }
    
    getCacheKey(chainId, address) {
        return `${chainId}_${address.toLowerCase()}`;
    }
    
    async isAddressRegistered(chainId, address) {
        const cacheKey = this.getCacheKey(chainId, address);
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.isRegistered;
        }
        
        try {
            const isRegistered = await this.registry.isAddressRegistered(chainId, address);
            
            this.cache.set(cacheKey, {
                isRegistered,
                timestamp: Date.now()
            });
            
            return isRegistered;
            
        } catch (error) {
            console.error(`Failed to check registration for ${address} on chain ${chainId}:`, error);
            throw error;
        }
    }
    
    invalidateCache(chainId = null, address = null) {
        if (chainId && address) {
            const cacheKey = this.getCacheKey(chainId, address);
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
    
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}
```

## Error Handling

### Robust Address Checking
```javascript
// Handle various error conditions gracefully
const safeCheckAddressRegistration = async (chainId, evvmAddress, options = {}) => {
    const { retries = 3, timeout = 10000 } = options;
    
    // Input validation
    if (!chainId || chainId <= 0) {
        return { success: false, error: 'Invalid chain ID' };
    }
    
    if (!evvmAddress || evvmAddress === "0x0000000000000000000000000000000000000000") {
        return { success: false, error: 'Invalid EVVM address' };
    }
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const promise = registryContract.isAddressRegistered(chainId, evvmAddress);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            );
            
            const isRegistered = await Promise.race([promise, timeoutPromise]);
            
            return {
                success: true,
                isRegistered,
                chainId,
                evvmAddress
            };
            
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            
            if (attempt === retries) {
                return {
                    success: false,
                    error: `Failed after ${retries} attempts: ${error.message}`,
                    chainId,
                    evvmAddress
                };
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
};
```

## Security Considerations

### Input Sanitization
```javascript
// Sanitize and validate inputs
const sanitizeAddressCheck = (chainId, evvmAddress) => {
    // Sanitize chain ID
    const numericChainId = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId;
    
    if (!Number.isInteger(numericChainId) || numericChainId <= 0) {
        throw new Error('Chain ID must be a positive integer');
    }
    
    // Sanitize address
    if (typeof evvmAddress !== 'string') {
        throw new Error('EVVM address must be a string');
    }
    
    const cleanAddress = evvmAddress.trim().toLowerCase();
    
    if (!/^0x[a-f0-9]{40}$/.test(cleanAddress)) {
        throw new Error('Invalid EVVM address format');
    }
    
    return {
        chainId: numericChainId,
        evvmAddress: cleanAddress
    };
};
```

## Integration Examples

### API Endpoint
```javascript
// Express.js endpoint for registration checking
app.get('/api/registry/check/:chainId/:address', async (req, res) => {
    try {
        const { chainId, address } = req.params;
        
        // Sanitize inputs
        const sanitized = sanitizeAddressCheck(parseInt(chainId), address);
        
        // Check registration
        const result = await safeCheckAddressRegistration(
            sanitized.chainId, 
            sanitized.evvmAddress
        );
        
        if (result.success) {
            res.json({
                success: true,
                data: {
                    chainId: sanitized.chainId,
                    evvmAddress: sanitized.evvmAddress,
                    isRegistered: result.isRegistered,
                    timestamp: new Date().toISOString()
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to check registration status',
            details: error.message
        });
    }
});
```

## Use Cases

### Registration Validation
- **Duplicate Prevention**: Prevent multiple registrations of the same address
- **Pre-Registration Checks**: Validate before attempting registration
- **Form Validation**: Real-time validation in registration interfaces

### Address Discovery
- **Registration Scanning**: Find where an address is already registered
- **Availability Checking**: Identify available chains for new registrations
- **Cross-Chain Analysis**: Analyze address registration patterns

### Integration Services
- **API Validation**: Validate registration requests in backend services
- **Multi-Chain dApps**: Check registration status across networks
- **Registry Management**: Monitor and manage address registrations

## Related Functions

### Validation Functions
- [`isChainIdRegistered()`](./06-isChainIdRegistered.md) - Check chain support
- [`getEvvmIdMetadata()`](./01-getEvvmIdMetadata.md) - Get registration details

### Registration Functions
- [`registerEvvm()`](../02-RegistrationFunctions/01-registerEvvm.md) - Uses this for duplicate prevention
- [`sudoRegisterEvvm()`](../02-RegistrationFunctions/02-sudoRegisterEvvm.md) - Also uses this for validation

This function provides essential duplicate prevention and registration verification capabilities, ensuring the integrity of the Registry EVVM system while enabling efficient address management across multiple blockchain networks.

---

## getUpgradeProposalData


**Function Type**: `view`  
**Function Signature**: `getUpgradeProposalData() returns (AddressTypeProposal memory)`

Retrieves complete upgrade proposal governance data including current implementation, proposed implementation, and acceptance timestamp information.

## Return Value

| Type                   | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `AddressTypeProposal`  | Struct containing current implementation, proposed implementation, and timing data |

### AddressTypeProposal Structure

```solidity
struct AddressTypeProposal {
    address current;        // Currently active implementation address (unused for upgrades)
    address proposal;       // Proposed new implementation address (0x0 if none)
    uint256 timeToAccept;   // Timestamp when proposal can be accepted (0 if none)
}
```

## Description

This function provides comprehensive information about pending contract upgrade proposals, including the proposed implementation address and acceptance timeline. It's essential for governance interfaces and monitoring systems that need to track contract upgrade processes.

---

## getVersion


**Function Type**: `pure`  
**Function Signature**: `getVersion() returns (uint256)`

Returns the current version number of the Registry EVVM contract for compatibility checks and version tracking.

## Return Value

| Type      | Description                              |
| --------- | ---------------------------------------- |
| `uint256` | Current version number of the contract   |

## Description

This function provides a simple way to query the contract version, enabling applications to verify compatibility, track upgrades, and implement version-specific logic. The version number is hardcoded in the contract and increments with each upgrade.

---

## Overview(09-evvmCli)


The EVVM CLI is a powerful command-line interface tool designed to simplify the deployment, registration, and management of EVVM (Ethereum Virtual Virtual Machine) instances.

## What is the EVVM CLI?

The EVVM CLI (`./evvm`) is an interactive tool that automates the entire lifecycle of EVVM deployments. It handles:

- **Configuration** - Interactive prompts for all deployment parameters
- **Validation** - Automated prerequisite checks and input validation
- **Deployment** - Contract compilation and deployment using Foundry
- **Verification** - Block explorer verification with multiple provider support
- **Registration** - EVVM Registry integration for official identification

## Prerequisites

Before using the EVVM CLI, ensure you have the following installed:

- **Foundry** - [Installation Guide](https://getfoundry.sh/introduction/installation/)
- **Bun** (≥ 1.0) - [Installation Guide](https://bun.sh/)
- **Git** - [Installation Guide](https://git-scm.com/downloads)

The CLI automatically validates these prerequisites before executing commands.

## Installation

Clone the repository and install dependencies:

**Option 1: Using CLI install command (recommended)**

```bash
git clone --recursive https://github.com/EVVM-org/Testnet-Contracts
cd Testnet-Contracts
./evvm install
```

**Option 2: Manual installation**

```bash
git clone --recursive https://github.com/EVVM-org/Testnet-Contracts
cd Testnet-Contracts
bun install
forge install
```

## CLI Structure

The EVVM CLI is organized into several commands:

| Command | Purpose |
|---------|---------|
| [`deploy`](./02-Deploy.md) | Deploy a new EVVM instance (single or cross-chain) |
| [`register`](./03-Register.md) | Register an existing EVVM instance in the registry |
| [`setUpCrossChainTreasuries`](./05-SetUpCrossChainTreasuries.md) | Configure cross-chain treasury stations |
| [`developer`](./06-Developer.md) | Developer utilities and helpers |
| [`help`](./04-HelpAndVersion.md) | Display CLI help information |
| [`version`](./04-HelpAndVersion.md) | Show the current CLI version |

## Basic Usage

```bash
# Display help
./evvm help

# Check version
./evvm version

# Deploy a single-chain EVVM instance
./evvm deploy

# Deploy a cross-chain EVVM instance
./evvm deploy --crossChain

# Register an existing EVVM
./evvm register --evvmAddress 0x...

# Register a cross-chain EVVM
./evvm register --crossChain --evvmAddress 0x...

# Configure cross-chain treasuries
./evvm setUpCrossChainTreasuries

# Generate contract interfaces (for developers)
./evvm developer --makeInterface

# Run test suite
./evvm developer --runTest
```

## Environment Configuration

The CLI uses environment variables from a `.env` file:

### Single-Chain Configuration
```bash
# Required: RPC URL for your target network
RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Optional: Custom Ethereum Sepolia RPC for registry operations
EVVM_REGISTRATION_RPC_URL="https://gateway.tenderly.co/public/sepolia"

# Optional: Etherscan API key for contract verification
ETHERSCAN_API="your_etherscan_api_key"
```

### Cross-Chain Configuration
```bash
# Host chain RPC (main EVVM deployment)
HOST_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# External chain RPC (Treasury External Station)
EXTERNAL_RPC_URL="https://sepolia.base.org"

# Optional: Custom Ethereum Sepolia RPC for registry operations
EVVM_REGISTRATION_RPC_URL="https://gateway.tenderly.co/public/sepolia"

# Optional: Etherscan API key for contract verification
ETHERSCAN_API="your_etherscan_api_key"
```

If RPC URLs are not found in `.env`, the CLI will prompt you to enter them interactively.

Create your `.env` file from the example:

```bash
cp .env.example .env
```

> **Warning: Security**
Never store private keys in `.env` files. Use Foundry's encrypted keystore for wallet management.

## Wallet Management

The CLI uses Foundry's encrypted keystore for secure wallet management:

```bash
# Import a wallet
cast wallet import defaultKey --interactive

# Use a custom wallet name
cast wallet import myWallet --interactive

# Specify wallet during deployment
./evvm deploy --walletName myWallet

# List imported wallets
cast wallet list
```

## Global Options

All commands support these global options:

- `-h`, `--help` - Show command help
- `-v`, `--version` - Show CLI version

## Next Steps

- **[Deploy Command](./02-Deploy.md)** - Learn how to deploy a new EVVM instance
- **[Register Command](./03-Register.md)** - Register your EVVM in the official registry
- **[QuickStart Guide](../02-QuickStart.md)** - Step-by-step deployment tutorial

---

## Deploy Command


Deploy a complete EVVM instance to any supported blockchain network with interactive configuration.

## Command

```bash
./evvm deploy [options]
```

## Description

The `deploy` command is an interactive wizard that guides you through the entire EVVM deployment process. It supports both single-chain and cross-chain deployments, handling configuration collection, input validation, contract deployment, block explorer verification, and optional registry registration.

## Options

### `--skipInputConfig`, `-s`

Skip the interactive configuration wizard and use the existing configuration file.

- **Type**: `boolean`
- **Default**: `false`
- **Usage**: `./evvm deploy --skipInputConfig`

When enabled, the CLI reads configuration from:
- Single-chain: `./input/BaseInputs.sol`
- Cross-chain: `./input/BaseInputs.sol` + `./input/CrossChainInputs.sol`

Useful for:
- Re-deploying with the same configuration
- Automated deployments
- Testing and development workflows

Ensure configuration files exist and contain valid data before using this flag.

### `--walletName <name>`, `-n <name>`

Specify which Foundry wallet to use for single-chain deployment transactions.

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm deploy --walletName myWallet`

The wallet must be previously imported into Foundry's keystore:

```bash
cast wallet import myWallet --interactive
```

### `--walletNameHost <name>`

Specify which Foundry wallet to use for host chain deployment (cross-chain only).

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm deploy --crossChain --walletNameHost hostWallet`

Requires sufficient gas tokens on the host chain.

### `--walletNameExternal <name>`

Specify which Foundry wallet to use for external chain deployment (cross-chain only).

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm deploy --crossChain --walletNameExternal externalWallet`

Requires sufficient gas tokens on the external chain.

### `--crossChain`, `-c`

Deploy a cross-chain EVVM instance with treasury support on two different blockchains.

- **Type**: `boolean`
- **Default**: `false`
- **Usage**: `./evvm deploy --crossChain`

When enabled:
- Deploys EVVM contracts on the **host chain**
- Deploys Treasury External Station on the **external chain**
- Configures cross-chain communication between treasuries

Cross-chain deployments require additional configuration for both host and external chains.

## Required Environment Variables

### Single-Chain Deployment

```bash
# RPC URL for the blockchain where you want to deploy EVVM
RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Optional: Etherscan API key for contract verification
ETHERSCAN_API="your_etherscan_api_key"
```

### Cross-Chain Deployment

```bash
# Host chain RPC (where EVVM core contracts will be deployed)
HOST_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# External chain RPC (where Treasury External Station will be deployed)
EXTERNAL_RPC_URL="https://sepolia.base.org"

# Optional: Ethereum Sepolia RPC for registry operations
EVVM_REGISTRATION_RPC_URL="https://gateway.tenderly.co/public/sepolia"

# Optional: Etherscan API key for contract verification
ETHERSCAN_API="your_etherscan_api_key"
```

If RPC URLs are not found in `.env`, the CLI will prompt you to enter them.

## Deployment Types

### Single-Chain Deployment

Standard EVVM deployment on a single blockchain.

```bash
./evvm deploy
```

**Deployed Contracts:**
- Evvm (Core virtual machine)
- NameService (Domain system)
- Staking (Staking and rewards)
- Estimator (Reward calculation)
- Treasury (Asset management)
- P2PSwap (Token exchange)

### Cross-Chain Deployment

EVVM deployment with cross-chain treasury support.

```bash
./evvm deploy --crossChain
```

**Deployed Contracts:**

**Host Chain:**
- Evvm (Core virtual machine)
- NameService (Domain system)
- Staking (Staking and rewards)
- Estimator (Reward calculation)
- Treasury Host Station (Host-side treasury)
- P2PSwap (Token exchange)

**External Chain:**
- Treasury External Station (External-side treasury)

After cross-chain deployment, you'll need to run `./evvm setUpCrossChainTreasuries` to connect both treasury stations.

## Deployment Flow

### 1. Prerequisites Validation

The CLI validates that all required tools are installed and configured:

- ✅ Foundry installation check
- ✅ Wallet availability verification
- ✅ RPC connectivity test

### 2. Configuration Collection

#### Administrator Addresses

Three administrative addresses are required:

**Admin**
- Full contract administrator privileges
- Can modify system parameters
- Controls contract upgrades

**Golden Fisher**
- Sudo account with privileged staking operations
- Bypasses normal staking constraints
- Used for emergency operations

**Activator**
- Manages epoch activation in the Estimator contract
- Controls reward distribution timing
- Essential for staking rewards system

```
Enter the admin address: 0x...
Enter the goldenFisher address: 0x...
Enter the activator address: 0x...
```

#### Token Configuration

Configure your EVVM's native token:

```
EVVM Name [EVVM]: 
Principal Token Name [Mate Token]: 
Principal Token Symbol [MATE]: 
```

Values in brackets `[value]` are defaults. Press Enter to accept or type a new value.

#### Advanced Metadata (Optional)

Configure token economics and reward parameters:

```
Configure advanced metadata (totalSupply, eraTokens, reward)? (y/n):
```

If you choose `y`, you'll be prompted for:

- **totalSupply** - Total token supply (default: `2033333333000000000000000000`)
- **eraTokens** - Tokens allocated per era (default: `1016666666500000000000000000`)
- **reward** - Reward per block/action (default: `5000000000000000000`)

Unless you have specific token economics requirements, use the default values by answering `n`. The defaults are designed for most use cases.

#### Configuration Summary

Review all entered values:

```
═══════════════════════════════════════
          Configuration Summary
═══════════════════════════════════════

Addresses:
  admin: 0x...
  goldenFisher: 0x...
  activator: 0x...

EVVM Metadata:
  EvvmName: EVVM
  principalTokenName: Mate Token
  principalTokenSymbol: MATE
  principalTokenAddress: 0x0000000000000000000000000000000000000001
  totalSupply: 2033333333000000000000000000
  eraTokens: 1016666666500000000000000000
  reward: 5000000000000000000

Confirm configuration? (y/n):
```

### 3. Chain Validation

The CLI verifies that your target chain is supported:

- **Testnet chains**: Automatically validated against EVVM Registry
- **Local blockchains** (Chain ID 31337/1337): Skip validation, proceed directly
- **Unsupported chains**: Display error with instructions for requesting support

> **Note: Local Development**
Local blockchains (Anvil, Hardhat) are detected automatically and skip registry validation.

### 4. Block Explorer Verification

Choose how to verify your deployed contracts:

```
Select block explorer verification:
🭬 Etherscan v2
  Blockscout
  Sourcify
  Custom
  Skip verification (not recommended)
```

#### Verification Options

**Etherscan v2**
- Requires `ETHERSCAN_API` in `.env` file
- Supports Etherscan and Etherscan-compatible explorers
- Most common option for major networks

**Blockscout**
- Requires block explorer homepage URL
- CLI will prompt: `Enter your Blockscout homepage URL`
- Common for L2s and custom networks

**Sourcify**
- Automatically verifies on [Sourcify](https://sourcify.dev/)
- No API key required
- Decentralized verification

**Custom**
- Provide custom verification flags
- Example: `--verify --verifier-url <url> --verifier-api-key <key>`
- For specialized verification setups

**Skip verification**
- Deploys without verification
- Not recommended for production
- Use only for local testing

### 5. Contract Deployment

The CLI compiles and deploys all EVVM contracts:

```
═══════════════════════════════════════
             Deployment
═══════════════════════════════════════

 Chain ID: 421614
Starting deployment...
```

Six contracts are deployed in sequence:

1. **Staking** - Staking and reward management
2. **Evvm** - Core virtual machine logic
3. **Estimator** - Reward calculation engine
4. **NameService** - Domain name system
5. **Treasury** - Asset management
6. **P2PSwap** - Token exchange

The deployment automatically:
- Links contracts together
- Sets up initial permissions
- Configures cross-contract references

### 6. Deployment Success

After successful deployment, you'll see:

```
✓ Deployment completed successfully!

═══════════════════════════════════════
          Deployed Contracts
═══════════════════════════════════════

  ✓ Staking
    → 0x...
  ✓ Evvm
    → 0x...
  ✓ Estimator
    → 0x...
  ✓ NameService
    → 0x...
  ✓ Treasury
    → 0x...
  ✓ P2PSwap
    → 0x...
```

All contracts are verified on the block explorer with links to view them.

### 7. Registry Registration (Optional)

The CLI asks if you want to register your EVVM immediately:

```
═══════════════════════════════════════
          Next Step: Registration
═══════════════════════════════════════
Your EVVM instance is ready to be registered.

Important:
   To register now, your Admin address must match the defaultKey wallet.
   Otherwise, you can register later using:
   evvm register --evvmAddress 0x...

   📖 For more details, visit:
   https://www.evvm.info/docs/QuickStart#7-register-in-registry-evvm

Do you want to register the EVVM instance now? (y/n):
```

If you choose `y`:

1. CLI prompts for custom Ethereum Sepolia RPC (optional)
2. Calls EVVM Registry contract on Ethereum Sepolia
3. Receives EVVM ID (≥ 1000)
4. Updates your EVVM contract with the assigned ID

If you choose `n`, you can register later using the [`register` command](./03-Register.md).

## Examples

### Basic Deployment

Deploy with interactive configuration:

```bash
./evvm deploy
```

### Deploy with Existing Configuration

Use previously saved configuration:

```bash
./evvm deploy --skipInputConfig
```

### Deploy with Custom Wallet

Use a specific wallet for deployment:

```bash
./evvm deploy --walletName myWallet
```

### Combined Options

Skip configuration and use custom wallet:

```bash
./evvm deploy -s -w myWallet
```

## Output Files

### Configuration File

Generated at `./input/Inputs.sol`:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

abstract contract Inputs {
    address admin = 0x...;
    address goldenFisher = 0x...;
    address activator = 0x...;

    CoreStructs.EvvmMetadata inputMetadata =
        CoreStructs.EvvmMetadata({
            EvvmName: "EVVM",
            EvvmID: 0,
            principalTokenName: "Mate Token",
            principalTokenSymbol: "MATE",
            principalTokenAddress: 0x0000000000000000000000000000000000000001,
            totalSupply: 2033333333000000000000000000,
            eraTokens: 1016666666500000000000000000,
            reward: 5000000000000000000
        });
}
```

### Deployment Data

Saved at `./broadcast/Deploy.s.sol/[chainId]/run-latest.json`:

Contains:
- Transaction details
- Deployed contract addresses
- Constructor arguments
- Gas usage information
- Verification data

## Troubleshooting

### Foundry Not Found

```
Error: Foundry is not installed.
```

**Solution**: Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Wallet Not Found

```
Error: Wallet 'defaultKey' is not available.
```

**Solution**: Import your wallet:
```bash
cast wallet import defaultKey --interactive
```

### Chain Not Supported

```
Error: Host Chain ID 12345 is not supported.
```

**Solution**: 
- For testnet chains, request support at [evvm-registry-contracts](https://github.com/EVVM-org/evvm-registry-contracts)
- For mainnet, EVVM doesn't support mainnet yet
- For local testing, use an unregistered chain ID (e.g., 1337)

### Verification Failed

If verification fails, contracts are still deployed successfully. You can verify manually later using Foundry:

```bash
forge verify-contract <contract_address> <contract_name> \
  --chain-id <chain_id> \
  --etherscan-api-key <api_key>
```

## See Also

- **[Register Command](./03-Register.md)** - Register your deployed EVVM
- **[QuickStart Guide](../02-QuickStart.md)** - Complete deployment tutorial
- **[EVVM Registry](../08-RegistryEvvm/01-Overview.md)** - Registry system documentation

---

## Register Command


Register an existing EVVM instance in the official EVVM Registry to receive a unique EVVM ID.

## Command

```bash
./evvm register [options]
```

## Description

The `register` command integrates your deployed EVVM instance with the EVVM Registry contract on Ethereum Sepolia. It supports both single-chain and cross-chain EVVM registrations.

Registration provides:

- **Unique EVVM ID** - Official identification number (≥ 1000)
- **Chain validation** - Verification of host chain support
- **Ecosystem integration** - Visibility in EVVM ecosystem
- **Standardized metadata** - Consistent EVVM instance information

> **Warning: Critical Requirements**
**All registrations happen on Ethereum Sepolia**, regardless of where your EVVM is deployed. You need ETH Sepolia for gas fees.

Faucets: [ethglobal.com/faucet](https://ethglobal.com/faucet/), [alchemy.com/faucets](https://www.alchemy.com/faucets/ethereum-sepolia)

## Options

### `--evvmAddress <address>`

The address of your deployed EVVM contract.

- **Type**: `0x${string}` (Ethereum address)
- **Required**: Yes (or will prompt)
- **Usage**: `./evvm register --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2`

If not provided, the CLI will prompt you to enter it interactively.

### `--walletName <name>`, `-n <name>`

Specify which Foundry wallet to use for registration transactions (single-chain only).

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm register --evvmAddress 0x... --walletName myWallet`

The wallet must be previously imported into Foundry's keystore:

```bash
cast wallet import myWallet --interactive
```

The wallet address must have sufficient ETH Sepolia for gas fees.

### `--walletNameHost <name>`

Specify which Foundry wallet to use for host chain registration (cross-chain only).

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm register --crossChain --walletNameHost hostWallet`

### `--walletNameExternal <name>`

Specify which Foundry wallet to use for external chain registration (cross-chain only).

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm register --crossChain --walletNameExternal externalWallet`

### `--useCustomEthRpc`

Use a custom Ethereum Sepolia RPC endpoint instead of the public default.

- **Type**: `boolean`
- **Default**: `false`
- **Usage**: `./evvm register --evvmAddress 0x... --useCustomEthRpc`

When enabled:
1. CLI reads `EVVM_REGISTRATION_RPC_URL` from `.env`
2. If not found, prompts for RPC URL
3. Uses custom RPC for all Ethereum Sepolia operations

**Default RPC**: `https://gateway.tenderly.co/public/sepolia`

### `--crossChain`, `-c`

Register a cross-chain EVVM instance.

- **Type**: `boolean`
- **Default**: `false`
- **Usage**: `./evvm register --crossChain --evvmAddress 0x...`

When enabled:
- Prompts for Treasury External Station address
- Reads both `HOST_RPC_URL` and `EXTERNAL_RPC_URL` from `.env`
- Validates both host and external chain support
- Registers cross-chain configuration in the registry

Cross-chain registration requires additional configuration compared to single-chain registration.

### `--treasuryExternalStationAddress <address>` (Cross-Chain Only)

The address of the Treasury External Station contract (required for cross-chain registration).

- **Type**: `0x${string}` (Ethereum address)
- **Required**: Yes for cross-chain (or will prompt)
- **Usage**: `./evvm register --crossChain --evvmAddress 0x... --treasuryExternalStationAddress 0x...`

## Required Environment Variables

### Single-Chain Registration

```bash
# RPC URL for the blockchain where your EVVM is deployed
RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Optional: Custom Ethereum Sepolia RPC (only with --useCustomEthRpc)
EVVM_REGISTRATION_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/your-api-key"
```

### Cross-Chain Registration

```bash
# Host chain RPC (where EVVM core contracts are deployed)
HOST_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# External chain RPC (where Treasury External Station is deployed)
EXTERNAL_RPC_URL="https://sepolia.base.org"

# Optional: Custom Ethereum Sepolia RPC (only with --useCustomEthRpc)
EVVM_REGISTRATION_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/your-api-key"
```

If RPC URLs are not found in `.env`, the CLI will prompt you to enter them.

## Registration Types

### Single-Chain Registration

Register a standard EVVM instance deployed on a single blockchain.

```bash
./evvm register --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2
```

### Cross-Chain Registration

Register an EVVM instance with cross-chain treasury support.

```bash
./evvm register --crossChain \
  --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2 \
  --treasuryExternalStationAddress 0x1234... \
  --walletName myWallet
```

Or use interactive mode:

```bash
./evvm register --crossChain
```

The CLI will prompt for missing addresses.

## Registration Flow

### 1. Prerequisites Validation

The CLI validates that all required tools are installed and configured:

- ✅ Foundry installation check
- ✅ Wallet availability verification
- ✅ Wallet balance check (ETH Sepolia)

### 2. EVVM Address Validation

The CLI prompts for or validates the provided EVVM address:

```
Enter the EVVM Address: 0x...
```

The address must:
- Be a valid Ethereum address format
- Point to a deployed EVVM contract
- Not be already registered (unless within 24-hour edit window)

### 3. Chain Support Verification

The CLI verifies that your host chain is supported:

```
Validating host chain support...
```

The registry checks:
- Chain ID registration status
- Host chain compatibility
- Network requirements

#### Local Blockchain Detection

If deploying on a local blockchain (Chain ID 31337 or 1337):

```
Local Blockchain Detected
Skipping registry contract registration for local development
```

Local deployments skip registration automatically.

#### Unsupported Chain

If your chain is not supported:

```
Error: Host Chain ID 12345 is not supported.

Possible solutions:
  • Testnet chains:
    Request support by creating an issue at:
    https://github.com/EVVM-org/evvm-registry-contracts
    
  • Mainnet chains:
    EVVM currently does not support mainnet deployments.
    
  • Local blockchains (Anvil/Hardhat):
    Use an unregistered chain ID.
    Example: Chain ID 31337 is registered, use 1337 instead.
```

### 4. Registry Contract Call

The CLI interacts with the EVVM Registry contract:

**Contract Address**: `0x389dC8fb09211bbDA841D59f4a51160dA2377832`  
**Network**: Ethereum Sepolia  
**Function**: `registerEvvm(uint256 hostChainId, address evvmAddress)`

```
Setting EVVM ID directly on contract...
```

The registry:
1. Validates the host chain ID
2. Checks EVVM contract compatibility
3. Generates a unique EVVM ID (≥ 1000)
4. Records registration metadata

### 5. EVVM ID Assignment

The CLI receives the generated EVVM ID:

```
EVVM ID generated: 1042
Setting EVVM ID on contract...
```

The CLI then calls `setEvvmID(uint256)` on your EVVM contract to store the ID on-chain.

### 6. Registration Complete

After successful registration:

```
═══════════════════════════════════════
        Registration Complete
═══════════════════════════════════════

EVVM ID: 1042
Contract: 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2

Your EVVM instance is now ready to use!
```

## EVVM ID System

### ID Ranges

- **IDs 1-999**: Reserved for official EVVM deployments by the EVVM team
- **IDs ≥ 1000**: Public registrations (your EVVM will receive one of these)

### ID Modification

- **First 24 hours**: EVVM ID can be changed
- **After 24 hours**: EVVM ID becomes permanent and cannot be modified

Choose your host chain carefully. While you can change the EVVM ID within 24 hours, the host chain association is permanent after the time window.

## Verification

After registration, verify everything is correct:

### Check EVVM ID on Your Contract

```bash
cast call <evvm_address> "getEvvmID()(uint256)" --rpc-url <your_rpc_url>
```

Expected output: Your assigned EVVM ID (e.g., `1042`)

### Check Registry Metadata

```bash
cast call 0x389dC8fb09211bbDA841D59f4a51160dA2377832 \
  "getEvvmIdMetadata(uint256)" <evvm_id> \
  --rpc-url https://gateway.tenderly.co/public/sepolia
```

Should return:
- Host chain ID
- EVVM contract address
- Registration timestamp
- Other metadata

## Examples

### Basic Registration

Register with interactive prompts:

```bash
./evvm register
```

The CLI will prompt for:
- EVVM address
- Confirmation

### Register with Address

Provide EVVM address directly:

```bash
./evvm register --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2
```

### Register with Custom Wallet

Use a specific wallet:

```bash
./evvm register \
  --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2 \
  --walletName myWallet
```

### Register with Custom Ethereum RPC

Use a custom Ethereum Sepolia endpoint:

```bash
./evvm register \
  --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2 \
  --useCustomEthRpc
```

The CLI will use `ETH_SEPOLIA_RPC` from `.env` or prompt for it.

### Complete Example

Full command with all options:

```bash
./evvm register \
  --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2 \
  --walletName myWallet \
  --useCustomEthRpc
```

## Troubleshooting

### Insufficient ETH Sepolia

```
Error: Transaction failed - insufficient funds for gas
```

**Solution**: Get ETH Sepolia from faucets:
- [ETH Global Faucet](https://ethglobal.com/faucet/)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

### Chain Not Supported

```
Error: Host Chain ID 12345 is not supported.
```

**Solution**: Request support by creating an issue at the [EVVM Registry Contracts repository](https://github.com/EVVM-org/evvm-registry-contracts/issues)

### EVVM ID Setting Failed

If the EVVM ID is generated but setting it on your contract fails:

```
Error: EVVM ID setting failed.

You can try manually with:
cast send 0x... \
  --rpc-url <rpc_url> \
  "setEvvmID(uint256)" 1042 \
  --account defaultKey
```

**Solution**: Run the provided `cast send` command manually

### Already Registered

If your EVVM is already registered:

**Within 24 hours**: You can call `setEvvmID()` again to change it  
**After 24 hours**: The EVVM ID is permanent

### RPC Connection Issues

```
Error: Failed to connect to Ethereum Sepolia RPC
```

**Solution**: 
- Check internet connection
- Try using `--useCustomEthRpc` with a reliable RPC endpoint
- Verify Ethereum Sepolia network status

## Registry Contract

### Contract Information

- **Address**: `0x389dC8fb09211bbDA841D59f4a51160dA2377832`
- **Network**: Ethereum Sepolia
- **Etherscan**: [View on Etherscan](https://sepolia.etherscan.io/address/0x389dC8fb09211bbDA841D59f4a51160dA2377832#writeProxyContract)

### Key Functions

**registerEvvm(uint256 hostChainId, address evvmAddress)**
- Registers a new EVVM instance
- Returns: EVVM ID

**getEvvmIdMetadata(uint256 evvmId)**
- Retrieves metadata for an EVVM ID
- Returns: Host chain ID, EVVM address, timestamp

**isChainIdRegistered(uint256 chainId)**
- Checks if a chain ID is supported
- Returns: boolean

## See Also

- **[Deploy Command](./02-Deploy.md)** - Deploy a new EVVM instance
- **[Registry System](../08-RegistryEvvm/01-Overview.md)** - Detailed registry documentation
- **[QuickStart Guide](../02-QuickStart.md)** - Complete deployment and registration tutorial

---

## Help and Version Commands


Display CLI information and usage instructions.

## Help Command

### Command

```bash
./evvm help
```

or

```bash
./evvm --help
./evvm -h
```

### Description

Displays comprehensive CLI usage information including available commands, options, and examples.

### Output

The help command shows:

```
╔═══════════════════════════════════════════════════════════╗
║                     EVVM CLI Tool v2.2.0                  ║
╚═══════════════════════════════════════════════════════════╝

USAGE:
  evvm <command> [options]

COMMANDS:
  deploy              Deploy a new EVVM instance
                      Interactive wizard or use existing inputs (-s)

  register            Register an EVVM instance with the registry
                      Supports single- and cross-chain registration

  setUpCrossChainTreasuries
                      Configure cross-chain treasury stations (host ↔ external)

  fulltest            Run the complete test suite

  developer           Developer helpers and utilities

  help                Display this help message

  version             Show CLI version

DEPLOY OPTIONS:
  --skipInputConfig, -s
                      Skip interactive prompts and use existing ./input/BaseInputs.sol

  --walletName <name>
                      Wallet name imported with cast (default: defaultKey)

  --crossChain, -c
                      Deploy a cross-chain EVVM instance

  Tip: Import keys securely with cast wallet import <name> --interactive
        Never store private keys in .env

REGISTER OPTIONS:
  --evvmAddress <address>
                      EVVM contract address to register

  --walletName <name>
                      Wallet name for registry transactions

  --useCustomEthRpc
                      Use a custom Ethereum Sepolia RPC for registry calls
                      Reads EVVM_REGISTRATION_RPC_URL from .env or prompts if missing

  --crossChain, -c
                      Register a cross-chain EVVM (uses cross-chain registration flow)

SETUP CROSS-CHAIN OPTIONS:
  --treasuryHostStationAddress <address>
  --treasuryExternalStationAddress <address>
  --walletNameHost <name>
  --walletNameExternal <name>
                      Configure treasury station connections between chains

GLOBAL OPTIONS:
  -h, --help          Show help
  -v, --version       Show version

EXAMPLES:
  # Deploy with interactive configuration
  evvm deploy

  # Deploy with custom wallet
  evvm deploy --walletName myWallet

  # Deploy cross-chain
  evvm deploy --crossChain

  # Register EVVM
  evvm register --evvmAddress 0x...

  # Set up cross-chain treasuries
  evvm setUpCrossChainTreasuries

  # Run tests
  evvm developer --runTest

  # Generate interfaces
  evvm developer --makeInterface
```

### When to Use

Use the help command when you need:

- Overview of available commands
- Command syntax and options
- Usage examples
- Links to documentation

---

## Version Command

### Command

```bash
./evvm version
```

or

```bash
./evvm --version
./evvm -v
```

### Description

Displays the current version of the EVVM CLI tool.

### Output

```
EVVM CLI v2.2.0
```

The version number follows semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

### When to Use

Use the version command when:

- Reporting issues on GitHub
- Checking for updates
- Verifying installation
- Following documentation for specific versions

## Related Commands

- [`deploy`](./02-Deploy.md) - Deploy EVVM instances
- [`register`](./03-Register.md) - Register EVVM instances
- [`setUpCrossChainTreasuries`](./05-SetUpCrossChainTreasuries.md) - Configure cross-chain treasuries
- [`developer`](./06-Developer.md) - Developer utilities
v2.2.0
```

The version number follows [Semantic Versioning](https://semver.org/):
- **Major version** - Breaking changes
- **Minor version** - New features (backward compatible)
- **Patch version** - Bug fixes

### Version History

The CLI version is synchronized with the package version in `package.json`.

### When to Use

Check the version when:

- Reporting bugs or issues
- Verifying you have the latest version
- Checking compatibility with documentation
- Troubleshooting CLI behavior

### Updating the CLI

To get the latest version:

```bash
cd Testnet-Contracts
git pull
./evvm install
```

Or clone a fresh copy:

```bash
git clone --recursive https://github.com/EVVM-org/Testnet-Contracts
cd Testnet-Contracts
bun install
```

---

## Global Flags

Both `--help` and `--version` flags work with any command:

### Command-Specific Help

```bash
./evvm deploy --help
./evvm register --help
```

### Check Version Anywhere

```bash
./evvm deploy --version
./evvm register --version
```

All display the CLI version.

---

## Related Commands

- [`deploy`](./02-Deploy.md) - Deploy EVVM instances
- [`register`](./03-Register.md) - Register EVVM instances
- [`setUpCrossChainTreasuries`](./05-SetUpCrossChainTreasuries.md) - Configure cross-chain treasuries
- [`developer`](./06-Developer.md) - Developer utilities

---

## SetUp Cross-Chain Treasuries Command


Configure connections between Host and External treasury stations for cross-chain EVVM instances.

## Command

```bash
./evvm setUpCrossChainTreasuries [options]
```

## Description

The `setUpCrossChainTreasuries` command establishes the bidirectional connection between the Treasury Host Station (deployed on the host chain) and the Treasury External Station (deployed on the external chain). This connection is essential for cross-chain EVVM instances to function properly.

> **Warning: Prerequisites**
Before running this command, you must:
1. Deploy a cross-chain EVVM instance using `./evvm deploy --crossChain`
2. Have both treasury station addresses from the deployment output
3. Have wallets with gas tokens on both chains

## Options

### `--treasuryHostStationAddress <address>`

The address of the Treasury Host Station contract deployed on the host chain.

- **Type**: `0x${string}` (Ethereum address)
- **Required**: Yes (or will prompt)
- **Usage**: `./evvm setUpCrossChainTreasuries --treasuryHostStationAddress 0x...`

### `--treasuryExternalStationAddress <address>`

The address of the Treasury External Station contract deployed on the external chain.

- **Type**: `0x${string}` (Ethereum address)
- **Required**: Yes (or will prompt)
- **Usage**: `./evvm setUpCrossChainTreasuries --treasuryExternalStationAddress 0x...`

### `--walletNameHost <name>`

Specify which Foundry wallet to use for host chain transactions.

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm setUpCrossChainTreasuries --walletNameHost hostWallet`

The wallet must be imported and have gas tokens on the host chain.

### `--walletNameExternal <name>`

Specify which Foundry wallet to use for external chain transactions.

- **Type**: `string`
- **Default**: `defaultKey`
- **Usage**: `./evvm setUpCrossChainTreasuries --walletNameExternal externalWallet`

The wallet must be imported and have gas tokens on the external chain.

## Required Environment Variables

```bash
# Host chain RPC (where Treasury Host Station is deployed)
HOST_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# External chain RPC (where Treasury External Station is deployed)
EXTERNAL_RPC_URL="https://sepolia.base.org"
```

If RPC URLs are not found in `.env`, the CLI will prompt you to enter them.

## Setup Flow

### 1. Prerequisites Validation

The CLI validates that all required tools are installed and configured:

- ✅ Foundry installation check
- ✅ Wallet availability verification (both host and external)
- ✅ RPC connectivity test (both chains)

### 2. Address Collection

The CLI prompts for or validates the provided treasury addresses:

```
Enter the Host Station Address: 0x...
Enter the External Station Address: 0x...
```

### 3. Chain Support Verification

The CLI verifies that both host and external chains are supported:

```
Validating host chain support...
Validating external chain support...
```

### 4. Connection Establishment

The CLI calls the connection functions on both treasury stations:

```
Setting connections...
```

This process:
1. Configures the Host Station to recognize the External Station
2. Configures the External Station to recognize the Host Station
3. Enables bidirectional cross-chain treasury operations

### 5. Completion

```
Your Treasury contracts are now connected!
```

## Usage Examples

### Interactive Mode

Prompt for all addresses:

```bash
./evvm setUpCrossChainTreasuries
```

### Non-Interactive Mode

Provide all addresses via flags:

```bash
./evvm setUpCrossChainTreasuries \
  --treasuryHostStationAddress 0x1234... \
  --treasuryExternalStationAddress 0x5678... \
  --walletNameHost hostWallet \
  --walletNameExternal externalWallet
```

### Using Different Wallets

Use different wallets for each chain:

```bash
./evvm setUpCrossChainTreasuries \
  --treasuryHostStationAddress 0x1234... \
  --treasuryExternalStationAddress 0x5678... \
  --walletNameHost arbitrumWallet \
  --walletNameExternal baseWallet
```

## Troubleshooting

### Chain Not Supported

If a chain is not supported:

```
Error: Host Chain ID 12345 is not supported.

Possible solutions:
  • Testnet chains:
    Request support by creating an issue at:
    https://github.com/EVVM-org/evvm-registry-contracts
    
  • Mainnet chains:
    EVVM currently does not support mainnet deployments.
    
  • Local blockchains (Anvil/Hardhat):
    Use an unregistered chain ID.
    Example: Chain ID 31337 is registered, use 1337 instead.
```

**Solution**: Use a supported testnet or local blockchain with an unregistered chain ID.

### Wallet Not Found

```
Error: Wallet 'myWallet' is not available.

Please import your wallet using:
   cast wallet import myWallet --interactive

   You'll be prompted to enter your private key securely.
```

**Solution**: Import the wallet using Foundry's `cast wallet import` command.

### Insufficient Gas

If transactions fail due to insufficient gas:

**Solution**: 
1. Ensure both wallets have sufficient native tokens on their respective chains
2. Get testnet tokens from faucets:
   - Arbitrum Sepolia: [bridge.arbitrum.io](https://bridge.arbitrum.io/)
   - Base Sepolia: [portal.base.org](https://portal.base.org/)

### RPC URL Issues

If RPC connection fails:

**Solution**:
1. Verify RPC URLs in `.env` are correct and accessible
2. Try using alternative RPC providers
3. Check network connectivity

## Next Steps

After setting up cross-chain treasuries:

1. **Register your EVVM**: Use `./evvm register --crossChain` to register in the EVVM Registry
2. **Test the connection**: Verify cross-chain operations work correctly
3. **Monitor transactions**: Check both chains for transaction confirmations

## Related Commands

- [`deploy --crossChain`](./02-Deploy.md) - Deploy cross-chain EVVM instance
- [`register --crossChain`](./03-Register.md) - Register cross-chain EVVM
- [`help`](./04-HelpAndVersion.md) - Display all CLI commands

---

## Developer Command


Developer utilities and helpers for EVVM contract development.

## Command

```bash
./evvm developer [options]
```

## Description

The `developer` command provides utilities for EVVM developers working with smart contracts. It includes tools for generating interfaces, running tests, and other development workflows.

This command is primarily intended for EVVM core developers and advanced users who need to work with contract interfaces or modify EVVM contracts.

## Options

### `--makeInterface`, `-i`

Generate Solidity interfaces for EVVM contracts.

- **Type**: `boolean`
- **Default**: `false`
- **Usage**: `./evvm developer --makeInterface`

This option:
1. Analyzes compiled EVVM contracts
2. Extracts public/external functions
3. Generates `.sol` interface files
4. Useful for integration and testing

### `--runTest`, `-t`

Run the complete test suite for EVVM contracts.

- **Type**: `boolean`
- **Default**: `false`
- **Usage**: `./evvm developer --runTest`

This option:
1. Compiles all contracts
2. Runs unit tests
3. Runs fuzz tests
4. Generates test reports

## Usage Examples

### Generate Contract Interfaces

```bash
./evvm developer --makeInterface
```

This command will:
- Read compiled contract artifacts
- Generate interface files for all EVVM contracts
- Save interfaces to the appropriate directory

**Output:**
```
Generating contract interfaces...
✓ ICore.sol
✓ INameService.sol
✓ IStaking.sol
✓ IEstimator.sol
✓ ITreasury.sol
✓ IP2PSwap.sol

Interfaces generated successfully!
```

## Use Cases

### For Integration Developers

Generate interfaces to:
- Build external contracts that interact with EVVM
- Create mock contracts for testing
- Ensure type-safe contract interactions

### For Core Developers

Generate interfaces to:
- Update contract interfaces after modifications
- Maintain consistency across contracts
- Document public contract APIs

## Usage Examples

### Interactive Mode

Run without flags for interactive menu:

```bash
./evvm developer
```

This shows options:
```
Select an action:
  🭬 Generate Contract Interfaces
    Run Full Test Suite
    exit
```

### Generate Contract Interfaces

```bash
./evvm developer --makeInterface
```

### Run Tests

```bash
./evvm developer --runTest
```

## Related Commands

- [`deploy`](./02-Deploy.md) - Deploy EVVM contracts
- [`help`](./04-HelpAndVersion.md) - Display all CLI commands

## Examples

### Complete Development Workflow

1. Generate interfaces:
   ```bash
   ./evvm developer --makeInterface
   ```

2. Deploy to local testnet:
   ```bash
   ./evvm deploy --skipInputConfig
   ```

3. Test integration:
   ```bash
   # Use generated interfaces in your test contracts
   ```

## Prerequisites

Before using developer commands:

- **Foundry** - Required for contract compilation
- **Bun** - Required for CLI execution
- **Compiled contracts** - Run `forge build` before generating interfaces

## Troubleshooting

### Contracts Not Compiled

If interface generation fails:

```
Error: No compiled contracts found
```

**Solution**: Compile contracts first:
```bash
forge build
```

### Permission Issues

If file writing fails:

**Solution**: Ensure you have write permissions in the project directory.

## Best Practices

1. **Regenerate after changes**: Always regenerate interfaces after modifying contracts
2. **Version control**: Commit generated interfaces to version control
3. **Testing**: Use generated interfaces in test contracts for type safety
4. **Documentation**: Interfaces serve as contract API documentation

---

## Introduction


## What is EVVM?

EVVM (Ethereum Virtual Virtual Machine) is a virtual blockchain system that runs on existing blockchains, giving you your own blockchain without managing infrastructure.

## Key Features

### Virtual Blockchain
- **No Infrastructure**: Deploy your blockchain without validators or nodes
- **Host Security**: Inherits security from the underlying blockchain
- **Instant Deployment**: Launch in minutes, not months
- **Vertical Scalability**: Run multiple EVVMs on one host blockchain

### Gasless Communication
- **Fishing Spots**: Use any data channel (APIs, messaging, etc.) to transmit transactions
- **Zero Gas Fees**: Transactions through alternative channels cost nothing

## Who Should Use EVVM?

### Organizations & Protocols
Deploy custom blockchain solutions without infrastructure:
- Protocols, enterprises, banks, public sector
- Custom on-chain rules and optimizations
- Blockchain-as-a-Service approach

### Developers
Three ways to build:
1. **Deploy Your Own**: Create isolated, custom blockchain environments
2. **Build Within**: Collaborate in existing EVVM ecosystems
3. **Experiment**: Test future Web3 technologies and EIPs

## Core Components

### EVVM Core Contract
Payment processing and token management:
- Dual-track system for stakers and non-stakers
- Token abstractions using EIP-191 signatures
- Cross-chain transfers via Fisher Bridge

### Name Service
Human-readable identities:
- Username registration and metadata
- Username-based payments

### Staking System
Token staking with rewards:
- Era-based deflationary rewards
- Enhanced access for stakers
- Fisher and service (smart contract) staking support

### Fisher Bridge
Cross-chain asset transfers:
- Secure multi-chain withdrawals
- Decentralized operator network

## Get Started

Deploy your EVVM in minutes with our **[Quickstart Guide](./02-QuickStart.md)**:
- Interactive setup wizard
- Testnet deployment (Sepolia, Arbitrum Sepolia)
- Complete ecosystem deployment
- Local development with Anvil

---

## QuickStart


Deploy your EVVM virtual blockchain in minutes.

> **Note: Building Services Instead?**
Want to build dApps on existing EVVM? Go to **[How to Create an EVVM Service](./06-HowToMakeAEVVMService.md)**.

> **Note: Want to experiment with a EVVM?**
You can start with the **[scaffold-evvm](https://github.com/EVVM-org/scaffold-evvm)**.

---

## Prerequisites

- **Foundry** - [Install](https://getfoundry.sh/introduction/installation/)
- **Bun** (≥ 1.0) - [Install](https://bun.sh/)
- **Git** - [Install](https://git-scm.com/downloads)

The CLI validates these automatically.

## 1. Clone and Install

```bash
git clone --recursive https://github.com/EVVM-org/Testnet-Contracts
cd Testnet-Contracts
bun install
forge install
```

## 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:
```bash
# RPC URL for blockchain to deploy EVVM
RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Optional: Custom Ethereum Sepolia RPC for registry operations
EVVM_REGISTRATION_RPC_URL="https://gateway.tenderly.co/public/sepolia"

# Optional: Etherscan API Key for contract verification
ETHERSCAN_API="your_etherscan_api_key"
```

### Cross-Chain Configuration (Optional)
```bash
# Host chain RPC (main EVVM deployment)
HOST_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# External chain RPC (Treasury External Station)
EXTERNAL_RPC_URL="https://sepolia.base.org"

# Optional: Custom Ethereum Sepolia RPC for registry
EVVM_REGISTRATION_RPC_URL="https://gateway.tenderly.co/public/sepolia"

# Optional: Etherscan API Key for verification
ETHERSCAN_API="your_etherscan_api_key"
```

> **Warning: Never Store Private Keys in .env**
Use Foundry's encrypted keystore to protect your private keys. The `.env` file should only contain RPC URLs and API keys.

## 3. Import Wallet

```bash
cast wallet import defaultKey --interactive
```

This command securely encrypts and stores your private key.

> **Tip: Custom Wallet Name**
You can use any name instead of `defaultKey`:
```bash
cast wallet import myWallet --interactive
```

Then specify it during deployment:
```bash
./evvm deploy --walletName myWallet
```

## 4. Deploy with CLI

If you are on linux or macOS, run:
```bash
./evvm deploy
```

If you are on Windows, run on PowerShell:
```bash
.\evvm.bat deploy
```

Some systems may require `chmod +x evvm` to make the script executable.

The interactive wizard will:
1. Validate prerequisites
2. Configure your EVVM (addresses, metadata, network)
3. Deploy contracts
4. Verify on block explorer
5. Register in EVVM Registry (optional)

### Configuration

The interactive wizard prompts for:

**Administrator Addresses (required):**
- **Admin** - Full contract administrator privileges
- **Golden Fisher** - Sudo account for privileged staking operations
- **Activator** - Manages epoch activation for rewards

```
Enter the admin address: 0x...
Enter the goldenFisher address: 0x...
Enter the activator address: 0x...
```

**Token Configuration (required):**
```
EVVM Name [EVVM]: My EVVM
Principal Token Name [Mate Token]: My Token
Principal Token Symbol [MATE]: MYT
```

Press Enter to accept the default values shown in brackets `[default]`, or type a new value.

**Advanced Metadata (optional):**

The CLI will ask:
```
Configure advanced metadata (totalSupply, eraTokens, reward)? (y/n):
```

If you answer `y`, you'll configure:
- **totalSupply** - Maximum token supply (default: `2033333333000000000000000000`)
- **eraTokens** - Tokens allocated per era (default: `1016666666500000000000000000`)
- **reward** - Reward per transaction (default: `5000000000000000000`)

> **Tip: Recommended for Most Users**
Unless you have specific token economics requirements, **answer `n`** to use default values. The defaults are optimized for most use cases.

**Configuration Summary:**

Review all values before deployment:
```
═════════════════════════════════════════
        Configuration Summary
═════════════════════════════════════════

Addresses:
  admin: 0x...
  goldenFisher: 0x...
  activator: 0x...

Token Metadata:
  EvvmName: My EVVM
  Token Name: My Token
  Token Symbol: MYT

Confirm configuration? (y/n):
```

The CLI shows a summary before deployment. Review and confirm to proceed.

**Block Explorer Verification:**

Choose a verification method for automatic contract verification:

```
Select block explorer verification:
  🭬 Etherscan v2
    Blockscout
    Sourcify
    Custom
    Skip verification (not recommended)
```

**Available Options:**

- **Etherscan v2** - Requires `ETHERSCAN_API` in `.env` file
  - Best for: Major networks (Ethereum, Arbitrum, Base, Optimism)
  - Note: Most common option

- **Blockscout** - Requires block explorer homepage URL
  - Best for: Custom L2s and networks with Blockscout explorer
  - Example URL: `https://sepolia.arbiscan.io/`

- **Sourcify** - No API key required
  - Best for: Decentralized verification across all networks
  - Uses: [https://sourcify.dev/](https://sourcify.dev/)

- **Custom** - Provide custom verification parameters
  - For: Specialized verification setups
  - Example: `--verify --verifier-url <url> --verifier-api-key <key>`

- **Skip verification** - Deploy without verification
  - ⚠️ Not recommended for production
  - Use only for local testing

## 5. Deployment Output

The deployment compiles and deploys **6 core contracts**:

| Contract | Purpose |
|----------|---------|
| **Evvm** | Core virtual machine logic |
| **Staking** | Staking and reward management |
| **Estimator** | Reward calculation engine |
| **NameService** | Domain name system |
| **Treasury** | Asset management and liquidity |
| **P2PSwap** | Peer-to-peer token exchange |

**Success Screen:**

After deployment, you'll see:
```
✓ Deployment completed successfully!

═══════════════════════════════════════
       Deployed Contracts
═══════════════════════════════════════

  ✓ Staking
    → 0x1111111111111111111111111111111111111111
  ✓ Evvm
    → 0x2222222222222222222222222222222222222222
  ✓ Estimator
    → 0x3333333333333333333333333333333333333333
  ✓ NameService
    → 0x4444444444444444444444444444444444444444
  ✓ Treasury
    → 0x5555555555555555555555555555555555555555
  ✓ P2PSwap
    → 0x6666666666666666666666666666666666666666
```

**Verification:**

All contracts are automatically verified on the block explorer with direct links to view them.

**Artifacts:**

- Deployment data: `broadcast/Deploy.s.sol/[chainId]/run-latest.json`
- Generated config: `input/BaseInputs.sol`
- Output summary: `output/evvmDeployment.json` (if saved)

## 6. Register in EVVM Registry

After deployment, register your EVVM to obtain an official EVVM ID.

### During Deployment

The CLI asks if you want to register immediately:
```
Your EVVM instance is ready to be registered.

Do you want to register the EVVM instance now? (y/n):
```

If you choose `y`:
1. CLI prompts for Ethereum Sepolia RPC (optional, uses default if not provided)
2. Submits registration to EVVM Registry contract
3. Receives unique EVVM ID (≥ 1000)
4. Updates your EVVM contract with the assigned ID

If you choose `n`, register later using the command below.

### Register Later

```bash
./evvm register --evvmAddress 0x...
```

**Options:**
```bash
# Basic registration
./evvm register --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2

# With custom wallet
./evvm register \
  --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2 \
  --walletName myWallet

# With custom Ethereum Sepolia RPC
./evvm register \
  --evvmAddress 0x3e562a2e932afd6c1630d5f3b8eb3d88a4b058c2 \
  --useCustomEthRpc
```

### EVVM Registry Details

- **Address:** `0x389dC8fb09211bbDA841D59f4a51160dA2377832`
- **Network:** Ethereum Sepolia
- **View:** [Etherscan](https://sepolia.etherscan.io/address/0x389dC8fb09211bbDA841D59f4a51160dA2377832#writeProxyContract)

**ID Assignment Rules:**
- IDs 1-999: Reserved for official EVVM deployments
- IDs ≥ 1000: Public community registrations
- ID is **permanent** after 24 hours

> **Warning: Critical Requirements**
**All registrations happen on Ethereum Sepolia**, regardless of where your EVVM is deployed.

You need ETH Sepolia for gas fees:
- [EthGlobal Faucet](https://ethglobal.com/faucet/)
- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

**Verify Registration:**

After registration, verify using the registry contract:
```bash
# Check EVVM ID metadata (on Ethereum Sepolia)
cast call 0x389dC8fb09211bbDA841D59f4a51160dA2377832 \
  "getEvvmIdMetadata(uint256)" <evvmID>

# Check ID on your EVVM contract (on your deployment chain)
cast call <your_evvm_address> "getEvvmID()" --rpc-url <your_rpc>
```

## CLI Command Reference

**Deployment & Registration:**
```bash
./evvm deploy                    # Deploy EVVM interactively (single-chain)
./evvm deploy --skipInputConfig  # Deploy using saved config (non-interactive)
./evvm deploy --crossChain       # Deploy cross-chain EVVM instance
./evvm register                  # Register EVVM in registry (interactive)
./evvm register --crossChain     # Register cross-chain EVVM
./evvm register --evvmAddress 0x...
```

**Cross-Chain & Developer:**
```bash
./evvm setUpCrossChainTreasuries  # Connect treasury stations
./evvm developer --makeInterface  # Generate Solidity interfaces
./evvm developer --runTest        # Run test suite
./evvm install                    # Install dependencies
```

**Information:**
```bash
./evvm help                       # Show comprehensive help
./evvm version                    # Show CLI version
```

**Common examples:**
```bash
# Interactive deploy with custom wallet
./evvm deploy --walletName myWallet

# Non-interactive deploy (use saved config)
./evvm deploy --skipInputConfig --walletName myWallet

# Register an EVVM
./evvm register --evvmAddress 0x... --walletName myWallet

# Run tests
./evvm developer --runTest

# Generate interfaces
./evvm developer --makeInterface
```

**Wallet Management:**
```bash
# Import a wallet securely
cast wallet import defaultKey --interactive

# Import with custom name
cast wallet import myWallet --interactive

# List available wallets
cast wallet list
```

**Support:** `https://github.com/EVVM-org/Testnet-Contracts/issues`

## Next Steps

**Learn More About CLI:**
- **[EVVM CLI Overview](./09-evvmCli/01-Overview.md)** - Complete CLI reference
- **[Deploy Command Details](./09-evvmCli/02-Deploy.md)** - Advanced deployment options
- **[Register Command Details](./09-evvmCli/03-Register.md)** - Registration options
- **[Cross-Chain Setup](./09-evvmCli/05-SetUpCrossChainTreasuries.md)** - For cross-chain deployments

**Build Services on Your EVVM:**
- **[How to Make an EVVM Service](./06-HowToMakeAEVVMService.md)** - Build dApps on your EVVM
- **[Transaction Flow](./03-ProcessOfATransaction.md)** - Understand transaction processing
- **[Core Contracts Documentation](./04-Contracts/01-EVVM/01-Overview.md)** - Technical details

**Advanced Topics:**
- **[Signature Structures](./05-SignatureStructures/Overview.md)** - EIP-191 specifications
- **[Registry System](./08-RegistryEvvm/01-Overview.md)** - Registry governance

---

**Support & Issues:**
- GitHub Issues: https://github.com/EVVM-org/Testnet-Contracts/issues
- Documentation: https://www.evvm.info/
- Discord/Community: Check GitHub for community links

Your EVVM is ready for development!

---

## Process of a Transaction in EVVM


Understanding how transactions work in the EVVM (Ethereum Virtual Virtual Machine) ecosystem requires examining its unique architecture. EVVM operates as a virtual blockchain where transactions are processed through a fisher-based validation and execution system, creating a gasless experience for users.

![Transaction Process](./img/03-ProcessOfATransaction/img/transaction-process.svg)

The transaction process consists of four key stages:

1. **Transaction Creation & Signing**: Users create and cryptographically sign transactions using the EIP-191 standard
2. **Transaction Broadcasting**: Signed transactions are sent to fishing spots where fishers can discover them
3. **Fisher Capture & Validation**: Fishers monitor fishing spots, capture transactions, and validate their authenticity
4. **Execution & Rewards**: Valid transactions are executed on EVVM, and rewards are distributed to participants

Each stage is explained in detail below.

## Transaction Creation & Signing

In the first stage, users construct and cryptographically sign their transactions using the EIP-191 standard for secure authentication:

### 1. Transaction Payload Construction

Every EVVM transaction follows a standardized format that includes all necessary information:

```solidity
string.concat(<evvmId>,",",<service/coreAddress>,",",<HashOfFunction(fucntionName,param1,param2,...,paramN)>,",",<originExecutor/senderExecutor>,",",<nonce>,",",<isASyncExec>)
```

**Component breakdown:**

- `<evvmId>`: Unique identifier of the target EVVM instance (which virtual blockchain to use)
- `<service/coreAddress>`: Address of the service or core contract to interact with
- `<HashOfFunction(fucntionName,param1,param2,...,paramN)>`: Keccak256 hash of the abi-encoded function name and parameters
- `<originExecutor/senderExecutor>`: Address of the transaction sender or origin executor that will be responsible for execution (if address is zero, any executor can process it)
- `<nonce>`: Unique number to prevent replay attacks
- `<isASyncExec>`: Boolean indicating if the nonce execution is asynchronous (true) or synchronous (false)

### 2. EIP-191 Signature Generation

The user signs the transaction using the **EIP-191 standard**, which ensures cryptographic authenticity:

```
signature = sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))
```

### 3. Broadcast to Fishing Spot

Once the transaction is signed, the user broadcasts the complete package to a **fishing spot**:

**What gets broadcasted:**

- The signed transaction (with EIP-191 signature)
- Input data (function parameters)
- Target function (which EVVM function to execute)

**Where transactions can be sent (Fishing Spots):**

- **Public Mempool**: Broadcasting to blockchain mempools where anyone can see and capture transactions (e.g., Ethereum mainnet mempool)
- **Private APIs**: Direct submission to fisher-operated APIs for faster or private processing
- **Communication Channels**: Any communication medium where fishers actively monitor for EVVM transactions

### Gas Parameters for Mempool Transactions

When sending transactions to public mempools, specific gas parameters ensure the transaction waits for fisher capture instead of immediate execution:

**Recommended gas settings:**

$$gas = \left(  \frac{lengthOfText}{2}\right) \times 16 + 21000$$

$$maxFeePerGas = 1~gwei$$

$$maxPriorityFeePerGas = 0.0000001~gwei$$

**Why these low values:** These intentionally low gas parameters prevent miners from executing the transaction immediately, giving fishers time to capture and properly validate it through the EVVM system.

## Fisher Capture & Validation

In this critical stage, fishers act as transaction processors who monitor fishing spots, capture user transactions, and perform comprehensive validation before execution:

### 1. Transaction Capture

Fishers actively monitor various fishing spots to capture transactions:

- **Mempool Monitoring**: Scanning blockchain mempools for EVVM transactions
- **API Listening**: Receiving transactions through private APIs
- **Direct Submission**: Users can submit transactions directly to specific fishers

### 2. Comprehensive Validation

Before execution, fishers perform thorough validation:

#### **EIP-191 Signature Verification**

- Fishers verify each EIP-191 signature to ensure transaction authenticity
- Multiple signatures may be required depending on the function (EVVM + service signatures)
- Invalid signatures result in transaction rejection

#### **Nonce Verification**

Nonces are unique numbers that prevent transaction replay attacks. EVVM supports two types:

- **Synchronous Nonces**: Must follow sequential order (1, 2, 3, 4...) for each user account
- **Asynchronous Nonces**: Can be any unused number, providing more flexibility for applications
- **Service-Specific Nonces**: Individual services like NameService and Staking maintain their own nonce systems

#### **Balance & Authorization Checks**

- Sender must have sufficient token balance for the transaction
- Required permissions and access rights are validated
- Service-specific requirements (e.g., staking status, username ownership) are checked

### 3. Fisher Requirements and Incentives

**Who can be a fisher:**

- Any Ethereum address can become a fisher and process transactions
- Stakers (users who have staked MATE tokens) receive enhanced rewards for their service
- Some advanced services may require fishers to be stakers for execution privileges

**Fisher responsibilities:**

- Cover gas costs for executing transactions on the host blockchain (Ethereum, Arbitrum, etc.)
- These costs are typically offset by the rewards received from successful transaction processing

## Execution & Rewards

In the final stage, validated transactions are executed within the EVVM virtual blockchain, and the reward system distributes incentives to participants:

### 1. EVVM Execution

Once validated, the transaction executes within the EVVM virtual blockchain environment:

- **Function Calls**: The specified EVVM function or service function is invoked with the provided parameters
- **State Updates**: Smart contract states are modified according to the transaction logic (balances, ownership, etc.)
- **Token Transfers**: All required payments, fees, and token movements are processed atomically

### 2. Reward Distribution System

The EVVM ecosystem maintains a sustainable economy by rewarding participants who contribute to transaction processing and network security:

#### **Base Rewards for Stakers**

- **EVVM Contract Rewards**: Stakers receive base MATE token rewards for executing EVVM functions
- **Service Rewards**: Additional rewards from services like NameService, Staking Contract, etc.
- **Enhanced Amounts**: Stakers often receive multiplied reward amounts compared to non-stakers

#### **Priority Fee Distribution**

- **Direct Fisher Payment**: Optional priority fees paid by users are sent directly to the fisher who processes their transaction
- **Market-Based Incentives**: Higher priority fees create competition among fishers, leading to faster processing times
- **User Control**: Users decide whether to pay priority fees based on their urgency requirements

#### **Service-Specific Rewards**

Different services provide varying reward structures:

- **NameService**: Rewards for registration, renewal, and offer processing
- **Staking Contract**: Enhanced rewards for staking-related operations
- **Treasury Operations**: Rewards for deposit and withdrawal processing
- **P2P Swap**: Fees from peer-to-peer trading operations

### 3. Reward Requirements

- **Staker Verification**: Only verified stakers receive enhanced rewards
- **Successful Execution**: Rewards are only distributed upon successful transaction completion
- **Gas Coverage**: Fishers must cover host blockchain gas costs, which are typically offset by rewards

### 4. Multi-Service Coordination

EVVM enables sophisticated transactions that can interact with multiple services simultaneously:

- **Cross-Service Operations**: A single transaction can involve multiple EVVM services (payments, name registration, staking operations)
- **Coordinated Rewards**: The reward system automatically accounts for all services involved in a transaction
- **Atomic Execution**: All operations within a transaction either complete successfully together, or the entire transaction fails and reverts

## Economic Model Summary

This multi-layered reward system creates a self-sustaining ecosystem where:

- **Users** pay for services they need, often without gas fees
- **Fishers** are compensated for processing transactions and covering gas costs
- **Stakers** receive enhanced rewards for their long-term commitment to network security
- **Services** can offer incentives to encourage usage and adoption

The result is a virtual blockchain that operates efficiently while maintaining economic incentives for all participants.

---

## How to Create an EVVM Service


Build smart contracts where users don't pay gas fees. Let's learn by building a coffee shop!

## What You'll Learn

**The Problem:** Users hate paying gas fees.

**The Solution:** EVVM Services - users sign transactions off-chain (free), "fishers" execute them (and get rewarded).

## Coffee Shop Example

```solidity
// ❌ Traditional Contract: Users pay gas + coffee price
contract TraditionalCafe {
    function buyCoffee() external payable {
        require(msg.value >= 0.01 ether, "Not enough for coffee");
        // User paid gas + coffee = bad UX
    }
}

// ✅ EVVM Service: Users pay only coffee price, no gas!
contract EVVMCafe {
    function orderCoffee(
        address clientAddress,
        string memory coffeeType,
        uint256 quantity,
        uint256 totalPrice,
        address originExecutor,
        uint256 nonce,
        bool isAsyncExec,
        bytes memory signature,
        uint256 priorityFeeEvvm,
        uint256 nonceEvvm,
        bool isAsyncExecEvvm,
        bytes memory signatureEvvm
    ) external {
        // 1. Customer signed this off-chain (no gas!)
        // 2. Fisher executes this function (gets rewarded)
        // 3. Customer pays only coffee price through EVVM
        // 4. Everyone happy! ☕
    }
}
```

**What happens:**
1. **Customer**: Signs `"<evvmID>,orderCoffee,latte,1,1000000000000000,123456"` (1 latte for 0.001 ETH, no gas!)
2. **Fisher**: Executes the transaction (gets rewarded for doing it)
3. **EVVM**: Handles the payment (customer pays only for coffee)
4. **Result**: Customer gets coffee without gas fees!

### Who are "Fishers"?

**Fishers** = Anyone who executes EVVM transactions

- **Anyone can be a fisher** (even your grandma!)
- **Staker-fishers** get automatic rewards from EVVM
- **Regular fishers** get rewards only if you give them some

Think of fishers like Uber drivers - they provide a service (executing transactions) and get paid for it.

## Installation

**Foundry (Recommended):**
```bash
forge install EVVM-org/Testnet-Contracts
```

Add to `foundry.toml`:
```toml
remappings = ["@evvm/testnet-contracts/=lib/Testnet-Contracts/src/"]
```

**NPM:**
```bash
npm install @evvm/testnet-contracts
```

## Building the Coffee Shop

Let's build step by step. We'll use `EvvmService` - a helper contract that makes everything easier.

### Step 1: Setup

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract EVVMCafe is EvvmService {
    address ownerOfShop;
    
    constructor(address _coreAddress, address _stakingAddress, address _owner) 
        EvvmService(_coreAddress, _stakingAddress) 
    {
        ownerOfShop = _owner;
    }
}
```

**What we did:**
- Import `EvvmService` (gives us helper functions)
- Set owner address
- Connect to Core and Staking contracts

### Step 2: Order Coffee Function

```solidity
function orderCoffee(
    address clientAddress,
    string memory coffeeType,
    uint256 quantity,
    uint256 totalPrice,
    address originExecutor,
    uint256 nonce,
    bool isAsyncExec,
    bytes memory signature,
    uint256 priorityFeeEvvm,
    uint256 nonceEvvm,
    bool isAsyncExecEvvm,
    bytes memory signatureEvvm
) external {
    // 1. Verify customer's signature and consume nonce (prevents replay attacks)
    core.validateAndConsumeNonce(
        clientAddress,
        keccak256(abi.encode(
            "orderCoffee",
            coffeeType,
            quantity,
            totalPrice
        )),
        originExecutor,
        nonce,
        isAsyncExec,
        signature
    );
    
    // 2. Process payment through EVVM
    requestPay(
        clientAddress,
        getEtherAddress(),
        totalPrice,
        priorityFeeEvvm,
        nonceEvvm,
        isAsyncExecEvvm,
        signatureEvvm
    );
    
    // 3. Reward the fisher (if shop is staker)
    if (core.isAddressStaker(address(this))) {
        makeCaPay(msg.sender, getEtherAddress(), priorityFeeEvvm);
        makeCaPay(msg.sender, getPrincipalTokenAddress(), core.getRewardAmount() / 2);
    }
}
```

**What each part does:**
1. **Validate and consume nonce** - Verify customer signature and prevent replay attacks in one call
2. **Process payment** - Customer pays shop through EVVM
3. **Reward fisher** - Give fisher incentive to execute (if shop is staker)

### Step 3: Staking & Withdrawals

```solidity
// Stake tokens to become a staker (earns automatic rewards)
function stake(uint256 amount) external onlyOwner {
    _makeStakeService(amount);
}

// Unstake when needed
function unstake(uint256 amount) external onlyOwner {
    _makeUnstakeService(amount);
}

// Withdraw coffee sale funds
function withdrawFunds(address to) external onlyOwner {
    uint256 balance = core.getBalance(address(this), getEtherAddress());
    makeCaPay(to, getEtherAddress(), balance);
}

// Withdraw accumulated rewards
function withdrawRewards(address to) external onlyOwner {
    uint256 balance = core.getBalance(address(this), getPrincipalTokenAddress());
    makeCaPay(to, getPrincipalTokenAddress(), balance);
}
```

**Why stake?**
- Shop becomes a staker → earns rewards on every transaction
- Can share rewards with fishers → fishers prioritize your transactions
- Creates sustainable economics for your service

> **Note: Complete Code**
See the full implementation: [EVVMCafe.sol](https://github.com/EVVM-org/Hackathon-CoffeShop-Example/blob/main/contracts/src/EVVMCafe.sol)

## Key Concepts

### Nonces (Prevent Replay Attacks)

```solidity
// Without nonce: Evil person can copy signature and order 1000 coffees!
// With nonce: Each signature can only be used once
```

**Two types:**
- **Sync**: Must be in order (1, 2, 3...) - EVVM manages
- **Async**: Any unused number - You track (EVVMCafe uses this)

### Fishers & Rewards

| Who | Gets Rewards? |
|-----|---------------|
| Staker fisher + Paid service | ✅ Automatic |
| Regular fisher + Paid service | ❌ Only if you give custom rewards |
| Any fisher + Free service | ❌ No automatic rewards |

## Common Patterns

**Free Service** (no payments):
```solidity
function freeAction(address user, bytes signature) external {
    validateServiceSignature(...);
    // Your logic
}
```

**Paid Service** (automatic rewards for staker fishers):
```solidity
function paidAction(address user, uint256 amount, bytes signature) external {
    validateServiceSignature(...);
    requestPay(user, getEtherAddress(), amount, ...);
}
```

**Custom Rewards** (you decide who gets what):
```solidity
function customRewardAction(address user, bytes signature) external {
    validateServiceSignature(...);
    // Give custom reward
    makeCaPay(msg.sender, getPrincipalTokenAddress(), rewardAmount);
}
```

## Helper Functions Reference

**From EvvmService:**
```solidity
// Signature & nonce validation (validates signature and consumes nonce in one call)
core.validateAndConsumeNonce(user, hashPayload, originExecutor, nonce, isAsyncExec, signature);

// Payments
requestPay(from, token, amount, priorityFee, nonce, isAsyncExec, signature);
makeCaPay(to, token, amount);

// Addresses
getEtherAddress();              // address(0)
getPrincipalTokenAddress();     // address(1)

// Staking
_makeStakeService(amount);
_makeUnstakeService(amount);

// Check balances
core.getBalance(address, token);
core.isAddressStaker(address);
core.getRewardAmount();
```

## Frontend Example

```javascript
// User signs off-chain (no gas!)
async function orderCoffee(coffeeType, quantity, totalPrice, originExecutor) {
    const nonce = Date.now();
    const hashPayload = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ["string", "string", "uint256", "uint256"],
            ["orderCoffee", coffeeType, quantity, totalPrice]
        )
    );
    const message = `${evvmId},${serviceAddress},${hashPayload},${originExecutor},${nonce},true`;
    const signature = await signer.signMessage(message);
    
    // Send to fisher
    await fetch('/api/fisher', {
        method: 'POST',
        body: JSON.stringify({ 
            clientAddress, coffeeType, quantity, totalPrice, 
            originExecutor, nonce, isAsyncExec: true, signature 
        })
    });
}
```

## Next Steps

**What to explore:**
- **[Staking System](./04-Contracts/03-Staking/01-Overview.md)** - Make your service earn rewards
- **[Signature Structures](./05-SignatureStructures/01-EVVM/01-SinglePaymentSignatureStructure.md)** - Detailed signature formats
- **[Name Service](./04-Contracts/02-NameService/01-Overview.md)** - Add username support
- **[EVVM Core](./04-Contracts/01-EVVM/01-Overview.md)** - Advanced features

**Tips:**
1. Start with free services, add payments later
2. Test extensively on testnet
3. Consider staking for sustainable economics
4. Gasless UX is your biggest advantage

---

Copy the coffee shop example and start building! 🚀

---

## EVVM Noncommercial License v1.0


**SPDX-License-Identifier: EVVM-NONCOMMERCIAL-1.0**

Copyright (c) 2025 MATE Labs Inc., a Delaware corporation

---

## 1. OVERVIEW

This software is licensed under a modified PolyForm Noncommercial License 1.0.0 with additional share-alike requirements. You may use, modify, and distribute this software for noncommercial purposes only, subject to the terms below.

**COMMERCIAL USE REQUIRES A SEPARATE LICENSE.**  
For commercial licensing inquiries, contact: g@evvm.org

Full license text available at: https://polyformproject.org/licenses/noncommercial/1.0.0/

---

## 2. BASE LICENSE: PolyForm Noncommercial 1.0.0

### 2.1 Acceptance
By using this software, you agree to these terms as binding obligations and conditions.

### 2.2 Copyright License
MATE Labs Inc. grants you a copyright license to use the software for any permitted purpose, subject to the distribution and modification restrictions below.

### 2.3 Distribution License
You may distribute copies of the software, including modified versions, provided you comply with Section 3 (Share-Alike Requirements) and Section 2.4 (Notices).

### 2.4 Notices
Anyone receiving the software from you must also receive:
- A copy of this license or the URL: https://polyformproject.org/licenses/noncommercial/1.0.0/
- The following notice: **"Copyright (c) 2025 MATE Labs Inc."**

### 2.5 Changes and New Works License
You may create modifications and derivative works for any permitted purpose, subject to Section 3.

### 2.6 Patent License
MATE Labs Inc. grants you a patent license covering any patent claims that would be infringed by using the software.

### 2.7 Permitted Purposes
The following are permitted purposes:
- **Noncommercial purposes**: Any use that does not generate revenue or provide commercial advantage
- **Personal use**: Research, experimentation, testing, study, entertainment, hobbies, or religious observance without commercial application
- **Noncommercial organizations**: Use by charitable, educational, research, public safety, health, environmental, or government institutions

### 2.8 Fair Use
These terms do not limit your fair use rights under applicable law.

### 2.9 No Sublicensing
You may not sublicense or transfer your licenses to others.

### 2.10 Patent Defense
If you or your company claims the software infringes any patent, all your licenses terminate immediately.

### 2.11 Violations and Cure Period
If you violate these terms, you have **32 days** from written notification to:
- Come into full compliance, AND
- Take practical steps to correct past violations

Otherwise, all licenses terminate immediately.

---

## 3. SHARE-ALIKE REQUIREMENTS

### 3.1 Scope
If you create a **Derivative Work** and engage in **Triggering Distribution**, you must publicly release that Derivative Work under this same license.

### 3.2 Definitions

**"Derivative Work"** means any modification, enhancement, or work based on the software that:
- Alters, adds, or removes functionality of the original code
- Incorporates substantial portions of the original source code
- Creates new components that depend on or interface with the original software

**Derivative Work does NOT include:**
- Configuration files or parameters
- Plugins or extensions that use only public APIs
- Works that merely link to or use the software as a library without modification

**"Triggering Distribution"** means:
- Making the Derivative Work available to any third party (whether by download, hosting, or other means)
- Using the Derivative Work to provide services accessible to third parties
- Deploying the Derivative Work in production environments accessible to others

### 3.3 Publication Requirements
Within **90 days** of first Triggering Distribution, you must:

1. **Publish source code** on a publicly accessible platform (e.g., GitHub, GitLab, Codeberg)
2. **Include this license** with the published code
3. **Provide clear attribution** identifying:
   - The original work (EVVM)
   - MATE Labs Inc. as the original licensor
   - A description of your modifications
4. **Ensure accessibility** - the code must remain publicly available for at least 3 years

### 3.4 Internal Use Exception
You are NOT required to publish Derivative Works that:
- Remain internal to your organization
- Are not distributed to third parties
- Are not used to provide services to external users

However, once you engage in Triggering Distribution, the 90-day publication requirement begins.

---

## 4. NO LIABILITY

**AS FAR AS THE LAW ALLOWS, THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NONINFRINGEMENT.**

**MATE LABS INC. SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THIS SOFTWARE UNDER ANY LEGAL THEORY.**

---

## 5. DEFINITIONS

- **"MATE Labs Inc."** or **"Licensor"**: MATE Labs Inc., a Delaware corporation
- **"Software"**: EVVM and all related components distributed under this license
- **"You"**: The individual or entity agreeing to these terms
- **"Your company"**: Any legal entity you work for, plus all entities under common control
- **"Control"**: Ownership of substantially all assets or power to direct management
- **"Use"**: Any activity with the software requiring a license

---

## 6. QUESTIONS AND COMMERCIAL LICENSING

For questions about this license or to obtain a commercial license:
- Email: g@evvm.org
- Include "EVVM License Inquiry" in subject line

---

**END OF LICENSE**
