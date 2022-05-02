// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;


struct PortfolioStruct {
    address projectAddress; // Key
    //iAcademyProjects.ProjectStruct name;
    string name;    // Key for iAcademyProjects.ProjectStruct
}

interface iStudentPortfolio {
    function addProject (address projectAddress, string memory projectName) external returns (uint256);
    function deleteProjectByAddress (address projectAddress) external returns (bool);
}  

