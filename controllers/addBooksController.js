'use strict';
const AddBook = require( '../models/addbook' );
console.log("loading the addBook Controller")


// this displays all of the skills
exports.getAllBooks = ( req, res ) => {
  console.log('in getAllBooks')
  AddBook.find( {} )
    .exec()
    .then( ( addBooks ) => {
      res.render( 'addBooks', {
        addBooks: addBooks
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'AddBook promise complete' );
    } );
};




exports.saveBook = ( req, res ) => {
  console.log("in saveBook!")
  console.dir(req)
  let newBook = new AddBook( {
    quantity: req.body.quantity,
    bookName: req.body.bookName,
    courses: req.body.courses,
    coverType: req.body.coverType,
    condition: req.body.condition,
    lowestPrice: req.body.lowestPrice,
    seller: req.body.seller
  } )

  console.log("addBook = "+newBook)

  newBook.save()
    .then( () => {
      res.redirect( '/addBooks' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteBook = (req, res) => {
  console.log("in deleteBook")
  let addBookName = req.body.deleteQuantity
  if (typeof(addBookName)=='string') {
      console.log("in first if statement")
      AddBook.deleteOne({quantity:addBookName})
           .exec()
           .then(()=>{res.redirect('/addBooks')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(addBookName)=='object'){
      console.log("in second if statement")
      AddBook.deleteMany({quantity:{$in:addBookName}})
           .exec()
           .then(()=>{res.redirect('/addBooks')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(addBookName)=='undefined'){
      console.log("This is if they didn't select a book")
      res.redirect('/addBooks')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown addBookName: ${addBookName}`)
  }

};
