const contract = require('truffle-contract');
const SimpleStorageContract = require('../build/contracts/SimpleStorage.json');
const simpleStorage = contract(SimpleStorageContract)

let CurrentInstance = null;

function start(Callback) {
  console.log("Getting Accounts");
  simpleStorage.setProvider(this.web3.currentProvider);
  this.web3.eth.getAccounts(function (err, FetchedAccounts) {
    if (err) {
      console.log("There was an error fetching your accounts.");
      console.log(err);
      Callback(null);
    } else if (FetchedAccounts.length == 0) {
      console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      Callback(null);
    } else {
      console.log(FetchedAccounts);
      Callback(FetchedAccounts);
    }
  });
}

function UploadHash(FileHashArray, Account, Callback) {
  console.log("Uploading to Blockchain");
  console.log(FileHashArray);
  simpleStorage.setProvider(this.web3.currentProvider)
  simpleStorage.deployed().then((instance) => {
    CurrentInstance = instance;
    return CurrentInstance.set(FileHashArray, { from: Account });
  }).then((UploadResponse) => {
    console.log(UploadResponse);
    Callback("Upload Successful");
  })
  .catch((err) => {
    console.log(err);
    Callback(null);
  });
}

function FetchHash(Account, Callback){
  console.log("Fetching Data from Blockchain");
  simpleStorage.setProvider(this.web3.currentProvider)
  simpleStorage.deployed().then((instance) => {
    CurrentInstance = instance;
    return CurrentInstance.get({ from: Account });
  }).then((FetchedData) => {
    console.log("Data Fetched Successfully");
    console.log(FetchedData);
    Callback(FetchedData);
  }).catch((err) => {
    console.log(err);
    Callback(null);
  });
}

module.exports = {
  start,
  UploadHash,
  FetchHash
}
