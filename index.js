const path = require('path')
const express = require('express')
var cors = require('cors')
var app = express()
var router = express.Router();
var db = require('./database/db.js');
const hbs = require('hbs')
const pug = require('pug');
const bodyparser = require('body-parser')
const cookieParser = require("cookie-parser");

const { Whitelist } = require("./Whitelist.js");
const credentials = require("./credentials");



const corsOptions = {
  origin: (origin, callback) => {
    if (Whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(credentials);

app.use(cors(corsOptions));


app.use(cookieParser());

app.use(bodyparser.urlencoded({
    extended: false

 })); 

app.use(bodyparser.json())



var userRouter = require('./user')
var userExtRouter = require('./user_ext')
var adminRouter = require('./admin')
var homePageRouter = require('./homepage')


// Define paths for express config
const publicDirectoryPath = path.join(__dirname,'./public')
const viewsPath = path.join(__dirname,'./views')

//app.use(express.static(path.join(__dirname, 'public/')));
// set up handlebars engine and views location
app.set('view engine', 'hbs')
//app.set('view engine', pug);
app.set('views',viewsPath)

//hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.use('/', userRouter);
app.use('/', userExtRouter);
app.use('/', adminRouter);
app.use('/', homePageRouter);


var port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log("server is up on port" + port);
});
