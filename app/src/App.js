import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import './App.css';
import AcademyClassList from "./contracts/AcademyClassList.json";
import AcademyClass from "./contracts/AcademyClass.json";
import AcademyStudents from "./contracts/AcademyStudents.json";
import AcademyStudentQuiz from "./contracts/AcademyStudentQuiz.json";
import StudentPortfolio from "./contracts/StudentPortfolio.json";
import MasterName from "./contracts/MasterName.json";


function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');

  const [scAcademyClassList, setScAcademyClassList] = useState(null);    
  const [scAcademyStudents, setScAcademyStudents] = useState(null);  
  const [scAcademyStudentQuiz, setScAcademyStudentQuiz] = useState(null); 
  const [scMasterName, setScMasterName] = useState(null);

  const [studentProfile, setStudentProfile] = useState(null);
  const [studentClasses, setStudentClasses] = useState(null);

  const [scStudentPortfolio, setScStudentPortfolio] = useState(null);
  const [studentPortfolioAddress, setStudentPortfolioAddress] = useState(null);
  const [studentPortfolioList, setStudentPortfolioList] = useState(null);

  const [scAcademyClass, setScAcademyClass] = useState(null);
  const [studentActiveClass, setStudentActiveClass] = useState(null);
  const [studentActiveClassName, setStudentActiveClassName] = useState('');  
  const [studentActiveClassStatus, setStudentActiveClassStatus] = useState('');
  const [studentActiveClassStart, setStudentActiveClassStart] = useState('');

  const [academyQuizByStudentList, setAcademyQuizByStudentList] = useState(null);
  const [academyStudentsList, setAcademyStudentsList] = useState(null);
  const [academyStudentsCount, setAcademyStudentsCount] = useState(null);

  const [scStudentName, setScStudentName] = useState(null);
  const [studentName, setStudentName] = useState(null);

  const [classList, setClassList] = useState(null);
  const [inputClassSubscribeAddress, setInputClassSubscribeAddress] = useState('');
  const [inputChangeActiveClassAddress, setInputChangeActiveClassAddress] = useState('');
  const [inputAddQuizAnswerParameters, setInputAddQuizAnswerParameters] = useState('');


  const [masterListNames, setMasterListNames] = useState(null);
  const [inputMasterNameAddNameAddress, setInputMasterNameAddNameAddress] = useState('');
  const [inputMasterNameAddNameStudentName, setInputMasterNameAddNameStudentName] = useState('');
  

  useEffect(() => {
    async function loadWeb3() {      
      //window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!',
        );
      }
      setWeb3(window.web3);
      /**/
     console.log ("currentProvider: \n", window.web3.currentProvider);
    }
    
    async function loadBlockchainData() {
      try {
        const web3 = window.web3;
       
        // Load first account
        const [account] = await web3.eth.getAccounts();
        console.log ('account: ', account);
        setAccount(account);

        // Check which network is active on web3
        const networkId = await web3.eth.net.getId();
        console.log ('networkId: ', networkId);

        let networkData;

        // AcademyStudents
        networkData = AcademyStudents.networks[networkId];        
        if (networkData) {
          console.log ('AcademyStudents address: ', networkData.address);
          var contract = await new web3.eth.Contract(
            AcademyStudents.abi,
            networkData.address,
          );
          await setScAcademyStudents(contract);
          console.log ('AcademyStudents: ', contract);
        }

        //AcademyClassList
        networkData = AcademyClassList.networks[networkId];        
        if (networkData) {
          console.log ('AcademyClassList address: ', networkData.address);
          var contract = await new web3.eth.Contract(
            AcademyClassList.abi,
            networkData.address,
          );
          await setScAcademyClassList(contract);
          console.log ('AcademyClassList: ', contract);
        }

        //AcademyStudentQuiz
        networkData = AcademyStudentQuiz.networks[networkId];        
        if (networkData) {
          console.log ('AcademyStudentQuiz address: ', networkData.address);
          var contract = await new web3.eth.Contract(
            AcademyStudentQuiz.abi,
            networkData.address,
          );
          await setScAcademyStudentQuiz(contract);
          console.log ('AcademyStudentQuiz: ', contract);
        }

        // TODO: automate load all masters
        // MasterName
        networkData = MasterName.networks[networkId];        
        if (networkData) {
          console.log ('MasterName address: ', networkData.address);
          var contract = new web3.eth.Contract(
            MasterName.abi,
            networkData.address,
          );
          await setScMasterName(contract);
          console.log ('MasterName: ', contract);
        }

        /*
        } else {
          window.alert('Smart contract not deployed to detected network.');
        }
        */
      } catch (error) {
        console.error(error);
      }
    }
    loadWeb3().then(() => loadBlockchainData());
  }, []);
  
  async function handleGetStudentProfile (e) {
    e.preventDefault();
    
    let studentInfo = await scAcademyStudents.methods.getStudentByAddress(account.toLowerCase()).call()
    console.log ('studentInfo: ', JSON.stringify(studentInfo));

    if (studentInfo[0] != "0") {
      console.log ('studentInfo: ', JSON.stringify(studentInfo));
      setStudentProfile(JSON.stringify(studentInfo));

      //AcademyStudents.StudentStruct
      const [index, ownerAddress, portfolioAddress, activeClassAddress, studentClasses] = studentInfo;          
      console.log ('portfolioAddress: ', studentInfo.portfolioAddress);

      setStudentClasses(studentClasses);
      console.log ('studentClasses: ', studentClasses);
      setStudentPortfolioAddress(portfolioAddress);
      setStudentActiveClass(activeClassAddress);
  
      // StudentPortfolio for StudentAccount
      var scStudentPortfolio = await new web3.eth.Contract(
        StudentPortfolio.abi,
        portfolioAddress,
      );
      setScStudentPortfolio(scStudentPortfolio);
      console.log ('StudentPortfolio: ', scStudentPortfolio);

      if (scStudentPortfolio) {
        let studentPortfolioList = await scStudentPortfolio.methods.listPortfolio().call();
        if (studentPortfolioList) {
          setStudentPortfolioList(studentPortfolioList);
          console.log ('studentPortfolioList: ', studentPortfolioList);
          await getName(studentPortfolioList);
        }

        /*
        //Student's name
        //Check if he has the name project in portfolio
        //https://gist.github.com/DanDiplo/30528387da41332ff22b
        const nameProject = portfolioList.filter(function (item) {
          return item.name == "Name";
        });
        console.log ('nameProject: ', nameProject);
        if (nameProject.length > 0) {
          var nameProjectAddress = nameProject[0].projectAddress;
          console.log ('nameProjectAddress: ', nameProject[0].projectAddress);
          var studentName = await scMasterName.methods.getName(nameProjectAddress).call();
          console.log ('studentName: ', studentName);
          setStudentName(studentName);  
        }
        */
      }

      await handleSetStudentActiveClass (activeClassAddress);
    }
  };

  async function handleSetStudentActiveClass (activeClassAddress) {
    // Active AcademyClass for StudentAccount
    var scAcademyClass = await new web3.eth.Contract(
      AcademyClass.abi,
      activeClassAddress,
    );
    setScAcademyClass(scAcademyClass);
    console.log ('Active AcademyClass: ', scAcademyClass);

    if (scAcademyClass) {
      setStudentActiveClassName(await scAcademyClass.methods.className().call());

      let classStudentInfo = await scAcademyClass.methods.getStudentByAddress(account.toLowerCase()).call();
      const [status, start, end] = classStudentInfo;
      
      //TODO: convert status number to name
      setStudentActiveClassStatus(status);
      //TODO: convert start to datetime
      setStudentActiveClassStart(start);
    }
    return (scAcademyClass);
  }
  
  async function handleClassSubscribe (e) {
    e.preventDefault();

    console.log ('inputClassSubscribeAddress: ', inputClassSubscribeAddress);
    try {
      var scClass = await new web3.eth.Contract(
        AcademyClass.abi,
        inputClassSubscribeAddress.toLowerCase(),
      );
      scClass.methods.subscribe().send({ from: account })
        .once('receipt', receipt => {
          console.log ('transaction receipt: ', receipt);
          setInputClassSubscribeAddress('');
        })
        .catch(err => window.alert(err.message));
    }
    catch (err) {
      window.alert(err.message);
    }
  };

  async function handleChangeActiveClass (e) {
    e.preventDefault();

    console.log ('inputChangeActiveClassAddress: ', inputChangeActiveClassAddress);
    try {
      scAcademyStudents.methods.updateActiveClass(inputChangeActiveClassAddress.toLowerCase())
        .send({ from: account })
        .once('receipt', receipt => {
          console.log ('transaction receipt: ', receipt);
          setInputChangeActiveClassAddress('');
        })
        .catch(err => window.alert(err.message));
    }
    catch (err) {
      window.alert(err.message);
    }
  };

  async function getName (portfolioList) {
    //Student's name
    //Check if he has the name project in portfolio
    //https://gist.github.com/DanDiplo/30528387da41332ff22b

    if (portfolioList){
      try {
        const nameProject = portfolioList.filter(function (item) {
          return item.name == "Name";
        });
        console.log ('nameProject: ', nameProject);
        if (nameProject.length > 0) {
          var nameProjectAddress = nameProject[0].projectAddress;
          console.log ('nameProjectAddress: ', nameProject[0].projectAddress);
          var studentName = await scMasterName.methods.getName(nameProjectAddress).call();
          console.log ('studentName: ', studentName);
          setStudentName(studentName);  
        }
      }
      catch (err) {
        window.alert(err.message);
      }
      //TODO: update studentName  
    }
  };

  //async 
  async function handleAddQuizAnswer (e) {
    e.preventDefault();
    
    console.log ('inputAddQuizAnswerParameters, : ', inputAddQuizAnswerParameters);
    var parameters = inputAddQuizAnswerParameters.split(',');
    // console.log ('Quiz: ', parameters[0]);
    // console.log ('Answer: ', parameters[1]);
    // console.log ('Total: ', parameters[2]);
    // console.log ('Grade: ', parameters[3]);
    var quiz = parameters[0];
    var answer = parameters[1];    
    var total = web3.utils.toBN(parameters[2]);
    var grade = web3.utils.toBN(parameters[3]);

    try {      
      let studentActiveClassAddress
      let scClass

      if (!studentActiveClass) {        
        let studentInfo = await scAcademyStudents.methods.getStudentByAddress(account.toLowerCase()).call()
        if (studentInfo) {
          studentActiveClassAddress = studentInfo[3]
        }
        scClass = await handleSetStudentActiveClass (studentActiveClassAddress); 
      }
      else {
        studentActiveClassAddress = studentActiveClass;
        scClass = scAcademyClass;
      }
      console.log ('studentActiveClassAddress \n', studentActiveClassAddress);
      console.log ('scClass \n', scClass);

      if (scClass) {
        var receipt = await scClass.methods.addQuizAnswer(parameters[0], parameters[1], total, grade).send({ from: account })
        return receipt;
      }
    }
    catch (err) {
      window.alert(err.message);
    }
  };

  async function getStudentQuiz (student, quizName) {    
    const result = scAcademyStudentQuiz.methods.getStudentQuiz(student, quizName).call()
      .then( function(res) {
        console.log ('getStudentQuiz: \n', res);
        return res;
      });
      return result;
  };

  async function handleQuizByStudentList (e) {
    e.preventDefault();

    var aux = await scAcademyStudentQuiz.methods.listQuizByStudent(account).call();
    if (aux) {
      let list = [];

      for(let i = 0; i < aux.length; i++ ) {
        const item = await getStudentQuiz(account, aux[i]);
         //setQuizResultByStudentList(prev => [...prev, result])
        console.log (i, ":", item);
        list.push(item);
      }
      setAcademyQuizByStudentList(list);      
    }

  };  

  async function handleMasterNameAddName (e) {
    e.preventDefault();

    console.log ('inputMasterNameAddNameAddress: ', inputMasterNameAddNameAddress);
    try {
      scMasterName.methods
      .addName(inputMasterNameAddNameAddress, inputMasterNameAddNameStudentName)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log ('transaction receipt: ', receipt);
        setInputMasterNameAddNameAddress('');
        setInputMasterNameAddNameStudentName('');
        getName(studentPortfolioList);
      })
      .catch(err => window.alert(err.message));
    }
    catch (err) {
      window.alert(err.message);
    }
    //TODO: update studentName
  };

  async function handleMasterNameDeleteName (e) {
    e.preventDefault();

    try {
      scMasterName.methods
      .deleteName()
      .send({ from: account })
      .once('receipt', receipt => {
        console.log ('transaction receipt: ', receipt);
        setStudentName('');        
      })      
      .catch(err => window.alert(err.message));
    }
    catch (err) {
      window.alert(err.message);
    }
    await getName(studentPortfolioList);    
  };  

  const handleClassList = e => {
    e.preventDefault();
    
    console.log ('scAcademyClassList: \n', scAcademyClassList._address);

    scAcademyClassList.methods.listAcademyClasses().call()
    .then( function(list) {
      console.log ('scAcademyClassList listAcademyClass: \n', list);
      setClassList(list);
    });
  };

  const handleAcademyStudentList = e => {
    e.preventDefault();
    
    scAcademyStudents.methods.listStudents().call()
      .then( function(list) {
        console.log ('scAcademyStudents listStudents: \n', list);
        setAcademyStudentsList(list);
      });
    scAcademyStudents.methods.countStudents().call()
    .then( function(result) {
      console.log ('scAcademyStudents countStudents: \n', result);
      setAcademyStudentsCount(result);
    });   
  };

  const handleMasterNameListNames = e => {
    e.preventDefault();
    
    let list = [];
    scMasterName.methods.listNameInfo().call()
      .then( function(nameInfos) {
        console.log ('nameInfos: ', nameInfos);
        setMasterListNames(nameInfos);
      });
  };

  //console.log ('academyQuizByStudentList Before RETURN', academyQuizByStudentList);
  
  return (
    <Container>
      <div className="App">

        <div>
          {account && <p>Your account: {account}</p>}
          {scAcademyClassList && <p>AcademyClassList: scAcademyClassList._address - scAcademyClassList.address</p>}
          {scAcademyStudents && <p>AcademyStudents: scAcademyStudents._address - scAcademyStudents.ddress</p>}
          {scAcademyClass && <p>AcademyClass: {scAcademyClass._address}</p>}
          {scStudentPortfolio && <p>StudentPortfolio: scStudentPortfolio._address</p>}
          {scMasterName && <p>MasterName: {scMasterName._address}</p>}
        </div>

        <br/><br/>
        <hr/>
        <h1>Admin page</h1>
        <br/>
        <h2>Students</h2>
        <div>
          <br/> 
          <Form onSubmit={handleAcademyStudentList}>
              <Button type="submit">List Students</Button>
          </Form>
          <Row>
            {academyStudentsList && 
              <p>List: 
                {academyStudentsList.map((item, i) => 
                  <li key={i}>{item}</li>
                  )}
              </p>
            }
            <br/>
            {academyStudentsCount && <p>
              Count: {academyStudentsCount}
            </p>
            }
          </Row>          
        </div>        

        <br/>
        <h2>MasterName</h2>
        <div>
          <br/>
          <Form onSubmit={handleMasterNameListNames}>
              <Button type="submit">List Names</Button>
          </Form>
          <Row>
            {masterListNames && 
              <p>List: 
                {masterListNames.map((item, i) => 
                  <li key={i}>{item[0]} - {item[1]} - {item[2]}</li>
                  )}
              </p>
            }
          </Row>          
        </div>
        <br/><br/>

        <hr/>
        <h2>Student subscribe in class</h2>
        <div>
          <h4>Classes</h4>
          <div>
            <Form onSubmit={handleClassList}>
              <Button type="submit">List classes</Button>
            </Form>
            <br/>
            {classList && 
              classList.map((item, i) =>
                <li key={i}>{item.classAddress} - {item.name}</li>
              )
            }
            <br/>
          </div>
          <div>
            <h4>Subscribe</h4>
            <Form onSubmit={handleClassSubscribe}>
              <Form.Group controlId="formClassSubscribe">
                <Form.Label>Class</Form.Label>
                <Form.Control placeholder="Class address"
                  onChange={e => setInputClassSubscribeAddress(e.target.value)}
                  value={inputClassSubscribeAddress}
                />              
              </Form.Group>
              <Button type="submit">Subscribe</Button>
            </Form>
            <br/>
          </div>

        </div>

        <hr/>
        <h2>Student profile page</h2>
        <div>         
          <Form onSubmit={handleGetStudentProfile}>
            <Button type="submit">Get profile</Button>
          </Form>          
          {studentProfile && 
            <p>
              {studentProfile}
              <br/><br/>
              
              Name: {studentName}
              <br/><br/>
              <h4>Portfolio</h4>
              Portfolio address: {studentPortfolioAddress}
              <br/>
              {studentPortfolioList && 
                studentPortfolioList.map((item, i) =>
                  <li key={i}>{item.projectAddress} - {item.name}</li>
                )
              }
              <br/>
              <h4>Classes subscribed</h4>
              {studentClasses && 
                studentClasses.map((item, i) =>
                  <li key={item.i}>{item}</li>
                )                  
              }
              <br/>
              <p>                
                <h4>Active class</h4>
                {studentActiveClassName}
                <br/>
                class address: {studentActiveClass}
                <br/>
                Status: {studentActiveClassStatus}
                <br/>
                Start: {studentActiveClassStart}
              </p>
            </p>
          }
          <br/>
          <h4>Change active class</h4>
            <Form onSubmit={handleChangeActiveClass}>
              <Form.Group controlId="formChangeActiveClass">
                <Form.Label>Class</Form.Label>
                <Form.Control placeholder="Class address"
                  onChange={e => setInputChangeActiveClassAddress(e.target.value)}
                  value={inputChangeActiveClassAddress}
                />              
              </Form.Group>
              <Button type="submit">Change</Button>
            </Form>
          <br/>
        </div>

        <hr/>
        <h2>Student project Name</h2>
        <div>
          <p>Submit project name</p>
          {scStudentName && <p>Project address: {scStudentName._address}</p>} 
          {studentName && <p>Student name: {studentName}</p>} 
          <Form onSubmit={handleMasterNameAddName}>
            <Form.Group controlId="formMasterNameAddName">
              <Form.Label>Address of project name</Form.Label>
              <Form.Control placeholder="Project address"
                onChange={e => setInputMasterNameAddNameAddress(e.target.value)}
                value={inputMasterNameAddNameAddress}
              />              
            </Form.Group>
            <Form.Label>Name saved in your project</Form.Label> 
            <Form.Control placeholder="Student name"
              onChange={e => setInputMasterNameAddNameStudentName(e.target.value)}
              value={inputMasterNameAddNameStudentName}
            />                 
            <Button type="submit">Add</Button>
          </Form>
          <br/>
          <p>Delete your project name
          <Form onSubmit={handleMasterNameDeleteName}>
            <Button type="submit">Delete</Button>
          </Form>
          </p>          
        </div>


        <hr/>
        <h2>Student Quizzes</h2>
        <div>
          <div>
            <h4>Add quiz answer</h4>
            <Form onSubmit={handleAddQuizAnswer}>
              <Form.Group controlId="formAddQuizName">
                <Form.Label>"quiz name", "answer", total, grade</Form.Label>
                <Form.Control placeholder="quiz name, answer, total, grade"
                  onChange={e => setInputAddQuizAnswerParameters(e.target.value)}
                  value={inputAddQuizAnswerParameters}
                />
              </Form.Group>
              <Button type="submit">Add</Button>
            </Form>
            <br/>
          </div>
          <div>
            <Form onSubmit={handleQuizByStudentList}>
                <Button type="submit">List Quizzes</Button>
            </Form>            
            {academyQuizByStudentList && 
              <p>List: 
                {academyQuizByStudentList.map((item, i) => 
                  <li key={i}>{JSON.stringify(item)}</li>
                  )}
              </p>
            }          
          </div>          
        </div>


        <br/><br/>
      </div>      
    </Container>
  );
}

export default App;
