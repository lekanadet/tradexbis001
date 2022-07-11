require('dotenv').config();
const express = require('express')
var router = express.Router();
var db = require('./database/db.js');



/* Unprotected home route for buy and sell rate data */
router.get('/homepage-currency-rates',(req,res) => { // an example of a protected route
  
      db.query("CALL get_currencies_type_rates();", function (err, result){
        if (err) throw err;
      console.log(result[0])
      console.log(result[0])
      res.json(
        {message: "Currency Type Rates",
        result: result[0]
      })
      })
    
     })  








module.exports = router;   