// js/app.js

// Defined an array to hold user-defined custom filters
let activeFilters = [];

// Listen for DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Handle adding custom filters
  const addFilterBtn = document.getElementById('add-filter-btn');
  addFilterBtn.addEventListener('click', addCustomFilter);

  // Handle the main search form submission
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Get comma-separated stock symbols
    const stockInput = document.getElementById('stock-input').value.trim();
    if (!stockInput) return;

    showLoading();

    try {
      // Fetch data for the entered symbols
      const stockDataArray = await fetchStockData(stockInput);
      hideLoading();

      // Filter stocks based on active custom filters
      const alphaCandidates = filterAlphaCandidates(stockDataArray, activeFilters);
      displayStocksData(alphaCandidates);
    } catch (error) {
      hideLoading();
      displayError(error);
    }
  });
});

/**
 * Adds a custom filter based on user input and displays it.
 */
function addCustomFilter() {
  // Get values from the filter form
  const symbol = document.getElementById('filter-symbol').value.trim().toUpperCase();
  const attribute = document.getElementById('filter-attribute').value;
  const operator = document.getElementById('filter-operator').value;
  const threshold = parseFloat(document.getElementById('filter-threshold').value);

  if (!symbol || isNaN(threshold)) {
    alert('Please enter valid filter values.');
    return;
  }

  // Create a filter object
  const filter = { symbol, attribute, operator, threshold };
  activeFilters.push(filter);
  renderActiveFilters();

  // Optionally, clear the form fields after adding
  document.getElementById('filter-form').reset();
}

/**
 * Renders the list of active filters in the UI.
 */
function renderActiveFilters() {
  const container = document.getElementById('active-filters');
  container.innerHTML = '<h3>Active Filters:</h3>';
  activeFilters.forEach((filter, index) => {
    const filterDiv = document.createElement('div');
    filterDiv.classList.add('active-filter');
    filterDiv.innerHTML = `
      <p>
        [${filter.symbol}] ${filter.attribute} ${filter.operator} ${filter.threshold}
        <button onclick="removeFilter(${index})">Remove</button>
      </p>
    `;
    container.appendChild(filterDiv);
  });
}

/**
 * Removes a filter from the activeFilters array and re-renders the list.
 * @param {number} index - Index of the filter to remove.
 */
function removeFilter(index) {
  activeFilters.splice(index, 1);
  renderActiveFilters();
}

/**
 * Filters an array of stock objects using the custom filters.
 * A stock is included if it meets at least one active filter.
 * @param {Array} stocks - Array of stock data objects.
 * @param {Array} filters - Array of custom filter objects.
 * @returns {Array} - Filtered stock data objects.
 */
function filterAlphaCandidates(stocks, filters) {
  // If no filters are active, return all stocks
  if (filters.length === 0) return stocks;

  return stocks.filter(stock => {
    // For each filter, if the stock's symbol matches the filter's symbol,
    // then check the condition using the chosen attribute.
    for (let filter of filters) {
      if (stock.symbol.toUpperCase() === filter.symbol) {
        const value = stock[filter.attribute];
        if (value == null) continue; // Skip if no data for this attribute

        // Apply the operator comparison
        if (filter.operator === '<' && value < filter.threshold) return true;
        if (filter.operator === '>' && value > filter.threshold) return true;
      }
    }
    return false;
  });
}

/**
 * Displays a simple loading message.
 */
function showLoading() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p>Loading...</p>';
}

/**
 * Hides the loading indicator.
 */
function hideLoading() {
  // In this simple example, no extra actions are needed.
}

/**
 * Displays stock data elements on the page.
 * @param {Array} stocks - Array of stock data objects.
 */
function displayStocksData(stocks) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (stocks.length === 0) {
    resultsDiv.innerHTML = '<p>No alpha candidates found.</p>';
    return;
  }

  stocks.forEach(stock => {
    const stockInfo = document.createElement('div');
    stockInfo.classList.add('stock-info');

    stockInfo.innerHTML = `
      <h2>${stock.symbol}</h2>
      <p>Price: $${formatNumber(stock.regularMarketPrice)}</p>
      <p>P/E Ratio: ${stock.trailingPE ? stock.trailingPE : 'N/A'}</p>
    `;

    resultsDiv.appendChild(stockInfo);
  });
}

/**
 * Displays an error message on the page.
 * @param {Error} error - The error object.
 */
function displayError(error) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
}
