'use strict';
const mongoose = require( 'mongoose' );

var activeOrderSchema = mongoose.Schema( {
  customer: String,
  email: String,
  sandwich: String,
  hotdog: String,
  bread: String,
  toppings: String,
  condiments: String,
  status: String
} );

module.exports = mongoose.model( 'activeOrder', activeOrderSchema );
