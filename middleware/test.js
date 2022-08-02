/* protected route for withdrawal transaction information and guide */
router.post('/deposittttt',upload.single('productimage'),(req,res) => { // testing Purpose
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



router.post('/upload-testpictures-single', upload.single('productimage'), (req, res) => { // working - Single file uploads
        console.log(req.file) 
    
        
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
       value = [data.Location,data.Key] 
       db.query("CALL add_test_picture(?,?);", value, function (err, result) {   
      if (err) throw err; 
     // console.log(result[0])
    
    });
        })
    res.status(200).send('Successfully Uploaded')
    }
    
    })         