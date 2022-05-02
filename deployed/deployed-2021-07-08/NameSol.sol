// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract NameSol {
    string private name;
    address public owner;

    constructor() {
        owner = msg.sender;
        name = "Solange Gueiros";
    }

    function getName() public view returns (string memory) {
        return name;
    }
}