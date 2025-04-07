const jwt = require('jsonwebtoken')

async function verifyToken(req, res, next){
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Access token not found or malformed'})
    }

    const accessToken = authHeader.split(' ')[1]

    try{
        const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.user = decodedAccessToken
        next()
    } catch(err){
        return res.status(401).json({message: 'Access token invalid or expired'})
    }
}

module.exports = verifyToken