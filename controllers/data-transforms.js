var moment = require('moment-timezone');

function transformData(transactions) {
    console.log("Transactions array in data-transforms.js: ", transactions);

    // We use map() and the spread operator to generate a new array from the elements of the old array,
    // but we transform the elements we want transformed first.
    return transactions.map(transaction => ({
        ...transaction,
        status: formatStatuses(transaction.status),
        createdAt: formatDates(transaction.createdAt),
        paymentInstrumentType: formatTypes(transaction.paymentInstrumentType),
        cardType: formatCardTypes(transaction.cardType)
    }));
}

// Functions to format the rest of the data that needs formatting.
// We define a map that with the preferred values.
// Then we use the map function with that map to re-define each value in the array properly.
// All 3 functions pretty much do the same thing.
// Functions are updated to run on individual elements now. transformData() maps over each element in the objects in the array.
function formatStatuses(status) {
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
    return paymentTypeMap[status] || status;
}

// Function to move the dates from UTC to CST.
function formatDates(date) {
    let m = moment.utc(date);
    m.tz('America/Chicago');
    return m.format('MMMM Do, YYYY - h:mm A');
}

function formatTypes(type) {
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
    return TypeMap[type] || type;
}

function formatCardTypes(cardType) {
    const cardTypeMap = {
        "Apple Pay - Visa": "Visa",
        "Apple Pay - MasterCard": "MasterCard",
        "Apple Pay - Discover": "Discover",
        "Apple Pay - American Express": "American Express",
        "undefined": "Undefined"
    };
    return cardTypeMap[cardType] || cardType;
}

module.exports = { transformData };