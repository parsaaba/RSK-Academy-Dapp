// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';
import "./oz-contracts/utils/math/SafeMath.sol";

import './iAcademyStudentQuiz.sol';
import './iName.sol';

struct CertificateStruct {
    address studentAddress;
    string studentName;
    string courseName;
    string storageHash;
}

// This certification is exclusive for course Devs 2021-01!
// I found an error retrieving names from MasterName, so this certification is solving this too

contract AcademyCertification is AccessControl {
  using SafeMath for uint256;

  uint256 public constant decimalpercent = 100; //100 = 100%

  CertificateStruct[] public certificateInfo;    
  mapping(address => mapping(string => uint256)) public certificateIndex;  //By studentAddress, course

  iAcademyStudentQuiz public academyStudentQuiz;
  iMasterName public masterName;

  string[] public quizList;
  mapping(string => uint256) public quizListIndex;
  uint256 public quizMinimum;   // In percent  

  constructor(address addressAcademyStudentQuiz, address addressMasterName) {
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      academyStudentQuiz = iAcademyStudentQuiz(addressAcademyStudentQuiz);
      masterName = iMasterName(addressMasterName);
      quizMinimum = 60;
  }

  modifier onlyOwner() {
      require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyCertification: only owner");
      _;
  }

  function addQuiz (string memory name) public onlyOwner returns(uint256) {
    if (existQuiz(name))
        return quizListIndex[name];

    quizList.push(name);
    uint256 index = quizList.length;
    quizListIndex[name] = index;
    return index;
  }
  
  function delQuiz (string memory name) public onlyOwner returns (bool) {
    if (!existQuiz(name))
        return false;

    uint256 indexToDelete = quizListIndex[name]-1;
    uint256 indexToMove = quizList.length-1;
    string memory keyToMove = quizList[indexToMove];        
    quizList[indexToDelete] = quizList[indexToMove];
    quizListIndex[keyToMove] = indexToDelete+1;
    delete quizListIndex[name];
    quizList.pop();
    return true;
  }

  function validateStudent(address studentAddress) public view returns (bool) {
    
    bool pass = true;
    uint256 index;
    uint256 perc;

    for (uint i = 0; i < quizList.length; i++) {
      index = academyStudentQuiz.indexOf (studentAddress, quizList[i]);
      if (index == 0) {
        pass = false;
        break;
      }

      StudentQuizStruct memory info = academyStudentQuiz.getStudentQuiz(index);
      perc = info.grade * decimalpercent / info.total;

      if (perc <  quizMinimum) {
        pass = false;
        break;        
      }
    }
      
    return pass;    
  }

  function addCertificate (address studentAddress, string memory studentName, string memory course, string memory storageHash) private returns(uint256) {
    if (existCertificate(studentAddress, course))
      return certificateIndex[studentAddress][course];

    CertificateStruct memory c;
    c.studentAddress = studentAddress;
    c.studentName = studentName;
    c.courseName = course;
    c.storageHash = storageHash;    

    certificateInfo.push(c);
    uint256 index = certificateInfo.length;
    certificateIndex[studentAddress][course] = index;
    return index;
  }
  
  function registerCertificate(address studentAddress, string memory studentName, string memory course, string memory storageHash) public returns (bool) {
    require (masterName.existsOwner(studentAddress), "student must have a name contract");
    require (validateStudent(studentAddress), "student not approved");

    uint256 index = addCertificate(studentAddress, studentName, course, storageHash);
    if (index > 0)
      return true;
    else
      return false;
  }

  function updateQuizMinimum(uint256 value) public onlyOwner returns (bool) {
    require(value <= decimalpercent, "Invalid quizMinimum");
    quizMinimum = value;
    return true;
  }

  function existCertificate(address studentAddress, string memory course) public view returns (bool) {
    if (certificateIndex[studentAddress][course] == 0)
      return false;
    else
      return true;
  }

  function existQuiz(string memory name) public view returns (bool) {
      if (quizListIndex[name] == 0)
          return false;
      else
          return true;
  }

  function countQuiz() public view returns (uint256) {
      return quizList.length;
  }
    
  function listQuiz() public view returns (string[] memory) {
      return quizList;
  }

  function getCertificate(address studentAddress, string memory course) public view returns (CertificateStruct memory) {
    CertificateStruct memory certificate;
    uint256 index = certificateIndex[studentAddress][course];
    if (index > 0) {
      certificate = certificateInfo[index-1];      
    }
    //return certificateInfo[certificateIndex[studentAddress][course]-1];
    return certificate;
  }
  
  function compareStrings(string memory a, string memory b) private pure returns (bool) {
      return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }
      
}