const truffleAssert = require('truffle-assertions');

/*
  Attention: it is not a official test yes, it is only a draft base on deploy to test locally

  I don't know what is the capacity of this model.
  It need to be tested in order to create some limits.
*/


const AcademyClassList = artifacts.require("AcademyClassList");
const AcademyClass = artifacts.require("AcademyClass");
const AcademyProjectList = artifacts.require("AcademyProjectList");
const AcademyStudents = artifacts.require("AcademyStudents");
const StudentPortfolio = artifacts.require("StudentPortfolio");
const MasterName = artifacts.require("MasterName");
const NameSol = artifacts.require("NameSol");
const Name = artifacts.require("Name");

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
//const ADMIN_ROLE = web3.utils.soliditySha3('ADMIN_ROLE');

contract("AcademyClassList", accounts => {

  const [academyOwner, accountStudent] = accounts;
  let response, academyClassList, academyProjectList, academyStudents;

  beforeEach('test', async () => {

    //Deploy AcademyClassList
    academyClassList = await AcademyClassList.new( {from: academyOwner});
    console.log("academyClassList.address: ", academyClassList.address);

    //Deploy AcademyProjectList
    academyProjectList = await AcademyClassList.new( {from: academyOwner});
    console.log("academyProjectList.address: ", academyProjectList.address);

    //Deploy AcademyStudents, using addressProjectList
    academyStudents = await AcademyStudents.new( academyProjectList.address, {from: academyOwner});
    console.log("academyStudents.address: ", academyStudents.address);

    //grantRole for AcademyClassList in academyStudents
    console.log("grantRole for AcademyClassList in academyStudents");
    //"0x0000000000000000000000000000000000000000000000000000000000000000","0x0fC5025C764cE34df352757e82f7B5c4Df39A836"
    academyStudents.grantRole(DEFAULT_ADMIN_ROLE, academyClassList.address, {from: academyOwner});

  });

  it('Testing all', async () => {

    //In AcademyProjectList, addProject "Name"


    //Deploy MasterName
    nameProject = "Name";
    masterName = await MasterName.new(academyStudents.address, {from: academyOwner});
    console.log("masterName.Address: ", masterName.address);

    //Update Master in Project Name
    project = await academyProjectList.getProjectByName(nameProject);
    //console.log("\nproject\n", project);  
    //console.log("project.master", project.master);
    console.log("Update Master in Project Name");
    await academyProjectList.updateProjectByName(project.name, project.active, masterName.address, project.description, project.ABI);

    //MasterName updated in academyProjectList
    project = await academyProjectList.getProjectByName(nameProject);
    console.log("\nproject AFTER\n", project);
    
    
    //AcademyClassList.createAcademyClass 01 - Devs
    console.log("AcademyClassList.createAcademyClass 01 (addressStudentList, className)");
    className = "Devs 2021-01";
    class01 = await academyClassList.createAcademyClass(academyStudents.address, className, {from: academyOwner});
    //console.log(JSON.stringify(class01));
    class01Address = await class01.logs[2].args[0];
    class01 = await AcademyClass.at(class01Address);
    console.log("class01.Address: ", class01.address);

    //Is class01 admin in academyStudents?
    response = await academyStudents.hasRole(DEFAULT_ADMIN_ROLE, class01.address);
    console.log("class01 role ", response);

    //AcademyClassList.createAcademyClass 02 - Business
    console.log("AcademyClassList.createAcademyClass 02 (addressStudentList, className)");
    className = "Business 2021-02";
    class02 = await academyClassList.createAcademyClass(academyStudents.address, className, {from: academyOwner});
    class02Address = await class02.logs[2].args[0];
    class02 = await AcademyClass.at(class02Address);
    console.log("class02Address: ", class02Address);
    console.log("class02.Address: ", class02.address);  

    //AcademyClass.subscribe class01
    console.log("\n\nAcademyClass.subscribe");
    await class01.subscribe({from: accountStudent});

    studentInClass = await class01.getStudentByAddress(accountStudent);
    console.log("\n studentInClass class01\n", studentInClass);
    student = await academyStudents.getStudentByAddress(accountStudent);
    console.log("\n student info\n", student);

    //AcademyClass.subscribe class02
    console.log("\n\nAcademyClass.subscribe");
    await class02.subscribe({from: accountStudent});

    studentInClass = await class02.getStudentByAddress(accountStudent);
    console.log("\n studentInClass class02\n", studentInClass); 
    student = await academyStudents.getStudentByAddress(accountStudent);
    console.log("\n student info\n", student);   

    //Student academyStudents.updateActiveClass class01
    response = await academyStudents.updateActiveClass(class01.address, {from: accountStudent});
    //console.log("\n Student academyStudents.updateActiveClass response\n", response);
    console.log("\n\n class01.Address: ", class01.address);

    student = await academyStudents.getStudentByAddress(accountStudent);
    console.log("\n student info\n", student);

    //Name
    yourName = await Name.new( {from: accountStudent});
    console.log("yourName.Address: ", yourName.address);

    console.log("\nValidate project Name in Mastername");
    await masterName.addName(yourName.address, "Your name", {from: accountStudent});

    console.log("\nacademyStudents.getStudentByAddress");
    student = await academyStudents.getStudentByAddress(accountStudent);
    //console.log("\n student\n", student);
    portfolio = await StudentPortfolio.at(student.portfolioAddress);
    console.log("portfolio.Address: ", portfolio.address);

    response = await portfolio.listPortfolio();
    console.log("\n portfolio\n", response);   

    response = await masterName.listNameInfo();
    console.log("\n MasterName list\n", response);
    
    //The student published a wrong name, then will delete the project and submit again
    console.log("\nstudent delete the wrong project");
    response = await masterName.deleteName({from: accountStudent});
    console.log("\n Student masterName.deleteName response\n", JSON.stringify(response.logs));
    
    response = await portfolio.listPortfolio();
    console.log("\n portfolio AFTER deleteProjectByAddress \n", response);

    response = await masterName.listNameInfo();
    console.log("\n MasterName list AFTER deleteProjectByAddress\n", response);  

    //NameSol
    nameSol = await NameSol.new(NameSol, {from: accountStudent});
    console.log("nameSol.Address: ", nameSol.address);

    console.log("\nValidate project NameSol in Mastername");
    await masterName.addName(nameSol.address, "Solange Gueiros", {from: accountStudent});

    console.log("\nacademyStudents.getStudentByAddress");
    student = await academyStudents.getStudentByAddress(accountStudent);
    console.log("\n student\n", student);  

    portfolio = await StudentPortfolio.at(student.portfolioAddress);
    console.log("portfolio.Address: ", portfolio.address);

    response = await portfolio.listPortfolio();
    console.log("\n portfolio\n", response); 

  });

});
