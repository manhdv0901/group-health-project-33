const express = require('express')

const device = require('../controller/device_controller')

const router = express.Router()

//update token bác sĩ
router.post('/update/track-history', device.trackhistory)
router.post('/update/treatmentcourse',device.treatmentcourse)

module.exports = router