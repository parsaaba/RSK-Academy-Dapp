const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyStudentQuiz = artifacts.require("AcademyStudentQuiz");

module.exports = async (deployer, network, accounts) => {

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("academyOwner: ", academyOwner);
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyStudentQuiz
  await deployer.deploy(AcademyStudentQuiz, {from: academyOwner});
  academyStudentQuiz = await AcademyStudentQuiz.deployed();
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //AcademyClassList
  academyClassList = await AcademyClassList.deployed();
  console.log("academyClassList.address: ", academyClassList.address);

  //grantRole for AcademyClassList in AcademyStudentQuiz
  console.log("\ngrantRole for AcademyClassList in AcademyStudentQuiz");
  await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudentQuiz?
  console.log("Is AcademyClassList admin in academyStudentQuiz?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudentQuiz", result);  

  
  console.log("\n\n");

};
