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
  className = "Business 2021-01";
  console.log("\nAcademyClassList.createAcademyClass (addressStudentList, className) ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  class02 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});
  //console.log("OK\n", JSON.stringify(class02.logs));
  class02Address = await class02.logs[3].args[0];

  class02 = await AcademyClass.at(class02Address);
  console.log("class02Address: ", class02Address);
  console.log("class02.Address: ", class02.address);

  //Is class02 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudents", result);

  //Is class02 admin in AcademyStudentQuiz?
  console.log("Is class02 admin in AcademyStudentQuiz?");
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudentQuiz", result);  

  
  console.log("\n\n");

};
