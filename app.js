const express = require('express');
const app = express();
const chalk = require('chalk');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// env configuration
const dotenv = require("dotenv");
dotenv.config();

const IndexRoutes = require('./routes/indexRoutes');
const adminRoutes = require('./routes/admin/index');
const categoryRoutes = require('./routes/admin/category');
const businessRoutes = require('./routes/admin/business');
const contactRoutes = require('./routes/admin/contact');
const feedbackRoutes = require('./routes/admin/feedback');
const aboutRoutes = require('./routes/admin/about');
const userRoutes = require('./routes/admin/users');

//mongo db connection
mongoose.connect( process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log(chalk.blue('Database Connected'));
}).catch( (err) => {
    console.log(chalk.red('Database Not Connected' + err));
});

//morgan 
app.use(morgan('dev'));


// middleware
app.use(cookieParser());

//json and url encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//session for meassage
app.use(
    session({ 
    secret : 'my secret key',
    saveUninitialized : true,
    resave : false,
    })
);


app.use((req, res, next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// image path set 
app.use(express.static('uploads'));

app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Set Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Initialising Express
// app.use(express.static('public'));
// // set the view engine to ejs
// app.set('view engine', 'ejs');

// Routes Define 
app.use('/', IndexRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/category', categoryRoutes);
app.use('/admin/business', businessRoutes);
app.use('/admin/contact', contactRoutes);
app.use('/admin/feedback', feedbackRoutes);
app.use('/admin/about', aboutRoutes);
app.use('/admin/users', userRoutes);

app.use(function (req, res) {
    res.status(404).render('frontend/error');
});

module.exports = app;