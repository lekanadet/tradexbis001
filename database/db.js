
var mysql = require('mysql')

var con = mysql.createConnection({  
    host: "tradexbis-db.cjh2cih5udvp.us-east-1.rds.amazonaws.com",  
    user: "admin",  
    password: "Kolapoishola123$",
    database: "tradexbis",
    multipleStatements: true
  });   

  con.connect(function(err) {
    if (err) throw err;
});

module.exports = con;



