const {sequelize, DataTypes} = require("../config/sequelize")

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
    tableName: 'likes',
    timestamps: false
})

module.exports = Like