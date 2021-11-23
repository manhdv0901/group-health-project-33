const express = require('express')

const device = require('../controller/list_doctor_controller')

const router = express.Router()

router.get('/list', device.listdoctor)


module.exports = router