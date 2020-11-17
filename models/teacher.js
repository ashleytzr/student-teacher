const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Teacher = sequelize.define('teacher', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Teacher;