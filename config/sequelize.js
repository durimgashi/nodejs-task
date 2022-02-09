const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config();

const {
	DB_HOST,
	DB_USERNAME,
	DB_PASSWORD,
	DB_NAME
} = process.env

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: DB_HOST,
	dialect: 'mysql',
	logging: false
});

module.exports = {
    sequelize,
    DataTypes
}