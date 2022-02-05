const { Sequelize, DataTypes } = require('sequelize')


const sequelize = new Sequelize('nodejs-task', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	logging: false
});

module.exports = {
    sequelize,
    DataTypes
}