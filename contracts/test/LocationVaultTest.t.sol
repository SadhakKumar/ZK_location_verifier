// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {LocationVault} from "../src/LocationVault.sol";

contract LocationVaultTest is Test {
    LocationVault vault;
    uint256 constant AMOUNT = 1 ether;

    function setUp() public {
        vault = new LocationVault(AMOUNT);
    }

    function test__dummy() public pure {
        require(1 == 1);
    }
}
