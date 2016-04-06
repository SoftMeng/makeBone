var express = require('express'),
    router = express.Router();
var markting = require('../models/sqlConnection.js');
var hbs = require('hbs');
var fileTool = require('../models/fileTool.js');

router.get('/:table', function (req, res) {
    var sqlString = "select * from "+req.params.table+" limit 0,1";
    if(JSON.stringify(req.query)=="{}"){
        markting.query(sqlString,function(err,result){
            var index = [];
            if(!!result&&!!result[0]){
                for(var key in result[0]){
                    index.push(key);
                }
            }
            res.locals = {
                "tableName": req.params.table,
                "viewPath": "result/models",
                "modelPath": "result/views",
                "index": index,
                "url": "window.app.ajaxUrlMap['marketing']",
                "functionName": "Null"
            }
            res.render('codes');
        })
    }else{
        res.locals = {
            "success":"success"
        };
        fileTool.work(req.query);
        res.render("codeResult");
    }
});

router.get('/', function (req, res) {
    res.locals = {
        "tableName": "tableName",
        "viewPath": "result/models",
        "modelPath": "result/views",
        "index": "id",
        "url": "window.app.ajaxUrlMap['marketing']",
        "functionName": "Null"
    }
    res.render('codes');
});

module.exports = router;
