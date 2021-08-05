require('dotenv').config();
const express = require('express');
const app = express();
const home = require('./routing/home');
const create = require('./routing/create');
const view = require('./routing/view');
const signup = require('./routing/signupsignin');
const update = require('./routing/update');
const bookticket = require('./routing/booktickets');
const admin = require('./routing/admin');
const unpaid = require('./routing/viewunpaid');
const cookieparser = require('cookie-parser');

const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cookieparser());
app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 },proxy: true,resave: true,saveUninitialized: true}));

app.set('view engine','ejs');

app.use('/', home);
app.use(create);
app.use(view);
app.use(signup);
app.use(update);
app.use(bookticket);
app.use(unpaid);
app.use(admin);

app.listen(3050, ()=>console.log("Listening on port 3050"));