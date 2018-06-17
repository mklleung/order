/*class AddBooks{
  constructor(quantity,bookName,courses,coverType,condition,lowestPrice,seller){
    this.quantity = quantity
    this.bookName = bookName
    this.courses = courses
    this.coverType = coverType
    this.condition = condition
    this.lowestPrice = lowestPrice
    this.seller = seller
  }

  toString(){
    return `AddBooks(${this.quantity},${this.bookName},${this.courses},${this.coverType},${this.condition},${this.lowestPrice},${this.seller})`
  }
}

module.exports = AddBooks*/


'use strict';
const mongoose = require( 'mongoose' );

var addBookSchema = mongoose.Schema( {
  quantity: String,
  bookName: String,
  courses: String,
  coverType: String,
  condition: String,
  lowestPrice: String,
  seller: String
} );

module.exports = mongoose.model( 'addBook', addBookSchema );
