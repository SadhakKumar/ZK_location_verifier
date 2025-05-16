// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Groth16Verifier} from "./ZkContract.sol";

contract LocationVault is ReentrancyGuard {
    error LocationVault__StakedValueInsufficient();
    error LocationVault__InsufficientBalance();
    error LocationVault__NotZkContract();
    error LocationVault__ProofVerificationFailed();
    error LocationVault__NotAuthority();
    error LocationVault__VisaPeriodOngoing();
    error LocationVault__WithdrawDateExpired();
    error LocationVault__AuthorityCannotWithdrawYet();


    event Staked(address staker, uint256 amount);

    // modifier withinLocationAndTimePeriod() {
    //     _;
    // }

    modifier onlyAuthority() {
        if (msg.sender != authority) {
            revert LocationVault__NotAuthority();
        }
        _;
    }

    modifier onlyZkContract() {
        if (msg.sender != zkContract) {
            revert LocationVault__NotZkContract();
        }
        _;
    }

    modifier verifyProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[1] calldata _pubSignals
    ) {
        if (!Groth16Verifier(zkContract).verifyProof(_pA, _pB, _pC, _pubSignals)) {
            revert LocationVault__ProofVerificationFailed();
        }
        _;
    }

    struct ImmigrantData {
        uint256 visaPeriod;
        uint256 amount;
        uint256 creationTimestamp;
    }

    address public zkContract;
    address public authority;
    bool public locked;
    mapping(address immigrant => ImmigrantData data) immigrantData;

    constructor(address _zkContract) {
        locked = false;
        zkContract = _zkContract;
    }

    function stake(uint256 _period, uint256 _amount) public payable {
        if (msg.value < _amount) {
            revert LocationVault__StakedValueInsufficient();
        } else {
            immigrantData[msg.sender].amount = _amount;
            immigrantData[msg.sender].visaPeriod = _period;
            immigrantData[msg.sender].creationTimestamp = block.timestamp;
            emit Staked(msg.sender, _amount);
        }
    }

    function withdrawByImmigrant(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[1] calldata _pubSignals
    ) public nonReentrant verifyProof(_pA, _pB, _pC, _pubSignals) {
        if (immigrantData[msg.sender].amount <= 0) {
            revert LocationVault__InsufficientBalance();
        }  
        //verify timestampsss
        if (block.timestamp - immigrantData[msg.sender].creationTimestamp < immigrantData[msg.sender].visaPeriod) {
            revert LocationVault__VisaPeriodOngoing();
        }
        if (block.timestamp - immigrantData[msg.sender].creationTimestamp >= immigrantData[msg.sender].visaPeriod + 5 days) {
            revert LocationVault__WithdrawDateExpired();
        }

        uint256 amountToWithdraw = immigrantData[msg.sender].amount;
        immigrantData[msg.sender].amount = 0;
        (bool result,) = payable(msg.sender).call{value: amountToWithdraw}("");
        require(result, "Transfer Failed");
    }

    function setAuthority(address _authority) public {
        authority = _authority;
    }

    function withdrawByAuthority() public nonReentrant onlyAuthority {
        if (immigrantData[msg.sender].amount <= 0) {
            revert LocationVault__InsufficientBalance();
        }  
        if (block.timestamp - immigrantData[msg.sender].creationTimestamp <= immigrantData[msg.sender].visaPeriod + 5 days) {
            revert LocationVault__AuthorityCannotWithdrawYet();
        }
        uint256 amountToWithdraw = immigrantData[msg.sender].amount;
        immigrantData[msg.sender].amount = 0;
        (bool result,) = payable(msg.sender).call{value: amountToWithdraw}("");
        require(result, "Transfer Failed");
    }
}
