const gateway = require('./gatewaycreate.js');
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

app.get('/transactionDataForAnalytics', (req, res) => {
  let transactionAmounts = [];
  let transactionIDs = [];
  let transactionStatuses = [];
  let transactionsCreatedAt = [];
  let transactionTypes = [];
  let transactionCardTypes = [];

  // Function to move the dates from UTC to CST.
  function formatDates(dates) {
    return dates.map(date => {
        let m = moment.utc(date);
        m.tz('America/Chicago');
        return m.format('MMMM Do, YYYY - h:mm A');
    });
  }

  // Functions to format the rest of the data that needs formatting.
  // We define a map that with the preferred values.
  // Then we use the map function with that map to re-define each value in the array properly.
  // All 3 functions pretty much do the same thing.
  function formatTypes(types) {
    const TypeMap = {
      "credit_card": "Credit Card",
      "apple_pay_card": "Apple Pay",
      "android_pay_card": "Google Pay",
      "samsung_pay_card": "Samsung Pay",
      "network_token": "Network Token",
      "masterpass_card": "Masterpass",
      "visa_checkout_card": "Visa Checkout",
      "paypal_account": "PayPal"
    };
    return types.map(type => TypeMap[type] || type);
  }

  function formatStatuses(statuses) {
    const paymentTypeMap = {
      "settled": "Settled",
      "submitted_for_settlement": "Submitted For Settlement",
      "settling": "Settling",
      "authorized": "Authorized",
      "processor_declined": "Processor Declined",
      "gateway_rejected": "Gateway Rejected",
      "authorization_expired": "Authorization Expired",
      "failed": "Failed",
      "settlement_declined": "Settlement Declined",
      "settlement_pending": "Settlement Pending",
      "settlement_confirmed": "Settlement Confirmed",
      "voided": "Voided"
    };
    return statuses.map(status => paymentTypeMap[status] || status);
  }

  function formatCardTypes(cardTypes) {
    const cardTypeMap = {
      "Apple Pay - Visa": "Visa",
      "Apple Pay - MasterCard": "MasterCard",
      "Apple Pay - Discover": "Discover",
      "Apple Pay - American Express": "American Express",
      "undefined": "Undefined"
    };
    return cardTypes.map(cardType => cardTypeMap[cardType] || cardType);
  }

  // Noticed that the search results are pulled in UTC.
  // This will cut off and include some results outside of the timezone of the gateway (CST in my case) at the beginning and ends of the search ranges.
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  // To fix that, we're gonna define the timezone offset here.
  let timezoneOffset = 6;
  // Now we define two new Date objects from the original date objects we received from the client.
  // Also defining the exact time in these; transactions will be pulled starting from 12 AM on the startDate and end at 11:59.59 PM at the endDate.
  let adjustedStartDate = new Date(`${startDate}T00:00:00Z`);
  let adjustedEndDate = new Date(`${endDate}T23:59:59Z`);

  // Now we add the time offset to the dates.
  // So now, let's say the offset is 6 hours like above, transactions will be pulled starting from 6 AM UTC on XXX date which is 12 AM CST. 
  adjustedStartDate.setHours(adjustedStartDate.getHours() + timezoneOffset);
  adjustedEndDate.setHours(adjustedEndDate.getHours() + timezoneOffset);
  
  // Now using toISOString() to turn these back into the YYYY-MM-DD format that the API call likes.
  adjustedStartDate = adjustedStartDate.toISOString();
  adjustedEndDate = adjustedEndDate.toISOString();

  console.log(adjustedStartDate);
  console.log(adjustedEndDate);

  let stream = gateway.transaction.search((search) => {
    console.log("Searching...");
    search.createdAt().between(adjustedStartDate, adjustedEndDate);
  });
  console.log("Adding data to arrays...");
  stream.on('data', (transaction) => {
    // This check ensures that only sale transactions are pulled from the search. No refunds.
    if (transaction.type == "sale") {
      transactionAmounts.push(transaction.amount);
      transactionIDs.push(transaction.id);
      transactionStatuses.push(transaction.status);
      transactionsCreatedAt.push(transaction.createdAt);
      transactionTypes.push(transaction.paymentInstrumentType);

      // Conditions to grab the card type from each type of payment method.
      // This way only the one correct card type attribute is pushed into the array.
      // Keeps the array indexes consistent with the same transaction at each index of each array.
      if (transaction.paymentInstrumentType == "credit_card") {
        transactionCardTypes.push(transaction.creditCard.cardType);
      }
      else if (transaction.paymentInstrumentType == "apple_pay_card") {
        transactionCardTypes.push(transaction.applePayCard.cardType);
      }
      else if (transaction.paymentInstrumentType == "android_pay_card") {
        transactionCardTypes.push(transaction.androidPayCard.sourceCardType);
      }
      // Threw these in as well for the less common payment methods, however they appear to be causing errors.
      // The card type seems to always be undefined. I think this is an issue with the API.
      // Nothing I can do about that. ¯\_(ツ)_/¯
      /*
      else if (transaction.paymentInstrumentType == "samsung_pay_card") {
        transactionCardTypes.push(transaction.samsungPayCardDetails.cardType);
      }
      else if (transaction.paymentInstrumentType == "network_token") {
        transactionCardTypes.push(transaction.networkToken.cardType);
      }
      else if (transaction.paymentInstrumentType == "masterpass_card") {
        transactionCardTypes.push(transaction.masterpassCardDetails.cardType);
      }
      else if (transaction.paymentInstrumentType == "visa_checkout_card") {
        transactionCardTypes.push(transaction.visaCheckoutCardDetails.cardType);
      }*/
      // In case a payment method didn't match any of the defined payment methods (like the ones above), we just add "undefined" to the array.
      // This is to keep the indexes accurate.
      else {
        transactionCardTypes.push("undefined");
      }
    };
  });
  stream.on('end', () => {
    // Using the functions to create new arrays filled with the formatted data.
    let correctedDates = formatDates(transactionsCreatedAt);
    let correctedTypes = formatTypes(transactionTypes);
    let correctedStatuses = formatStatuses(transactionStatuses);
    let correctedCardTypes = formatCardTypes(transactionCardTypes);

    console.log("All done! Sending the data over.");
    res.send({
      amounts: transactionAmounts,
      ids: transactionIDs,
      statuses: correctedStatuses,
      createdAt: correctedDates,
      types: correctedTypes,
      cardTypes: correctedCardTypes
    });
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