
var mysql = require('mysql')

var con = mysql.createConnection({  
    host: "",  
    user: "",  
    password: "",
    database: "",
    multipleStatements: true
  });   

  con.connect(function(err) {
    if (err) throw err;
});

module.exports = con;



