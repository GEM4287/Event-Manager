const jwt = require('jsonwebtoken');
const con = require('../db/db');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    console.log(token);
    if(token)
    {
        jwt.verify(token, 'my secret key', (error,decoded) => {
            if(error){
                console.log(error);
                res.redirect('/');
            }
            else{
                console.log(decoded);
                next();
            }
        });
    }
    else
    {
        res.redirect('/');
    }
}

const checkcurrentuser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token, 'my secret key', async (error,decoded) => {
            if(error){
                console.log(error);
                res.locals.user = null;
                next();
            }
            else{
                console.log(decoded);
                const uservalue = await new Promise((resolve,reject) => {
                    const query = `Select * from login where idlogin = ?`;
                    con.query(query,decoded.id,(err, result)=> {
                        if (err)    reject(new Error('Something failed (Record Updation) :'+err));
                        resolve (result);
                    });
                })
                console.log(uservalue[0]);
                res.locals.user = uservalue[0];
                req.user = uservalue[0];
                next();
            }
        });
    }
    else
    {
        res.locals.user = null;
        next(); 
    }
}

module.exports = { requireAuth,checkcurrentuser};