const express = require('express');
const con = require('../db/db');
const jwt = require('jsonwebtoken');
const { requireAuth,checkcurrentuser} = require('../middleware/authmiddleware');
const router = express.Router();

var message = '';
let usernameglobal = "";

const maxAge = 2*24*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, 'my secret key', {
        expiresIn: maxAge
    });
};

//--------------------------------------------------------------------------------------------------------------

router.post('/signupto', async(req,res)=>{
    const user = { 
        fname: req.body.ifirstname,
        mname: req.body.imidname,
        lname: req.body.ilastname,
        username: req.body.iusername,
        password: req.body.ipassword,
        loginaddress: req.body.iaddress,
        loginemail:req.body.iemail,
        mob: req.body.imobno
    };
    if(user.password.length < 3)
    {
        var message = "Password length must be greater than 6 character";
        res.render('./SIGNUPSIGNIN/signup',{message: message});
    }
    var fullname = user.fname + " " + user.mname + " " +user.lname;
    let data = [fullname,user.username,user.password,user.loginaddress,user.loginemail,user.mob];
    console.log(data);
    const uservalue = await new Promise((resolve, reject)=> {
        const query = `SELECT username from login where username = ?`;
        con.query(query,user.username,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    if(!uservalue)
    {
        await new Promise((resolve, reject)=> {
            const query = `INSERT INTO login (fullname,username,password,loginaddress,loginemail,loginmobno) VALUES (?,?,?,?,?,?)`;
            con.query(query,data,(err, result)=> {
                if (err)    reject(new Error('Something failed (Record Updation) :'+err));
                resolve (result);
                message = "Succesfully! Your account has been created.";
                res.render('./SIGNUPSIGNIN/signup',{message: message});
            });
        });
    }
    else
    {
        message = "Username Already Taken";
        res.render('./SIGNUPSIGNIN/signup',{message: message});
    }
});

//--------------------------------------------------------------------------------------------------------------

router.get('/login', [requireAuth,checkcurrentuser], async(req,res)=>{
    res.render('./USERPAGES/dashboard', {users:req.user.username});
});

router.post('/login', async(req,res)=>{
    let today = new Date().toISOString().slice(0, 10);
    const allusers2 = await new Promise((resolve, reject)=> {
        const query = `select * from event where eventdate >= ? and typeofevent = "public" ORDER BY eventdate limit 4`;
        con.query(query,today,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    const user = { 
        username: req.body.iusername,
        password: req.body.ipassword
    };
    if(usernameglobal=="" || usernameglobal == undefined)
        usernameglobal = user.username;
    const uservalue = await new Promise((resolve,reject)=>{
        const query = `Select * from login where username = ?`;
        con.query(query,user.username,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    if(uservalue[0] == undefined)
    {
        message = 'No user exists';
        res.render('home',{message: message,cardvalue: allusers2});
    }
    else if(uservalue[0].username)
    {
        if(uservalue[0].password == user.password)
        {
            const token = createToken(uservalue[0].idlogin);
            res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge*1000});
            res.render('./USERPAGES/dashboard',{users: user.username});
        }
        else
        {
            message = 'Wrong credentials';
            res.render('home',{message: message,cardvalue: allusers2});
        }
    }
});

//--------------------------------------------------------------------------------------------------------------

router.get('/loginadmin', [requireAuth,checkcurrentuser] ,async(req,res)=>{
    res.render('./ADMINPAGES/adminlogin', {users:req.user.username});
})

//--------------------------------------------------------------------------------------------------------------

router.post('/loginadmin', async(req,res)=>{
    let today = new Date().toISOString().slice(0, 10);
    const allusers2 = await new Promise((resolve, reject)=> {
        const query = `select * from event where eventdate >= ? and typeofevent = "public" ORDER BY eventdate limit 4`;
        con.query(query,today,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    const user = { 
        username: req.body.iusername,
        password: req.body.ipassword
    };
    const uservalue = await new Promise((resolve,reject)=>{
        const query = `Select * from login where username = ?`;
        con.query(query,user.username,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    if(uservalue[0] == undefined)
    {
        message = 'No admin exists';
        res.render('home',{message: message,cardvalue: allusers2});
    }
    else if(uservalue[0].username && uservalue[0].admin==1)
    {
        if(uservalue[0].password == user.password)
        {
            const token = createToken(uservalue[0].idlogin);
            res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge*1000});
            res.render('./ADMINPAGES/adminlogin',{users: user.username});
        }
        else
        {
            message = 'Wrong credentials';
            res.render('home',{message: message,cardvalue: allusers2});
        }
    }
    else
    {
        message = 'You are not an admin';
        res.render('home',{message: message,cardvalue: allusers2});
    }
});

//--------------------------------------------------------------------------------------------------------------

router.get('/signout', (req,res) => {
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/');
});

module.exports = router;