const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const auth = require('../middleware/authMiddleware');

const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  importEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const Employee = require('../models/Employee'); // 👈 Import model for count route

router.use(auth);

// ➕ New route for employee count
router.get('/count', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error fetching employee count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);

router.post('/', addEmployee);
router.post('/import', upload.single('file'), importEmployees);

router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;