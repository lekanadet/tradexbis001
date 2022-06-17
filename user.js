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





/* User Registration */
router.post('/user-registration',[

  check('firstname')
  .not()
  .isEmpty()
  .withMessage('Firstname is required'),
  check('lastname', 'Lastname is really required').not().isEmpty(),
  check('lastname')
  .not()
  .isEmpty()
  .withMessage('Lastname is required'),
  check('email')
  .not()
  .isEmpty()
  .withMessage('Email is required')  
  .isEmail()
  .withMessage('Invalid Email'),
  check('email')
  .custom(async email => {
     const value = await findout.isEmailInUse(email);
     if (value) {
      throw new Error('Email is already in Use!!!');   
      
  }
}),
check('phone_no')
.not()
.isEmpty()
.withMessage('Phone_no is required'),
check('phone_no')
.custom(async phone => {
     const value = await findout.isPhoneInUse(phone);
     if (value) {
      throw new Error('Phone number is already in Use!!!');   
      
  }
}),
check('password')
.not()
.isEmpty()
.withMessage('Password is required'),
check('confirm_password', 'Please retype the password above').not().isEmpty(),
check('confirm_password', 'Passwords do not match').custom((value,{req}) => (value === req.body.password))

]

,(req,res) => {
  const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(422).json( errors.errors[0].msg );
        } 
        else{

      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const email = req.body.email;
      const phone_no = req.body.phone_no;
      const password = req.body.password;
    

var values = [firstname,lastname,email,phone_no,password]


db.query("CALL register_user(?,?,?,?,?)",values, function (err, result){
  if (err) throw err;
       console.log(result[0][0].v_secret)
       code  = result[0][0].v_secret


          // Step 1
 const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
},
 tls: {
  rejectUnauthorized: false
}
});

const body = 'Congratulations, you have Successfully Registered please use the secret code below to verify your email.\n\n.'
         
// Step 2
let mailOptions = {
from: "ladetutu@tts-nigeria.com", // TODO: email sender
to: email, // TODO: email receiver
subject: 'Email Verification',
text: body,
html: 
`<p>Hello ${req.body.firstname}</p>
<br/>
<p>${body}</p>
<br/>
<br/>
<p>${code}</p>
`  
              
} 

console.log(mailOptions)


// Step 3
transporter.sendMail(mailOptions, (err, data) => {
if (err) {
    return console.log('Error occurs',err);
}
return console.log('Email sent!!!');
});
res.send({result:result[0][0].v_secret})
     
     })
    }
   }) 



/* Email verification */
router.post('/verify/:id',
[check('secret')
.not()
.isEmpty()
.withMessage('Please enter verification code sent to your email'),
],

(req,res) => {
  const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(422).json( errors.errors[0].msg );
        } 
        else{
    
  email = req.params.id
  secret = req.body.secret
  message = ' Secret Key has expired'
 

  db.query("CALL check_if_verified(?);",[email], function (err, result){
    if (err) throw err;

    if (result[0][0].v_status === 'Verified') {

       return res.send('Your account has been verified please go ahead and login')
      //res.send('Please verify your email take to verify page')
    } 
    else {

  db.query("CALL check_secret(?,?);", [email,secret], function (err, result){
    if (err) throw err; 
    if (result[0][0].v_out === 0) {
      return res.send("wrong code entered give option to request for another code") // resend secret API
    } 
    else if (result[0][0].v_out === 1) { 

      db.query("CALL check_token_expiry(?,?);", [email,secret], function (err, result){
        if (err) throw err; 
        if (result[0][0].v_out === 0) {
          db.query("CALL effect_expired_token(?,?);",[email,secret], function (err, result){
            if (err) throw err; 
            //return res.send("Secret Key has expired please resend another one") / resend secret API
              res.send('Secret Expired option to resend token') //resend secret API
          })
        } 

        else if (result[0][0].v_out === 1) {
          db.query("CALL update_status(?);",[email], function (err, result){
            if (err) throw err; 
          return res.send("Email verified send to Login")
          //return res.redirect('/login-form')
          })
        }
})
}
})
    }
  })
}
})    



    /* Resend Verification code */
    router.post('/resend-token/:id',(req,res) => {

      email = req.params.id

      db.query("CALL check_if_verified(?);",[email], function (err, result){
       if (err) throw err;
   
       if (result[0][0].v_status === 'Verified') {
   
          return res.send('Your account has been verified please go ahead and login')
         //res.send('Please verify your email take to verify page')
       } 

       else  {

      db.query("CALL resend_secret(?)", [email], function (err, result) {
       if(err) throw err;

       console.log(result[0][0].v_secret2)
       console.log(result[1][0].firstname)
       
       code  = result[0][0].v_secret2
       firstname = result[1][0].firstname



   // Step 1
 const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   auth: {
     user: process.env.SMTP_USER,
     pass: process.env.SMTP_PASSWORD
 }
 });
 
 const body = 'You requested for a new secret code to verify your email. Please use the code below\n\n.'
          
 // Step 2
 let mailOptions = {
  from: "ladetutu@tts-nigeria.com", // TODO: email sender
  to: email, // TODO: email receiver
  subject: 'Email Verification',
  text: body,
  html: 
  `<p>Hello ${firstname}</p>
  <br/>
  <p>${body}</p>
  <br/>
  <br/>
  <p>${code}</p>
  `  
                
  } 
 
 console.log(mailOptions)
 
 
 // Step 3
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
      return console.log('Error occurs',err);
  }
  return console.log('Email sent!!!');
  });
  res.send({result:result[0][0].v_secret2})
 })
}
      })
})


 /* Login task using jwt and cookie */
router.post('/login2000',[
  
  check('email')
  .not()
  .isEmpty()
  .withMessage('Email is required')  
  .isEmail()
  .withMessage('Invalid Email'),
  check('password')
  .not()
  .isEmpty()
  .withMessage('Password is required')
  ],
(req,res) => {
  const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(422).json( errors.errors[0].msg );
        } 
        else {

  email = req.body.email
  password = req.body.password

  db.query("CALL check_if_verified(?);",[email], function (err, result){
   if (err) throw err;

   if (result[0][0].v_status === 'Unverified') {

      return res.send('Your email has not been verified ')  // Resend secret API
     //res.send('Please verify your email take to verify page')
   } 

   else  {

    db.query("CALL authentication(?,?);",[req.body.email,req.body.password], function (err, result){
      if (err) throw err;
    
      if (result[0][0].v_result === 1) {

        const token = jwt.sign({
          email: req.body.email,
          userId: result[1][0].user_id,
          firstname: result[1][0].firstname,
          userStatus: result[1][0].user_status,
          userType: result[1][0].user_type,
          IdStatus: result[1][0].id_card_status,
          phoneStatus: result[1][0].phone_status,
        },
        process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_LIFE
        }
      );

      res
    .cookie("access_token3", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });

      }
      else  {
        res.send('user or password not correct')  
      }
    })
}
  })
}
})


  /* Login task using jwt only  */
  router.post('/login200',[
  
  check('email')
  .not()
  .isEmpty()
  .withMessage('Email is required')  
  .isEmail()
  .withMessage('Invalid Email'),
  check('password')
  .not()
  .isEmpty()
  .withMessage('Password is required')
  ],
  
  function(req, res, next) {
  email = req.body.email
  
        db.query("CALL authentication(?,?);",[req.body.email,req.body.password], function (err, result_a){
          if (err) throw err;
        
          if (result_a[0][0].c === 1) {
  
  
            //return res.redirect('/')
  
            db.query("CALL check_if_verified(?)",[req.body.email], function (err, result){
              if (err) throw err;
          
              if (result[0][0].v_status === 'Unverified') {
          
                 return res.send('Your account has been not been verified') // Resend secret API
                //res.send('Please verify your email take to verify page')
              } 
          else if (result[0][0].v_status === 'Verified'){
            
            
            
            const token = jwt.sign({
              email: req.body.email,
              userId: result[1][0].v_user_id,
              firstname: result[3][0].v_firstname,
              usertype: result[2][0].v_user_type
            },
            process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: process.env.ACCESS_TOKEN_LIFE
            }
          );
  
          res.send({
            msg: 'Logged in!',
            email: email,
            token,
            user_id: result[1][0].v_user_id, 
            firstname: result[3][0].v_firstname,
            usertype:  result[2][0].v_user_type
          });
            }
          
        })

        }  else if (result[0][0].c === 0) {
          res.send('Not Successful stay on that page so they can try another password on this page create a link that will call the forget-password api.')  
        }
    });
  
  })  


  /* Log out and clear cookie */
  router.get("/logout2000", validateLoginMiddlewareCookie.isLoggedIn, (req, res) => {
    return res
      .clearCookie("access_token3")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  });


  /* protected home route for backend testing */
  router.get('/home',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
    if (req.userData) { 
      console.log(req.userData)
      res.json({message: "Home Page",userDetails: req.userData})
      } 
     }) 


    /* protected home route for currency caategories or type */
    router.get('/currency-type',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
      if (req.userData) { 
        console.log(req.userData)
  
        db.query("CALL get_currency_types();", function (err, result){
          if (err) throw err;
        console.log(result[0])
        res.json(
          {message: "Currency Types",
          CurrencyTypeInfo: result[0]
        })

        })
        } 
      
       })    

   module.exports = router;   