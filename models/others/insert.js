var express = require('express'),
    router = express.Router(),
    sql = require('../models/sql.js');
var hbs = require('hbs');
var moment = require('moment');

router.get('/kao', function(req, res) {
    console.log("访问成功");
    var kkk = ["CAMPAIGN_ID","CAMPAIGN_CATEGORY","CAMPAIGN_CODE","CAMPAIGN_NAME","CAMPAIGN_STATUS","CHANNEL_CODE","AUDIT_STATUS","COMMENTS","CREATE_BY","CREATE_TIME","CREATE_PERSON","CREATION_AREA","CREATION_CINEMA","CREATION_LEVEL","DESCRIPTION","END_TIME","START_TIME","UPDATE_BY","UPDATE_TIME","UPDATE_PERSON","SCENE_TYPE","scene_desc","RULE_ID","CREATE_BY","CREATE_TIME","LIMITATION_RULE","PRICE_EQUAL","LIST_PRICE_RULE","RULE_CODE","TICKET_PRICE_RULE","UPDATE_BY","UPDATE_TIME","CAMPAIGN_ID","AUDIT_ID","AUDIT_COMMENT","AUDIT_RESULT","AUDITOR","CAMPAIGN_ID","CREATE_BY","CREATE_TIME","CREATE_PERSON","UPDATE_BY","UPDATE_TIME","UPDATE_PERSON"];
    var result = '';
    kkk.forEach(function(item,index,array){
        result += "private String "+item+";";
    })
    console.log(result);
});

router.get('/sql', function(req, res) {
    var sqlString = "select * from t_mkt_campaign left join t_mkt_price_rule on (t_mkt_campaign.CAMPAIGN_ID = t_mkt_price_rule.CAMPAIGN_ID) LEFT JOIN t_mkt_campaign_audit ON (t_mkt_campaign.CAMPAIGN_ID = t_mkt_campaign_audit.CAMPAIGN_ID) where t_mkt_campaign.CAMPAIGN_STATUS=2 and t_mkt_campaign.AUDIT_STATUS=2 and t_mkt_campaign.CAMPAIGN_ID = 10004"
    sql.query(sqlString,function(err,result){
        var table_th = [];
        if(!!result&&!!result[0]){
            for(var key in result[0]){
                table_th.push(key);
            }
        }
        console.log(JSON.stringify(table_th))
        res.locals = {
            some_value: '查询活动',
            table_th: table_th,
            list:result
        }
        // console.log(JSON.stringify(result));
        res.render('index');
    })           
});

router.get('/ko', function(req, res) {
    var sqlString = "select * from t_mkt_campaign left join t_mkt_price_rule on (t_mkt_campaign.CAMPAIGN_ID = t_mkt_price_rule.CAMPAIGN_ID) where t_mkt_campaign.CAMPAIGN_STATUS=2 and t_mkt_campaign.AUDIT_STATUS=2 limit 0,10"
    sql.query(sqlString,function(err,result){
        var json_list = [];
        result.forEach(function(item,index,array){
            var t_main = { 
                Main_Id: item.CAMPAIGN_ID,
                Approval_Id: "未知",
                Name: item.CAMPAIGN_NAME,
                Customer_Id: '未知',
                Note: item.COMMENTS,
                Status: item.CAMPAIGN_STATUS,
                Start_Date: item.START_TIME,
                End_Date: item.END_TIME,
                Creator: item.CREATE_PERSON,
                Create_Date: item.CREATE_TIME,
                Updator: item.UPDATE_PERSON,
                Update_Date: item.UPDATE_TIME,
                Version: "未知" 
            };
            var t_sub = {   
                Sub_Id: item.CAMPAIGN_ID,
                Main_Id: item.CAMPAIGN_ID,
                Name: item.CAMPAIGN_NAME,
                Type_Code: '未知',
                Template_Id: '未知',
                Tag_Name: item.CAMPAIGN_NAME,
                Priority_Code: '未知',
                Priority_Num: '未知',
                Start_Date: item.START_TIME,
                End_Date: item.END_TIME,
                Description: item.COMMENTS,
                Product_Type: '未知',
                Channel_Type_Code: '未知',
                Active_Status: item.CAMPAIGN_STATUS,
                Approval_Status: item.AUDIT_STATUS
            };
            var t_rule = { 
                Basic_Id: "生成",
                Sub_Id: item.CAMPAIGN_ID,
                Name: '未知',
                Rule_Kind_Code: '未知',
                Oper: '未知',
                Name_Code: '未知' 
            };
            var t_rule_list = [];
            t_rule_list.push(t_rule);
            var t_rule_detail = { 
                Cond_Id: "生成",
                Basic_Id: "未知",
                Name: '支付方式',
                Type_Code: '2',
                Type_Name: '支付方式',
                Value: '01',
                Value_Name: '支付宝',
                Oper: 'out',
                Start_Date: null,
                End_Date: null,
                Text: '- 支付宝',
                Name_Code: 'pay' 
            };
            var t_rule_detail_list = [];
            var t_price = { 
                Strategy_Id: 25,
                Sub_Id: 25,
                Name: '价格优惠',
                Type_Code: '1',
                Type_Name: '价格优惠' 
            };
            var t_price_list = [];
            var t_price_detail = { 
                Cond_Id: 113,
                Strategy_Id: 23,
                Type_Code: '12',
                Type_Name: '补贴设置',
                Value_Json: '{"type":"3","value":"13"}' 
            };
            var t_price_detail_list = [];
            //数据库表和JSON串的对应关系
            var table2Sql = {
                "t_main_campaign":t_main,
                "t_sub_campaign":t_sub,
                "t_basic_rule":t_rule_list,
                "t_rule_condition":t_rule_detail_list,
                "t_price_strategy" :t_price_list,
                "t_rule_condition":t_price_detail_list
            }
            for(var table in table2Sql){
                if(table2Sql[table] instanceof Array){
                    table2Sql[table].forEach(function(item,index,array){
                        var t_temp = item;
                        getSql(t_temp);
                    });
                }else{
                    var t_temp = table2Sql[table];
                    getSql(t_temp);
                }                
            }
            function getSql(t_temp){
                var insert_sql = "INSERT INTO "+table+"(";
                var insert_sql_t_main_key = "";
                var insert_sql_t_main_value = "";
                for(var key in t_temp){
                    if(t_temp[key]==null||t_temp[key].toString()=='未知'||t_temp[key]==''){
                        t_temp[key] = null;
                    }
                    //如果是日期，且不为null,则进行日期转换
                    if(key.indexOf("Date")>-1){
                        if(!!t_temp[key]&&t_temp[key].toString()!=null){
                            t_temp[key] = moment(t_temp[key]).format('YYYY-MM-DD HH:mm:ss');
                            t_temp[key] = "DATE_FORMAT('"+t_temp[key]+"', '%Y-%m-%d %H:%m:%S')";
                        }
                    }
                    insert_sql_t_main_key += key +",";
                    if(t_temp[key]==null||t_temp[key].toString().indexOf('DATE_FORMAT')>-1){
                        insert_sql_t_main_value += t_temp[key]+",";
                    }else{
                        insert_sql_t_main_value += "'"+t_temp[key]+"',";
                    }
                }
                insert_sql_t_main_key = insert_sql_t_main_key.substr(0,insert_sql_t_main_key.length-1);
                insert_sql_t_main_value = insert_sql_t_main_value.substr(0,insert_sql_t_main_value.length-1);
                insert_sql = insert_sql + insert_sql_t_main_key + ") VALUES ("+insert_sql_t_main_value+")";
                json_list.push(insert_sql);
            }
        });
        res.locals = {
            some_value:'活动信息组合',
            json_list:json_list
        }
        res.render('partials/tableJson');
    })           
});

module.exports = router;



