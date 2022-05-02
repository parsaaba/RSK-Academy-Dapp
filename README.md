# RSK academy dApp


## Develop locally

Run these commands:

```shell
git clone https://github.com/parsaaba/RSK-Academy-Dapp.git
cd rsk-academy-dapp
npm i
truffle compile
```

Use the file `deploy_locally.js` located in `migrations-TESTs\Locally`

In the folder `migrations`, be sure that you only have the file `deploy_locally.js` in this folder.

### Truffle develop
To develop locally, I'm using only the `truffle develop` environment.

> Truffle develop environment is a blockchain simulator, so you don't need to run a node when use `truffle develop` 

Verify if exists the file .secret
If don't exists, create it. It can be empty when you are using truffle develop. 

```shell
truffle develop
migrate --reset
```

## Run the dApp frontend

```shell
cd app
```

In the first time:

```shell
cd app
```

to run the dApp:

```shell
npm run start
```

In your webwallet, use the same mnemonic from truffle develop.


## Deploy on Blockchain
truffle migrate --network testnet --skip-dry-run

Use the files located in folder `migrations-TESTs\Testnet`.

Copy the file of your choice for the folder `migrations`, 

## RSK Testnet addresses V3 Prod - deployed smart contracts

what ...

```
academyOwner: 0xC2725b31bc77146eDb07b34DaD734a38D2A68277
academyWallet: 0xDA3C24d714f008d0580AE280242381f87E981599

academyProjectList.address: 0x0D3f8b4d2C659B6402F35cd1a73BB8a4B0864C20
academyStudents.address: 0xc24d44eD3CA8d75342f2135B4F1713b9B9589239
academyClassList.address: 0x6800597b6fF5a423002Ff57e58727902BDDE13A6
academyStudentQuiz.address: 0x7eEA02aBFD8cFaF0c6386970A91936471211f5E0

masterName.Address: 0x98A7BeE32B1532F8a8F1ECD72942375C60bc06FF

Devs 2021-01 - class01.address: 0x770a1B1eC8523F98Fe32229b3011cb7A520886bC
Business 2021-01 - class02.address: 0xD2a26e354c3109FAF8F01542362ce5E25C778ad7
```

## Contact

parsa.ba.a@gmail.com
