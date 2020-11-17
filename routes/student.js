const express = require('express');
const { body } = require('express-validator');

const studentController = require('../controllers/student');

const router = express.Router();

// Create new teacher record
router.post(
    '/add-student', 
    body('email')
        .isEmail()
    ,
    studentController.createStudent
);

module.exports = router;