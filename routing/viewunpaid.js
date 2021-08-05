const express = require('express');
const con = require('../db/db');
const { requireAuth,checkcurrentuser } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/viewunpaidadmin', [requireAuth,checkcurrentuser], async(req,res) => {
    var message = "";
    const value = await new Promise((resolve, reject)=> {
        const query = `select username from login`;
        con.query(query,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    console.log(value);
    res.render('./ADMINPAGES/viewunpaidadmin', {message,username: req.user.username,value: value,view:-1,details:message,todel: null});
});

router.post('/viewunpaidadmin', [requireAuth,checkcurrentuser], async(req,res) => {
    var message = "";
    console.log(req.body);
    const value = await new Promise((resolve, reject)=> {
        const query = `select username from login`;
        con.query(query,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    const details = await new Promise((resolve, reject)=> {
        const query = `select * from event where username=? and accepted=0`;
        con.query(query,req.body.iusername,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    console.log(details);
    res.render('./ADMINPAGES/viewunpaidadmin', {
        message,
        username: req.user.username,
        value:value,
        view:0,
        details,
        todel: req.body.iusername
    });
});

router.post('/deleteunpaidadminfull',[checkcurrentuser], async (req,res) => {
    var message="";
    console.log(req.body.iusernameof);
    const value = await new Promise((resolve, reject)=> {
        const query = `select username from login`;
        con.query(query,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    await new Promise((resolve, reject)=> {
        const query = `delete from event where username=?`;
        con.query(query,req.body.iusernameof,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    const details = await new Promise((resolve, reject)=> {
        const query = `select * from event where username=? and accepted=0`;
        con.query(query,req.body.iusernameof,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    console.log(details);
    res.render('./ADMINPAGES/viewunpaidadmin', {
        message,
        username: req.user.username,
        view:0,
        details,
        value: value,
        todel: req.body.iusernameof
    });
});

router.post('/deleteunpaidadmin',[checkcurrentuser], async (req,res) => {
    var message="";
    console.log(req.body.iidevent);
    console.log(req.body.iusernameof);
    const value = await new Promise((resolve, reject)=> {
        const query = `select username from login`;
        con.query(query,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    await new Promise((resolve, reject)=> {
        const query = `delete from event where idevent=?`;
        con.query(query,req.body.iidevent,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    const details = await new Promise((resolve, reject)=> {
        const query = `select * from event where username=? and accepted=0`;
        con.query(query,req.body.iusernameof,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    console.log(details);
    res.render('./ADMINPAGES/viewunpaidadmin', {
        message,
        username: req.user.username,
        view:0,
        details,
        value: value,
        todel: req.body.iusernameof
    });
});

//-----------------------------------------------------------------------------------------------------------

router.post('/viewunpaid', [requireAuth,checkcurrentuser], async(req,res) => {
    var message = "";
    console.log(req.body);
    const details = await new Promise((resolve, reject)=> {
        const query = `select * from event where username=? and accepted=0`;
        con.query(query,req.user.username,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    console.log(details);
    res.render('./USERPAGES/viewunpaid', {message,username: req.user.username,view:0,details});
});

router.post('/deleteunpaid',[checkcurrentuser], async (req,res) => {
    var message="";
    console.log(req.body.iidevent);
    await new Promise((resolve, reject)=> {
        const query = `delete from event where idevent=?`;
        con.query(query,req.body.iidevent,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    const details = await new Promise((resolve, reject)=> {
        const query = `select * from event where username=? and accepted=0`;
        con.query(query,req.user.username,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
        });
    });
    console.log(details);
    res.render('./USERPAGES/viewunpaid', {message,username: req.user.username,view:0,details});
});

//-----------------------------------------------------------------------------------------------------------

router.post('/topaid' , [checkcurrentuser],(req,res) => {
    
})

module.exports = router;