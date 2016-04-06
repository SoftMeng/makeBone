var fs = require('fs');
var hbs = require('hbs');
var markting = require('../models/sqlConnection.js');

var fileTool = {};

fileTool.work = (function(){
    function createContext(source,options){
        var template = hbs.compile(source);
        return htmlDecode(template(options));
    }

    function htmlDecode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&#x27;/g,"\"");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    }

    function getTableInfo(options,callBack){
        var sqlString = "select  column_name, column_comment from information_schema.columns where table_schema ='"+markting.DB_NAME+"'  and table_name = '"+options.tableName+"';";
        markting.query(sqlString, function (err,result) {
            callBack(err,result);
        });
    }

    return function (options) {
        options.result = "result";
        options.type = "js"
        getTableInfo(options,function(err,data){
            options.columns = data;
            options.count = data.length;
            var result = {
                list:[]
            }
            fs.readFile(__dirname + "/data/file.json" , {
                flag: 'r+',
                encoding: 'utf8'
            }, function (err, data) {
                if (err) {
                    console.info(err);
                }
                var fileList = JSON.parse(data);
                //文件夹新建
                fileList.dir.forEach(function(item,index,array){
                    var dirPath = createContext(item,options);
                    if (fs.existsSync(__dirname+dirPath)) {
                        fileTool.rmdirSync(__dirname+dirPath);
                    }
                    fs.mkdirSync(__dirname+dirPath);
                });
                //读取模版文件,并写入到业务文件中
                fileList.file.forEach(function(item,index,array){
                    var templatePath = createContext(item,{
                        "result":"template",
                        "functionName":"template",
                        "type":"template"
                    });
                    fs.readFile(__dirname + templatePath , {
                        flag: 'r+',
                        encoding: 'utf8'
                    }, function (err, data) {
                        if (err) {
                            console.info(err);
                        }
                        var str = createContext(data,options);
                        fs.writeFileSync(__dirname + createContext(item,options),str);
                    });
                });
            });
        });
    }
})();
/**
 * 同步递归删除文件夹
 */
fileTool.rmdirSync = (function(){
    function iterator(url,dirs){
        var stat = fs.statSync(url);
        if(stat.isDirectory()){
            dirs.unshift(url);//收集目录
            inner(url,dirs);
        }else if(stat.isFile()){
            fs.unlinkSync(url);//直接删除文件
        }
    }
    function inner(path,dirs){
        var arr = fs.readdirSync(path);
        for(var i = 0, el ; el = arr[i++];){
            iterator(path+"/"+el,dirs);
        }
    }
    return function(dir,cb){
        cb = cb || function(){};
        var dirs = [];
        try{
            iterator(dir,dirs);
            for(var i = 0, el ; el = dirs[i++];){
                fs.rmdirSync(el);//一次性删除所有收集到的目录
            }
            cb()
        }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
            e.code === "ENOENT" ? cb() : cb(e);
        }
    }
})();

module.exports = fileTool;