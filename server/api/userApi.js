var express = require('express');
var router = express.Router();
var models = require('../db/db');
var mysql = require('mysql');
var $sql = require('../db/sqlMap');
var crypt = require('../api/crypt');
var cfg = require( '../config');

var conn = mysql.createConnection(models.mysql);

//define public methods

var formatErrorCode = function (err = '', sql_map = '') {
    var newDate = new Date()//转换为时间
    var rtnDate = newDate.getFullYear() + '-';
    if ((newDate.getMonth() + 1) < 10) rtnDate += '0';
    rtnDate += (newDate.getMonth() + 1) + '-';
    if (newDate.getDate() < 10) rtnDate += '0';
    rtnDate += newDate.getDate() + ' ';
    if (newDate.getHours() < 10) rtnDate += '0';
    rtnDate += newDate.getHours() + ':';
    if (newDate.getMinutes() < 10) rtnDate += '0';
    rtnDate += newDate.getMinutes() + ':';
    if (newDate.getSeconds() < 10) rtnDate += '0';
    rtnDate += newDate.getSeconds();
    console.log('[' + rtnDate + ']', '<' + sql_map + '>', err)
}

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.send('err');
    } else {
        res.send(ret);
    }
}

var jdToken = async function (token, update = false) {
    var tList = token.split('-')
    tList[0] = (parseInt(tList[0],'16') ^ 0xf8).toString('10');//uid
    var sql_name = $sql.user.slct_token + " where idj_usr = '" + tList[0] + "';";

    return new Promise(function (resolve, reject) {
        conn.query(sql_name, function (err, result) {
            if (err) {
                formatErrorCode(err, sql_name);
                return reject(err);
            }
            else if (result[0] === undefined) {
                if (cfg.config.dbgMode) formatErrorCode('User or Usertoken doesnt existed;', sql_name);
                resolve('-1');//用户或者用户token不存在
            }
            else {
                let resultArray = result[0]
                let _secreyKey = resultArray.sToken
                let _result = atob(_secreyKey)
                if (crypt.c1ytoken_verify(token, _result)) {
                    //是否更新用户token 若更新则返回token 若不更新则返回用户id
                    if (update) {
                        jsonWrite(res, _secreryKey);
                    }
                    resolve(tList[0]);
                } else {
                    if (cfg.config.dbgMode) formatErrorCode('User\'s token verification failed ;', sql_name);
                    resolve('-1');//token错误
                }
            }
        })
    })
}

var antiSQLinject = (param) => {
    //anti sql inject, if existed then return true, or return false
    var _reg = /select |update |delete |truncate |join |union |exec |insert |drop |count | and | or |mid |from |=|add |&|-- |>|<|%/i;
    if (param && _reg.test(param)) {
        return true;
    }
    return false;
}   

/*
* post
*/

router.post('/login', (req, res) => {
    var sql_name = $sql.user.slct_user;
    var params = req.body;
    var keywords = JSON.parse(crypt.c1yd(params.payload))
        
    if (antiSQLinject(keywords.account)) {
        res.send('-1')
        return
    } //判断是否存在sql注入
        
    /*此处正则判断邮箱手机还是正常用户名*/
    if (true);
        sql_name += " where idj_usr='" + keywords.account + "'";
    if (parseInt(new Date().getTime() / 1000) - keywords.v > 10 || parseInt(new Date().getTime() / 1000) - keywords.v < -10) {
        res.send('0')
        return
    }
    sql_name += " and passj_usr ='" + keywords.password + "' LIMIT 1;";

    console.log(sql_name)
    conn.query(sql_name, function (err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            let resultArray = result[0];//返回token
            let payload = { uid: resultArray.idj_usr }; // 要存储在token中的数据
            let secreyKey = btoa(Math.ceil(Math.random() * (6000000 - 100000 + 1) + 100000 - 1))//100,000 - 6,000,000
            let expiresIn = Date.now() + 10800 * 1000; // 3h过期
            var _utoken = crypt.c1ytoken(payload, secreyKey, expiresIn);
            let db_s = btoa(secreyKey); //base64象征性两次加密
            let _sql_name = "update j_usr set sToken = '" + db_s + "' where idj_usr = '" + resultArray.idj_usr + "';"
            let _sql_slct = $sql.user.slct_user_basic_info + ' where id=' + resultArray.idj_usr + ';'
            conn.query(_sql_name, (err, _result) => {
                if (err) formatErrorCode(err, _sql_name)
                conn.query(_sql_slct, (err, __result) => {
                    __result[0].token = _utoken

                    //encode remark
                    jsonWrite(res, __result[0])
                })
            })//update
        }
    })
});

router.post('/register', (req, res) => {
    var sql_name = $sql.user.regist_usr1;
    var sql_write = $sql.user.regist_usr2;          /* 'insert into user (username, password) values (re_username, re_password)' */
    var params = req.body;
    let name = '默认用户' + (parseInt(Date.now() / 1000) % 1680000000)
    conn.query(sql_name, [params.password, name, params.email], function (err, result) {
        console.log(result);
        if (err) {
            console.log(err);
            res.send('0')
        }
        else if (result.insertId) {
            conn.query(sql_write, [result.insertId, name, params.email, params.date], function (_err, _result) {
                if (_err) {
                    console.log(_err);
                    res.send('0')
                } else {
                    res.send('1');
                }
            })
        }
    })
});

router.post('/infotrans', (req, res) => {
    jdToken(req.headers.authorization).then(function (rows) {
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }
        //判断是否是用户所属群组，
        var sql_name = $sql.message.insert_message;
        /* 'insert into user (username, password) values (re_username, re_password)' */
        var keywords = req.body;
        //var keywords = JSON.parse(Object.keys(params)[0]);
        conn.query(sql_name, [keywords.sId, keywords.sName, keywords.gId, keywords.gName, keywords.rId, keywords.rName, keywords.mTitle, keywords.mContent, keywords.mDate], function (_err, _result) {
            if (_err) {
                formatErrorCode(_err, sql_name);
            }
            else if (_result.affectedRows === 'undefined') {
                res.send('0');
            } else {
                let sql_write = $sql.message.message2inbox;
                conn.query(sql_write, [keywords.rId, _result.insertId])
                res.send('1');
            }
        })
    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'infotrans抛出异常')
        throw err
    }))
})

router.post('/createGroup', (req, res) => {
    jdToken(req.headers.authorization).then(function (rows) {
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }
        //判断是否是用户所属群组，
        var sql_name = $sql.message.insert_message;
        /* 'insert into user (username, password) values (re_username, re_password)' */
        var keywords = req.body;
        //var keywords = JSON.parse(Object.keys(params)[0]);
        conn.query(sql_name, [keywords.sId, keywords.sName, keywords.gId, keywords.gName, keywords.rId, keywords.rName, keywords.mTitle, keywords.mContent, keywords.mDate], function (_err, _result) {
            if (_err) {
                formatErrorCode(_err, sql_name);
            }
            else if (_result.affectedRows === 'undefined') {
                res.send('0');
            } else {
                let sql_write = $sql.message.message2inbox;
                conn.query(sql_write, [keywords.rId, _result.insertId])
                res.send('1');
            }
        })
    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'infotrans抛出异常')
        throw err
    }))
})
/*---------------------------------------
 *    GET系列
 ----------------------------------------*/
router.get("/getGroups", (req, res) => {
    //通过传输的header字串判断用户
    jdToken(req.headers.authorization).then(function (rows) {
        //参数设置 g=gid p=pageNumber i是否在首页
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }
        //区分概览还是详细
        var params = req.query;

        //概览
        {
            if (!params.g || params.g == 'undefined') {
                let sql_name = $sql.group.slct_groups
                conn.query(sql_name, usrid, function (err, result) {
                    if (err) {
                        formatErrorCode(err, sql_name);
                    }
                    if (result[0] === undefined) {
                        res.send('0')
                    } else {
                        jsonWrite(res, result);
                    }
                })
            }
            
        }
        //详细
        {
            if (params.g) {
                let sql_name = $sql.group.slct_groups_d
                sql_name += " where id = " + params.g + ";"
                conn.query(sql_name, function (err, result) {
                    if (err) {
                        formatErrorCode(err, sql_name);
                    }
                    if (result[0] === undefined) {
                        res.send('0')   //查询不到 或者没有权限
                    } else {
                        //此处应有加密
                        jsonWrite(res, result[0]);
                    }
                })
            }
        }
        


        // 判断群组是否用户所属

        // 非用户所属则获取信息判断是否公开，不公开返回错误 公开则返回详细信息
        
    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'getGroups抛出异常')
        throw err
    }))
})

router.get("/getMes", (req, res) => {
    //通过传输的header字串判断用户
    jdToken(req.headers.authorization).then(function (rows) {
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }
        //区分
        var params = req.query;

        //参数设置 t=s (send) & r(recieve) m=messageid
        {
            //获取全部收件
            if (!params.mi || params.mi == 'undefined') {
                let sql_name = $sql.message.slct_msgbox
                sql_name += ' where rId = ' + usrid + ' and delDate is NULL order by mDate DESC;'
                conn.query(sql_name, function (err, result) {
                    if (err) {
                        formatErrorCode(err, sql_name);
                    }
                    if (result[0] === undefined) {
                        res.send('0')
                    } else {
                        jsonWrite(res, result);
                    }
                })
            }

        }
        //详细
        {
            if (params.mi) {
                let sql_name = $sql.message.slct_msgbox
                sql_name += " where rId = " + usrid + " and id = " + params.mi +  " LIMIT 1;"
                conn.query(sql_name, function (err, result) {
                    if (err) {
                        formatErrorCode(err, sql_name);
                    }
                    if (result[0] === undefined) {
                        res.send('0')   //查询不到 或者没有权限
                    } else {
                        //此处应有加密
                        jsonWrite(res, result[0]);
                    }
                })
            }
        }



        // 判断群组是否用户所属

        // 非用户所属则获取信息判断是否公开，不公开返回错误 公开则返回详细信息

    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'getGroups抛出异常')
        throw err
    }))
})

router.get("/rdmsg", (req, res) => {
    jdToken(req.headers.authorization).then(function (rows) {
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }
        //区分
        var params = req.query;

        //参数设置 t=s (send) & r(recieve) m=messageid
        {
            //获取全部收件
            if (params.mi && params.mi != 'undefined') {
                let sql_name = $sql.message.read_msg
                sql_name += ' where id = ' + params.mi + ' LIMIT 1;'
                conn.query(sql_name, function (err, result) {
                    if (err) {
                        formatErrorCode(err, sql_name);
                    }else {
                        res.send('');
                    }
                })
            }

        }
    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'rdmsg抛出异常')
        throw err
    }))
})

router.get("/delmsg", (req, res) => {
    jdToken(req.headers.authorization).then(function (rows) {
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }
        //区分
        var params = req.query;

        //参数设置 t=s (send) & r(recieve) m=messageid
        {
            //获取全部收件
            if (params.mi && params.mi != 'undefined') {
                let sql_name = $sql.message.del_msg
                sql_name += ' =' + Date.now() / 1000 + ' where id = ' + params.mi + ' LIMIT 1;'
                conn.query(sql_name, function (err, result) {
                    if (err) {
                        formatErrorCode(err, sql_name);
                    } else {
                        res.send('');
                    }
                })
            }

        }
    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'delmsg抛出异常')
        throw err
    }))
})

router.get("/operGroup", (req, res) => {
    jdToken(req.headers.authorization).then(function (rows) {
        var usrid = rows
        if (usrid == '-1') {
            res.send('-1')
            return
        }

        var params = req.query;
        //0加入 1退出
        if (params.action == 0 && params.gi) {
            let sql_name = $sql.group.join_group
            conn.query('SELECT id from info_groups where id=' + params.gi + ' LIMIT 1;', (_err, _result) => {
                if (_err) {
                    formatErrorCode(_err, 'SELECT id from info_groups');
                }
                else if (_result[0] === undefined) {
                    res.send('群组不存在');
                }
                else {
                    conn.query('SELECT gId from joined_groups where gId=' + params.gi + ' and id=' + usrid + ' LIMIT 1;', (_err1, _result1) => {
                        if (_err1) {
                            formatErrorCode(_err1, 'SELECT gId from joined_groups');
                        }
                        else if (_result1[0] != undefined) {
                            res.send('您已加入过该群组');
                        }
                        else {
                            conn.query(sql_name, [usrid, params.gi, params.t], function (err, result) {
                                if (err) {
                                    formatErrorCode(err, sql_name);
                                } else {
                                    res.send('加入成功');
                                }
                            }) }
                    })
                    
                }
            })
            
        }
        else if (params.action == 1 && params.gi) {
            let sql_name = $sql.group.del_group;
            sql_name += ' where id=' + usrid + ' and gId=' + params.gi + ' limit 1;'
            conn.query(sql_name, (err, result) => {
                if (err) {
                    formatErrorCode(err, sql_name);
                }
                else {
                    res.send('退出成功')
                }
            })
        }
    }).catch((err) => setImmediate(() => {
        formatErrorCode(err, 'delmsg抛出异常')
        throw err
    }))
})

router.get("/getTips", (req, res) => {
    var sql_name = $sql.others.tips;
    // var sql_password = $sql.user.select_password;

    conn.query(sql_name, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
})

//以下测试数据库连接


router.get("/addUser", (req, res) => {
    // res.send("<h1>Hello World</h1>") 发送HTML
    // res.send({mag:"Hello World"}) 发送json格式数据
    // res.json({success:true}) 发送json格式数据
    // res.sendStatus(400) 发送状态码
    res.status(200).json({ success: true, msg: "Hello World" }) //发送状态码和json数据
})
module.exports = router;