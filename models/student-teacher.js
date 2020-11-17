const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const StudentTeacher = sequelize.define('studentTeacher', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = StudentTeacher;