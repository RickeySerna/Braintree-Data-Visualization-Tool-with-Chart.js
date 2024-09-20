# Braintree-Data-Visualization-Tool-with-Chart.js

Hello!

This is a data visualization tool for Braintree gateways using Chart.js. It is a website which generates two charts; a Transaction Timeline and Transaction Volume by Day. They are in the form of a line chart and a bar chart respectively. The chart site is empty upon loading the site, then a start and end date can be selected in the date fields. Once chosen, you can hit the Submit button and both charts will be generated.

## Transaction Timeline

This chart plots transactions on with each plot point representing an individual transaction from further to most recent going from left to right.
* Each plot points is color coded to represent the final outcome of the transaction:
  * Green points represent successful transactions.
  * Red points represent Processor Declined transactions.
  * Blue points represent Gateway Rejected transactions.
  * Orange points represent other failed transaction statuses, such as Failed (3000) or Authorization Expired.
* Hovering over any individual transaction will generate a tooltip which provides information on that specific transaction such as the it's Braintree transaction ID, it's status, it's payment method, and more.
* Transactions can be clicked on the chart and the Transaction Detail page within the Braintree gateway will be opened in a new tab.

## Transaction Volume by Day

This chart plots each day within the search range and creates three bars in each date; one for successful transactions, for Processor Declined transactions, and one for Gateway Rejected transactions.
* Each bar is color coded to represent each of the three outcomes represented:
   * Green bar represents successful transactions.
   * Red bar represents Processor Declined transactions.
   * Blue bar represents Gateway Rejected transactions.
* The size of each bar is determined by the amount per day of each category. For example, if two successful transactions were created on 10/1/2023 for $500 and $1000 respectively, the green bar on that day would reach $1500 on the Y axis.
* Hovering over any bar will bring up a tooltip providing information on that bar including the date, the total amount on those transactions, and the transaction IDs making up the bar.
* Each bar can be clicked and it will bring the user to a transaction search within the Braintree gateway bringing up those specific transactions.

Both charts have a number of common features:

* Filtering options are generated dynamically based on what's returned in the search. I.e., American Express will only appear as a filtering option under Card Types if the search contained Amex transactions.
* Filters can be used together so that only specific transactions are charted. For example, if a user only wants to see how their Visa Apple Pay transactions have been processing, they could filter out everything but Apple Pay under Payment Methods and everything but Visa under Card Types.
* Zooming and panning is supported. Useful for wide search ranges, all functionalities are maintained when a chart is zoomed/panned.
   * Zooming is achieved by holding the Shift key, then scrolling with the mouse/touchpad while the cursor is over the chart.
   * Panning is achieved by left clicking and holding, then dragging the cursor to where you want to pan.
* A box in the upper righthand corner summarizing the transactions pulled in the search.
* A Set Y Max Value option under the filtering categories. Allow the user to manually set the upper limit of the Y axis. Useful when zooming and panning or in the event that an outlier transaction pulls the Y axis too high to see most transactions.
* A Pop Out button in the upper lefthand corner which pulls the chart out to cover the entire browser window.
* At any time, the user can rightclick on the chart and save a snapshot of the chart exactly as it is currently displayed as a PNG file. The snapshot captures the chart even when zoomed, panned, and/or filtered.

## Installation and Run

To run the project, download a copy and unzip it. Enter the root directory and copy the gatewaycredentials.env file's contents into a new file titled .env. Enter the new .env file and enter your Braintree API Keys in the designated spaces.

Do note that the file project is set to run on production/live Braintree gateways by default. To use this with a sandbox, enter the gatewaycreate.js file and change the environment parameter from braintree.Environment.Sandbox to braintree.Environment.Production:

```
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Production,"Change this line"
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});
```

Once that's done, open a terminal inside the project and run npm install to ensure that all dependencies are generated properly:

```
npm install
```

Once that's done, start the server by running npm start:

```
npm start
```

While the server is running, head to http://localhost:3000/ on any browser.

Thank you and enjoy!

- Rickey
