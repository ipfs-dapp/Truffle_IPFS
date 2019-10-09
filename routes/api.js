const truffle_connect = require('../connection/app.js');
const ipfsAPI = require("ipfs-http-client");
const route = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

let testFile, testBuffer;
let New_Hash = null;
let Account = null;
let Hash_Array = [];
let index = 0;

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/path/to/temporary/directory/to/store/uploaded/files"
});

function AddFile() {
  return new Promise(function(resolve, reject) {
    testBuffer = new Buffer.from(testFile);
    console.log(testBuffer);
    ipfs.add(testBuffer, function(err, file) {
      console.log("File uploaded successfully");
      if (err) {
        console.log("Error occured : ")
        console.log(err);
        Hash_Array = [
          {
            "hash" :  "QmVh9VYMs4QXoTtsYmoYK2oipg4xCpQ2CZgXg4zvxseE1i"
          },
          {
            "hash" :  "Qma8yA5LTcQusTR9DD8gwyv9mWTVKHnWqsiTTSf4tQNaPt"
          },
          {
            "hash" :  "QmeqfjucTiF6MAhqruxTFc6EuM1QS6BmC4XfNN1Jy8fEXp"
          }
          ,
          {
            "hash" :  "Qmd2kHZaobA25JWVV2MDWDwBmvY2XHvYM4VrbbrfQQuGJT"
          },
          {
            "hash" :  "Qmc4aHpNNpy9YpFnJgezkJnaDgGaFBSh8CvRdixw6pqkWh"
          }
        ]
        New_Hash = Hash_Array[index].hash;
        index++;
        // reject(err);
      }else{
        New_Hash = file[0].hash;
      }
      resolve();
    });
  });
}

function StringToArray(HashArrayString){
  console.log("Converting String to Array");
  let OldArray = HashArrayString.split("_");
  let newArray = [];
  for(HashObject of OldArray){
    newArray.push(JSON.parse(HashObject));
  }
  console.log("newArray : "+newArray);
  return newArray;
}

function ArrayToString(HashArray){
  console.log("Converting Array to String");
  let newArray = [];
  for(HashObject of HashArray){
    newArray.push(JSON.stringify(HashObject));
  }
  console.log("newArray : "+newArray);
  return newArray.join("_");
}

route.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

route.get("/getUploadedfile", (req, res) => {
  res.send(New_Hash);
});

route.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    if (req.file != undefined) {
      const tempPath = req.file.path;
      testFile = fs.readFileSync(tempPath);
      AddFile()
        .then(() => {
          console.log("Sending hash to upload");
          console.log("New Hash is : "+New_Hash);
          truffle_connect.FetchHash(Account,function(Fetched_Hash_Array_String){
            console.log(Fetched_Hash_Array_String);
            if(Fetched_Hash_Array_String){
              // let Hash_Array = StringToArray(Fetched_Hash_Array_String);
              let Hash_Array = [];
              Hash_Array.push({
                "hash" : New_Hash
              });
              let Hash_Array_String = ArrayToString(Hash_Array);
              console.log("Uploading Hash to Blockchain");
              truffle_connect.UploadHash(Hash_Array_String,Account,function(response){
                if(response){
                  console.log(response);
                  console.log("Fetching Data");
                  truffle_connect.FetchHash(Account,function(Update_Hash_Array){
                    if(Update_Hash_Array){
                      console.log(Update_Hash_Array);
                      let New_Updated_Hash_Array = StringToArray(Update_Hash_Array);
                      res.send(New_Updated_Hash_Array);
                    }else{
                      res.send(null);
                    }
                  })
                }else{
                  res.send(null);
                }
              })
            }else{
              console.log("Unable to fetch data");
              res.send(null);
            }
          })
        }).catch(err => {
          console.log(err);
          res.send({ error: err })
        });
    } else res.send("No File chosen");
  }
);

route.post("/getMyAccount", (req, res) => {
  truffle_connect.start(function (data) {
    if (data) {
      Account = data[req.body.UserID];
      console.log("Account " + req.body.UserID + " : " + data[req.body.UserID]);
      truffle_connect.FetchHash(Account,function(Hash_Array){
        if(Hash_Array){
          // let New_Updated_Hash_Array = StringToArray('{"hash":"Sample"}_{"hash":"Sample2"}');
          let New_Updated_Hash_Array = StringToArray(Hash_Array);
          res.send(New_Updated_Hash_Array);
        }else{
          res.send(null);
        }
      })
    } else {
      console.log("Error Occured");
      res.send(null);
    }
  })
})

exports = module.exports = {
  route
};