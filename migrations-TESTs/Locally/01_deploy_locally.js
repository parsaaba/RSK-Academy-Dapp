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

/*
This migration file is to be used locally.
It creates all structure, including:
- 3 projects in AcademyProjectList: "Name", "Pig Bank", "Token"
- a student: accounts[1]
- 2 classes: 
    class01 = "Devs 2021-01"
    class02 = "Business 2021-02"
- the student subscribe on 2 classes

User case: a student submit the name project, 
but he did a mistake, then delete it and submit again
*/



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
  academyProjectList = await deployer.deploy(AcademyProjectList, {from: accounts[0]});
  //If I didn't do this in the first deploy, I didn't get the contract.address...
  academyProjectList = await AcademyProjectList.deployed();   
  //academyProjectListAddress = '0x080c4cBb2b107ecEB49D6ebed39Aa18DB262C758';
  //academyProjectList = await AcademyProjectList.at(academyProjectListAddress);
  console.log("academyProjectList.address: ", academyProjectList.address);  
  
  //Deploy AcademyStudents, using addressProjectList
  academyStudents = await deployer.deploy(AcademyStudents, academyProjectList.address, {from: accounts[0]});
  //academyStudentsAddress = '0x82c7E2534A6d69165fCc0552535907f11D6ed0a9';
  //academyStudents = await AcademyStudents.at(academyStudentsAddress);
  console.log("academyStudents.address: ", academyStudents.address);

  //Deploy AcademyClassList
  academyClassList = await deployer.deploy(AcademyClassList, {from: accounts[0]});
  //academyClassListAddress = '0xf10A7106f7b3Ef3a933a6E177f6871Bad86a9606';
  //academyClassList = await AcademyClassList.at(academyClassListAddress);
  console.log("academyClassList.address: ", academyClassList.address);

  //grantRole for AcademyClassList in academyStudents
  //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
  console.log("grantRole for AcademyClassList in academyStudents");
  await academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudents", result);

  //Deploy AcademyStudentQuiz
  academyStudentQuiz = await deployer.deploy(AcademyStudentQuiz, {from: accounts[0]});
  //academyStudentQuizAddress = '0x9792E3660B9CE434e4c777f2815968b9d9607168';
  //academyStudentQuiz = await AcademyStudentQuiz.at(academyStudentQuizAddress);  
  console.log("academyStudentQuiz.address: ", academyStudentQuiz.address);

  //grantRole for AcademyClassList in AcademyStudentQuiz
  console.log("\ngrantRole for AcademyClassList in AcademyStudentQuiz");
  await academyStudentQuiz.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: accounts[0]});
  
  //Is AcademyClassList admin in academyStudentQuiz?
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, academyClassList.address);
  console.log("AcademyClassList admin in academyStudentQuiz", result);  



////////////////////////////// class "Devs 2021-01"
  //AcademyClassList.createAcademyClass
  className = "Devs 2021-01";
  console.log("\nAcademyClassList.createAcademyClass ", className);
  console.log("\n", academyStudents.address, academyStudentQuiz.address, className);
  class01 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: accounts[0]});
  class01Address = class01.logs[3].args[0];  
  console.log("OK\n", JSON.stringify(class01.logs));

  //class01Address = '0x2dD6Ce85e5d9A92CBCA9a5d2A306dEbe52496E76';
  class01 = await AcademyClass.at(class01Address);
  console.log("class01.Address: ", class01.address);

  //Is class01 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudents", result);

  //Is class01 admin in AcademyStudentQuiz?
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
  console.log("class01 admin in academyStudentQuiz", result);  


////////////////////////////// class "Business 2021-02"
  //AcademyClassList.createAcademyClass
  className = "Business 2021-02";
  console.log("\nAcademyClassList.createAcademyClass ", className);
  
  class02 = await academyClassList.createAcademyClass(academyStudents.address, academyStudentQuiz.address, className, {from: academyOwner});
  class02Address = await class02.logs[3].args[0];
  //console.log(JSON.stringify(class02));
  //class02Address = '0x2dD6Ce85e5d9A92CBCA9a5d2A306dEbe52496E76';
  class02 = await AcademyClass.at(class02Address);
  console.log("class02Address: ", class02Address);
  console.log("class02.Address: ", class02.address); 

  //Is class02 admin in academyStudents?
  result = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudents", result);

  //Is class01 admin in AcademyStudentQuiz?
  result = await academyStudentQuiz.hasRole(DEFAULT_ADMIN_ROLE, class02.address);
  console.log("class02 admin in academyStudentQuiz", result);    

///////////////////////////  STUDENTs

  //Student subscribe class01 => AcademyClass.subscribe class01
  console.log("\n\nAcademyClass.subscribe");
  await class01.subscribe({from: StudentSol});

  studentInClass = await class01.getStudentByAddress(StudentSol);
  console.log("\n studentInClass class01\n", studentInClass);
  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student info\n", student);

  //Student subscribe class02 => AcademyClass.subscribe class02
  console.log("\n\nAcademyClass.subscribe");
  await class02.subscribe({from: StudentSol});

  studentInClass = await class02.getStudentByAddress(StudentSol);
  console.log("\n studentInClass class02\n", studentInClass); 
  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student info\n", student);   

  //Student academyStudents.updateActiveClass class01
  result = await academyStudents.updateActiveClass(class01.address, {from: StudentSol});
  //console.log("\n Student academyStudents.updateActiveClass result\n", result);
  console.log("\n\n class01.Address: ", class01.address);

  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student info\n", student);

  //Student2 subscribe class01 => AcademyClass.subscribe class01
  console.log("\n\nStudent2 - AcademyClass.subscribe");
  await class01.subscribe({from: StudentTalip});

  student = await academyStudents.getStudentByAddress(StudentTalip);
  console.log("\n student info\n", student);  


///////////////////////////  QUIZ 

  //Student1 did Quiz
  console.log("addStudentQuizAnswer");
  await class01.addQuizAnswer("Q1", "1 B 2 T 3 A 4 A 5 F", 5, 1, {from: StudentSol})
  await class01.addQuizAnswer("Q1", "1 A 2 T 3 C 4 C 5 F", 5, 3, {from: StudentSol})
  await class01.addQuizAnswer("Q1", "1 A 2 T 3 C 4 B 5 F", 5, 4, {from: StudentSol})

  await class01.addQuizAnswer("Q2", "1 T 2 F 3 F", 3, 1, {from: StudentSol})

  quizInfo = await academyStudentQuiz.listQuizByStudent(StudentSol);
  console.log("\n quiz from ", StudentSol, quizInfo);  

  //Student2 did Quiz
  await class01.addQuizAnswer("Q1", "1 A 2 T 3 C 4 B 5 F", 5, 4, {from: StudentTalip})

  quizInfo = await academyStudentQuiz.listQuizByStudent(StudentTalip);
  console.log("\n quiz from ", StudentTalip, quizInfo);  

  //Who did Q1?
  quizName = "Q1"
  quizInfo = await academyStudentQuiz.listStudentByQuiz(quizName);
  console.log("\n who did  ", quizName, quizInfo);  


/////////////////////////// PROJECTS 
  
  //academyStudents = await AcademyStudents.at("0x73f2aa5D251DbdEd6C950257124eA93bb00c0Ec0");
  //academyProjectList = await AcademyProjectList.at("0x24AfE1784672750155C2a504DB4b6f1eD76bBAEf");

  //In AcademyProjectList, addProject "Name"
  await academyProjectList.addProject("Name","Your name stored in a smart contract", {from: accounts[0]});
  await academyProjectList.addProject("Pig Bank","smart contract to save economies", {from: accounts[0]});
  await academyProjectList.addProject("Token","Mintable token ERC20", {from: accounts[0]});
  //await academyProjectList.addProject("CRUD","A basic database to Create Read Update Delete", {from: accounts[0]});
  //await academyProjectList.addProject("Photo Album","Photos stored in IPFS and hashes in a smart contract", {from: accounts[0]});

  //Deploy MasterName
  nameProject = "Name";
  masterName = await deployer.deploy(MasterName, academyStudents.address, {from: accounts[0]});
  console.log("masterName.Address: ", masterName.address);

  project = await academyProjectList.getProjectByName(nameProject);
  //console.log("\nproject\n", project);  
  //console.log("project.master", project.master);
  console.log("Update Master in Project Name");
  await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("\nproject AFTER\n", project);

  //Name
  yourName = await deployer.deploy(Name, {from: StudentSol});
  console.log("yourName.Address: ", yourName.address);

  console.log("\nValidate project Name in Mastername");
  await masterName.addName(yourName.address, "Your name", {from: StudentSol});

  console.log("\nacademyStudents.getStudentByAddress");
  student = await academyStudents.getStudentByAddress(StudentSol);
  //console.log("\n student\n", student);
  portfolio = await StudentPortfolio.at(student.portfolioAddress);
  console.log("portfolio.Address: ", portfolio.address);

  result = await portfolio.listPortfolio();
  console.log("\n portfolio\n", result);   

  result = await masterName.listNameInfo();
  console.log("\n MasterName list\n", result);
  
  //The student published a wrong name, then will delete the project and submit again
  console.log("\nstudent delete the wrong project");
  //result = await portfolio.deleteProjectByAddress(yourName.address, {from: StudentSol});
  result = await masterName.deleteName({from: StudentSol});
  console.log("\n Student masterName.deleteName result\n", JSON.stringify(result.logs));
  
  result = await portfolio.listPortfolio();
  console.log("\n portfolio AFTER deleteProjectByAddress \n", result);

  result = await masterName.listNameInfo();
  console.log("\n MasterName list AFTER deleteProjectByAddress\n", result);  

  //NameSol
  nameSol = await deployer.deploy(NameSol, {from: StudentSol});
  console.log("nameSol.Address: ", nameSol.address);

  console.log("\nValidate project NameSol in Mastername");
  await masterName.addName(nameSol.address, "Solange Gueiros", {from: StudentSol});

  console.log("\nacademyStudents.getStudentByAddress");
  student = await academyStudents.getStudentByAddress(StudentSol);
  console.log("\n student\n", student);  

  portfolio = await StudentPortfolio.at(student.portfolioAddress);
  console.log("portfolio.Address: ", portfolio.address);

  result = await portfolio.listPortfolio();
  console.log("\n portfolio\n", result); 
  
/*
  //Second Project, Quote, only for tests

  //Deploy MasterQuote
  nameProject = "Quote";
  await academyProjectList.addProject("Quote","Write your phrases for eternity", {from: accounts[0]});
  masterQuote = await deployer.deploy(MasterQuote, academyStudents.address, {from: accounts[0]});
  console.log("masterQuote.Address: ", masterQuote.address);

  project = await academyProjectList.getProjectByName(nameProject);
  console.log("Update Master in Project Quote");
  await academyProjectList.updateProjectByName(project.name, project.active, masterQuote.address, project.description, project.ABI);

  //Quote for student1
  quote1 = await deployer.deploy(Quote, {from: StudentSol});
  console.log("quote1.Address: ", quote1.address);
  result = await quote1.setQuote("Have a nice day");

  console.log("\nValidate project Quote in Master");
  await masterQuote.validate(quote1.address, {from: StudentSol});

  //Student2 - Name


  yourName2 = await deployer.deploy(Name, {from: StudentTalip});
  console.log("yourName2.Address: ", yourName2.address);

  console.log("\nValidate project Name in Mastername");
  await masterName.addName(yourName2.address, "Your name", {from: StudentTalip});

/*  
*/

console.log("\n\n\n");

};
