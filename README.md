# Braintree Data Visualization Tool with Chart.js

Hello!

This is a data visualization tool for Braintree gateways using Chart.js. It is a website which generates two charts; Transaction Timeline and Transaction Volume by Day. They are in the form of a line chart and a bar chart respectively. Enter a start and end date in the designated date fields, then hit the Submit button and both charts will be generated.

## Table of Contents
- [Setup](#setup)
- [Transaction Timeline](#transaction-timeline)
- [Transaction Volume by Day](#transaction-volume-by-day)
- [Notable features](#notable-features)

## Setup

1. **Download and Unzip**: Download a copy of the project and unzip it.
2. **Setup Environment Variables**: Enter the root directory and copy the contents of `gatewaycredentials.env` into a new file named `.env`. Enter your Braintree API Keys in the designated spaces. Set the `ENVIRONMENT` variable to the environment your gateway uses. It is set to "Sandbox" by default, but set it to "Production" instead if you are using a production gateway.
3. **Install Dependencies**: Open a terminal in the root directory and run:
```
npm install
```
4. **Start the Server**: To start the server, run:
```
npm start
```

Then open http://localhost:3000/ in any browser.

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

#### Notable features:

* Filtering options are generated dynamically based on what's returned in the search. I.e., American Express will only appear as a filtering option under Card Types if the search contained Amex transactions.
* Filters can be used together so that only specific transactions are charted. For example, if a user only wants to see how their Visa Apple Pay transactions have been processing, they could filter out everything but Apple Pay under Payment Methods and everything but Visa under Card Types.
* Zooming and panning is supported. Useful for wide search ranges, all functionalities are maintained when a chart is zoomed/panned.
   * Zooming is achieved by holding the Shift key, then scrolling with the mouse/touchpad while the cursor is over the chart.
   * Panning is achieved by left clicking and holding, then dragging the cursor to where you want to pan.
* A box in the upper righthand corner summarizing the transactions pulled in the search.
* A Set Y Max Value option under the filtering categories. Allow the user to manually set the upper limit of the Y axis. Useful when zooming and panning or in the event that an outlier transaction pulls the Y axis too high to see most transactions.
* A Pop Out button in the upper lefthand corner which pulls the chart out to cover the entire browser window.
* At any time, the user can rightclick on the chart and save a snapshot of the chart exactly as it is currently displayed as a PNG file. The snapshot captures the chart even when zoomed, panned, and/or filtered.

Thank you and enjoy!

-- Rickey