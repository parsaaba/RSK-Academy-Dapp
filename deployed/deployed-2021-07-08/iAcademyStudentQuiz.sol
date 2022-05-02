// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

struct StudentQuizStruct {
    address student;
    uint8 total;
    uint8 grade;
    uint8 attempt;
    string quiz;
    string answer;
}

interface iAcademyStudentQuiz {
    function addStudentQuizAnswer (address student, string memory quiz, string memory answer, uint8 total, uint8 grade) external returns(uint256);
    function grantRole (bytes32 role, address account) external;
    function exists(address student, string memory quiz) external view returns (bool);
    function indexOf(address student, string memory quiz) external view returns (uint256);
    function getStudentQuiz (uint256 index) external view returns (StudentQuizStruct memory);
}
