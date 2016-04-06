
//引入文件系统
var fs = require('fs');

//引入express，hbs
var express = require('express');
var hbs = require('hbs');
var path = require('path');

//marketing连接的数据库markting.js
var tables = require('./routes/tables');
var codes = require('./routes/codes');
var css = require('./routes/css');
//另外的数据库对应设置sql.js
//var insert = require('./routes/insert');

var app = express();


app.use('/tables', tables);
app.use('/codes', codes);
app.use('/css', css);
//app.use('/insert', insert);

//注册模版
hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');

//设置模版
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.locals = {
        some_value: '查询场次',
        list: ['cat', 'dog']
    }
    res.render('home');
});

app.listen(8000, function(){
     console.log("Server has strart! Port: 8000");
});

