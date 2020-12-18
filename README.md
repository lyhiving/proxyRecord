# proxyRecord

* 基于anyproxy的二次开发
* 网络 http/https 的数据审计  （完成)
* 被动插件支持开发（未完成,计划中）
* 数据包重放功能 (未完成,计划中）
* cookie有效性探测 (未完成,计划中）



## 使用
####  0.安装
```
git clone https://github.com/yu2lulu/proxyRecord.git
cd proxyapp
npm install

cd webapp
npm install

cd webtemplates
npm install

```
####  1.数据库初始化配置
* 创建数据库webproxy 【如非webproxy，后续mysql连接也需要同步修改】
* 导入sqltable中的表结构 【auth.sql,hostname.sql,proxy.sql,session.sql,sessioncheck.sql】
  
#### 2.代理审计配置 【proxyapp/libs/dbdriver.js】
```
// 创建数据池
const pool  = mysql.createPool({
  host     : '127.0.0.1',   // 数据库地址
  user     : 'root',    // 数据库用户
  password : '123456',   // 数据库密码
  database : 'webproxy'  // 选中数据库
})
```


#### 3.管理页面后台配置 
* 同2


## 部分截图
![](./images/dashboard.jpg)
![](./images/proxy.jpg)


