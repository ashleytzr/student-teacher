const Sequelize = require('sequelize');

const sequelize = new Sequelize('teacherstudent', 'root', 'P@ssw0rd1', {
    dialect: 'mysql', 
    host: 'db',
    query: {
        raw: true
    }
});

module.exports = sequelize;