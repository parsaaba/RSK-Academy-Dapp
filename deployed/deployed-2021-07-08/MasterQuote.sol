// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './iAcademyStudents.sol';
import './iStudentPortfolio.sol';

struct StudentProjectStruct {
    address owner;
    address scProject;
    string info;
}

contract MasterQuote is AccessControl {

    string constant PROJECT_NAME = "Quote";
    iAcademyStudents public studentList;

    StudentProjectStruct[] private projectInfo;
    mapping(address => uint256) private ownerIndex;
    mapping(address => uint256) private scProjectIndex;

    constructor(address addressStudentList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        studentList = iAcademyStudents(addressStudentList);
    }

    event ProjectAdded (address indexed owner, address indexed scProject);
    event ProjectDeleted (address indexed owner, address indexed scProject);    

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MasterName: only owner");
        _;
    }

    function validate (address scProjectAddress) public returns (bool) {
        _validate (msg.sender, scProjectAddress);
        return true;
    }
    
    function validateBySC (address scOwner, address scProjectAddress) public onlyOwner returns (bool) {
        _validate (scOwner, scProjectAddress);
        return true;
    }
    
    function _validate (address scOwner, address scProjectAddress) private returns (bool) {
        //Does it already exist?
        require (!existsScProject(scProjectAddress), "scProject exists");
        require (!existsOwner(scOwner), "owner exists");
        
        //TODO: call Project and validate it

        //Only owner's sc can add
        //require (scProject.owner() == scOwner, "only sc owner");

        StudentProjectStruct memory sps;
        sps.owner = scOwner;
        sps.scProject = scProjectAddress;

        projectInfo.push(sps);
        uint256 index = projectInfo.length;    //Attention: real location is index-1!
        ownerIndex[scOwner] = index;
        scProjectIndex[scProjectAddress] = index;
        
        _addInPortfolio(scOwner, scProjectAddress);

        emit ProjectAdded (scOwner, scProjectAddress);
        return true;
    }    

    function _addInPortfolio(address scOwner, address scProjectAddress) private returns (bool) {
        if (!studentList.isStudent(scOwner))
            return false;

        StudentStruct memory s = studentList.getStudentByAddress(scOwner);        
        if (s.portfolioAddress != address(0x0)) {
            iStudentPortfolio p = iStudentPortfolio(s.portfolioAddress);
            p.addProject(scProjectAddress, PROJECT_NAME);
        }        
        return true;
    }

    function deleteProject () public returns (bool) {
        _deleteProject (msg.sender);
        return true;        
    }

    function deleteProjectBySC (address scOwner) public onlyOwner returns (bool) {
        _deleteProject (scOwner);
        return true;        
    }

    function _deleteProject (address scOwner) private returns (bool) {
        require (existsOwner(scOwner), "owner not exists");

        uint256 indexToDelete = ownerIndex[scOwner] - 1;
        address scProjectToDelete = projectInfo[indexToDelete].scProject;

        uint256 indexToMove = projectInfo.length - 1;
        address ownerToMove = projectInfo[indexToMove].owner;
        address scProjectToMove = projectInfo[indexToMove].scProject;

        projectInfo[indexToDelete] = projectInfo[indexToMove];
        ownerIndex[ownerToMove] = indexToDelete + 1;
        scProjectIndex[scProjectToMove] = indexToDelete + 1;

        delete ownerIndex[scOwner];
        delete scProjectIndex[scProjectToDelete];
        projectInfo.pop();
        
        StudentStruct memory s = studentList.getStudentByAddress(scOwner); 
        if (s.portfolioAddress != address(0x0)) {
            iStudentPortfolio p = iStudentPortfolio(s.portfolioAddress);
            p.deleteProjectByAddress(scProjectToDelete);
        }

        emit ProjectDeleted (scOwner, scProjectToDelete);
        return true;
    }
    
    function updateStudentList(address addressStudentList) public onlyOwner returns (bool) {
        studentList = iAcademyStudents(addressStudentList);
        return true;
    }
    
    //Owner can have more than one scProject? NO
    function existsOwner(address account) public view returns (bool) {
        if (ownerIndex[account] == 0)
            return false;
        else
            return true;
    }
    
    function existsScProject(address scAddress) public view returns (bool) {
        if (scProjectIndex[scAddress] == 0)
            return false;
        else
            return true;
    }
    
    function listProjectsInfo () public view returns (StudentProjectStruct[] memory) {
        return projectInfo;
    }
    
    function countProjects () public view returns (uint) {
        return (projectInfo.length);
    }

    function getProjectByIndex (uint256 index) public view returns (StudentProjectStruct memory) {
        return projectInfo[index - 1];
    }

    function getProjectByOwner (address scOwner) public view returns (StudentProjectStruct memory) {
        uint256 index = ownerIndex[scOwner];
        return projectInfo[index - 1];
    }        
   
   
}
