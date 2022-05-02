// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract NameTalip {
    string private name;
    address public owner;

    constructor() {
        owner = msg.sender;
        name = "Talip Altas";
    }

    function getName() public view returns (string memory) {
        return name;
    }
}