const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config();

let DB_HOST
let DB_USERNAME
let DB_PASSWORD
let DB_NAME


// if(process.env.NODE_ENV == 'development') {
	DB_HOST = process.env.DB_HOST
	DB_USERNAME = process.env.DB_USERNAME
	DB_PASSWORD = process.env.DB_PASSWORD
	DB_NAME = process.env.DB_NAME

// } else {
// 	DB_HOST = process.env.DB_HOST_TEST
// 	DB_USERNAME = process.env.DB_USERNAME_TEST
// 	DB_PASSWORD = process.env.DB_PASSWORD_TEST
// 	DB_NAME = process.env.DB_NAME_TEST
// }


const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: DB_HOST,
	dialect: 'mysql',
	logging: false
});

module.exports = {
    sequelize,
    DataTypes
}