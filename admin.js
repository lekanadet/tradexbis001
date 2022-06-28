require('dotenv').config();
const path = require('path')
const express = require('express')
var router = express.Router();
var db = require('./database/db.js');
const validateLoginMiddlewareCookie = require('./middleware/validate_login_cookie.js');




/* protected home route for currency caategories or type */
router.get('/currency-type',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    console.log(req.userData)

    db.query("CALL get_currency_types();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Currency Types",
      CurrencyTypeInfo: result[0],userdata:req.userData
    })

    })
    } 
  
   })          



/* protected route to add new currencies under a particular currency type */
router.post('/add-currencies',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
  if (req.userData) { 

    db.query("CALL check_currency(?);",[req.body.currency_name], function (err, result){
      if (err) throw err;
    
      if (result[0][0].v_result === 1) {
  
         return res.send('Currency already exists')
        //res.send('Please verify your email take to verify page')
      } 
      else {

const currency_name = req.body.currency_name
const currency_code = req.body.currency_code
const currency_symbol = req.body.currency_symbol
//const currency_icon = req.body.currency_icon
const currency_type = req.body.currency_type
const currency_wallet_address = req.body.currency_wallet_address
const buy_rate = req.body.buy_rate
const sell_rate = req.body.sell_rate
const currency_exchange_rate = req.body.currency_exchange_rate
//const status = req.body.status
const minimum_deposit_limit = req.body.minimum_deposit_limit
const maximum_deposit_limit = req.body.maximum_deposit_limit
const minimum_withdrawal_limit = req.body.minimum_withdrawal_limit
const maximum_withdrawal_limit = req.body.maximum_withdrawal_limit


value = [ currency_name,currency_code, currency_symbol,currency_type,currency_wallet_address,buy_rate,sell_rate,
  currency_exchange_rate,minimum_deposit_limit,maximum_deposit_limit,minimum_withdrawal_limit,maximum_withdrawal_limit]


    db.query("CALL add_currency(?,?,?,?,?,?,?,?,?,?,?,?);", value,function (err, result){
      if (err) throw err;
    res.json(
      {message: "Currencies",
      Currencies_Info: result[0]
         })

       })
      } 
     })
    }
  
   })        


/* protected home route for active currencies under a particular currency type */
router.get('/currencies/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    console.log(req.userData)
    const currency_id = req.params.id
    value = [currency_id]
    db.query("CALL get_currencies(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Currency Types",
      CurrencyTypeInfo: result[0]
    })

    })
    } 
  
   })  
   
   
/* protected route to add new currencies under a particular currency type */
router.post('/update-currencies/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
  if (req.userData) { 

const currency_id = req.params.id
const currency_name = req.body.currency_name
const currency_code = req.body.currency_code
const currency_symbol = req.body.currency_symbol
//const currency_icon = req.body.currency_icon
const currency_type = req.body.currency_type
//const currency_wallet_address = req.body.currency_wallet_address
const buy_rate = req.body.buy_rate
const sell_rate = req.body.sell_rate
const currency_exchange_rate = req.body.currency_exchange_rate
const status = req.body.status
const minimum_deposit_limit = req.body.minimum_deposit_limit
const maximum_deposit_limit = req.body.maximum_deposit_limit
const minimum_withdrawal_limit = req.body.minimum_withdrawal_limit
const maximum_withdrawal_limit = req.body.maximum_withdrawal_limit


value = [currency_id,currency_name,currency_code, currency_symbol,currency_type,currency_exchange_rate,buy_rate,
  sell_rate,status,minimum_deposit_limit,maximum_deposit_limit,minimum_withdrawal_limit,maximum_withdrawal_limit]


    db.query("CALL update_currency(?,?,?,?,?,?,?,?,?,?,?,?,?);", value,function (err, result){
      if (err) throw err;
    res.json(
      {message: "Currency Updated Details",
      Currency_Updated_Info: result[0]

    })

    })
    } 
  
   })      








   /* protected home route for currency caategories or type */
router.get('/get-all-users',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    console.log(req.userData)

    db.query("CALL get_users();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Currency Types",
      User_Info: result[0]
    })

    })
    } 
  
   })   

   module.exports = router;   