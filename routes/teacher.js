const express = require('express');
const { body } = require('express-validator');

const teacherController = require('../controllers/teacher');

const router = express.Router();

// Create new teacher record
router.post(
    '/add-teacher', 
    body('email')
        .isEmail()
    ,
    teacherController.createTeacher
);

router.post(
    '/register',
    teacherController.postRegisterStudentsForTeacher
)

router.post(
    '/suspend', teacherController.postSuspendStudent);

router.post(
    '/retrievefornotifications', teacherController.getStudentsForNotification);

// GET /commonstudents?teacherEmail
router.get('/commonstudents?:teacher', teacherController.getStudentsByTeachers);


module.exports = router;