var express = require('express'),
    router = express.Router();
var markting = require('../models/sqlConnection.js');
var hbs = require('hbs');

router.get('/:table', function(req, res) {
    var sqlString = "select * from "+req.params.table+" limit 0,20";
    markting.query(sqlString,function(err,result){
        var table_th = [];
        if(!!result&&!!result[0]){
            for(var key in result[0]){
                table_th.push(key);
            }
        }
        res.locals = {
            some_value: '表['+req.params.table+']数据',
            table_th: table_th,
            list:result,
            all:false
        }
        res.render('index');
    })
});

router.get('/', function(req, res) {
    console.log("查询全表名"+markting.DB_NAME);
    var allTables = "SELECT TABLE_NAME,TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='"+markting.DB_NAME+"'";
    markting.query(allTables,function(err,result){
        var table_th = [];
        if(!!result&&!!result[0]){
            for(var key in result[0]){
                table_th.push(key);
            }
        }
        res.locals = {
            some_value: '查询全部表',
            table_th: table_th,
            list:result,
            dbname:markting.DB_NAME,
            all:true
        }
        res.render('index');
    })
});

module.exports = router;
