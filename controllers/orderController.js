'use strict';
const ActiveOrder = require( '../models/ActiveOrder' );
console.log("loading the ActiveOrder Controller")

exports.renderorder = ( req, res ) => {
  res.render( 'order');
};


// this displays all of the members
exports.getAllActiveOrder = ( req, res ) => {
  console.log('in getAllActiveOrder')
  ActiveOrder.find( {} )
    .exec()
    .then( ( activeOrder ) => {
      res.render( 'activeOrder', {
        activeOrder: activeOrder
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'activeOrder promise complete' );
    } );
};




 exports.attachActiveOrder = ( req, res, next ) => {
  console.log('in attachActiveOrder')
  ActiveOrder.find( {} )
    .exec()
    .then( ( activeOrder ) => {
      res.locals.activeOrder = activeOrder
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'members promise complete' );
    } );
 };



exports.saveActiveOrder = ( req, res ) => {
  console.log("in saveActiveOrder!")
  console.dir(req)
  let newOrder = new ActiveOrder( {
    customer: req.body.customer,
    email: req.body.email,
    sandwich: req.body.sandwich,
    hotdog: req.body.hotdog,
    bread: req.body.bread,
    toppings: req.body.toppings,
    condiments: req.body.condiments
  } )
  console.log("after the let newOrder")
  console.log("newOrder = "+ newOrder)

  newOrder.save()
    .then( () => {
      console.log("redirecting to members")
      res.redirect( '/' );
    } )
    .catch( error => {
      res.send( error );
    } );
};





exports.deleteActiveOrder = (req, res) => {
  console.log("in deleteActiveOrder")
  let orderName = req.body.deleteActiveOrder
  if (typeof(orderName)=='string') {
      ActiveOrder.deleteOne({_id:orderName})
           .exec()
           .then(()=>{res.redirect('/')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(orderName)=='object'){
      ActiveOrder.deleteMany({_id:{$in:orderName}})
           .exec()
           .then(()=>{res.redirect('/')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(orderName)=='undefined'){
      console.log("This is if they didn't select a post")
      res.redirect('/')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown orderName: ${orderName}`)
   }
};
