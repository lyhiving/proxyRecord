const dbdriver=require('../libs/dbdriver');


async function getProxyTotalNum(){
    //获取总的接口数
    var sql="select count(1) from proxy where 1";
    var params=[]
    var data=await dbdriver.getdata(sql,params);

    return data[0]['count(1)'];
    
}

async function getPersonTotalNum(){
    //获取总的用户数
    var sql="select count(1) from auth where 1";
    var params=[]
    var data=await dbdriver.getdata(sql,params);

    return data[0]['count(1)'];
    
}


module.exports={
    getProxyTotalNum,
    getPersonTotalNum
}