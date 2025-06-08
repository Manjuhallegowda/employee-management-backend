function tdsCalculator(annualSalary) {
  let tax = 0;

  // Apply slab-wise calculation
  if (annualSalary <= 250000) {
    tax = 0;
  } else if (annualSalary <= 500000) {
    tax = (annualSalary - 250000) * 0.05;
  } else if (annualSalary <= 1000000) {
    tax = (250000 * 0.05) + (annualSalary - 500000) * 0.20;
  } else {
    tax = (250000 * 0.05) + (500000 * 0.20) + (annualSalary - 1000000) * 0.30;
  }

  // Rebate under section 87A (if income <= ₹5,00,000, tax = 0)
  if (annualSalary <= 500000) {
    tax = 0;
  }

  // Health and education cess (4% on tax)
  if (tax > 0) {
    tax += tax * 0.04;
  }

  return Math.round(tax);
}

module.exports = tdsCalculator;