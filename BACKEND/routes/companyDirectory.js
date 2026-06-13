const express = require('express');
const { getCompanies, createCompany, seedCompanies } = require('../controllers/companyDirectoryController');

const router = express.Router();

router.get('/', getCompanies);
router.post('/', createCompany);
router.post('/seed', seedCompanies);

module.exports = router;
