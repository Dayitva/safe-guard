// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.17;

import "@gnosis.pm/zodiac/contracts/factory/FactoryFriendly.sol";
import "@gnosis.pm/zodiac/contracts/guard/BaseGuard.sol";


contract DenyTransactionGuard is BaseGuard {
    fallback() external {
        // We don't revert on fallback to avoid issues in case of a Safe upgrade
        // E.g. The expected check method might change and then the Safe would be locked.
    }

    modifier onlySafe() {
        require(msg.sender == safeAddress, "Not the safe");
        _;
    }

    address public safeAddress; // WILL ONLY WORK IF SAFE IS THE OWNER
    mapping (address => bool) public blacklisted;

    constructor(address[] memory _blacklisted, address _safeAddress){
        safeAddress = _safeAddress;
        for (uint i = 0; i < _blacklisted.length; i++) {
            blacklisted[_blacklisted[i]] = true;
        }
    }

    function addAddress(address _newAddress) external onlySafe{
        blacklisted[_newAddress] = true;
    }

    function removeAddress(address _prevAddress) external onlySafe{
        blacklisted[_prevAddress] = false;
    }

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory,
        address
    ) external override {
        require(!blacklisted[to], "You are sending the transaction to an unallowed address");
    }

    function checkAfterExecution(bytes32 txHash, bool success) external override {
    }
}

contract DenyDeployer{
    DenyTransactionGuard[] public deployedContracts;
    uint256 public counter;

    function deploy(address[] memory _blacklisted, address _safeAddress) public {
        DenyTransactionGuard dc = new DenyTransactionGuard(_blacklisted, _safeAddress);
        deployedContracts.push(dc);
        counter = counter + 1;
    }
}