const express = require('express');
const router = express.Router();
const braintree = require('braintree');
require('dotenv').config();

// Defining all of the environment variables needed to run the app.
const requiredEnvVars = ["ENVIRONMENT", "MERCHANT_ID", "PUBLIC_KEY", "PRIVATE_KEY"];
// Creating a var filled with any missing environment variable.
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

// Checking if missingEnvVars is has any values which would mean that some environment var or vars is/are missing.
if (missingEnvVars.length > 0) {
  // If so, throw an error mentioning the missing vars.
  console.error(`The following environment variables are missing or empty: ${missingEnvVars.join(', ')}. Please set them in your .env file.`);
  process.exit(1);
}

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