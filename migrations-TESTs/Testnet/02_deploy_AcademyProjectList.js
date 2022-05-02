const AcademyProjectList = artifacts.require("AcademyProjectList");

module.exports = async (deployer, network, accounts) => {

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyProjectList
  await deployer.deploy(AcademyProjectList, {from: academyOwner});
  academyProjectList = await AcademyProjectList.deployed();
  console.log("academyProjectList.address: ", academyProjectList.address);  

  
  console.log("\n\n");

};
