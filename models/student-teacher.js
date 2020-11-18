const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// TODO: Think about using studentID and teacherID as composite key for this table instead
const StudentTeacher = sequelize.define('studentTeacher', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = StudentTeacher;