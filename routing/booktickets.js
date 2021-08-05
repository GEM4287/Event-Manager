const express = require('express');
const connection = require('../db/db');
const router = express.Router();

function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

router.post('/bookmytickets', async(req,res)=>{
    console.log(req.body);
    var idevent = req.body.idevent;
    const alluser = await new Promise((resolve, reject)=> {
        const query = `select eventprice,eventdate from event where idevent = ?`;
        connection.query(query,idevent,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));  
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('./MISC/booktickets',{idevent: idevent,price: alluser});
});

router.post('/booktickets', async(req,res)=>{
    console.log(req.body);
    var mydate = req.body.idate;
    var desireddate = convert(mydate);
    const user = {
        bookingid: req.body.idevent,
        bookingname: req.body.iname,
        bookingmobno: req.body.imobno,
        bookingemail: req.body.iemail,
        bookingaddress: req.body.iaddress,
        bookingdate: desireddate,
        bookingpeoples: req.body.inumber,
        bookingprice: req.body.inumber * req.body.ivalue
    };
    console.log(user);
    await new Promise((resolve, reject)=> {
        const query = `INSERT INTO booking SET ?`;
        connection.query(query,user,(err,result)=>{
            if (err){
                reject(new Error('Something failed (Record Updation) :'+err));
                message = "There is some problem with your booking. Please try it again."
                res.render('home.ejs', { message: message,cardvalue: allusers2});
            }    
            else{
                resolve (result);
                message = "Your booking is done";
            }
        });
    });
    const alluser = await new Promise((resolve, reject)=> {
        const query = `select eventpeopleleft from event where idevent = ?`;
        connection.query(query,user.bookingid,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));  
            resolve(result);
        });
    });
    console.log(alluser[0].eventpeopleleft);
    let data = [alluser[0].eventpeopleleft-user.bookingpeoples,user.bookingid];
    var message = "";
    await new Promise((resolve, reject)=> {
        const query = `UPDATE event SET eventpeopleleft = ? WHERE idevent= ? `;
        connection.query(query,data,(err, result)=> {
            if (err)
                reject(new Error('Something failed (Record Updation) :'+err));
            else
                resolve(result);
        });
    });
    let today = new Date().toISOString().slice(0, 10);
    console.log(today);
    const allusers2 = await new Promise((resolve, reject)=> {
        const query = `select * from event where eventdate >= ? and typeofevent = "public" ORDER BY eventdate limit 4`;
        connection.query(query,today,(err,result)=>{
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));
            resolve (result);
            console.log(result);
        });
    });
    res.render('home', { message: message,cardvalue: allusers2});
})

module.exports = router;