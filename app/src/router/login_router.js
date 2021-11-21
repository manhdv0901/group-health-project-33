const express = require('express')

const device = require('../controller/login_controller')

const router = express.Router()

router.get('/login', device.login)
router.post('/login', device.login1)

module.exports = router