// js/utils.js

/**
 * formatNumber(num) <- return number with commas.
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number.
 */
function formatNumber(num) {
    if (num == null) return 'N/A';
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  
  /**
   * Calculates a ratio given a numerator and denominator upto 4 decimal places.
   * @param {number} numerator - The numerator.
   * @param {number} denominator - The denominator.
   * @returns {string} - The calculated ratio, or 'N/A' if denominator is zero.
   */
  function calculateRatio(numerator, denominator) {
    if (!denominator || denominator === 0) return 'N/A';
    return (numerator / denominator).toFixed(4);
  }
  