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




/* User Registration */
router.post(
  "/user-registration",
  [
    check("firstname").not().isEmpty().withMessage("Firstname is required"),
    check("lastname").not().isEmpty().withMessage("Lastname is required"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    check("email").custom(async (email) => {
      const value = await findout.isEmailInUse(email);
      if (value) {
        throw new Error("Email is already in Use!!!");
      }
    }),
    check("phone_no")
      .not()
      .isEmpty()
      .withMessage("Phone number is required")
      .custom(async (phone_no) => {
        const value = await findout.isPhoneInUse(phone_no);
        if (value) {
          throw new Error("Phone number already in use!!!");
        }
      }),
      check("country").not().isEmpty().withMessage("Country is required"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .trim()
      .isLength({ min: 6, max: 24 })
      .withMessage(
        "Password must be a minimum of 6 characters and maximum of 24 characters"
      ),
    check("confirm_password")
      .not()
      .isEmpty()
      .withMessage("Please type in your password again")
      .custom(async (confirm_password, { req }) => {
        const password = req.body.password;

        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirm_password) {
          throw new Error("Both passwords must match");
        }
      }),
  ],

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.errors[0].msg);
    } else {
      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const email = req.body.email;
      const phone_no = req.body.phone_no;
      const password = req.body.password;
      const country = req.body.country;

      var values = [firstname, lastname, email, phone_no, password, country];

      db.query("CALL register_user(?,?,?,?,?,?)", values, function (err, result) {
        if (err) throw err;
        console.log(result[0][0].v_secret);
        code = result[0][0].v_secret;

        // Step 1
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "af67cd68b9517b",
            pass: "062462cdc09ad5",
          },
        });
        // const transporter = nodemailer.createTransport({
        //   host: process.env.SMTP_HOST,
        //   port: process.env.SMTP_PORT,
        //   secure: true,
        //   auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASSWORD,
        //   },
        //   tls: {
        //     rejectUnauthorized: false,
        //   },
        // });

        const body =
          "Congratulations, you have Successfully Registered please use the secret code below to verify your email.\n\n.";

        // Step 2
        let mailOptions = {
          from: "okoromivictorsunday@gmail.com", // TODO: email sender
          to: email, // TODO: email receiver
          subject: "Email Verification",
          text: body,
          html: `<p>Hello ${req.body.firstname}</p>
<br/>
<p>${body}</p>
<br/>
<br/>
<p>${code}</p>
`,
        };

        console.log(mailOptions);

        // Step 3
        transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            return console.log("Error occurs", err);
          }
          return console.log("Email sent!!!");
        });
        res.send({ result: result[0][0].v_secret });
      });
    }
  }
);



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
 var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "af67cd68b9517b",
            pass: "062462cdc09ad5",
          },
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

    db.query("CALL authentication(?,?,?,?,?);",
    [req.body.email,req.body.password,req.body.ip,req.body.country,req.body.city],
     function (err, result){
      if (err) throw err;
    
      if (result[0][0].v_result === 1) {  //1
        
        email_auth = req.body.email,
        userId_auth = result[1][0].user_id,
        firstname_auth = result[1][0].firstname,
        userStatus_auth = result[1][0].user_status,
        userType_auth= result[1][0].user_type,
        IdStatus_auth = result[1][0].id_card_status,
        phoneStatus_auth = result[1][0].phone_status,
        login_id_auth = result[2][0].v_id2

        db.query("CALL check_user_status(?);",[email], function (err, result){
          if (err) throw err;
       
          if (result[0][0].v_result === 0) {

            return res.send('Your account has been banned')  

       } 

        else if (result[0][0].v_result === 1){


        const token = jwt.sign({
          email: email_auth,
          userId: userId_auth,
          firstname: firstname_auth,
          userStatus: userStatus_auth,
          userType: userType_auth,
          IdStatus: IdStatus_auth,
          phoneStatus: phoneStatus_auth,
          login_id: login_id_auth
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
})
      } // 1
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
    if (req.userData) { 
      id = req.userData.login_id
      db.query("CALL update_login_logs(?);",[id], function (err, result){
        if (err) throw err;
      
    return res
      .clearCookie("access_token3")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀", time: result[0][0].signed_out_at });
      })
    }
  });


  /* protected home route for backend testing */
router.get('/home',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
    if (req.userData) { 
      console.log(req.userData)
      res.json({message: "Home Page",userDetails: req.userData})
      } 
     }) 
 

router.get('/upload-testpics',(req,res) => { 
       
    res.render('upload2',{title: 'Picture Upload Form'})
   
   }) 


router.post('/upload-testpictures', upload.single('productimage'), (req, res) => {
    console.log(req.file) 
  
    // Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID2,              
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY2       
})   
    
    const params = {
        Bucket:process.env.AWS_BUCKET_NAME,      // bucket that we made earlier
        Key:Date.now() + '_' + req.file.originalname,               // Name of the image
        Body:req.file.buffer,                   // defining the permissions to get the public link
        ContentType:"image/jpeg"                 // Necessary to define the image content-type to view the photo in the browser with the link
    };
  
   // uplaoding the photo using s3 instance and saving the link in the database.
    
    s3.upload(params,(error,data)=>{
        if(error){
            res.status(500).send({"err":error}) 
        }
        
    console.log(data)                     
    
   // saving the information in the database.   
   value = [data.Location,data.Key] 
   db.query("CALL add_test_picture(?,?);", value, function (err, result) {   
  if (err) throw err; 
 // console.log(result[0])
 res.status(200).send({
  productLocation: data.Location,
  productKey: data.Key

})
});
    })
})

   

          

   module.exports = router;   
