var mysql = require('mysql');
var DB_NAME = 'markting';

var pool2  = mysql.createPool({
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '123456',        //MySQL认证用户密码
  port: '3306',                   //端口号
});

pool2.on('connection', function(connection) {  
    connection.query('SET SESSION auto_increment_increment=1'); 
});  

function Markting(){
};
module.exports = Markting;

pool2.getConnection(function(err, connection) {

    var useDbSql = "USE " + DB_NAME;
    console.log("使用的数据库是:"+DB_NAME);
    connection.query(useDbSql, function (err) {
         if (err) {
            console.log("USE Error: " + err.message);
            return;
         }
         console.log('USE succeed');
    });

    Markting.query = function getUserNumByName(sqlString, callback) {
        connection.query(sqlString, function (err, result) {
            if (err) {
                console.log("query Error: " + err.message);
                return;
            }
            console.log("invoked[query]");
            callback(err,result);                     
        });        
    };
    Markting.DB_NAME = DB_NAME;
});