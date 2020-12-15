const dbdriver=require('../libs/dbdriver');


async function getSessionCheckData(content,page,pagesize){
    var startpoint=parseInt(parseInt(page)-1)*parseInt(pagesize);
    var sql="select * from sessioncheck where ( hostname like ?  or check_url like ? ) order by id desc limit ?,?";
    var params=['%'+content+'%','%'+content+'%',startpoint,pagesize]
    var data=await dbdriver.getdata(sql,params);
    return data;   
}

async function getSessionCheckDataTotal(content){
    var sql="select count(1) from sessioncheck where ( hostname like ?  or check_url like ? ) limit 1";
    var params=['%'+content+'%','%'+content+'%']
    var data=await dbdriver.getdata(sql,params);
    return data[0]['count(1)'];   
}

async function saveSessionCheck(hostname,check_url,method,author){
    ctime=new Date().getTime();
    var sql="insert into sessioncheck(hostname,check_url,method,author,ctime)value(?,?,?,?,?)"
    var params=[hostname,check_url,method,author,ctime]
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

async function isSessionCheckExsit(hostname){
    var sql="select count(1) from sessioncheck where hostname=?"
    var params=[hostname]
    var data=await dbdriver.getdata(sql,params);
    if(data[0]['count(1)']!=0){
        return true;
    }else{
        return false;
    }
}


async function delSessionCheck(hostname){
    var sql="delete from sessioncheck where hostname=?"
    var params=[hostname]
    var rows=await dbdriver.query(sql,params)
    if(rows.affectedRows!=0){
        return true;
    }else{
        return false;
    }
}

async function updateSessionCheck(hostname,check_url,author,method){
    ctime=new Date().getTime();
    var sql="update  sessioncheck set check_url=?,author=?,method=?,ctime=? where hostname=?"
    var params=[check_url,author,method,ctime,hostname]
    var rows=await dbdriver.query(sql,params)
    if(rows.affectedRows!=0){
        return true;
    }else{
        return false;
    }
}
module.exports={
    getSessionCheckData,
    getSessionCheckDataTotal,
    saveSessionCheck,
    isSessionCheckExsit,
    delSessionCheck,
    updateSessionCheck
}