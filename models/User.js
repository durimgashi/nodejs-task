const {sequelize, DataTypes} = require("../config/sequelize")

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
    tableName: 'users',
    timestamps: false
})

module.exports = User