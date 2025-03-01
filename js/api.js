// js/api.js

/**
 * Fetches live stock data for one or more symbols from the Yahoo Finance API.
 * @param {string} symbols - Comma-separated stock symbols (e.g., "TQQQ,AAPL,BTC").
 * @returns {Promise<Array>} - Resolves with an array of stock data objects.
 */
async function fetchStockData(symbols) {
    const url = `https://yfapi.net/v6/finance/quote?symbols=${symbols}`;
    const options = {
      method: 'GET',
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    };
  
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    const json = await response.json();
    if (json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result.length > 0) {
      return json.quoteResponse.result;
    } else {
      throw new Error('No data found for the given stock symbols');
    }
  }
  
  /**
   * Fetches historical data for a given symbol and timeline.
   * @param {string} symbol - Stock symbol.
   * @param {string} startDate - Start date (YYYY-MM-DD).
   * @param {string} endDate - End date (YYYY-MM-DD).
   * @returns {Promise<Array>} - Resolves with an array of historical data objects.
   */
  async function fetchHistoricalData(symbol, startDate, endDate) {
    // Convert dates to Unix timestamps (in seconds)
    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date(endDate).getTime() / 1000);
    // Construct the API URL for historical data
    const url = `https://yfapi.net/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d`;
    const options = {
      method: 'GET',
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    };
  
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    const json = await response.json();
    // Process the historical data into a more usable format
    if (json.chart && json.chart.result && json.chart.result.length > 0) {
      const result = json.chart.result[0];
      const timestamps = result.timestamp;
      const prices = result.indicators.quote[0].close;
      // Map data into an array of objects with date and price properties
      const historicalData = timestamps.map((ts, index) => {
        return { 
          date: new Date(ts * 1000), 
          price: prices[index] 
        };
      });
      return historicalData;
    } else {
      throw new Error('No historical data found for ' + symbol);
    }
  }
  