const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");

module.exports = async (deployer, network, accounts) => {

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //AcademyProjectList
  academyProjectList = await AcademyProjectList.deployed();
  console.log("academyProjectList.address: ", academyProjectList.address);  

  //AcademyStudents
  academyStudents = await AcademyStudents.deployed();
  console.log("academyStudents.address: ", academyStudents.address);  

  //Deploy MasterName
  nameProject = "Name";
  masterName = await deployer.deploy(MasterName, academyStudents.address, {from: academyOwner});
  console.log("masterName.Address: ", masterName.address);

  //In AcademyProjectList, addProject "Name"
  console.log("In AcademyProjectList, addProject Name");
  await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: academyOwner});

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject\n", project);  
  console.log("project.master", project.master);
  console.log("Update Master in Project Name");
  await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI, {from: academyOwner});

  
  console.log("\n\n\n");

};
