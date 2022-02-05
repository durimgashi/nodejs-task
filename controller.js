const {sequelize} = require('./config/sequelize.js')
const {QueryTypes} = require("sequelize")

const signUp = async (data) => {
    let {firstName, lastName, email, password} = data

    let result = await sequelize.query('CALL signup(:p_firstName, :p_lastName, :p_email, :p_password)', {
        replacements: {
            p_firstName: firstName ?? null,
            p_lastName: lastName ?? null,
            p_email: email ?? null,
            p_password: password ?? null
        }
    })

    return result[0]
}

module.exports = {
    signUp
}