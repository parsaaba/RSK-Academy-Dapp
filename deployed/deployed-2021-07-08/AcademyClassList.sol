// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './AcademyClass.sol';
import './iAcademyClassList.sol';
import './iAcademyStudents.sol';
import './iAcademyStudentQuiz.sol';


contract AcademyClassList is AccessControl {
    //Factory for AcademyClass

    bool public active;
    //mapping(address => ClassStruct) private classInfo;
    //address[] private classAddressIndex;
    ClassStruct[] private classInfo;
    mapping(address => uint256) private classAddressIndex;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
    }

    event AcademyClassCreated(address indexed classAddress, string className);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyClassList: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyClassList: not active");
        _;
    } 

    function createAcademyClass(address addressStudentList, address addressStudentQuiz, string memory className) public onlyOwner onlyActive returns (address) {
        //className = "Devs 2021-01";
        //Can repeat className? YES
        
        AcademyClass ac = new AcademyClass(addressStudentList, addressStudentQuiz, className);
        address classAddress = address(ac);
        
        ClassStruct memory c;
        c.classAddress = classAddress;
        c.active = true;
        c.name = className;
        classInfo.push(c);
        uint256 index = classInfo.length;    //Attention: real location is index-1!
        classAddressIndex[classAddress] = index;

        iAcademyStudents studentList = iAcademyStudents(addressStudentList);
        studentList.grantRole(DEFAULT_ADMIN_ROLE, classAddress);

        iAcademyStudentQuiz studentQuiz = iAcademyStudentQuiz(addressStudentQuiz);
        studentQuiz.grantRole(DEFAULT_ADMIN_ROLE, classAddress);

        emit AcademyClassCreated (classAddress, className);
        return classAddress;
    }
    
    function changeActiveClass(address classAddress) public onlyOwner onlyActive returns(bool) {
        require (!isAcademyClass(classAddress), "class not exists");

        uint256 index = classAddressIndex[classAddress]-1;
        classInfo[index].active = !classInfo[index].active;

        AcademyClass c = AcademyClass(classAddress);
        c.changeClassStatus();
        return true;
    }

    function addClassOwner(address account, address classAddress) public onlyOwner onlyActive {
        AcademyClass c = AcademyClass(classAddress);
        c.grantRole(DEFAULT_ADMIN_ROLE, account);
    }
    
    function delClassOwner(address account, address classAddress) public onlyOwner onlyActive {
        AcademyClass c = AcademyClass(classAddress);
        c.revokeRole(DEFAULT_ADMIN_ROLE, account);
    }    
    
    function changeActive() public onlyOwner returns(bool) {
        active = !active;
        return active;
    }

    function isAcademyClass(address classAddress) public view returns (bool) {
        if (classAddressIndex[classAddress] == 0)
            return false;
        else
            return true;
    }

    function getAcademyClass(address classAddress) public view returns (ClassStruct memory) {
        uint256 index = classAddressIndex[classAddress]-1;
        return classInfo[index];
    }    
    
    function countAcademyClasses() public view returns(uint) {
        return (classInfo.length);
    }
    
    function listAcademyClasses() public view returns(ClassStruct[] memory) {
        return classInfo;
    } 

}


