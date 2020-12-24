const sensive_rule = require('../rules/sensive_rule')
const dbutils = require('./methods/dbutils')
const tools = require('./methods/tools')
const filescan = require('../rules/filescan')
const path = require('path')
const { hostname } = require('os')
const { url } = require('inspector')

function responseMain(strs) {
    //敏感信息处理
    // if (sensive_rule.sensive_check(strs) == true) {
    //     console.log(strs.toString());
    // }
    // console.dir(strs.response.statusCode)
    // console.dir(strs.response.header)
    // console.log(strs.response.body.toString())
}

function getRemoteAddress(add1,add2){
    try{
        var rip=add1.split(":")[3];
        if(undefined==rip){
            try{
                var rip=add2.split(":")[3];
                if(undefined==rip){
                    return '-';
                }else{
                    return rip;
                }
            }catch(e){
                return '-'
            }
        }else{
            return rip
        }
    }catch(e){
        return '-';
    }
}

async function requestMain(requestDetail,responseDetail) {
    // var rip=getRemoteAddress(requestDetail._req.socket.remoteAddress,requestDetail._req.connection.remoteAddress)
    var rip=getRemoteAddress(requestDetail.requestOptions.headers['remoteAddress'],requestDetail._req.connection.remoteAddress)  //将请求头保存的信息去获取ip
    req_hostname = requestDetail.requestOptions.hostname;
    req_port = requestDetail.requestOptions.port;
    req_url_path = requestDetail.requestOptions.path;
    req_method = requestDetail.requestOptions.method;
    req_headers = JSON.stringify(requestDetail.requestOptions.headers);
    req_protocol = requestDetail.requestOptions.protocol;
    req_url = requestDetail.url;
    req_requestData = requestDetail.requestData;

    rep_statusCode=responseDetail.response.statusCode;
    rep_header=JSON.stringify(responseDetail.response.header);
    rep_body=responseDetail.response.body.toString()


    //判断是否是白名单，如果是白名单就添加，不是则放弃
    if(await dbutils.isWhiteHostname(req_hostname)!=false){
        if (req_method == 'GET' || req_method == "POST") {
            dbutils.intodb(req_hostname, req_port, req_url_path, req_method, req_headers, req_protocol, req_url, req_requestData.toString(),rep_statusCode,rep_header,rep_body,rip);
        }else{
            console.log('非GET和POST方法不记录')
        }
    }else{
        console.log('非白名单里的hostname不记录:'+req_hostname)
    }


}


module.exports = {
    responseMain,
    requestMain
};