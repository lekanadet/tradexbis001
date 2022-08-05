require('dotenv').config();
const path = require('path')
const express = require('express')
var router = express.Router();
var db = require('./database/db.js');
const validateLoginMiddlewareCookie = require('./middleware/validate_login_cookie.js');
const id = require('faker/lib/locales/id_ID/index.js');




/* protected route for currency caategories or type */
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


   
/* protected route for active currencies under a particular currency type */
router.get('/currencies/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    console.log(req.userData)
    const currency_type_id = req.params.id
    value = [currency_type_id]
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


/*****************New****************************** */
/* protected route to get all the details of a selected currency*/ 
router.get('/selected-currency-details/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
    
    const currency_id = req.params.id
    value = [currency_id]

    db.query("CALL get_selected_currency_details(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Selected Currency Details",
      CurrencyDetails: result[0]})

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


 
/* protected route to update currencies type buy and sell rates */
router.post('/update-currencies-type/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
  if (req.userData) { 

   const currency_type_id = req.params.id
   const buy_rate = req.body.buy_rate
   const sell_rate = req.body.sell_rate


   values = [currency_type_id,buy_rate,sell_rate]


    db.query("CALL update_currencies_type(?,?,?);", values,function (err, result){
      if (err) throw err;
    res.json(
      {message: "Currency Types Updated"})

    })
    } 
  
   })    



/* protected route to get all users details */
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


   /*****************New****************************** */
/* protected route to get selected user's details */
router.get('/get-user-details/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const user_id = req.params.id
    value = [user_id]

    db.query("CALL get_user_details(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Details",
      UserDetails: result[0]
    })

    })
    } 
  })
  


   /*****************New****************************** */
/* protected route to update selected user's status Active or Ban*/
router.get('/update-user-status/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const user_id = req.params.id
    const status = req.body.user_status
    value = [user_id,status]

    db.query("CALL update_user_status(?,?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Updated Details",
      UserUpdatedDetails: result[0]
    })

    })
    } 
  
   })    
  
  

   /*****************New****************************** */
/* protected route to get selected user's login log history */
router.get('/user-login-log/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const user_id = req.params.id
    value = [user_id]

    db.query("CALL user_login_log(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Login Logs",
      UserLoginLogs: result[0]
    })

    })
    } 
  })   


   /*****************New****************************** */
/* protected route to get selected user's deposit transaction history */
router.get('/deposit-history/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const user_id = req.params.id
    value = [user_id]

    db.query("CALL user_deposit_history2(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Deposit History",
      UserDepositHistory: result[0]
    })

    })
    } 
  })     



     /*****************New****************************** */
/* protected route to get selected user's deposit transaction history */
router.get('/withdrawal-history/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const user_id = req.params.id
    value = [user_id]

    db.query("CALL user_withdraw_history(?);", value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Deposit History",
      UserDepositHistory: result[0]
    })

    })
    } 
  })  



     /*****************New****************************** */
/* protected route to get all pending deposit transactions */
router.get('/pending-deposit',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL pending_deposit();", function (err, result){
      if (err) throw err;
    console.log(result[0][0])
    res.json(
      {message: "Pending Deposit",
      PendingDeposit: result[0]
    })

    })
    } 
  })  
  
  

       /*****************New****************************** */
/* protected route to get all rejected deposit transactions */
router.get('/rejected-deposit',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL rejected_deposit();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Rejected Deposit",
      RejectedDeposit: result[0]
    })

    })
    } 
  })    



       /*****************New****************************** */
/* protected route to get all accepted deposit transactions */
router.get('/accepted-deposit',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL accepted_deposit();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Accepted Deposit",
      AcceptedDeposit: result[0]
    })

    })
    } 
  })   



     /*****************New****************************** */
/* protected route to get all pending withdrawal transactions */
router.get('/pending-withdrawal',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL pending_withdrawal();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Pending Withdrawal",
      PendingWithdrawal: result[0]
    })

    })
    } 
  })    



/* protected route to get all accepted withdrawals transactions */
router.get('/accepted-withdrawal',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL accepted_withdrawals();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Accepted Withdrawal",
      AcceptedWithdrawal: result[0]
    })

    })
    } 
  }) 
  
  

  
/* protected route to get all rejected withdrawals transactions */
router.get('/rejected-withdrawal',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL rejected_withdrawals();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Rejected Withdrawal",
      RejectedWithdrawal: result[0]
    })

    })
    } 
  })    




/* protected route to get to authorize or reject all deposits transactions */
router.put('/authorize-deposit/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const deposit_id = req.params.id
    const authorization = req.body.authorization // 'value should = Accepted or Rejected'
    const rejection_reason = req.body.rejection_reason // 'this field only shows and thus supplied if the authorization value is Rejected'
    values = [deposit_id,authorization,rejection_reason]

    db.query("CALL authorize_deposit_transaction(?,?,?);", values, function (err, result){
      if (err) throw err;
    
    res.json(
      {message: "Operation Completed"
    })

    })
    } 
  })   
  
  


/* protected route to get to authorize or reject all withdrawals transactions */  
router.put('/authorize-withdrawal/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const withdawal_id = req.params.id
    const authorization = req.body.authorization // 'value should = Accepted or Rejected'
    const rejection_reason = req.body.rejection_reason // 'this field only shows and thus supplied if the authorization value is Rejected'
    values = [withdawal_id,authorization,rejection_reason]

    db.query("CALL authorize_withdawal_transaction(?,?,?);", values, function (err, result){
      if (err) throw err;
    
    res.json(
      {message: "Operation Completed"
    })

    })
    } 
  })   



/* protected route to get all transactions */
router.get('/get-transaction-report',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
  if (req.userData) { 
   

    db.query("CALL transaction_report();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Transactions Report",
      result: result[0]
    })

    })
    } 
  
   }) 



   /* protected route to get all identity authorization request list */ 
router.get('/get-identity-authorization-req-list',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
  if (req.userData) { 
   

    db.query("CALL identity_authorization_list();", function (err, result){
      if (err) throw err;
  
    res.json(
      {message: "Identity Authorization Request List",
      result: result[0]
    })

    })
    } 
  
   }) 



   /* protected route to get selected identity authorization request details */ 
   router.get('/get-selected-identity-auth-req-details/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
    if (req.userData) { 
     

      const id = req.params.id
      db.query("CALL select_identity_details(?);", [id], function (err, result){
        if (err) throw err;
    
      res.json(
        {message: "Selected Identity Authorization Request Details",
        result: result[0]
      })
  
      })
      } 
    
     })    



/* protected route to get to authorize or reject identity authorization request transactions */  
router.post('/authorize-identity/:id/:id2',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 

    const id = req.params.id
    const user_id = req.params.id2
    const authorization = req.body.authorization // 'value should = Accepted or Rejected'
    const rejection_reason = req.body.rejection_reason // 'this field only shows and thus supplied if the authorization value is Rejected'
    values = [id,user_id,authorization,rejection_reason]

    db.query("CALL authorize_identity(?,?,?,?);", values, function (err, result){
      if (err) throw err;
    

      if (result[0][0].v_outcome === 'Rejected') {
        console.log('send email')
      }
      else  if(result[0][0].v_outcome === 'Accepted'){
        console.log('Do not send email')
      }

    res.json(
      {message: "Operation Completed",
      operation_result: result[0][0]
    })

    })
    } 
  }) 
  
  


   /* protected route to get all identity status list */ 
   router.get('/get-identity-status-list',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { 
    if (req.userData) { 
     
  
      db.query("CALL identity_status_list();", function (err, result){
        if (err) throw err;
    
      res.json(
        {message: "Identity Status List",
        result: result[0]
      })
  
      })
      } 
    
     })   

       
/* protected route to get all deposit transactions */
router.get('/all-deposit',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL all_deposit();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "All Deposit",
      result: result[0]
    })

    })
    } 
  }) 
  
  

/* protected route to get all deposit transactions */
router.get('/all-withdrawal',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL all_withdrawal();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "All Withdrawal",
      result: result[0]
    })

    })
    } 
  })     




/* protected route to get graph data for deposit vs currencies  */
router.get('/deposit-graph',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL deposit_graph();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Deposit Graph Data",
      result: result[0]
    })

    })
    } 
  })   




/* protected route to get graph data for withraws vs currencies  */
router.get('/withdrawal-graph',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 


    db.query("CALL withdrawal_graph();", function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Withdrawal Graph Data",
      result: result[0]
    })

    })
    } 
  })   



/* protected route to search users using email as the search string  */
router.get('/user-email-search',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
     
    
     const search_string = req.body.search_string
     value = [search_string]

    db.query("CALL user_email_search(?);",value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Search Result Using Email",
      result: result[0]
    })

    })
    } 
  })   




/* protected route to search users using user_status as the search string  */
router.get('/user-status-search',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
     
    
     const search_string = req.body.search_string
     value = [search_string]

    db.query("CALL user_status_search(?);",value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "User Search Result Using Status",
      result: result[0]
    })

    })
    } 
  })     


/* protected route to search transaction report contents  */
router.get('/transaction-report-search',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
     
    
     const search_string = req.body.search_string
     value = [search_string]

    db.query("CALL transaction_report_search(?);",value, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Transaction Report Search Result",
      result: result[0]
    })

    })
    } 
  }) 



/* protected route to search currencies contents */
router.get('/currency-search/:id',validateLoginMiddlewareCookie.isLoggedIn,(req,res) => { // an example of a protected route
  if (req.userData) { 
     
    const id = req.params.id
     search_string = req.body.search_string

     values = [search_string,id]
    db.query("CALL currency_search(?,?);",values, function (err, result){
      if (err) throw err;
    console.log(result[0])
    res.json(
      {message: "Currency Search Result",
      result: result[0]
    })

    })
    } 
  })    


   

   module.exports = router;   