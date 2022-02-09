const jwt = require('jsonwebtoken')
const { JWT_KEY } = process.env

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) return res.status(403).json({response_flag: 'NOK', response_message: "Not authorized"})

    try {
        res.user = jwt.verify(token, JWT_KEY)
        delete res.user.iat
        delete res.user.exp
    } catch (err) {
        return res.status(401).send({ response_flag: 'NOK', response_message: "The token provided is invalid"})
    }

    return next();
}

module.exports = {
    verifyToken
}