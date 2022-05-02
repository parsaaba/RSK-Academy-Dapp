// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

struct StudentStruct {
    uint index;
    address ownerAddress;
    address portfolioAddress;
    address activeClass;
    address[] studentClasses;
}

interface iAcademyStudents {
    function addStudent (address account) external returns (uint256);
    function addClass (address account, address classAddress) external returns (bool);
    function updateStudentActiveClass (address account, address classAddress) external returns (bool);
    function grantRole (bytes32 role, address account) external;
    function isStudent(address account) external view returns (bool);    
    function getStudentByAddress (address account) external view returns (StudentStruct memory);

    //function delStudent (address account) external returns (bool);
    //function updateName (address account, address scAddress, string memory name_) external returns (bool);
    //function updatePortfolio (address account, address portfolioAddress) external returns (bool);
}