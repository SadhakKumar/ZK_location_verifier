// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {LocationVault} from "../src/LocationVault.sol";
import {Groth16Verifier} from "../src/ZkContract.sol";

contract LocationVaultTest is Test {
    LocationVault vault;
    Groth16Verifier verifier;
    uint256 constant AMOUNT = 1 ether;

    function setUp() public {
        verifier = new Groth16Verifier();
        vault = new LocationVault(AMOUNT, address(verifier));
    }

    function test__dummy() public pure {
        require(1 == 1);
    }
}
