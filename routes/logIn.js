var express = require('express');
var router = express.Router();
const fs = require('fs');
const Usernam = require('../models/Username')
const Password = require('../models/Password')
const Evidence = require('../models/Evidence')
const LogIn = require('../models/LogIn')

console.log("inside router ...")
// Here is where we read the data from a file
let rawdata = fs.readFileSync('../database/data.json','utf8');
let database = JSON.parse(rawdata);
//console.log("just read database!")
//console.log(`Here are the squares ${database.squares.map((x)=>(x.toString()))}`)

//This variable only lasts as long as the router is not restarted
let counter = 0
//console.log("loading login router!!!")

router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  counter++
  //console.dir(database)
  //console.dir(database.skills)
  res.render('logIn',
      {info:'Log In',
      username:database.username,
      password:database.password,
      login:database.login,
      counter:counter,
    })
});

router.post('/', function(req, res, next){
  counter++
  //console.log(req.body.skill)
  //console.log(req.body.student)
  //console.log(req.body.evidence)
  let e = new LogIn(req.body.username, req.body.password)
  //console.log('Just loaded ',e)
  database.login.push(e)
  // here is where we write the modified data back to the disk
  fs.writeFileSync('../database/data.json',JSON.stringify(database,null,' '));
  // and we send them back to the same page ...
  res.render('logIn',
      {info:'Log In',
      username:database.username,
      password:database.password,
      login:database.login,
      counter:counter
    })
})

module.exports = router;
