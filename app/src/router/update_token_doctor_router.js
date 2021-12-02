const express = require('express')

const device = require('../controller/update_token_controller')

const router = express.Router()

//update token bác sĩ
router.post('/update-token', device.updatetoken)
router.post('/updateStatus',device.updatestatus)

module.exports = router