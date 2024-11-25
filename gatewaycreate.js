const express = require('express');
const router = express.Router();
const braintree = require('braintree');
require('dotenv').config();

const environmentMap = {
  'Sandbox': braintree.Environment.Sandbox,
  'Production': braintree.Environment.Production
};

const environment = process.env.ENVIRONMENT;

// Error checking to see if the user has input a bad ENVIRONMENT var.
if (!environmentMap[environment]) {
  console.error(`Invalid ENVIRONMENT value: ${environment}. Please set it to either "Sandbox" or "Production" in the .env file.`);
  process.exit(1);
}

const gateway = new braintree.BraintreeGateway({
  environment: environmentMap[environment],
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

module.exports = gateway