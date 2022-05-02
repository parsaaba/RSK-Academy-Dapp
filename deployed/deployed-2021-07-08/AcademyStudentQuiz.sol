// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './iAcademyStudentQuiz.sol';

// Off-contract: must be a subscribed student
// A quiz isn't linked to a class, it must be implemented

contract AcademyStudentQuiz is AccessControl {

    StudentQuizStruct[] private studentQuizInfo; 
    
    //Last attempt quizzes from Student
    mapping(address => mapping(string => uint256)) private studentQuizIndex;
    
    //What quizzes a student did?
    mapping(address => string[]) private studentQuizList;

    //Who did a quiz?
    mapping(string => address[]) private quizStudentList;


    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    event StudentGradeAdded(address indexed student, string indexed quiz, uint8 total, uint8 grade, uint8 attempt);
    event StudentGradeDeleted(address indexed student, string quiz);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "StudentQuiz: only owner");
        _;
    }

    function addStudentQuizAnswer (address student, string memory quiz, string memory answer, uint8 total, uint8 grade) public onlyOwner returns(uint256) {

        require (!compareStrings(quiz, ""), "quiz: invalid quiz");
        uint256 index = studentQuizIndex[student][quiz];
        uint8 lastAttempt = 0;
        
        if (index == 0) {
            //Create
            lastAttempt = 1;
            StudentQuizStruct memory q;
            q.student = student;
            q.quiz = quiz;
            q.answer = answer;
            q.attempt = 1;
            q.total = total;
            q.grade = grade;
            studentQuizInfo.push(q);
            index = studentQuizInfo.length;
            studentQuizIndex[student][quiz] = index;
            
            //What quizzes a student did?
            studentQuizList[student].push(quiz);
            //Who did a quiz?
            quizStudentList[quiz].push(student);
        }
        else {
            index = index - 1;
            studentQuizInfo[index].answer = answer;
            studentQuizInfo[index].total = total;
            studentQuizInfo[index].grade = grade;
            studentQuizInfo[index].attempt = studentQuizInfo[index].attempt + 1;
            lastAttempt = studentQuizInfo[index].attempt;
        }

        emit StudentGradeAdded(student, quiz, total, grade, lastAttempt);
        return index;
    }

    function indexOf(address student, string memory quiz) public view returns (uint256) {
        return studentQuizIndex[student][quiz];
    }
    
    function exists(address student, string memory quiz) public view returns (bool) {
        if (studentQuizIndex[student][quiz] == 0)
            return false;
        else
            return true;
    }

    function getStudentQuiz(address student, string memory quiz) public view returns (StudentQuizStruct memory) {
        require (exists(student, quiz), "not exists");
        
        uint256 index = studentQuizIndex[student][quiz]-1;
        return studentQuizInfo[index];
    }
    
    function getStudentQuiz (uint256 index) public view returns (StudentQuizStruct memory) {
        require ((index > 0 ) && (index <= studentQuizInfo.length), "out of range");
        return studentQuizInfo[index-1];
    }

    function countStudentByQuiz (string memory quiz) public view returns (uint256) {
        return quizStudentList[quiz].length;
    }
    
    function countQuizByStudent (address student) public view returns (uint256) {
        return studentQuizList[student].length;
    }    
     
    function listStudentByQuiz (string memory quiz) public view returns (address[] memory) {
        return quizStudentList[quiz];
    }
    
    function listQuizByStudent (address student) public view returns (string[] memory) {
        return studentQuizList[student];
    }    
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }   
}
