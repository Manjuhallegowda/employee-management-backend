const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // EMP ID
  name: { type: String, required: true }, // EMP Name
  position: { type: String, required: true }, // Position

  // Fixed Salary
  grossSalary: { type: Number, required: true }, // Fixed Gross Salary

  // Salary components without "fixed"
  basic: { type: Number, required: true }, // Basic
  hra: { type: Number, required: true }, // HRA
  ca: { type: Number, required: true }, // CA
  otherAllowances: { type: Number, required: true }, // Other Allowances

  // Attendance
  noOfDays: { type: Number, required: true }, // No of Days (Present)
  workingDays: { type: Number, required: true }, // No of Working Days

  // Earned Salary
  salaryEarned: { type: Number, required: true }, // Salary Earned
  epf: { type: Number, required: true }, // EPF (12%)
  esi: { type: Number, required: true }, // ESI (0.75%)
  tds: { type: Number, required: true }, // TDS
  salaryAdvance: { type: Number, default: 0 }, // Salary Advance
  deductAdvance: { type: Number, default: 0 }, // Deduct Advance
  dues: { type: Number, default: 0 }, // Dues
  pt: { type: Number, default: 0 }, // PT

  totalDeductions: { type: Number, required: true }, // Total Deductions
  netSalary: { type: Number, required: true }, // Net Salary
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);