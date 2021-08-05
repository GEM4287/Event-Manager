const express = require('express');
const con = require('../db/db');
const { requireAuth,checkcurrentuser } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/view', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    res.render('./USERPAGES/viewevent', {username: req.user.username,details: message,view:-1});
});

router.post('/viewpubliceventupcoming', [requireAuth,checkcurrentuser], async(req,res)=>{
    let today = new Date().toISOString().slice(0, 10);
    console.log(today)
    console.log(req.user.username);
    let data = [req.user.username,today];
    await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate >= ? and typeofevent = "public"`;
        con.query(query,data,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
            res.render('./USERPAGES/viewevent',{username:req.user.username,details: result,view: 1});
        });
    });
});

router.post('/viewprivateeventupcoming', [requireAuth,checkcurrentuser], async(req,res)=>{
    let today = new Date().toISOString().slice(0, 10);
    console.log(today)
    console.log(req.user.username);
    let data = [req.user.username,today];
    await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate >= ? and typeofevent = "private"`;
        con.query(query,data,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
            res.render('./USERPAGES/viewevent',{username:req.user.username,details: result,view: 2});
        });
    });
});

router.post('/viewpubliceventprevious', [requireAuth,checkcurrentuser], async(req,res)=>{
    let today = new Date().toISOString().slice(0, 10);
    console.log(today)
    console.log(req.user.username);
    let data = [req.user.username,today];
    await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate < ? and typeofevent = "public"`;
        con.query(query,data,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
            res.render('./USERPAGES/viewevent',{username:req.user.username,details: result,view: 3});
        });
    });
});

router.post('/viewprivateeventprevious', [requireAuth,checkcurrentuser], async(req,res)=>{
    let today = new Date().toISOString().slice(0, 10);
    console.log(today)
    console.log(req.user.username);
    let data = [req.user.username,today];
    await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate < ? and typeofevent = "private"`;
        con.query(query,data,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
            res.render('./USERPAGES/viewevent',{username:req.user.username,details: result,view: 4});
        });
    });
});

module.exports = router;