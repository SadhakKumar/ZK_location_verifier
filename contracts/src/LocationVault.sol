// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LocationVault is ReentrancyGuard {
    error LocationVault__StakedValueInsufficient();
    error LocationVault__InsufficientBalance();

    event Staked(address staker, uint256 amount);

    modifier withinLocationAndTimePeriod() {
        _;
    }

    bool public locked;
    uint256 public amount;
    mapping(address immigrant => uint256 amount) balances;

    constructor(uint256 _amount) {
        amount = _amount;
        locked = false;
    }

    function stake() public payable {
        if (msg.value >= amount) {
            revert LocationVault__StakedValueInsufficient();
        } else {
            balances[msg.sender] += amount;
            emit Staked(msg.sender, amount);
        }
    }

    function withdraw(uint256 _amount) public nonReentrant withinLocationAndTimePeriod {
        if (balances[msg.sender] < _amount) {
            revert LocationVault__InsufficientBalance();
        } else {
            (bool result,) = msg.sender.call{value: _amount}("");
            require(result, "Transfer Failed");
        }
    }
}
