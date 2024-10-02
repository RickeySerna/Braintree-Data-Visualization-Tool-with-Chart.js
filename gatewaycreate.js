const express = require('express');
const router = express.Router();
const braintree = require('braintree');
require('dotenv').config();

const environmentMap = {
  'Sandbox': braintree.Environment.Sandbox,
  'Production': braintree.Environment.Production
};

const gateway = new braintree.BraintreeGateway({
  environment: environmentMap[process.env.ENVIRONMENT],
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

module.exports = gateway