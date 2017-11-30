// require express
var express = require('express');
var path    = require('path');
var bitmarkSDK = require('bitmark-sdk');

// create our router object
var router = express.Router();

// export our router
module.exports = router;

var Account = bitmarkSDK.Account;
var bitmark = new Account('testnet');

// create account
router.get('/createAccount', function(req, res) {
  var accountNumber = bitmark.getAccountNumber().toString();

  var json = JSON.stringify({ 
    account_number: accountNumber, 
    seed: bitmark.getSeed()
  });

  res.send(json);
});

// get account number from seed
router.get('/getAccountNumber/:seed', function(req, res) {
  var account = Account.fromSeed(req.params.seed);

  var json = JSON.stringify({ 
    account_number: account.getAccountNumber().toString(), 
    seed: req.params.seed
  });

  res.send(json);
});

// get list of bitmarks from seed
router.get('/getBitmarks/:seed', function(req, res) {
  var account = Account.fromSeed(req.params.seed);

  account.getBitmarks()
    .then(function(result) {
      var json = JSON.stringify({ 
        account_number: account.getAccountNumber().toString(),
        bitmarks: result.bitmarks 
      });

      res.send(json);
    })
    .catch(function(error) {
      res.send(JSON.stringify({ error: "2", message: "Error issuing bitmarks", bitmark_error: error.message }));
    });
});

// issue bitmark for a given seed/account
router.get('/issueBitmark/:seed', function(req, res) {
  if (req.params.seed === ''){
    res.send(JSON.stringify({ error: "1", message: "Seed params is empty" }));
  }

  var account = Account.fromSeed(req.params.seed);

  var filePath = "public/img/planet.jpg";
  var accessibility = "public";
  var assetName = "Card";
  var assetMeta = { "issue_number": "1", "media_url": "" }
  var quantity = 1;
  account.issue(filePath, accessibility, assetName, assetMeta, quantity)
    .then(function(result) {
        var json = JSON.stringify({ 
                    account_number: account.getAccountNumber().toString(), 
                    seed: req.params.seed
                  });
        console.log(result);
    })
    .catch(function(error) {
      res.send(JSON.stringify({ error: "2", message: "Error issuing bitmarks", bitmark_error: error.message }));
    });
});

// transfer bitmark between 2 accounts
router.get('/transferBitmark/:fromSeed/:toSeed/:bitmarkId', function(req, res) {
  var fromAccount = Account.fromSeed(req.params.fromSeed);
  var toAccount = Account.fromSeed(req.params.toSeed);

  fromAccount.transfer(req.params.bitmarkId, toAccount.getAccountNumber().toString())
    .then(function(result) {
      var json = JSON.stringify({ 
                    account_number: toAccount.getAccountNumber().toString(), 
                    tranction_id: result
                  });
    })
    .catch(function(error) {
      console.log(error)
    });
});