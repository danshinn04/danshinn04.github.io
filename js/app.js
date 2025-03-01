// js/app.js

// Array to hold user-defined custom filters
let activeFilters = [];

document.addEventListener('DOMContentLoaded', () => {
  // Add custom filter event
  document.getElementById('add-filter-btn').addEventListener('click', addCustomFilter);

  // Main search form submission: fetch live stock data and apply filters
  document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const stockInput = document.getElementById('stock-input').value.trim();
    if (!stockInput) return;
    showLoading();

    try {
      const stockDataArray = await fetchStockData(stockInput);
      hideLoading();
      const alphaCandidates = filterAlphaCandidates(stockDataArray, activeFilters);
      displayStocksData(alphaCandidates);
    } catch (error) {
      hideLoading();
      displayError(error);
    }
  });

  // Close chart view
  document.getElementById('close-chart-btn').addEventListener('click', () => {
    document.getElementById('chart-section').style.display = 'none';
  });
});

/**
 * Adds a custom filter based on user input and displays it.
 */
function addCustomFilter() {
  const symbol = document.getElementById('filter-symbol').value.trim().toUpperCase();
  const attribute = document.getElementById('filter-attribute').value;
  const operator = document.getElementById('filter-operator').value;
  const threshold = parseFloat(document.getElementById('filter-threshold').value);

  if (!symbol || isNaN(threshold)) {
    alert('Please enter valid filter values.');
    return;
  }

  const filter = { symbol, attribute, operator, threshold };
  activeFilters.push(filter);
  renderActiveFilters();
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
  if (filters.length === 0) return stocks;
  return stocks.filter(stock => {
    for (let filter of filters) {
      if (stock.symbol.toUpperCase() === filter.symbol) {
        const value = stock[filter.attribute];
        if (value == null) continue;
        if (filter.operator === '<' && value < filter.threshold) return true;
        if (filter.operator === '>' && value > filter.threshold) return true;
      }
    }
    return false;
  });
}

/**
 * Displays stock data in the results section along with a "View Chart" button.
 * @param {Array} stocks - Array of filtered stock data objects.
 */
function displayStocksData(stocks) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
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
      <button class="view-chart-btn" data-symbol="${stock.symbol}">View Chart</button>
    `;
    resultsDiv.appendChild(stockInfo);
  });

  // Add event listeners for the newly added "View Chart" buttons
  document.querySelectorAll('.view-chart-btn').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const symbol = event.target.getAttribute('data-symbol');
      // Get timeline values from date inputs (if not provided, use defaults)
      const startDate = document.getElementById('start-date').value || '2020-01-01';
      const endDate = document.getElementById('end-date').value || new Date().toISOString().split('T')[0];

      try {
        showChartLoading();
        // Fetch historical data for the selected symbol
        const historicalData = await fetchHistoricalData(symbol, startDate, endDate);
        // Render the chart using the graph module, passing any filters for that symbol
        renderStockChart(symbol, historicalData, activeFilters);
        hideChartLoading();
        document.getElementById('chart-section').style.display = 'block';
      } catch (error) {
        hideChartLoading();
        alert('Error loading chart: ' + error.message);
      }
    });
  });
}

/**
 * Displays a loading message in the results section.
 */
function showLoading() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p>Loading...</p>';
}

/**
 * Hides the loading indicator.
 */
function hideLoading() {
  // For this example, nothing additional is needed.
}

/**
 * Displays a loading message for the chart.
 */
function showChartLoading() {
  const chartSection = document.getElementById('chart-section');
  chartSection.innerHTML = '<p>Loading chart...</p>';
}

/**
 * Hides the chart loading indicator.
 */
function hideChartLoading() {
  // Nothing extra needed if the chart renders properly.
}

/**
 * Displays an error message in the results section.
 * @param {Error} error - The error object.
 */
function displayError(error) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
}
