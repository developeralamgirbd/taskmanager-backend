const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const Token = req.headers['authorization'];
    jwt.verify(Token,"SecretKey123456789",function (err, decoded) {
        if(err){
            res.status(401).json({error: "unauthorized"})
        }
        else {
            const email = decoded['data'];
            req.headers.email = email
            next();
        }
    })
}