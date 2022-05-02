const AcademyClassList = artifacts.require("AcademyClassList");

module.exports = async (deployer, network, accounts) => {

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";


  //Deploy AcademyClassList
  await deployer.deploy(AcademyClassList, {from: academyOwner});
  academyClassList = await AcademyClassList.deployed();
  console.log("academyClassList.address: ", academyClassList.address);
  
  console.log("\n\n");

};
