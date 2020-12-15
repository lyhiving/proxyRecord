const dbdriver=require('../libs/dbdriver');


async function checkLogin(ipaddress){
    var sql="select * from auth where ipaddress=?";
    var params=[ipaddress]
    var data=await dbdriver.getdata(sql,params);
    return data;
    
}

module.exports={
    checkLogin
}