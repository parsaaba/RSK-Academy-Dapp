const AcademyWallet = artifacts.require("AcademyWallet");

module.exports = async (deployer, network, accounts) => {

  const [academyOwner, StudentSol, StudentTalip, StudentOther] = accounts;
  console.log ("\n accounts: \n", accounts, "\n");
  console.log ("academyOwner: ", academyOwner);

  //Deploy AcademyWallet
  await deployer.deploy(AcademyWallet, {from: academyOwner});
  academyWallet = await AcademyWallet.deployed();  
  console.log("academyWallet.address", academyWallet.address);

  console.log("\n\n");
};
