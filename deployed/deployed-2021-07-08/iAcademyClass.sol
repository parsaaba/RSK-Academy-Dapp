// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;


//enum studentStatus {Canceled = 0, InProgress = 1, Completed = 2}
enum StudentStatus {Canceled, InProgress, Completed}

struct StudentInClass {
    StudentStatus status;
    uint start;         // UNIX timestamp when the student enrolled
    uint end;           // UNIX timestamp when the student ended
}

interface iAcademyClass {
    function addStudent (address account) external returns (bool);
    function isStudent (address account) external view returns (bool);
}
