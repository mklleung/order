const
  createError = require('http-errors');
  express = require('express');
  path = require('path');
  cookieParser = require('cookie-parser');
  logger = require('morgan');
  util = require("util"),
  session = require("express-session"),
  flash = require('connect-flash'),
  bodyParser = require("body-parser"),

  indexRouter = require('./routes/index');
  //usersRouter = require('./routes/users');
  thankyouRouter = require('./routes/thankyou');
  ordersRouter = require('./routes/orders');
  logInController = require('./controllers/logInController');
  activeOrderController = require('./controllers/activeOrderController');
  usersController = require('./controllers/usersController'),
  User = require( './models/User' ),
  ActiveOrder = require( './models/ActiveOrder' );


  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

   // here we set up authentication with passport
   const passport = require('passport')
   const configPassport = require('./config/passport')
   configPassport(passport)


var app = express();

const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://admin:ordering1@ds263791.mlab.com:63791/order' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
  }
  next()
})

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/thankyou', thankyouRouter);
app.use('/orders', ordersRouter);

app.get('/inProgress',
    activeOrderController.getAllActiveOrder,
    (req, res) => {
        res.render('inProgress')
      });
app.get('/pickUp',
    activeOrderController.getAllReadyOrders,
    (req, res) => {
        res.render('pickUp')
      });
app.get('/completedOrders',
    activeOrderController.terminatedOrders,
    (req, res) => {
        res.render('completedOrders')
      });

app.get('/orderForm', function(req, res) {
      console.log(`req.user = ${req.user}`)
        res.render('orderForm', {
            user : req.user
        });
    });
app.get('/search',
    (req, res) => {
        res.render('search')
      });

app.post('/saveActiveOrder',activeOrderController.saveActiveOrder );
app.post('/moveOrderPickUp',activeOrderController.moveOrderPickUp );
app.post('/completeOrder',activeOrderController.completeOrder );
app.post('/searchOrder',activeOrderController.searchOrder );
app.post('/searchOrderEmail',activeOrderController.searchOrderEmail );


app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/logins', function(req,res){
  res.render('logins',{})
})

// route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

app.get('/users',usersController.getAllUsers)
app.get('/users/:id',
        usersController.attachUser,
        activeOrderController.attachUserCompletedOrder,
        usersController.getUser)
app.get('layout',usersController.getAllUsers)

/////////////////////////////////////////////// VUI Start

function count_activeOrders(session, req, res, next){
  ActiveOrder.find( {status:"Active"} )
    .exec()
    .then( ( activeOrder ) => {
      res.locals.output_string= "Number of active orders: "+ activeOrder.length;
      next();
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
}
function count_PickUpOrders(session, req, res, next){
  ActiveOrder.find( {status:"done"} )
    .exec()
    .then( ( activeOrder ) => {
      res.locals.output_string= "Number of ready to pick up orders: "+ activeOrder.length;
      next();
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
}

  let sessionVars=[];
  function process_request(req, res, next){
    res.locals.output_string = "there was an error";
    console.log("in the processing")
    sessionVars[req.body.sessions]= sessionVars[req.body.sessions] || {};
    let sessionVar = sessionVars[req.body.sessions];
    //This is intent allows the chefs to say "order # completed" and be sent to the pick up screen
    if(req.body.queryResult.intent.displayName == "count_activeOrders"){
      console.log("In count_activeOrders")
      count_activeOrders(sessionVar, req, res, next);
    } else if (req.body.queryResult.intent.displayName == "count_PickUpOrders"){
      console.log("In count_PickUpOrders")
      count_PickUpOrders(sessionVar, req, res, next);
    } else {
      res.locals.output_string = "oh no!";
      next();
    }
  };


function replyToDiaf(req, res, next){
  console.dir(req.body)
  return res.json({
      "fulfillmentMessages": [],
      "fulfillmentText": res.locals.output_string,
      "payload":{"slack":{"text":res.locals.output_string}},
      "outputContexts": [],
      "source": "Text Source",
      "followupEventInput":{}
    });

}

app.post('/hook', process_request, replyToDiaf);
/////////////////////////////////////////////// VUI End


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/loginerror'
            }));

    app.get('/login/authorized',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/loginerror'
            }));

function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
