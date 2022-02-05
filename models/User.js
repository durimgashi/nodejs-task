const {sequelize, DataTypes} = require('../config/sequelize.js')

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
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING
    }
}, {

});

console.log(User === sequelize.models.User)