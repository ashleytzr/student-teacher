const express = require('express');
const bodyParser = require('body-parser');

// Routes
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

// Database
const sequelize = require('./util/database');
const Teacher = require('./models/teacher');
const Student = require('./models/student');
const StudentTeacher = require('./models/student-teacher');

const app = express();

app.use(bodyParser.json());
app.use((error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({message: message});
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api', teacherRoutes);
app.use('/api', studentRoutes);


// Database relationship
Teacher.belongsToMany(Student, { through: StudentTeacher });
Student.belongsToMany(Teacher, { through: StudentTeacher });

Student.hasMany(StudentTeacher, { foreignKey: 'studentId', onDelete: 'CASCADE '});
Teacher.hasMany(StudentTeacher, { foreignKey: 'teacherId', onDelete: 'CASCADE '});


sequelize
    .sync()
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
