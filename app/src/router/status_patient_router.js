const express = require('express')

const device = require('../controller/status_patient_controller')

const router = express.Router()

router.get('/updateStatusPatient2/:key', device.status2)
router.get('/updateStatusPatient1/:key', device.status1)

module.exports = router