require('dotenv').config();
const path = require('path')
const express = require('express')
var router = express.Router();
var db = require('./database/db.js');
const findout = require('./middleware/checks.js')
const { check,validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const validateLoginMiddlewareCookie = require('./middleware/validate_login_cookie.js');





  /* protected home route for backend testing */
  router.get('/currency-type',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
    if (req.userData) { 
      console.log(req.userData)

      db.query("CALL get_currency_types();", function (err, result){
        if (err) throw err;

      res.json({message: "Currency Types",Currency_Type: result[0][0].currency_type,})
      })
      } 
    
     }) 

   module.exports = router;   