// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.17;

// import "../../common/Enum.sol";
// import "../../base/GuardManager.sol";
// import "../../GnosisSafe.sol";
import "@gnosis.pm/zodiac/contracts/factory/FactoryFriendly.sol";
import "@gnosis.pm/zodiac/contracts/guard/BaseGuard.sol";


contract AllowTransactionGuard is BaseGuard {
    fallback() external 
    {
        // We don't revert on fallback to avoid issues in case of a Safe upgrade
        // E.g. The expected check method might change and then the Safe would be locked.
    }

    modifier onlySafe() {
        require(msg.sender == safeAddress, "Not the safe");
        _;
    }

    address public safeAddress; // WILL ONLY WORK IF SAFE IS THE OWNER
    address public GnosisSafeAddress = address(0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552);
    address public GnosisSafeL2Address = address(0x3E5c63644E683549055b9Be8653de26E0B4CD36E);
    mapping (address => bool) public whitelisted;

    constructor(address[] memory _whitelisted, address _safeAddress){
        safeAddress = _safeAddress;
        for (uint i = 0; i < _whitelisted.length; i++) {
            whitelisted[_whitelisted[i]] = true;
        }
        whitelisted[GnosisSafeAddress] = true;
        whitelisted[GnosisSafeL2Address] = true;
    }

    function addAddress(address _newAddress) external onlySafe{
        whitelisted[_newAddress] = true;
    }

    function removeAddress(address _prevAddress) external onlySafe{
        whitelisted[_prevAddress] = false;
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
        require(whitelisted[to], "You are not sending the transaction to an allowed address");
    }

    function checkAfterExecution(bytes32 txHash, bool success) external override {
    }
}

contract AllowDeployer{
    AllowTransactionGuard[] public deployedContracts;
    uint256 public counter;

    function deploy(address[] memory _whitelisted, address _safeAddress) public {
        AllowTransactionGuard dc = new AllowTransactionGuard(_whitelisted, _safeAddress);
        deployedContracts.push(dc);
        counter = counter + 1;
    }
}