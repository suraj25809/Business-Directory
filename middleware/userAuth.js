const jwt = require('jsonwebtoken');

module.exports = function(req, res, next)
{
    const token = req.cookies.userjwt;

    if(!token)
    {
        return res.redirect('/login');
    }

    try {
        
        const decode = jwt.verify(token, process.env.SECRET);
        req.user = decode.user;
        next();

    } catch (error) {

        return res.redirect('/login');

    }
}