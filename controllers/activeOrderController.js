'use strict';
const ActiveOrder = require( '../models/ActiveOrder' );
console.log("loading the ActiveOrder Controller")

exports.renderorder = ( req, res ) => {
  res.render( 'order');
};

//This gets all the orders that still need to be made
exports.getAllActiveOrder = ( req, res ) => {
  console.log('in getAllActiveOrder')
  ActiveOrder.find( {status:"Active"} )
    .exec()
    .then( ( activeOrder ) => {
      res.render( 'inProgress', {
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
//This gets all the orders that are ready for pick up
exports.getAllReadyOrders = ( req, res ) => {
  console.log('in getAllReadyOrders')
  ActiveOrder.find( {status:"done"} )
    .exec()
    .then( ( activeOrder ) => {
      res.render( 'pickUp', {
        activeOrder: activeOrder
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'readyOrder promise complete' );
    } );
};
//This gets all the orders that have been picked up and are completely done
exports.terminatedOrders = ( req, res ) => {
  console.log('in terminatedOrders')
  ActiveOrder.find( {status:"complete"} )
    .exec()
    .then( ( activeOrder ) => {
      res.render( 'completedOrders', {
        activeOrder: activeOrder
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'terminatedOrders promise complete' );
    } );
};

exports.moveOrderPickUp = (req, res) => {
  console.log("in moveOrderPickUp")
  let orderID = req.body.orderID
  if (typeof(orderID)=='string') {
      ActiveOrder.updateOne({_id:orderID},{$set:{status:"done"}})
           .exec()
           .then(()=>{res.redirect('/inProgress')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(orderID)=='object'){
          //  users.updateMany({age:19},{$set:{status:"Active"}})
      ActiveOrder.updateMany({_id:orderID},{$set:{status:"done"}})
           .exec()
           .then(()=>{res.redirect('/inProgress')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(orderID)=='undefined'){
      console.log("This is if they didn't select an Order")
      res.redirect('/inProgress')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown orderID: ${orderID}`)
   }
};

exports.completeOrder = (req, res) => {
  console.log("in completeOrder")
  let orderID = req.body.orderID
  if (typeof(orderID)=='string') {
      ActiveOrder.updateOne({_id:orderID},{$set:{status:"complete"}})
           .exec()
           .then(()=>{res.redirect('/pickUp')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(orderID)=='object'){
          //  users.updateMany({age:19},{$set:{status:"Active"}})
      ActiveOrder.updateMany({_id:orderID},{$set:{status:"complete"}})
           .exec()
           .then(()=>{res.redirect('/pickUp')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(orderID)=='undefined'){
      console.log("This is if they didn't select an Order")
      res.redirect('/pickUp')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown orderID: ${orderID}`)
   }
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
    condiments: req.body.condiments,
    status: req.body.status
  } )
  console.log("after the let newOrder")
  console.log("newOrder = "+ newOrder)

  newOrder.save()
    .then( () => {
      console.log("redirecting to thank you")
      res.redirect( '/thankyou' );
    } )
    .catch( error => {
      res.send( error );
    } );
};


/*


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
*/
