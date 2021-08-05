const express = require('express');
const con = require('../db/db');
const {requireAuth, checkcurrentuser} = require('../middleware/authmiddleware')
const router = express.Router();

router.get('/create', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    res.render('./USERPAGES/createevent',{message:message, username: req.user.username,event:-1});
})

router.post('/createeventpublic', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    const user = {
        value: req.body.idate
    };
    let data = [user.value];
    const query = `select venuename from venue where venuename not in (select venuename from venue inner join event on event.eventvenue = venue.venuename where event.eventdate = ? )`;
    con.query(query,data,(err,result)=>{
        console.log(result)
        res.render('./USERPAGES/createevent',{message: message,users: result,username:req.user.username,event:1,date:user.value});
    })
});

router.post('/createeventprivate', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    const user = {
        value: req.body.idate
    };
    let data = [user.value];
    const query = `select venuename from venue where venuename not in (select venuename from venue inner join event on event.eventvenue = venue.venuename where event.eventdate = ? )`;
    con.query(query,data,(err,result)=>{
        console.log(result);
        res.render('./USERPAGES/createevent',{message: message,users: result,username:req.user.username,event:2,date:user.value});
    })
});

router.post('/createevent', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    console.log(req.body);
    const user = {
        eventname : req.body.inameevent,
        eventdate: req.body.idate1,
        typeofevent: req.body.itype,
        eventemail: req.body.iemail,
        eventmobno: req.body.imobno,
        eventtype: req.body.ieventtype,
        eventpeople: req.body.inumber,
        eventpeopleleft: req.body.inumber,
        eventfood: req.body.inlineRadioOptions,
        eventmusic: req.body.inlineRadioOptions1,
        eventdance: req.body.inlineRadioOptions2,
        eventvenue: req.body.ibookvenue,
        username: req.user.username,
        typeofevent: req.body.itype
    };
    await new Promise((resolve, reject)=> {
        const query = `INSERT INTO event SET ?`;
        con.query(query,user,(err,result)=>{
            if (err){
                reject(new Error('Something failed (Record Updation) :'+err));
                message = "There is some problem with your creation. Please try it again."
            }    
            else{
                resolve (result);
                message="Your event is successfully created.";
            }
            res.render('./USERPAGES/createevent',{message: message,users: message,username:req.user.username,event:-1,date:message});
        });
    });
});

router.post('/createmyevent', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    console.log(req.body);
    const user = {
        eventname : req.body.ifullname,
        eventdate: req.body.idate1,
        typeofevent: req.body.itype,
        eventemail: req.body.iemail,
        eventmobno: req.body.imobno,
        eventtype: req.body.ieventtype,
        eventprice: req.body.iprice,
        eventpeople: req.body.inumber,
        eventpeopleleft: req.body.inumber,
        eventfood: req.body.inlineRadioOptions,
        eventmusic: req.body.inlineRadioOptions1,
        eventdance: req.body.inlineRadioOptions2,
        eventvenue: req.body.ibookvenue,
        username: req.user.username,
        typeofevent: req.body.itype,
        eventdescription: req.body.idescription
    };
    await new Promise((resolve, reject)=> {
        const query = `INSERT INTO event SET ?`;
        con.query(query,user,(err,result)=>{
            if (err){
                reject(new Error('Something failed (Record Updation) :'+err));
                message = "There is some problem with your creation. Please try it again."
            }    
            else{
                resolve (result);
                message="Your event is successfully created.";
            }
            res.render('./USERPAGES/createevent',{message: message,users: message,username:req.user.username,event:-1,date:message});
        });
    });
});

module.exports = router;