'use strict';
const mongoose = require( 'mongoose' );

var orderSchema = mongoose.Schema( {
  customer: String,
  email: String,
  sandwich: String,
  hotdog: String,
  bread: String,
  toppings: String,
  condiments: String
} );

module.exports = mongoose.model( 'order', orderSchema );
