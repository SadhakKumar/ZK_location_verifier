// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LocationVault is ReentrancyGuard {
    error LocationVault__StakedValueInsufficient();
    error LocationVault__InsufficientBalance();
    error LocationVault__NotZkContract();

    event Staked(address staker, uint256 amount);

    // modifier withinLocationAndTimePeriod() {
    //     _;
    // }

    modifier onlyZkContract() {
        if (msg.sender != zkContract) {
            revert LocationVault__NotZkContract();
        }
        _;
    }

    address public zkContract;
    bool public locked;
    uint256 public amount;
    mapping(address immigrant => uint256 amount) balances;

    constructor(uint256 _amount, address _zkContract) {
        amount = _amount;
        locked = false;
        zkContract = _zkContract;
    }

    function stake() public payable {
        if (msg.value >= amount) {
            revert LocationVault__StakedValueInsufficient();
        } else {
            balances[msg.sender] += amount;
            emit Staked(msg.sender, amount);
        }
    }

    function withdraw(uint256 _amount) public nonReentrant {
        if (balances[msg.sender] < _amount) {
            revert LocationVault__InsufficientBalance();
        } else {
            (bool result,) = msg.sender.call{value: _amount}("");
            require(result, "Transfer Failed");
        }
    }
}
