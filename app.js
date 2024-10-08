const express = require('express');
const date = require('date-utils');
const path = require('path')
const stream = require('stream');
const readable = require('stream').Readable;
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var chalk = require('chalk');
var moment = require('moment-timezone');
const favicon = require('serve-favicon');
const { fetchDataForAnalytics } = require("./controllers/data-fetching");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, "public", "stylesheets", "chart.png")));

// Creating this to log in the server when a user accesses a page.
app.use('*', function (req, res, next) {
  // Only log files that are actually opened/seen by the user.
  if (!req.url.startsWith('/public/')) {
    console.log(chalk.green('User accessed ' + req.originalUrl));
  }
  next();
});

app.get('/', (req, res) => {
  // Passing the merchant ID here from the .env file as well so that it doesn't have to be hardcoded in the onclick handler.
  res.render('index', {
    merchantId: process.env.MERCHANT_ID,
    title: "Braintree Transaction Data Visualization"
  });
});

app.get('/transactionDataForAnalytics', async (req, res) => {
  // Pulling the start and end dates passed from the client.
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  
  // Calling the function we imported to fetch and transform the data.
  let transactions = await fetchDataForAnalytics(startDate, endDate);
  console.log("Transactions array in app.js: ", transactions);

  // Passing the data back to the client.
  res.send({
    transactions: transactions
  });
});

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