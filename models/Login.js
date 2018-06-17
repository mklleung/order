/*class LogIn{
  constructor(username,password){
    this.username = username
    this.password = password
  }

  toString(){
    return `LogIn(${this.username},${this.password})`
  }
}

module.exports = LogIn*/

'use strict';
const mongoose = require( 'mongoose' );

var loginSchema = mongoose.Schema( {
  username: String,
  password: String
} );

module.exports = mongoose.model( 'LogIn', loginSchema );
