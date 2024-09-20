# Braintree-Data-Visualization-Tool-with-Chart.js

Hello!

This is a data visualization tool for Braintree gateways using Chart.js. It is a website which generates two charts; a Transaction Timeline and Transaction Volume by Day. They are in the form of a line chart and a bar chart respectively. The chart site is empty upon loading the site, then a start and end date can be selected in the date fields. Once chosen, you can hit the Submit button and both charts will be generated.

## Transaction Timeline

This chart plots transactions on with each plot point representing an individual transaction from further to most recent going from left to right.
* Each plot points is colorcoded to represent the final outcome of the transaction:
  * Green points represent successful transactions.
  * Red points represent Processor Declined transactions.
  * Blue points represent Gateway Rejected transactions.
  * Orange points represent other failed transaction statuses, such as Failed (3000) or Authorization Expired.
* Hovering over any individual transaction will generate a tooltip which provides information on that specific transaction such as the it's Braintree transaction ID, it's status, it's payment method, and more.
* Transactions can be clicked on the chart and the Transaction Detail page within the Braintree gateway will be opened in a new tab.

## Transaction Volume by Day

to be continued