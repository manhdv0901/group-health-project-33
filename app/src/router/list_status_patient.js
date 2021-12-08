const express = require('express')

const patient = require('../controller/list_patient_state_controller')

const router = express.Router()

router.get('/curedlist', patient.listpatientdone)
router.get('/dielist', patient.listpatientdie)
module.exports = router