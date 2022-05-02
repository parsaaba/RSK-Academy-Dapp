const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const AcademyStudentQuiz = artifacts.require("AcademyStudentQuiz");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");
const MasterQuote = artifacts.require("MasterQuote");
const Quote = artifacts.require("Quote");
const AcademyCertification = artifacts.require("AcademyCertification");



module.exports = async (deployer, network, accounts) => {

  console.log ("\n accounts: \n", accounts, "\n");
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //AcademyProjectList
  academyProjectListAddress = '0x93B6D036e593f3c31C4c8b123c581F776524233b';
  academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //AcademyStudents
  academyStudentsAddress = '0x8B61659F5166B7E290cEbB1c9ae61b8C81D4850E';
  academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //AcademyClassList
  academyClassListAddress = '0xB2510CC85f359BAA45B4af24442E339B80450B64';
  academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //AcademyStudentQuiz
  academyStudentQuizAddress = '0x9C092457403Ce334cCDd14dC136A046F434f7EaC';
  academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);


////////////////////////////// class "Devs 2021-01"

  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass ", className);
  class01Address = '0xe9c79c9226e2cD36C09b1404825B7381240311bA';
  class01 = await AcademyClass.at(class01Address);
  console.log("class01.Address: ", class01.address);


/////////////////////////// PROJECTS 

  //MasterName
  masterNameAddress = '0x794247ADa39C572f6756118B9c1Df88860b96cFE';
  masterName = await MasterName.at(masterNameAddress);
  console.log("masterName.Address: ", masterName.address);


///////////////////////////  QUIZ 
quizInfo = await academyStudentQuiz.listQuizByStudent(accounts[0]);
console.log("\n quiz from ", accounts[0], quizInfo); 

/*  
*/

console.log("\n\n\n");

};
