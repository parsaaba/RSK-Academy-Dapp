// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

struct ProjectStruct {
    bool active;
    address master;
    string name;
    string description;
    string ABI;
}

interface iAcademyProjectList {
    function exists(string memory name) external view returns (bool);
    function isActive(string memory name) external view returns (bool);
    function getProjectByName (string memory name_) external view returns (ProjectStruct memory);
    function getMasterAddressByName (string memory name_) external view returns (address);
}
