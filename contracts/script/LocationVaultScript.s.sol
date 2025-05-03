// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {LocationVault} from "../src/LocationVault.sol";
import {Groth16Verifier} from "../src/ZkContract.sol";

contract LocationVaultScript is Script {
    uint256 public constant AMOUNT = 1 ether;

    function run() external returns (LocationVault, Groth16Verifier) {
        vm.startBroadcast();
        Groth16Verifier zkContract = new Groth16Verifier();
        LocationVault vault = new LocationVault(AMOUNT, address(zkContract));
        vm.stopBroadcast();
        return (vault, zkContract);
    }
}
