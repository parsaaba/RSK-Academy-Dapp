const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyStudents = artifacts.require("AcademyStudents");
const AcademyStudentQuiz = artifacts.require("AcademyStudentQuiz");

module.exports = async (deployer, network, accounts) => {

  //accountStudent = accounts[1];
  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //AcademyClassList
  academyClassList = await AcademyClassList.deployed();
  console.log("academyClassList.address: ", academyClassList.address);  

  //AcademyStudents
  academyStudents = await AcademyStudents.deployed();
  console.log("academyStudents.address: ", academyStudents.address);

  //AcademyStudentQuiz
  academyStudentQuiz = await AcademyStudentQuiz.deployed();
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass (addressStudentList, className) ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  class01 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: academyOwner});
  //console.log("OK\n", JSON.stringify(class01.logs));
  class01Address = await class01.logs[3].args[0];

  class01 = await AcademyClass.at(class01Address);
  console.log("class01Address: ", class01Address);
  console.log("class01.Address: ", class01.address);

  //Is class01 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudents", result);

  //Is class01 admin in AcademyStudentQuiz?
  console.log("Is class01 admin in AcademyStudentQuiz?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudentQuiz", result);  

  
  console.log("\n\n");

};
