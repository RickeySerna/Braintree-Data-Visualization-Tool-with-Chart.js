const gateway = require('../gatewaycreate.js');
const { transformData } = require('./data-transforms');

async function fetchDataForAnalytics(req) {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let transactions = [];

    console.log("Start date in data-fetching.js: " + startDate);
    console.log("End date in data-fetching.js: " + endDate);

    // Noticed that the search results are pulled in UTC.
    // This will cut off and include some results outside of the timezone of the gateway (CST in my case) at the beginning and ends of the search ranges.

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

    // Wrapping the Promise in a try block to have more control over error handling with the API call.
    try {
        return await new Promise((resolve, reject) => {
            let stream = gateway.transaction.search((search) => {
                console.log("Searching...");
                search.createdAt().between(adjustedStartDate, adjustedEndDate);
            });

            console.log("Adding data to arrays...");
            stream.on('data', (transaction) => {
                // This check ensures that only sale transactions are pulled from the search. No refunds.
                if (transaction.type == "sale") {

                    // Conditions to grab the card type from each type of payment method.
                    // This way only the one correct card type attribute is pushed into the array.
                    // Keeps the array indexes consistent with the same transaction at each index of each array.
                    const cardTypeMap = {
                        "credit_card": transaction.creditCard.cardType,
                        "apple_pay_card": transaction.applePayCard.cardType,
                        "android_pay_card": transaction.androidPayCard.sourceCardType
                    };

                    const cardType = cardTypeMap[transaction.paymentInstrumentType] || "undefined";

                    transactions.push({
                        amount: transaction.amount,
                        id: transaction.id,
                        status: transaction.status,
                        createdAt: transaction.createdAt,
                        paymentInstrumentType: transaction.paymentInstrumentType,
                        cardType: cardType
                    });

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
                }
            });

            stream.on('end', () => {
                console.log("All done! Sending the data over.");
                transactions = transformData(transactions);
                resolve(transactions);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    } catch (error) {
        // Calling out an authentication errors which would occur if the API keys the user inputted are wrong/not valid.
        if (error.type === "authenticationError") {
            console.error("Braintree Authentication Error: Looks like something went wrong with your API keys. Please check your .env file and ensure they're entered correctly.");
            process.exit(1);
        }
        else {
            console.error("Error: ", error.message);
            process.exit(1);
        }
    }
}

module.exports = { fetchDataForAnalytics };