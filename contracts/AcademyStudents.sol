// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './StudentPortfolio.sol';
import './iAcademyClass.sol';
import './iAcademyStudents.sol';


contract AcademyStudents is AccessControl {

    address public projectListAddress;
    bool public active;

    mapping(address => StudentStruct) private studentInfo;
    address[] private studentIndex;
    mapping(address => mapping (address=>bool) ) private studentClassSubscribed;
    
    constructor(address addressProjectList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
        projectListAddress = addressProjectList;
    }

    event StudentCreated(address indexed studentAddress);
    event StudentRemoved(address indexed studentAddress);
    event StudentSubscribed(address indexed classAddress, address indexed studentAddress);
    event StudentClassSelected(address indexed classAddress, address indexed studentAddress);
    
    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyStudents: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyStudents: not active");
        _;
    } 

    function addStudent (address account) public onlyOwner onlyActive returns (uint256) {
        uint256 indexStudent;
        if (!isStudent(account)) {
            indexStudent = _addStudent(account);
        }
        
        //Portfolio created for each student
        StudentPortfolio p = new StudentPortfolio (account, projectListAddress);
        studentInfo[account].portfolioAddress = address(p);
        
        return indexStudent;
    }
    
    function _addStudent (address account) private returns (uint256) {
        if (isStudent(account))
            return 0;
        //require (!isStudent(account), "student already exists");
        
        studentInfo[account].ownerAddress = account;
        studentIndex.push(account);
        uint256 index = studentIndex.length - 1;
        studentInfo[account].index = index;
        
        emit StudentCreated(account);
        return index;
    }
    
    function delStudent (address account) public onlyOwner onlyActive returns (bool) {
        _delStudent(account);
        return true;
    }
    
    function _delStudent (address account) private returns (bool) {
        if (!isStudent(account))
            return false;
        //require (isStudent(account), "student not exists");
        
        uint indexToDelete = studentInfo[account].index;
        address keyToMove = studentIndex[studentIndex.length-1];
        studentIndex[indexToDelete] = keyToMove;
        studentInfo[keyToMove].index = indexToDelete;
        
        delete studentInfo[account];
        studentIndex.pop();
        
        //Mantém o Portfolio do estudante?

        emit StudentRemoved(account);
        return true;
    }

    function addClass (address account, address classAddress) public onlyOwner onlyActive returns (bool) {
        if (!isStudent(account)) 
            return false;

        //Verificar se ele já está inscrito nesta classe
        if (!studentClassSubscribed[account][classAddress]) {
            studentInfo[account].studentClasses.push(classAddress);
            studentClassSubscribed[account][classAddress] = true;
        }
        
        emit StudentSubscribed(classAddress, account);
        return true;
    }

    function updateActiveClass (address classAddress) public returns (bool) {
        return _updateActiveClass(msg.sender, classAddress);
    }
    
    function updateStudentActiveClass (address account, address classAddress) public onlyOwner returns (bool) {
        return _updateActiveClass(account, classAddress);
    }

    function _updateActiveClass (address account, address classAddress) private onlyActive returns (bool) {
        if (!isStudent(account))
            return false;
        studentInfo[account].activeClass = classAddress;
        emit StudentClassSelected(classAddress, account);
        return true;
    }

    function changeActive() public onlyOwner returns (bool) {
        active = !active;
        return active;
    }

    function updateProjectListAddress (address addressProjectList) public onlyOwner returns (bool) {
        projectListAddress = addressProjectList;
        return true;
    }
    
    function isStudent(address account) public view returns (bool) {
        if(studentIndex.length == 0) return false;
        return (studentIndex[studentInfo[account].index] == account);
    }
    
    function getStudentByAddress (address account) public view returns (StudentStruct memory) {
        if (!isStudent(account)) {
            StudentStruct memory s;
            return s;
        }
        else 
            return studentInfo[account];
    }

    function countStudents () public view returns (uint256) {
        return studentIndex.length;
    }
    
    function listStudents () public view returns (address[] memory) {
        return studentIndex;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}





