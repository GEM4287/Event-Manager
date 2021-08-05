const express = require('express');
const con = require('../db/db');
const { requireAuth,checkcurrentuser } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/update', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message="";
    let today = new Date().toISOString().slice(0, 10);
    let data = [req.user.username,today];
    await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate >= ?`;
        con.query(query,data,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
            res.render('./USERPAGES/updateevent',{users:req.user.username,details: result,message:message});
        });
    });
});

router.post('/updateinto', [requireAuth,checkcurrentuser], async(req,res)=>{
    var message = "";
    console.log(req.body);
    const alluser = await new Promise((resolve, reject)=> {
        const query = `select * from event where idevent = ?`;
        con.query(query,req.body.idevent,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
        });
    });
    
    const alluser2 = await new Promise((resolve, reject)=> {
        const query = `select venuename from venue where venuename not in (select venuename from venue inner join event on event.eventvenue = venue.venuename where event.eventdate = ? )`;
        con.query(query,alluser[0].eventdate,(err,result)=>{
            if (err)    
                reject(new Error('Something failed (Record Updation) :'+err));
            else
                resolve (result);
            console.log(result);
        });
    });
    
    console.log(alluser[0].typeofevent);
    
    if(alluser[0].typeofevent == "Private")
        res.render('./USERPAGES/updateevent2',{users:req.user.username,details: alluser,venue:alluser2,view:1});
    else
        res.render('./USERPAGES/updateevent2',{users:req.user.username,details: alluser,venue:alluser2,view:2});
});

router.post('/updatefinallyprivate', [requireAuth,checkcurrentuser], async(req,res)=>{
    
    console.log(req.body);
    const user = {
        eventid: req.body.iidevent,
        email: req.body.iemail,
        mobno: req.body.imobno,
        name: req.body.ieventname,
        type: req.body.ieventtype,
        venue: req.body.ieventvenue,
        people: req.body.inumber,
        people2: req.body.inumber,
        food: req.body.ifood,
        music:req.body.imusic,
        dance:req.body.idance,
    };    
    const data = [[user.email],[user.mobno],[user.name],[user.type],[user.venue],[user.people],[user.people2],[user.food],[user.music],[user.dance],[user.eventid]];
    
    await new Promise((resolve, reject)=> {
        const query = `UPDATE event SET eventemail=? , eventmobno=? , eventname=? , eventtype=? , eventvenue=? , eventpeople=? , eventpeopleleft=? , eventfood=? , eventmusic=?, eventdance=? WHERE idevent=? `;
        con.query(query,data,(err, result)=> {
            if (err)
            reject(new Error('Something failed (Record Updation) :'+err));  
            else{
                message = "Private Event Updated successfully";   
                resolve(result);
            }
        });
    });

    var message="";
    let today = new Date().toISOString().slice(0, 10);
    let data1 = [req.user.username,today];
    const alluser = await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate >= ?`;
        con.query(query,data1,(err,result)=>{
            if (err)    
                reject(new Error('Something failed (Record Updation) :'+err));
            else
                resolve (result);
            console.log(result);
        });
    });
    
    res.render('./USERPAGES/updateevent', {users:req.user.username,details: alluser,message:message})
});

router.post('/updatefinallypublic', [requireAuth,checkcurrentuser], async(req,res)=>{
    
    var message = "";
    console.log(req.body);
    const user = {
        eventid: req.body.iidevent,
        email: req.body.iemail,
        mobno: req.body.imobno,
        name: req.body.ieventname,
        type: req.body.ieventtype,
        venue: req.body.ieventvenue,
        people: req.body.inumber,
        people2: req.body.inumber,
        food: req.body.ifood,
        music:req.body.imusic,
        dance:req.body.idance,
        price: req.body.iprice,
        descp: req.body.idescription,
        typep: req.body.itypeofevent
    };    
    const data = [[user.email],[user.mobno],[user.name],[user.type],[user.venue],[user.people],[user.people2],[user.food],[user.music],[user.dance], [user.price],[user.descp],[user.typep], [user.eventid]];
    
    await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `UPDATE event SET eventemail=? , eventmobno=? , eventname=? , eventtype=? , eventvenue=? , eventpeople=? , eventpeopleleft=? , eventfood=? , eventmusic=?, eventdance=? , eventprice=? , eventdescription=?, typeofevent=? WHERE idevent=? `;
        con.query(query,data,(err, result)=> {
            if (err)
                reject(new Error('Something failed (Record Updation) :'+err));  
            else{
                message = "Public Event Updated successfully";   
                resolve(result);
            }
        });
    });
    
    let today = new Date().toISOString().slice(0, 10);
    let data1 = [req.user.username,today];
    const alluser = await new Promise((resolve, reject)=> {
        const query = `select * from event where username = ? and eventdate >= ?`;
        con.query(query,data1,(err,result)=>{
            if (err)    
                reject(new Error('Something failed (Record Updation) :'+err));
            else
                resolve (result);
            console.log(result);
        });
    });

    res.render('./USERPAGES/updateevent', {users:req.user.username,details: alluser,message:message})
});

module.exports = router;