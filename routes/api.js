const Web3 = require('web3');
const truffle_connect = require('../connection/app.js');
const ipfsAPI = require("ipfs-api");
const route = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

let testFile, testBuffer;
let validCID = null;

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
  return new Promise(function (resolve, reject) {
    testBuffer = new Buffer.from(testFile);
    ipfs.files.add(testBuffer, function (err, file) {
      if (err) {
        console.log(err);
      }
      validCID = file[0].hash;
      resolve();
    });
  });
}

route.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

route.get("/getUploadedfile", (req, res) => {
  res.send(validCID);
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
          console.log(validCID);
          truffle_connect.start()
            .then(() => {
              truffle_connect.UploadHash()
                .then((hash) => {
                  res.send(hash);
                }).catch((err) => {
                  res.send(null);
                })
            }).catch((err) => {
              res.send(null);
            })
        })
        .catch(err => res.send({ error: err }));
    } else res.send("No File chosen");
  }
);

exports = module.exports = {
  route
};