// js/api.js

/**
 * Fetches stock data for one or more symbols from the Yahoo Finance API.
 * @param {string} symbols - Comma-separated stock symbols (e.g., "TQQQ,AAPL,BTC").
 * @returns {Promise<Array>} - Resolves with an array of stock data objects.
 */
async function fetchStockData(symbols) {
    // Construct the API URL 
    const url = `https://yfapi.net/v6/finance/quote?symbols=${symbols}`;
    
    // Options including the API key for authentication.
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
        'X-RapidAPI-Host': 'yfapi.net'
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
  