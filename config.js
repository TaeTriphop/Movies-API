var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    database: `playgrounddb`,
    user:'root',
    password:''
});

module.exports = connection;