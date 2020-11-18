const chai = require('chai');
const chaiHttp = require('chai-http');

const Teacher = require('../models/teacher');
const Student = require('../models/student');
const StudentTeacher = require('../models/student-teacher');

const modelUtil = require('../models/util/functions');

const app = require('../app');

const teacherController = require('../controllers/teacher');

const should = chai.should();
chai.use(chaiHttp);

describe('POST /api/add-teacher', () => {
    describe('Successfully create new teacher', () => {
        beforeEach(async () => {
            await Teacher.destroy({
                where: {email: 'teacherken@gmail.com'}
            });
            console.log('Teacher deleted');
            return true;
        });

        it('Should successfully create teacher with valid email provided', done => {
            const req = {
                email: 'teacherken@gmail.com'
            };
            
            chai
            .request(app)
            .post('/api/add-teacher')
            .set('content-type', 'application/json')
            .send(req)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('message').equals('Teacher created successfully!');
                done();
            });
        });
    });
});


// Register student to teacher
describe('POST /api/register', () => {
    // Success: Valid student and teacher 
    describe('Successfully register students to teacher', () => {
        beforeEach(async () => {
            await Teacher.upsert({ 
                email: 'teacherken@gmail.com'
            });

            await Student.upsert({ 
                email: 'studentjon@gmail.com',
                suspended: false
            });

            await Student.upsert({ 
                email: 'studenthon@gmail.com',
                suspended: false
            });

            const teacherId = await modelUtil.getIdWithEmail('teacherken@gmail.com', Teacher);

            const studentIdArray = await modelUtil.getIdWithEmail(['studenthon@gmail.com', 'studentjon@gmail.com'], Student);

            await StudentTeacher.destroy({
                model: { Teacher, Student },
                where: { teacherId: teacherId, studentId: studentIdArray}
            });
        });

        it('Should register students to teacher with existing teacher and student emails provided', done => {
            const req = {
                teacher: 'teacherken@gmail.com',
                students: [
                    'studentjon@gmail.com',
                    'studenthon@gmail.com'
                ]
            };

            chai
            .request(app)
            .post('/api/register')
            .send(req)
            .end((err, res) => {
                res.should.have.status(204);
                done();
            });
        });
    });

    // Fail: Valid student and invalid teacher 
    describe('Fail to register students to teacher', () => {
        beforeEach(async () => {
            const teacherId = await modelUtil.getIdWithEmail('teacherken@gmail.com', Teacher);
            
            await Teacher.destroy({
                where: {id: teacherId}
            });

            return true;
        });

        afterEach(async () => {
            await Teacher.upsert({ 
                email: 'teacherken@gmail.com'
            });
        });
    
        it('Should fail to register students to teacher if invalid teacher email is provided (teacher does not exist in database)', done => {
            const req = {
                teacher: 'teacherken@gmail.com',
                students: [
                    'studentjon@gmail.com',
                    'studenthon@gmail.com'
                ]
            };

            chai
            .request(app)
            .post('/api/register')
            .send(req)
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.equals(JSON.stringify({ message: 'No records found with provided email.' }));
                done();
            });
        });
    });
});

// Retrieve common list of students to a teacher 
    // Success: Valid teacher provided 

    // Fail: Valid teacher + invalid teacher provided 


// Suspend student
    // Success: Valid student provided

    // Fail: Student that does not exist in database is provided

    // Fail: List of students given


// Retrieve list of students who can receive notification
    // Success: Notification text given + valid teacher given + there are students registered under given teacher

    // Success: Notification text given + valid teacher given + there are students registered under given teacher + valid mentioned students 

    // Success: Notification text givien + valid teacher given + no student registered under teacher + valid mentioned students 

    // Fail: No notification text given + valid teacher given + there are students registered under given teacher

    // Fail: Notification text given + valid teacher given + no student registered under teacher
