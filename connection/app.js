const contract = require('truffle-contract');
const SimpleStorageContract = require('../build/contracts/SimpleStorage.json');
const simpleStorage = contract(SimpleStorageContract)

let Account;

function start() {
  return new Promise(function (resolve, reject) {
    simpleStorage.setProvider(self.web3.currentProvider);
    self.web3.eth.getAccounts(function (err, FetchedAccounts) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        reject(err);
      } else if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        reject("No Accounts Available");
      } else {
        Account = FetchedAccounts[0];
        console.log(FetchedAccounts);
        resolve();
      }
    });
  })
}

function UploadHash(Hash) {
  return new Promise(function (resolve, reject) {
    simpleStorage.setProvider(this.web3.currentProvider)
    simpleStorage.deployed().then((instance) => {
      instance.set(Hash,Account)
      .then((result)=>{
        console.log("Upload Successful");
        resolve(result[0].hash);
      }).catch((err)=>{
        console.log(err);
        reject(err);
      })
    }).catch((err)=>{
      console.log(err);
      reject(err);
    });
  })
}

module.exports = {
  start,
  UploadHash
}
