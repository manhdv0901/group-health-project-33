const express = require('express')

const patient = require('../controller/list_patient_controller')

const router = express.Router()

router.get('/list-patients', patient.listpatient)
router.get('/list-patients/update', patient.listpatient)
router.get('/list-patients/:na', patient.listpatientone)
router.get('/list-patients/update/:na', patient.updatepatient)
module.exports = router