const { validationResult } = require('express-validator');

const Teacher = require('../models/teacher');
const Student = require('../models/student');
const StudentTeacher = require('../models/student-teacher');

const modelUtil = require('../models/util/functions');

// Extra APIs
exports.createTeacher = async (req, res, next) => {
    console.log('add-teacher POST requested called to create new teacher');
    try {
        const errors = validationResult(req);

        if (typeof req.body.email === 'object') {
            const errorMessage =  JSON.stringify({ message: 'Please provide only one email' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        if (!errors.isEmpty()) {
            const errorMessage = JSON.stringify({ message: 'Teacher email provided is invalid!' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        const email = req.body.email;

        await Teacher.upsert({
            email: email
        });

        res.status(201).json({
            message: 'Teacher created successfully!',
        });

    } catch (err) {
        if (!err.statusCode) {
            res.status(500).json({ message: 'Oops, something went wrong! :(' });
            console.log(err);
        }

        res.status(err.statusCode).send(err.message);
    }
};

// First question: As a teacher, I want to register one or more students to a specified teacher
exports.postRegisterStudentsForTeacher = async (req, res, next) => {
    console.log('[postRegisterStudentsForTeacher] Registering students to given teacher');
    try {
        const teacherEmail = req.body.teacher;
        const studentEmailArray = req.body.students;

        const teacherId = await modelUtil.getIdWithEmail(teacherEmail, Teacher);
        console.log(`Teacher ID obtained:  ${teacherId}`);

        studentEmailArray.forEach( async studentEmail => {
            let studentId = await modelUtil.getIdWithEmail(studentEmail, Student);
            console.log(`Student ID obtained:  ${studentId}`);

            await StudentTeacher.upsert({
                studentId: studentId,
                teacherId: teacherId
            });
        });

        res.status(204).send('Success')

    } catch (err) {
        if (!err.statusCode) {
            res.status(500).json({ message: 'Oops, something went wrong! :(' });
            console.log(err);
        }

        res.status(err.statusCode).send(err.message);
    } 
};

// Second question: As a teacher, I want to retrieve a list of students common to a given list of teachers
exports.getStudentsByTeachers = async (req, res, next) => {
    const teacherEmail = req.query.teacher;
    console.log(typeof teacherEmail);
    try {
        const teacherRes = await Teacher.findAll({
            where: { email: teacherEmail}
        });
    
        if (teacherRes.length === 0) {
            const errorMessage = JSON.stringify({ message: 'Unable to find given teacher in the database. Is provided email a valid teacher in the database records?' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }
    
        let teacherIdArray = teacherRes.map( obj => {
            return obj.id;
        });
        
        console.log(teacherIdArray);

        if (typeof teacherEmail === 'object' && teacherEmail.length !== teacherIdArray.length ) {
            const errorMessage = JSON.stringify({ message: 'One of the teachers provided does not exist in the database' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        let studentsUnderTeacherArray = []
        let studentCounter = {}

        for(var teacher of teacherIdArray) {
            studentsUnderTeacherArray = await StudentTeacher.findAll({
                where: { teacherId: teacher }
            });

            let studentIdArrayForEachTeacher = studentsUnderTeacherArray.map( obj => {
                return obj.studentId;
            });

            console.log(studentIdArrayForEachTeacher);

            await studentIdArrayForEachTeacher.forEach( id => {
                studentCounter[id] = (studentCounter[id] || 0 ) + 1;
            });
            
        }

        console.log(studentCounter);

        let commonStudentIdArray = [];

        for (let key in studentCounter) {
            if(studentCounter[key] === teacherIdArray.length) {
                commonStudentIdArray.push(key);
            }
        }
        
    
        if (commonStudentIdArray.length === 0) {
            const errorMessage = JSON.stringify({ message: 'No students registered under given teacher(s)' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        const studentResArray = await Student.findAll({
            where: { id: commonStudentIdArray}
        })

        if (studentResArray.length === 0) {
            const error = new Error('Students cannot be found in the database');
            error.statusCode = 400;
            throw error;
        }

        let studentEmailArray = [];

        studentResArray.forEach(student => {
            studentEmailArray.push(student['email']);
        })
        
        res.status(200).json({
            students: studentEmailArray
        });

    } catch (err) {
        if (!err.statusCode) {
            res.status(500).json({ message: 'Oops, something went wrong! :(' });
            console.log(err);
        }

        res.status(err.statusCode).send(err.message);
    }
    
};

// Third question: As a teacher, I want to suspend a specified student 
exports.postSuspendStudent = async (req, res) => {
    const studentEmail = req.body.student;

    try {
        const result = await Student.update({ suspended: true }, { where: { email: studentEmail } });

        if (result[0] === 0) {
            const errorMessage = JSON.stringify({ message: 'Did not manage to suspend student because student might not exist.' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        res.status(204).send('Success');
        
    } catch (err) {
        if (!err.statusCode) {
            res.status(500).json({ message: 'Oops, something went wrong! :(' });
            console.log(err);
        }

        res.status(err.statusCode).send(err.message);
    }    
};

// Fourth question: As a teacher, I want to retrieve a list of students who can receive a given notification.
exports.getStudentsForNotification = async (req, res) => {
    const teacherEmail = req.body.teacher;
    const notification = req.body.notification; 

    // Look for students mentioned in the notification
    let notificationResArray = notification.split(' ');

    try {
        if (notificationResArray.length === 0) {
            const errorMessage = JSON.stringify({ message: 'Notification provided is empty. Please input notification text' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        if (teacherEmail.length === 0) {
            const errorMessage = JSON.stringify({ message: 'Please provide teacher email.' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        // Get an array  of students that are mentioned 
        let studentMentionedEmailArray = [];

        notificationResArray.forEach( (student) => {
            let studentSelected = student.substring(1, student.length);

            if (validateEmail(studentSelected)) {
                studentMentionedEmailArray.push(studentSelected);
            }
        });

        // Get teacher ID
        const teacherId = await modelUtil.getIdWithEmail(teacherEmail, Teacher);

        // Get ID of students that are registered under the given teacher 
        let registeredStudentIdArray = await StudentTeacher.findAll({
            attributes: [
                'studentId'
            ],
            where: { teacherId: teacherId }
        });

        registeredStudentIdArray = registeredStudentIdArray.map( obj => {
            return obj.studentId;
        })

        // Get student email of students registered under the given teacher 
        const registeredStudentEmailArray = await modelUtil.getEmailById(registeredStudentIdArray, Student);

        const studentEmailArray = [...registeredStudentEmailArray, ...studentMentionedEmailArray];

        // Get email of all recipients by checking if student is suspended 
        let recipientEmailArray = []

        studentEmailArray.forEach( student => {
            let isNotSuspendedOrNotExist = modelUtil.isStudentSuspended(student, Student)
            if (isNotSuspendedOrNotExist === 0 || isNotSuspendedOrNotExist !== -1) {
                recipientEmailArray.push(student);
            }
        });
    
        res.status(200).json({
            recipients: recipientEmailArray
        });

    } catch (err) {
        if (!err.statusCode) {
            res.status(500).json({ message: 'Oops, something went wrong! :(' });
            console.log(err);
        }
        
        res.status(err.statusCode).send(err.message);
    }
    
};


/**
 * 
 * @param  {String} email Given email to check if it's a valid email
 * @return {Boolean}      Returns true if email provided is valid and false if email provided is not valid
 */
const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}