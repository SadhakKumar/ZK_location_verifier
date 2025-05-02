// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {LocationVault} from "../src/LocationVault.sol";

contract LocationVaultScript is Script {

  uint256 public constant AMOUNT = 1 ether;
  function run() external returns (LocationVault) {
    vm.startBroadcast();
    LocationVault vault = new LocationVault(AMOUNT);
    vm.stopBroadcast();
    return vault;
  }
}