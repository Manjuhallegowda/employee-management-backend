// controllers/employeeController.js
const Employee = require('../models/Employee');
const xlsx = require('xlsx');
const tdsCalculator = require('../utils/tdsCalculator');

// Add a single employee
exports.addEmployee = async (req, res) => {
  try {
    const {
      name,
      employeeId,
      position,
      grossSalary,
      basic,
      hra,
      ca,
      otherAllowances,
      noOfDays,
      workingDays,
      salaryAdvance = 0,
      deductAdvance = 0,
      dues = 0,
      pt = 0,
    } = req.body;

    const basicNum = Number(basic);
    const hraNum = Number(hra);
    const caNum = Number(ca);
    const otherAllowancesNum = Number(otherAllowances);
    const grossSalaryNum = Number(grossSalary);
    const noOfDaysNum = Number(noOfDays);
    const workingDaysNum = Number(workingDays);

    const requiredNumbers = {
      basicNum, hraNum, caNum, otherAllowancesNum, grossSalaryNum, noOfDaysNum, workingDaysNum
    };

    for (const [key, val] of Object.entries(requiredNumbers)) {
      if (isNaN(val)) {
        return res.status(400).json({ error: `Invalid or missing value for: ${key.replace('Num','')}` });
      }
    }

    const salaryEarned = basicNum + hraNum + caNum + otherAllowancesNum;
    const epf = Math.round(basicNum * 0.12);
    const esi = salaryEarned <= 21000 ? Math.round(salaryEarned * 0.0075) : 0;
    const annualSalary = salaryEarned * 12;
    const annualTDS = tdsCalculator(annualSalary);
    const tds = Math.round(annualTDS / 12);

    const totalDeductions =
      epf + esi + tds +
      Number(salaryAdvance) +
      Number(deductAdvance) +
      Number(dues) +
      Number(pt);

    const netSalary = salaryEarned - totalDeductions;

    const newEmployee = {
      name,
      employeeId,
      position,
      grossSalary: grossSalaryNum,
      basic: basicNum,
      hra: hraNum,
      ca: caNum,
      otherAllowances: otherAllowancesNum,
      noOfDays: noOfDaysNum,
      workingDays: workingDaysNum,
      salaryEarned,
      epf,
      esi,
      tds,
      salaryAdvance: Number(salaryAdvance),
      deductAdvance: Number(deductAdvance),
      dues: Number(dues),
      pt: Number(pt),
      totalDeductions,
      netSalary,
    };

    const employee = await Employee.create(newEmployee);
    res.status(201).json(employee);
  } catch (err) {
    console.error('Error saving employee:', err);
    res.status(500).json({ msg: err.message });
  }
};

// Import employees from Excel file
exports.importEmployees = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const employees = rows.map(row => {
      const name = row['EMP Name']?.trim() || "Nil";
      const employeeId = row['EMP ID']?.toString().trim() || "Nil";
      const position = row['Position']?.trim() || "Nil";

      const grossSalary = Number(row['Gross Salary']) || 0;
      const noOfDays = Number(row['No of Days']) || 0;
      const workingDays = Number(row['Working Days']) || 0;

      const basic = Number(row['Basic']) || 0;
      const hra = Number(row['HRA']) || 0;
      const ca = Number(row['CA']) || 0;
      const otherAllowances = Number(row['OTHERS ALLOW.']) || 0;

      const salaryAdvance = Number(row['salary advance']) || 0;
      const deductAdvance = Number(row['deduct advance']) || 0;
      const dues = Number(row['dues']) || 0;
      const pt = Number(row['PT']) || 0;

      const salaryEarned = basic + hra + ca + otherAllowances;
      const epf = Math.round(basic * 0.12);
      const esi = salaryEarned <= 21000 ? Math.round(salaryEarned * 0.0075) : 0;

      const annualSalary = salaryEarned * 12;
      const annualTDS = tdsCalculator(annualSalary);
      const tds = Math.round(annualTDS / 12);

      const totalDeductions = epf + esi + tds + salaryAdvance + deductAdvance + dues + pt;
      const netSalary = salaryEarned - totalDeductions;

      return {
        name,
        employeeId,
        position,
        grossSalary,
        noOfDays,
        workingDays,
        basic,
        hra,
        ca,
        otherAllowances,
        salaryEarned,
        epf,
        esi,
        tds,
        salaryAdvance,
        deductAdvance,
        dues,
        pt,
        totalDeductions,
        netSalary,
      };
    });

    await Employee.insertMany(employees);
    res.status(201).json({ msg: 'Employees imported successfully', importedCount: employees.length });
  } catch (err) {
    console.error('Error importing employees:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Update employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      employeeId,
      position,
      grossSalary,
      noOfDays,
      workingDays,
      basic,
      hra,
      ca,
      otherAllowances,
      salaryAdvance = 0,
      deductAdvance = 0,
      dues = 0,
      pt = 0,
    } = req.body;

    const basicNum = Number(basic);
    const hraNum = Number(hra);
    const caNum = Number(ca);
    const otherAllowancesNum = Number(otherAllowances);
    const grossSalaryNum = Number(grossSalary);
    const noOfDaysNum = Number(noOfDays);
    const workingDaysNum = Number(workingDays);

    const requiredNumbers = {
      basicNum, hraNum, caNum, otherAllowancesNum, grossSalaryNum, noOfDaysNum, workingDaysNum
    };

    for (const [key, val] of Object.entries(requiredNumbers)) {
      if (isNaN(val)) {
        return res.status(400).json({ error: `Invalid or missing value for: ${key.replace('Num','')}` });
      }
    }

    const salaryEarned = basicNum + hraNum + caNum + otherAllowancesNum;
    const epf = Math.round(basicNum * 0.12);
    const esi = salaryEarned <= 21000 ? Math.round(salaryEarned * 0.0075) : 0;
    const annualSalary = salaryEarned * 12;
    const annualTDS = tdsCalculator(annualSalary);
    const tds = Math.round(annualTDS / 12);

    const totalDeductions =
      epf + esi + tds +
      Number(salaryAdvance) +
      Number(deductAdvance) +
      Number(dues) +
      Number(pt);

    const netSalary = salaryEarned - totalDeductions;

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        employeeId,
        position,
        grossSalary: grossSalaryNum,
        noOfDays: noOfDaysNum,
        workingDays: workingDaysNum,
        basic: basicNum,
        hra: hraNum,
        ca: caNum,
        otherAllowances: otherAllowancesNum,
        salaryEarned,
        epf,
        esi,
        tds,
        salaryAdvance: Number(salaryAdvance),
        deductAdvance: Number(deductAdvance),
        dues: Number(dues),
        pt: Number(pt),
        totalDeductions,
        netSalary,
      },
      { new: true }
    );

    if (!employee) return res.status(404).json({ msg: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Delete employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Employee not found' });
    res.json({ msg: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Get all employees with optional search query
exports.getEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee by ID:', err.message);
    res.status(500).json({ msg: err.message });
  }
};