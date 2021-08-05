const express = require('express');
const con = require('../db/db');
const {requireAuth, checkcurrentuser} = require('../middleware/authmiddleware')
const router = express.Router();

router.get('/addvenue', [requireAuth,checkcurrentuser] ,(req,res)=>{
    var message="";
    res.render('./ADMINPAGES/VENUES/addvenue', {username: req.user.username, message});
});

router.post('/addvenue', [requireAuth,checkcurrentuser] ,async(req,res)=>{
    const user = {
        venueowner: req.body.iownername,
        venuename: req.body.iname,
        venueaddress: req.body.iaddress,
        venueprice: req.body.iprice
    }
    await new Promise((resolve, reject)=> {
        const query = `INSERT INTO venue SET ?`;
        con.query(query,user,(err,result)=>{
            if (err){
                reject(new Error('Something failed (Record Updation) :'+err));
                message = "There is some problem with your creation. Please try it again."
            }    
            else{
                resolve (result);
                message="Your Venue is successfully added.";
            }
            res.render('./ADMINPAGES/VENUES/addvenue',{message,username:req.user.username});
        });
    });
});

router.get('/viewvenue', [requireAuth,checkcurrentuser] ,(req,res)=>{
    var message="";
    res.render('./ADMINPAGES/VENUES/viewvenue', {username: req.user.username, message});
});

router.get('/updatevenue', [requireAuth,checkcurrentuser] ,(req,res)=>{
    var message="";
    res.render('./ADMINPAGES/VENUES/updatevenue', {username: req.user.username, message});
});

module.exports = router;