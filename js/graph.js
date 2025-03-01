// js/graph.js

/**
 * Renders a line chart for a given stock symbol using historical data.
 * Highlights data points in red if any of the conditions (for price) are violated.
 * @param {string} symbol - Stock symbol.
 * @param {Array} historicalData - Array of { date: Date, price: number } objects.
 * @param {Array} conditions - Array of custom filter objects.
 */
function renderStockChart(symbol, historicalData, conditions) {
  // Prepare data arrays
  const labels = historicalData.map(dp => dp.date);
  const prices = historicalData.map(dp => dp.price);

  // Determine point colors based on conditions
  const pointColors = historicalData.map(dp => {
    // Default color if no condition violation
    let color = 'blue';
    // Check each condition that applies to this symbol and attribute (price)
    conditions.forEach(cond => {
      if (cond.symbol === symbol && cond.attribute === 'regularMarketPrice') {
        if (cond.operator === '<' && dp.price < cond.threshold) color = 'red';
        if (cond.operator === '>' && dp.price > cond.threshold) color = 'red';
      }
    });
    return color;
  });

  // Remove any existing chart instance before creating a new one
  if (window.stockChart) {
    window.stockChart.destroy();
  }

  const ctx = document.getElementById('stock-chart').getContext('2d');
  window.stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${symbol} Price`,
        data: prices,
        borderColor: 'blue',
        pointBackgroundColor: pointColors,
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Historical Price for ${symbol}`
        }
      }
    }
  });
}
