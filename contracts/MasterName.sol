// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './iName.sol';
import './iAcademyStudents.sol';
import './iStudentPortfolio.sol';


/*
    It must have a Project in AcademyProjectList in order to a Master works.
    The Master validate the project which is in AcademyProjectList.

    PROJECT_NAME is a key.
    So every Master must hava a PROJECT_NAME which the same name in project in AcademyProjectList.

    Master is linked to addressStudentList
    After creater a Master:
        your address must be updated in the project in AcademyProjectList.
        
    A Master has the student list who submited this project.

    MasterName validates the Name and add in student's portfolio.
    MasterName has the student's names = student list!
*/


contract MasterName is AccessControl {

    string constant PROJECT_NAME = "Name";
    iAcademyStudents public studentList;

    NameStruct[] private nameInfo;
    mapping(address => uint256) private ownerIndex;
    mapping(address => uint256) private scNameIndex;
    

    constructor(address addressStudentList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        studentList = iAcademyStudents(addressStudentList);
    }
    
    event NameAdded (address indexed owner, address indexed scName, string name);
    event NameDeleted (address indexed owner, address indexed scName);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MasterName: only owner");
        _;
    }

    function addName (address scNameAddress, string memory name) public returns (bool) {
        _addName (msg.sender, scNameAddress, name);
        return true;
    }
    
    function addNameBySC (address scOwner, address scNameAddress, string memory name) public onlyOwner returns (bool) {
        _addName (scOwner, scNameAddress, name);
        return true;
    }
    
    function _addName (address scOwner, address scNameAddress,  string memory name) private returns (bool) {
        //Does it already exist?
        require (!existsScName(scNameAddress), "scName exists");
        require (!existsOwner(scOwner), "owner exists");
        
        iName scName = iName(scNameAddress);
        //string memory name = scName.getName();
        require (compareStrings(scName.getName(), name), "different name");
        
        //Only owner's sc can add
        require (scName.owner() == scOwner, "only sc owner");
        
        NameStruct memory n;
        n.owner = scOwner;
        n.scName = scNameAddress;
        n.name = name;

        nameInfo.push(n);
        uint256 index = nameInfo.length;    //Attention: real location is index-1!
        ownerIndex[scOwner] = index;
        scNameIndex[scNameAddress] = index;
        
        _addInPortfolio(scOwner, scNameAddress);

        emit NameAdded(scNameAddress, scOwner, name);
        return true;
    }    

    function _addInPortfolio(address scOwner, address scNameAddress) private returns (bool) {
        if (!studentList.isStudent(scOwner))
            return false;

        StudentStruct memory s = studentList.getStudentByAddress(scOwner);        
        if (s.portfolioAddress != address(0x0)) {
            iStudentPortfolio p = iStudentPortfolio(s.portfolioAddress);
            p.addProject(scNameAddress, PROJECT_NAME);
        }
        
        return true;
    }

    function deleteName () public returns (bool) {
        _deleteName (msg.sender);
        return true;        
    }

    function deleteNameBySC (address scOwner) public onlyOwner returns (bool) {
        _deleteName (scOwner);
        return true;        
    }

    function _deleteName (address scOwner) private returns (bool) {
        require (existsOwner(scOwner), "owner not exists");

        uint256 indexToDelete = ownerIndex[scOwner] - 1;
        address scNameToDelete = nameInfo[indexToDelete].scName;

        uint256 indexToMove = nameInfo.length - 1;
        address ownerToMove = nameInfo[indexToMove].owner;
        address scNameToMove = nameInfo[indexToMove].scName;

        nameInfo[indexToDelete] = nameInfo[indexToMove];
        ownerIndex[ownerToMove] = indexToDelete + 1;
        scNameIndex[scNameToMove] = indexToDelete + 1;

        delete ownerIndex[scOwner];
        delete scNameIndex[scNameToDelete];
        nameInfo.pop();
        
        StudentStruct memory s = studentList.getStudentByAddress(scOwner); 
        if (s.portfolioAddress != address(0x0)) {
            iStudentPortfolio p = iStudentPortfolio(s.portfolioAddress);
            p.deleteProjectByAddress(scNameToDelete);
        }

        emit NameDeleted (scOwner, scNameToDelete);
        return true;
    }
    
    function updateStudentList(address addressStudentList) public onlyOwner returns (bool) {
        studentList = iAcademyStudents(addressStudentList);
        return true;
    }
    
    //Owner can have more than one SCName? NO
    function existsOwner(address account) public view returns (bool) {
        if (ownerIndex[account] == 0)
            return false;
        else
            return true;
    }
    
    function existsScName(address scAddress) public view returns (bool) {
        if (scNameIndex[scAddress] == 0)
            return false;
        else
            return true;
    }
    
    function checkName (address scNameAddress, string memory name) public view returns (bool) {
        //Name stored in scName equal name_
        iName scName = iName(scNameAddress);
        string memory nameInSC = scName.getName();
        if (compareStrings(nameInSC, name)) {
            return true;
        }
        return false;
    }
    
    function listNameInfo () public view returns (NameStruct[] memory) {
        return nameInfo;
    }
    
    function countNames () public view returns (uint) {
        return (nameInfo.length);
    }

    function getOwnerSc (address scNameAddress) public view returns (address) {
        iName scName = iName(scNameAddress);
        return scName.owner();
    }
    
    function getName (address scNameAddress) public view returns (string memory) {
        iName scName = iName(scNameAddress);
        return scName.getName();
    }
    
    function getNameInfoByOwner (address account) public view returns (NameStruct memory) {
        return nameInfo[ownerIndex[account]];
    }    

    function getNameInfoByNameSC (address scNameAddress) public view returns (NameStruct memory) {
        return nameInfo[scNameIndex[scNameAddress]];
    }    

    function getNameInfoByIndex (uint256 index) public view returns (NameStruct memory) {
        return nameInfo[index-1];
    } 
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }    
}
