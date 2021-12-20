const express = require('express')

const device = require('../controller/devices_controller')

const router = express.Router()

router.get('/dashboard-devices', device.dashboard)
router.get('/adds-devices', device.adddevices)
router.post('/adds-devices', device.postadddevices)
router.get('/list-devices', device.listdevices)

module.exports = router