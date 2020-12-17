const dbdriver=require('../libs/dbdriver');
const aes = require('../libs/aes');
const crypto = require('crypto');

const salt='webproxy';

async function getUserinfo(username){
    var sql="select * from auth where username=?";
    var params=[username]
    var data=await dbdriver.getdata(sql,params);
    return data;
    
}

async function checkusername_password(username,password){
    var content=salt+password;
    var pass = crypto.createHash('md5').update(content).digest("hex")
    var sql="select * from auth where username=? and password=?";
    var params=[username,pass]
    var data=await dbdriver.getdata(sql,params);
    if(data.length==0){
        return false;
    }else{
        return aes.encryption(JSON.stringify(data[0]));
    }
    
}

async function checkToken(req){
    if(req.headers.hasOwnProperty('authorization')==false){
        return false;
    }else{
        var token=req.headers.authorization;
        var userinfo=aes.decryption(token);
        if(userinfo.length==0){
            return false;
        }else{
            return getUserinfo(JSON.parse(userinfo).username)
        }
        
    }
}
module.exports={
    checkToken,
    checkusername_password
}