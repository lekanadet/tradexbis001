require('dotenv').config();
const path = require('path')
const express = require('express')
var router = express.Router();
var db = require('../database/db.js');



<<<<<<< HEAD
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




=======




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
>>>>>>> d8451a8219e34b8ead58cf572d812b493b10ea3f


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