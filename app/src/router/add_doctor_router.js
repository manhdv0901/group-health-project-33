const express = require('express')

const device = require('../controller/add_doctor_controller')

const router = express.Router()

router.get('/adddoctor', device.getdoc)
router.post('/adddoctor', device.postdoctor)

module.exports = router