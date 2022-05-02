// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;


struct NameStruct {
    address owner;
    address scName;
    string name;
}

interface iName {
    function owner() external view returns (address);
    function getName() external view returns (string memory);
}

interface iMasterName {
    function existsOwner(address account) external view returns (bool);
    function getNameInfoByOwner (address account) external view returns (NameStruct memory);
}
