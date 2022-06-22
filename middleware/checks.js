require('dotenv').config();
const path = require('path')
const express = require('express')
var router = express.Router();
var db = require('../database/db.js');



function isEmailInUse(email){
  return new Promise((resolve, reject) => {
    db.query("CALL check_email(?)", [email], function (err, result) {
          if(!err){
            //  console.log("EMAIL COUNT : "+result[0][0].v_result);
              return resolve(result[0][0].v_result === 1);
          } else {
              return reject(new Error('Database error!!'));
          }
        }
      );
  });
}






  function isPhoneInUse(phone){
    return new Promise((resolve, reject) => {
      db.query("CALL check_phone(?)", [phone], function (err, result) {
            if(!err){
              //  console.log("EMAIL COUNT : "+result[0][0].v_result);
                return resolve(result[0][0].v_result === 1);
            } else {
                return reject(new Error('Database error!!'));
            }
          }
        );
    });
  }

module.exports =  {

    isEmailInUse,
    isPhoneInUse

}