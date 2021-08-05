const express = require('express');
const con = require('../db/db');
const router = express.Router();

// ------------------------------------------------ Get home page --------------------------------------------

router.get('/', async(req,res)=>{
    var message ='';
    let today = new Date().toISOString().slice(0, 10);
    await new Promise((resolve, reject)=> {
        const query = `select * from event where eventdate >= ? and typeofevent = "public" ORDER BY eventdate limit 4`;
        con.query(query,today,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            res.render('home',{message: message,cardvalue:result});
        });
    });
});


// ------------------------------------------------ Contact us --------------------------------------------

router.get('/contactus', (req,res)=>{
    res.render('contactus');
});

//------------------------------------------------- Login form get data ---------------------------------------

router.get('/signup', (req,res)=>{
    var message = '';
    res.render('./SIGNUPSIGNIN/signup', {message: message});
});

router.get('/signupadmin', (req,res)=>{
    var message = '';
    res.render('./SIGNUPSIGNIN/signupadmin', {message: message});
});

//---------------------------------------- delete events --------------------------------------------------------

router.get('/delete', (req,res)=>{
    var message = "";
    res.render('deleteevent',{message: message});
});

router.post('/delete/deleteevent', async(req,res)=>{
    var message='';
    const user = {
        eventid: req.body.eventid
    };
    let data = [user.eventid];
    if(user.eventid==undefined || user.eventid=="")
    {
        message = "Please Enter a Valid EventId";
        res.render('deleteevent',{message:message});
    }
    await new Promise((resolve, reject)=> {
        const query = `DELETE FROM events WHERE idevents=?;`;
        con.query(query,data,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            message = "EventId \""+ user.eventid + "\" deleted succesfully";
            res.render('deleteevent',{message: message});
        });
    });
});

//--------------------------------------------------------------------------------------------------------------

module.exports = router;