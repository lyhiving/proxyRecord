const express = require('express')
const auth = require('./models/auth')
const proxy = require('./models/proxy')
const fs = require('fs');
const home = require('./models/home')
const hostname = require('./models/hostname')
const sessioncheck=require('./models/sessionCheck')
const bodyParser = require('body-parser');
const dbdriver = require('./libs/dbdriver')
const tools = require('./models/tools')
const app = express()
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

WhiteURL=['/api/login'];
//登录拦截器
app.all('/*', async (req, res, next)=>{
    //白名单无需登录
    if(WhiteURL.indexOf(req.url)!=-1){
        return next();
    }
    //先验证登录态，判断登录态度
    var ret=await auth.checkToken(req);
    if (ret==false) {
        return res.json({
            status: 403,
            data: '请登录'
        });
    } else {
        app.set('author',ret[0])
        next();
    }
});

//登录校验账号密码的操作
app.post('/api/login',async (req, res) => {
    if (req.body.hasOwnProperty('username')) {
        var username = req.body.username;
    } else {
        var username = '';
    }
    if (req.body.hasOwnProperty('password')) {
        var password = req.body.password;
    } else {
        var password = '';
    }

    var ret=await auth.checkusername_password(username,password);
    if(ret==false){
        //账号密码错误则返回登录失败的信息
        return  res.json({
            status: 403,
            data: '账号密码错误'
        });
    }else{
        //登录成功
        return  res.json({
            status: 200,
            data: ret
        });
    }
})

app.get('/', (req, res) => res.send('Hello World!'))




//返回所有的反向代理数据
app.post('/api/getProxyData', async (req, res) => {
    if (req.body.hasOwnProperty('content')) {
        var content = req.body.content;
    } else {
        var content = '';
    }
    if (req.body.hasOwnProperty('page')) {
        var page = req.body.page;
    } else {
        var page = 1;
    }
    if (req.body.hasOwnProperty('pagesize')) {
        var pagesize = req.body.pagesize;
    } else {
        var pagesize = 20;
    }
    var data = await proxy.getProxyData(content, page, pagesize);
    var total = await proxy.getProxyDataTotal(content);
    res.json({
        status: 200,
        total: total,
        data: data
    });
})

//
app.get('/api/getCardInfoData', async function (req, res, next) {
    var ProxyTotalNum = await home.getProxyTotalNum()
    var PersonTotalNum = await home.getPersonTotalNum()
    var HostnameNum=await hostname.getHostnameNum()
    var ProxyNumOfToday=await proxy.getProxyNumOfToday()
    var ProxyDataOf7days=await proxy.getProxyDataOf7days()
    res.json({
        status: 200,
        data: {
            proxyTotalNum: ProxyTotalNum,
            personTotalNum: PersonTotalNum,
            hostnameNum:HostnameNum,
            proxyNumOfToday:ProxyNumOfToday,
            proxyDataOf7days:ProxyDataOf7days
        }
    });

})



//返回每个hostname的数量
app.get('/api/getProxyDataClassify', async function (req, res, next) {
    var ProxyDataClassify = await proxy.getProxyDataClassify()
    res.json({
        status: 200,
        data: ProxyDataClassify
    });
})


app.post('/api/getHostname', async function (req, res, next) {
    if (req.body.hasOwnProperty('content')) {
        var content = req.body.content;
    } else {
        var content = '';
    }
    if (req.body.hasOwnProperty('page')) {
        var page = req.body.page;
    } else {
        var page = 1;
    }
    if (req.body.hasOwnProperty('pagesize')) {
        var pagesize = req.body.pagesize;
    } else {
        var pagesize = 20;
    }
    var data = await hostname.getHostnameData(content, page, pagesize);
    var total = await hostname.getHostnameDataTotal(content);
    res.json({
        status: 200,
        total: total,
        data: data
    });
})


app.post('/api/saveHostname', async (req, res, next)=>{
    if (req.body.hasOwnProperty('hostname')) {
        var hostname_ = req.body.hostname;
        if (hostname_.trim() == '') {
            res.json({
                status: 40300,
                msg: 'hostname不允许为空'
            });
        } else {
            //判断hostname是否存在
            if (await hostname.isHostnameExsit(hostname_) == true) {
                res.json({
                    status: 40300,
                    msg: 'hostname已存在,无需再添加'
                });
            } else {
                if(await hostname.saveHostname(hostname_,app.settings.author.username)==true){
                    res.json({
                        status: 200,
                        msg: 'successful'
                    }); 
                }else{
                    res.json({
                        status: 50000,
                        msg: 'failure',
                        author:UserInfo
                    }); 
                }
            }
        }
    } else {
        res.json({
            status: 40300,
            msg: 'hostname不允许为空'
        });
    }
})


app.post('/api/delHostName',async (req,res,next)=>{
    if (req.body.hasOwnProperty('hostname')) {
        var hostname_ = req.body.hostname;
        if (hostname_.trim() == '') {
            res.json({
                status: 40300,
                msg: 'hostname不允许为空'
            });
        } else {
            //删除操作
            if(await sessioncheck.isSessionCheckExsit(hostname_)==true){
                return res.json({
                    status: 40300,
                    msg: '监控地址存在该域名的会话监控,禁止删除,请先移除监控会话后再删除'
                }); 
            }
            if(await hostname.delHostNameItem(hostname_)==true){
                res.json({
                    status: 200,
                    msg: 'successful'
                }); 
            }else{
                res.json({
                    status: 40300,
                    msg: '删除失败'
                });   
            }
            
        }
    }else{
        res.json({
            status: 40300,
            msg: 'hostname不允许为空'
        }); 
    }
})




//获取监控域名的信息数据
app.post('/api/getSessionCheck', async function (req, res, next) {
    if (req.body.hasOwnProperty('content')) {
        var content = req.body.content;
    } else {
        var content = '';
    }
    if (req.body.hasOwnProperty('page')) {
        var page = req.body.page;
    } else {
        var page = 1;
    }
    if (req.body.hasOwnProperty('pagesize')) {
        var pagesize = req.body.pagesize;
    } else {
        var pagesize = 20;
    }
    var data = await sessioncheck.getSessionCheckData(content, page, pagesize);
    var total = await sessioncheck.getSessionCheckDataTotal(content);
    res.json({
        status: 200,
        total: total,
        data: data
    });
})

//保存监控域名的信息数据配置
app.post('/api/saveSessionCheck', async (req, res, next)=>{
    var hostname_=req.body.hostname
    var check_url=req.body.check_url
    var method=req.body.method
    var author=app.settings.author.username

    if(await sessioncheck.isSessionCheckExsit(hostname_)==true){
        return res.json({
            status: 40300,
            msg:'已存在相同的主机监控,请修改!'
        });
    }
    if (await sessioncheck.saveSessionCheck(hostname_,check_url,method,author)==true){
        res.json({
            status: 200,
            msg:'successful'
        });
    }else{
        res.json({
            status: 40300,
            msg:'保存数据失败'
        });
    }

})

//删除监控域名条目
app.post('/api/delSessionCheck',async (req,res,next)=>{
    if (req.body.hasOwnProperty('hostname')) {
        var hostname_ = req.body.hostname;
        if (hostname_.trim() == '') {
            res.json({
                status: 40300,
                msg: 'hostname不允许为空'
            });
        } else {
            //删除操作
            if(await sessioncheck.delSessionCheck(hostname_)==true){
                res.json({
                    status: 200,
                    msg: 'successful'
                }); 
            }else{
                res.json({
                    status: 40300,
                    msg: '删除失败'
                });   
            }
            
        }
    }else{
        res.json({
            status: 40300,
            msg: 'hostname不允许为空'
        }); 
    }
})

//更新域名监控条目
app.post('/api/updateSessionCheck', async (req, res, next)=>{
    var hostname_=req.body.hostname
    var check_url=req.body.check_url
    var method=req.body.method
    var author=app.settings.author.username

    if (await sessioncheck.updateSessionCheck(hostname_,check_url,author,method)==true){
        res.json({
            status: 200,
            msg:'successful'
        });
    }else{
        res.json({
            status: 40300,
            msg:'保存数据失败'
        });
    }

})



//证书文件下载
app.get('/api/certdownload',(req,res,next) => {
    res.set({
        "Content-Type":"application/octet-stream",//告诉浏览器这是一个二进制文件
        "Content-Disposition":"attachment; filename=rootCA.crt"//告诉浏览器这是一个需要下载的文件
    });
    fs.createReadStream('./public/rootCA.crt').pipe(res);
});


//404返回页面
app.get('*', function (req, res, next) {
    return res.json({
        status: 404,
        data: 'page not found'
    });
})



app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`))
