// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './iAcademyProjectList.sol';
import './iStudentPortfolio.sol';


contract StudentPortfolio is AccessControl {
    //One StudentPortfolio per Student
    address public student;

    //address public projectList;
    iAcademyProjectList public projectList;

    PortfolioStruct[] private portfolioProjects;
    mapping(address => uint256) private addressIndex;
    mapping(string => uint256) private nameIndex;

    constructor(address account, address addressProjectList) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        student = account;
        projectList = iAcademyProjectList(addressProjectList);
    }

    event PortfolioProjectAdded(address indexed projectAddress, string projectName);
    event PortfolioProjectDeleted(address indexed projectAddress, string projectName);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "StudentPortfolio: only owner");
        _;
    }
    
    modifier onlyOwnerOrStudent() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || (msg.sender == student), "StudentPortfolio: only student or owner");
        _;
    }

    function addProject (address projectAddress, string memory projectName) public returns(uint256) {
        //Owners are the Masters or the Academy. 
        //Only them can add projects in portfolio, because they validate the project before add it.
        require (!compareStrings(projectName, ""), "portfolio: invalid name");
        require (!(projectAddress == address(0x0)), "portfolio: invalid address");
        require (projectList.exists(projectName), "portfolio: project not exists");
        require (projectList.isActive(projectName), "portfolio: project not active");
        require(msg.sender == projectList.getMasterAddressByName(projectName), "Only Master can add project in portfolio");
        
        // Can the student have more than one same type project in portfolio? NO
        require (!addressInPortfolio(projectAddress), "portfolio: address exists");
        require (!nameInPortfolio(projectName), "portfolio: project exists");

        PortfolioStruct memory p;
        p.projectAddress = projectAddress;
        p.name = projectName;

        portfolioProjects.push(p);
        uint256 index = portfolioProjects.length; 
        addressIndex[projectAddress] = index;
        nameIndex[projectName] = index;

        emit PortfolioProjectAdded(projectAddress, projectName);
        return index;
    }
    
    function deleteProjectByAddress (address projectAddress) public returns (bool) {
        //If the student don't like your project, or did a mistake, he can delete it ad submit again.
        require (!(projectAddress == address(0x0)), "invalid address");
        require (addressInPortfolio(projectAddress), "address not exists");

        //Called only by your MasterProject
        address masterAddress = projectList.getMasterAddressByName(portfolioProjects[addressIndex[projectAddress]-1].name);
        require(msg.sender == masterAddress, "Only Master can add project in portfolio");

        uint256 indexToDelete = addressIndex[projectAddress]-1;
        string memory nameToDelete =  portfolioProjects[indexToDelete].name;
        
        uint256 indexToMove = portfolioProjects.length-1;
        address keyToMove = portfolioProjects[indexToMove].projectAddress;
        portfolioProjects[indexToDelete] = portfolioProjects[indexToMove];
        addressIndex[keyToMove] = indexToDelete+1;
        nameIndex[portfolioProjects[indexToMove].name] = indexToDelete+1;
        
        delete addressIndex[projectAddress];
        delete nameIndex[nameToDelete];    
        portfolioProjects.pop();

        emit PortfolioProjectDeleted(projectAddress, nameToDelete);
        return true;
    }
 
    function updateProjectList (address addressProjectList) public onlyOwner returns (bool) {
        projectList = iAcademyProjectList(addressProjectList);
        return true;
    }

    function addressInPortfolio (address projectAddress) public view returns (bool) {
        //if(portfolioProjects.length == 0) return false;        
        if (addressIndex[projectAddress] == 0)
            return false;
        else
            return true;
    }

    function nameInPortfolio (string memory projectName) public view returns (bool) {
        if (nameIndex[projectName] == 0)
            return false;
        else
            return true;
    }
    
    function listPortfolio () public view returns (PortfolioStruct[] memory) {
        return (portfolioProjects);
    }
    
    function countPortfolio () public view returns (uint) {
        return (portfolioProjects.length);
    }

    function projectByName (string memory projectName) public view returns (PortfolioStruct memory) {
        return portfolioProjects[nameIndex[projectName]-1];
    }
    
    function projectByAddress (address projectAddress) public view returns (PortfolioStruct memory) {
        return portfolioProjects[addressIndex[projectAddress]-1];
    }
    
    function projectByIndex (uint256 index) public view returns (PortfolioStruct memory) {
        require ((index > 0 ) && (index <= portfolioProjects.length), "out of range");
        return portfolioProjects[index-1];
    }    

    function indexOfProject (address projectAddress) public view returns (uint) {
        return addressIndex[projectAddress];
    }
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
}

