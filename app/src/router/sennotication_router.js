const express = require('express')

const device = require('../controller/sennotification_controller')

const router = express.Router()

router.post('/sendToAll', device.sentoAll)


module.exports = router