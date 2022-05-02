// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './iAcademyProjectList.sol';

  
contract AcademyProjectList is AccessControl {

    bool active;

    ProjectStruct[] private projectInfo;    
    //Project name is the index, can't be changed after created.
    mapping(string => uint256) private projectIndexName;
    //mapping(string => ProjectStruct) public projects;
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
    } 
    
    event ProjectAdded(string name, string description);
    event ProjectUpdated(string name, string description, address indexed master, bool active);
    event ProjectDeleted(string name);
    
    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyProjectList: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyProjectList: not active");
        _;
    }    

    function addProject (string memory name, string memory description) public onlyOwner onlyActive returns(uint256) {
        if (exists(name))
            return projectIndexName[name];
            
        ProjectStruct memory p;
        p.name = name;
        p.description = description;
        p.active = true;
        
        projectInfo.push(p);
        uint256 index = projectInfo.length;
        projectIndexName[name] = index;
        emit ProjectAdded(name, description);
        return index;
    }
    
    function delProject (string memory name) public onlyOwner onlyActive returns (bool) {
        if (!exists(name))
            return false;

        uint256 indexToDelete = projectIndexName[name]-1;
        uint256 indexToMove = projectInfo.length-1;
        string memory keyToMove = projectInfo[indexToMove].name;
        
        projectInfo[indexToDelete] = projectInfo[indexToMove];
        projectIndexName[keyToMove] = indexToDelete+1;

        delete projectIndexName[name];
        projectInfo.pop();

        emit ProjectDeleted(name);
        return true;
    }
    
    function updateProjectByName (string memory name, bool activeProject, address master,         
            string memory description, string memory ABI
        ) public onlyOwner onlyActive returns (bool) {
        if (!exists(name))
            return false;
        
        uint256 index = projectIndexName[name]-1;
        projectInfo[index].active = activeProject;
        projectInfo[index].master = master;
        projectInfo[index].description = description;
        projectInfo[index].ABI = ABI;
        emit ProjectUpdated(name, description, master, active);
        return true;
    }
    
    function changeActive () public onlyOwner returns (bool) {
        active = !active;
        return active;
    }
    
    function exists(string memory name) public view returns (bool) {
        if (projectIndexName[name] == 0)
            return false;
        else
            return true;
    }
    
    function isActive(string memory name) public view returns (bool) {
        return projectInfo[projectIndexName[name]-1].active;
    }
    
    function getProjectByName (string memory name) public view returns (ProjectStruct memory) {
        require (exists(name), "not exists");
        uint256 index = projectIndexName[name]-1;
        return projectInfo[index];
    }
    
    function getMasterAddressByName (string memory name) public view returns (address) {
        require (exists(name), "not exists");
        uint256 index = projectIndexName[name]-1;
        return projectInfo[index].master;
    }    

    function getProjectByIndex (uint256 index) public view returns (ProjectStruct memory) {
        require ((index > 0 ) && (index <= projectInfo.length), "out of range");
        return projectInfo[index-1];
    }
    
    function getIndexByName (string memory name) public view returns (uint256) {
        return projectIndexName[name];
    }    
 
    function countProjects () public view returns (uint256) {
        return projectInfo.length;
    }
     
    function listProjects () public view returns (ProjectStruct[] memory) {
        return projectInfo;
    }
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
}
