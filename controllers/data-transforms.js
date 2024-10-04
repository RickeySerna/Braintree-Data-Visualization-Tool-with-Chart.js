function transformData(transactions) {
    // TODO: call the below functions on the transactions map here.
}

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

module.exports = { transformData };