const express = require('express')

const device = require('../controller/addpatient_controller')

const router = express.Router()

router.get('/add-patient', device.getaddpatient)
router.post('/add-patient', device.postaddpatient)

module.exports = router