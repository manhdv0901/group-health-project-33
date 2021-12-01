const express = require('express')

const patient = require('../controller/list_patient_controller')

const router = express.Router()

router.get('/list-patients', patient.listpatient)
router.get('/list-patients/update', patient.listpatient)
router.post('/update-patient',patient.updatepatientpost)
// router.get('/:na', patient.listpatientone)
router.get('/list-patients/update/:key', patient.updatepatient)
router.get('/list-patients/delete/:key', patient.deletepatient)
module.exports = router