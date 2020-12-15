const dbdriver=require('../libs/dbdriver');


async function getHostnameData(content,page,pagesize){
    var startpoint=parseInt(parseInt(page)-1)*parseInt(pagesize);
    var sql="select * from hostname where ( hostname like ?  or author like ? ) order by id desc limit ?,?";
    var params=['%'+content+'%','%'+content+'%',startpoint,pagesize]
    var data=await dbdriver.getdata(sql,params);
    return data;   
}

async function getHostnameDataTotal(content){
    var sql="select count(1) from hostname where ( hostname like ?  or author like ? ) limit 1";
    var params=['%'+content+'%','%'+content+'%']
    var data=await dbdriver.getdata(sql,params);
    return data[0]['count(1)'];   
}

async function isHostnameExsit(hostname){
    var sql="select count(1) from hostname where hostname=?"
    var params=[hostname]
    var data=await dbdriver.getdata(sql,params)
    if(data[0]['count(1)']==0){
        return false;
    }else{
        return true;
    }
}

async function saveHostname(hostname,author){
    ctime=new Date().getTime();
    var sql="insert into hostname(hostname,author,ctime)value(?,?,?)"
    var params=[hostname,author,ctime]
    let rows = await dbdriver.query(sql,params);
    if(rows.affectedRows!=0){
        return true;
    }else{
        return false;
    }
    /**
     * OkPacket {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 2,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
        }
     */
}

async function delHostNameItem(hostname){
    var sql="delete from hostname where hostname=?"
    var params=[hostname]
    var rows=await dbdriver.query(sql,params)
    if(rows.affectedRows!=0){
        return true;
    }else{
        return false;
    }
}

async function getHostnameNum(){
    var sql="select count(1) from hostname where 1";
    var params=[]
    var data=await dbdriver.getdata(sql,params)
    return data[0]['count(1)'];
}

module.exports={
    getHostnameData,
    getHostnameDataTotal,
    isHostnameExsit,
    saveHostname,
    delHostNameItem,
    getHostnameNum
}