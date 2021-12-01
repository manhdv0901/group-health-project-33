const express = require('express')

const device = require('../controller/404_controller')

const router = express.Router()

router.get('/404', device.staus404)


module.exports = router