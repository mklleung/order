'use strict';
const Login = require( '../models/Login' );
console.log("loading the login Controller")


// this displays all of the skills
exports.getAllLogin = ( req, res ) => {
  console.log('in getAllLogin')
  Login.find( {} )
    .exec()
    .then( ( logins ) => {
      res.render( 'logins', {
        logins: logins
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'login promise complete' );
    } );
};




exports.saveLogin = ( req, res ) => {
  console.log("in saveLogin!")
  console.dir(req)
  let newLogin = new Login( {
    username: req.body.username,
    password: req.body.password
  } )

  console.log("login = "+newLogin)

  newLogin.save()
    .then( () => {
      res.redirect( '/logins' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteLogin = (req, res) => {
  console.log("in deleteLogin")
  let logInName = req.body.deleteusername
  if (typeof(logInName)=='string') {
      console.log("in first if statement")
      Login.deleteOne({username:logInName})
           .exec()
           .then(()=>{res.redirect('/logins')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(logInName)=='object'){
      console.log("in second if statement")
      Login.deleteMany({username:{$in:logInName}})
           .exec()
           .then(()=>{res.redirect('/logins')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(logInName)=='undefined'){
      console.log("This is if they didn't select a logIn")
      res.redirect('/logins')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown logInName: ${logInName}`)
  }

};
