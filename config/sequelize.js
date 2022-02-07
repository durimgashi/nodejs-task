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

const User = sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: {
			msg: "This username is taken"
		}
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: {
			msg: "This email is taken"
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: {
			msg: "This username is taken"
		}
	},
}, {
	timestamps: false
});

const Like = sequelize.define('Like', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	liker_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	timestamps: false
});

User.hasMany(Like, {
	foreignKey: 'user_id',
})

User.hasMany(Like, {
	foreignKey: 'liker_id'
})

module.exports = {
    sequelize,
    DataTypes,
	User,
	Like
}