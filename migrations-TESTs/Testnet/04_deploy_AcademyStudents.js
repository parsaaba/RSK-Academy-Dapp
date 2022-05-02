const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");

module.exports = async (deployer, network, accounts) => {

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //AcademyProjectList
  academyProjectList = await AcademyProjectList.deployed();
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  await deployer.deploy(AcademyStudents, academyProjectList.address, {from: academyOwner});
  academyStudents = await AcademyStudents.deployed();
  console.log("academyStudents.address: ", academyStudents.address);  


  //AcademyClassList
  academyClassList = await AcademyClassList.deployed();
  console.log("academyClassList.address: ", academyClassList.address);

  //grantRole for AcademyClassList in academyStudents
  console.log("grantRole for AcademyClassList in academyStudents");
  await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: academyOwner});
  
  //Is AcademyClassList admin in academyStudents?
  console.log("Is AcademyClassList admin in academyStudents?");
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudents", result);

 
  
  console.log("\n\n");

};
