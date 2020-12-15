const query=require('../libs/dbdriver');

async function intodb(hostname,port,path,method,headers,protocol,url,requestData,rep_statusCode,rep_header,rep_body,remoteAddress){
    ctime=new Date().getTime();
    sql="insert into proxy(hostname,port,path,method,headers,protocol,url,requestData,ctime,responseCode,responseHeaders,responseData,remoteAddress)values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var params=[hostname,port,path,method,headers,protocol,url,requestData,ctime,rep_statusCode,rep_header,rep_body,remoteAddress]
    let rows = await query(sql,params);

    return rows;
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

async function getdata(sql,values){
    let row = await query(sql,values);
    return row;
}

async function isWhiteHostname(hostname){
    var sql="select count(1) from hostname where hostname=?"
    var params=[hostname]
    var data=await query(sql,params)
    if(data[0]['count(1)']==0){
        return false;
    }else{
        return true;
    }
}

module.exports={
    intodb,
    getdata,
    isWhiteHostname
}