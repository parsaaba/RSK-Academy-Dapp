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

  //StudentSol = accounts[1];
  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("\n accounts: \n", accounts, "\n");
  console.log ("academyOwner: ", academyOwner);
  console.log ("StudentSol: ", StudentSol);  
  console.log ("StudentTalip: ", StudentTalip); 
  console.log ("StudentOther: ", StudentOther); 
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  //Deploy AcademyProjectList
  academyProjectListAddress = '0x0D3f8b4d2C659B6402F35cd1a73BB8a4B0864C20';
  academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  academyStudentsAddress = '0xc24d44eD3CA8d75342f2135B4F1713b9B9589239';
  academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //Deploy AcademyClassList
  academyClassListAddress = '0x6800597b6fF5a423002Ff57e58727902BDDE13A6';
  academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //Deploy AcademyStudentQuiz
  academyStudentQuizAddress = '0x7eEA02aBFD8cFaF0c6386970A91936471211f5E0';
  academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);


////////////////////////////// class "Devs 2021-01"
  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass ", className);
  class01Address = '0x770a1B1eC8523F98Fe32229b3011cb7A520886bC';
  class01 = await AcademyClass.at(class01Address);
  console.log("class01.Address: ", class01.address);


/////////////////////////// PROJECTS 

  //Deploy MasterName
  masterNameAddress = '0x98A7BeE32B1532F8a8F1ECD72942375C60bc06FF';
  masterName = await MasterName.at(masterNameAddress);
  console.log("masterName.Address: ", masterName.address);


/////////////////////////// CERTIFICATE

console.log("\n\n CERTIFICATE");
//Deploy AcademyCertification
academyCertification = await deployer.deploy(AcademyCertification, academyStudentQuiz.address, masterName.address, {from: accounts[0]});
//academyCertificationAddress = '0x0';
//academyCertification = await academyCertification.at(academyCertificationAddress);  
console.log("academyCertification.address: ", academyCertification.address);


//Add quizzes
quizName = "dev-01"
await academyCertification.addQuiz(quizName, {from: accounts[0]});
console.log("academyCertification.addQuiz: ", quizName);

quizName = "dev-02"
await academyCertification.addQuiz(quizName, {from: accounts[0]});
console.log("academyCertification.addQuiz: ", quizName);

quizName = "dev-03"
await academyCertification.addQuiz(quizName, {from: accounts[0]});
console.log("academyCertification.addQuiz: ", quizName);

/*

quizName = "dev-04"
await academyCertification.addQuiz(quizName, {from: accounts[0]});
console.log("academyCertification.addQuiz: ", quizName);

quizName = "dev-05"
await academyCertification.addQuiz(quizName, {from: accounts[0]});
console.log("academyCertification.addQuiz: ", quizName);

quizName = "dev-06"
await academyCertification.addQuiz(quizName, {from: accounts[0]});
console.log("academyCertification.addQuiz: ", quizName);

*/

console.log("\n\n\n");

};
