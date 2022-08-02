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
const Aws = require('aws-sdk')    
var upload = require('./middleware/multer.js');



/* protected route to get user's deposit transactions history */
router.get('/get-test',(req,res) => { // an example of a protected route

    
    db.query("CALL get_test();",function (err, result){
      if (err) throw err;
    console.log(result[0][0].id)
    res.json(
      {message: "User Deposit History",
      result: result[0][0].id
    })

    })
  })    



/* protected route to get user's deposit transactions history */
router.get('/user-deposit-history',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    id = req.userData.userId
    value = [id]
    
    db.query("CALL user_deposit_history3(?);", value,function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Deposit History",
      result: result[0]
    })

    })
    } 
  })     




/* protected route to get user's deposit transactions history */
router.get('/user-withdrawal-history',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    id = req.userData.userId
    value = [id]
    
    db.query("CALL user_withdrawal_history3(?);", value,function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Withdrawal History",
      result: result[0]
    })

    })
    } 
  })       



router.post('/change-password/:id',validateLoginMiddlewareCookie.isLoggedIn,

[ 
check("old_password").not().isEmpty().withMessage("Old Password is required"),
check("old_password").custom(async (password, { req }) => {
  const user_id = req.params.id
  const value = await findout.isOldPasswordCorrect(user_id,password);
  if (value) {
    throw new Error("Old Password inputted is Wrong!!!");
  }
}),
check("new_password").not().isEmpty().withMessage("New Password is required")
.trim().isLength({ min: 6, max: 24 }).withMessage("Password must be a minimum of 6 characters and maximum of 24 characters"),
check("confirm_password").not().isEmpty().withMessage("Please key in your new password for confirmation")
.custom(async (confirm_password, { req }) => {
  const new_password = req.body.new_password;
  if (new_password !== confirm_password) {
    throw new Error("Both passwords must match");
  }
})
],
(req,res) => {
  if (req.userData) { 

  const errors = validationResult(req);
  if (!errors.isEmpty()) {

      return res.status(422).json( errors.errors[0].msg );
  } 
  else{

    const email = req.userData.email;
    const password = req.body.new_password;

db.query("CALL update_new_password(?,?);", [email,password], function (err, result){
if (err) throw err; 
res.json(
{message: "Password Updated"
})
})
}
  }
})  



/* protected route to get all transactions */
router.get('/get-user-transaction-report',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
  if (req.userData) { 
   
     user_id = req.userData.userId
     value = [user_id]
    db.query("CALL user_transaction_report(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Transactions Report",
      result: result[0]
    })

    })
    } 
  
   }) 
  



/* protected route for deposit transaction information and guide */
router.get('/get-deposit-guide-info/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    
    currency_id = req.params.id
    value = [currency_id]

    db.query("CALL get_deposit_guide_info(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Deposit Transaction Guide and Information",
      deposit_information: result[0],
      currency_information: result[1]
    })

    })
    }
  })    
  



/* protected route for withdrawal transaction information and guide */
router.get('/get-withdrawal-guide-info/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    
    currency_id = req.params.id
    value = [currency_id]

    db.query("CALL get_withdraw_guide_info(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Withdraw Transaction Guide and Information",
      withdraw_information: result[0],
      currency_information: result[1]
    })

    })
    } 
  
   })       
  
   

   
   router.get('/deposit-upload',(req,res) => { 
       
    res.render('upload2',{title: 'Picture Upload Form'})
   
   })    




/* protected route to make a deposit transaction */
router.post('/deposit/:id',validateLoginMiddlewareCookie.isLoggedIn,upload.single('productimage'),(req,res) => { // testing Purpose
  if (req.userData) { 

    
    currency_id = req.params.id
    user_id = req.userData.userId
    wallet_address = req.body.wallet_address
    amount_naira = req.body.amount_naira
    amount_dollar = req.body.amount_dollar
    value = req.body.value
    ip = req.body.ip
  

    values = [user_id,currency_id,wallet_address,amount_naira,amount_dollar,value,ip]
    
if(amount_naira > 100000){ //Checking if the is more than 100,000 naira

    db.query("CALL check_id_status(?);", [user_id], function (err, result){
      if (err) throw err;

      if (result[0][0].v_result === 0) { // checking if user's id card has been verified if not verified halt
         console.log(result[0][0].v_result)
        return res.send('Upload Identification Card to Complete the transaction')
       
     } 

     else  { // if the user's ID has been verified continue

    db.query("CALL deposit(?,?,?,?,?,?,?);", values, function (err, result){
      if (err) throw err;
   
      var deposit_id = result[0][0].v_deposit_id3

      const s3 = new Aws.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY_ID2,              
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY2       
    })
  
  
      if (req.file) { 
          file = req.file
      const params = {
          Bucket:process.env.AWS_BUCKET_NAME,      
          Key:Date.now() + '_' + file.originalname,              
          Body:file.buffer,                   
          ContentType:"image/jpeg"                
     };
    
     // uploading the picture using s3 instance and saving the link in the database.
      
      s3.upload(params,(error,data)=>{
          if(error){
              res.status(500).send({"err":error}) 
          }
          
      console.log(data)                     
      
     // saving the information in the database.   
     value = [deposit_id,data.Location] 
     db.query("CALL add_deposit_proof(?,?);", value, function (err, result) {   
    if (err) throw err; 
  
  });
      })
  console.log('Successfully Uploaded')
  }

    res.json(
      {message: "Deposit Transaction Successful"
    })

    })
  }
    } )
  }


  else {   // when transaction amount ids less than 100,000 

   db.query("CALL deposit(?,?,?,?,?,?,?);", values, function (err, result){
    if (err) throw err;
 
    var deposit_id = result[0][0].v_deposit_id3

    const s3 = new Aws.S3({
      accessKeyId:process.env.AWS_ACCESS_KEY_ID2,              
      secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY2       
  })


    if (req.file) { 
        file = req.file
    const params = {
        Bucket:process.env.AWS_BUCKET_NAME,      
        Key:Date.now() + '_' + file.originalname,             
        Body:file.buffer,                  
        ContentType:"image/jpeg"              
    };
  
   // uploading the photo using s3 instance and saving the link in the database.
    
    s3.upload(params,(error,data)=>{
        if(error){
            res.status(500).send({"err":error}) 
        }
        
    console.log(data)                     
    
   // saving the information in the database.   
   value = [deposit_id,data.Location] 
   db.query("CALL add_deposit_proof(?,?);", value, function (err, result) {   
  if (err) throw err; 
 // console.log(result[0])

});
    })
console.log('Successfully Uploaded')
}


  res.json(
    {message: "Deposit Transaction Successful"
  })

  })

  }
  }
   })   





/* protected route for withdrawal transaction information and guide */
router.post('/deposit',upload.single('productimage'),(req,res) => { // testing Purpose
  // if (req.userData) { 
 
     
     currency_id = 15
    // user_id = req.userData.userId
     user_id = 7
     wallet_address = req.body.wallet_address
     amount_naira = req.body.amount_naira
     amount_dollar = req.body.amount_dollar
     value = req.body.value
     //deposit_proof = req.body.deposit_proof
     ip = req.body.ip
   
     console.log(wallet_address)
     console.log(amount_naira)
     console.log(amount_dollar)
     console.log(value)
     //deposit_proof = req.body.deposit_proof
     console.log(ip)
 
     values = [user_id,currency_id,wallet_address,amount_naira,amount_dollar,value,ip]
     
     if(amount_naira > 100000){
     console.log('went through more than 100000')
     db.query("CALL check_id_status(?);", [user_id], function (err, result){
       if (err) throw err;
 
       if (result[0][0].v_result === 0) {
          console.log(result[0][0].v_result)
         return res.send('Upload Identification Card to Complete the transaction')
        //res.send('Please verify your email take to verify page')
      } 
 
      else  {
 
     db.query("CALL deposit(?,?,?,?,?,?,?);", values, function (err, result){
       if (err) throw err;
    
       var deposit_id = result[0][0].v_deposit_id3
 
       const s3 = new Aws.S3({
         accessKeyId:process.env.AWS_ACCESS_KEY_ID2,              
         secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY2       
     })
   
   
       if (req.file) { 
           file = req.file
       const params = {
           Bucket:process.env.AWS_BUCKET_NAME,      // bucket that we made earlier
           Key:Date.now() + '_' + file.originalname,               // Name of the image
           Body:file.buffer,                   // defining the permissions to get the public link
           ContentType:"image/jpeg"                 // Necessary to define the image content-type to view the photo in the browser with the link
       };
     
      // uplaoding the photo using s3 instance and saving the link in the database.
       
       s3.upload(params,(error,data)=>{
           if(error){
               res.status(500).send({"err":error}) 
           }
           
       console.log(data)                     
       
      // saving the information in the database.   
      value = [deposit_id,data.Location] 
      db.query("CALL add_deposit_proof(?,?);", value, function (err, result) {   
     if (err) throw err; 
    // console.log(result[0])
   
   });
       })
   console.log('Successfully Uploaded')
   }
 
 
     res.json(
       {message: "Deposit Transaction Successful"
     })
 
     })
   }
     } )
   }
 
 
   else {
 console.log('went through less than 100000')
    db.query("CALL deposit(?,?,?,?,?,?,?);", values, function (err, result){
     if (err) throw err;
  
     var deposit_id = result[0][0].v_deposit_id3
 
     const s3 = new Aws.S3({
       accessKeyId:process.env.AWS_ACCESS_KEY_ID2,              
       secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY2       
   })
 
 
     if (req.file) { 
         file = req.file
     const params = {
         Bucket:process.env.AWS_BUCKET_NAME,      // bucket that we made earlier
         Key:Date.now() + '_' + file.originalname,               // Name of the image
         Body:file.buffer,                   // defining the permissions to get the public link
         ContentType:"image/jpeg"                 // Necessary to define the image content-type to view the photo in the browser with the link
     };
   
    // uplaoding the photo using s3 instance and saving the link in the database.
     
     s3.upload(params,(error,data)=>{
         if(error){
             res.status(500).send({"err":error}) 
         }
         
     console.log(data)                     
     
    // saving the information in the database.   
    value = [deposit_id,data.Location] 
    db.query("CALL add_deposit_proof(?,?);", value, function (err, result) {   
   if (err) throw err; 
  // console.log(result[0])
 
 });
     })
 console.log('Successfully Uploaded')
 }
 
 
   res.json(
     {message: "Deposit Transaction Successful"
   })
 
   })
 
   }
  // }
    })      
   
          

   module.exports = router;   
