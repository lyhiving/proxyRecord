const dbdriver=require('../libs/dbdriver');


async function getProxyData(content,page,pagesize){
    var startpoint=parseInt(parseInt(page)-1)*parseInt(pagesize);
    var sql="select * from proxy where ( url like ?  or headers like ? or requestData like ? or port like ? )order by id desc limit ?,?";
    var params=['%'+content+'%','%'+content+'%','%'+content+'%','%'+content+'%',startpoint,pagesize]
    var data=await dbdriver.getdata(sql,params);
    return data;   
}

async function getProxyDataTotal(content){
    var sql="select count(1) from proxy where ( url like ?  or headers like ? or requestData like ? or port like ? ) limit 1";
    var params=['%'+content+'%','%'+content+'%','%'+content+'%','%'+content+'%']
    var data=await dbdriver.getdata(sql,params);
    return data[0]['count(1)'];   
}

//今天新增的接口数量
async function getProxyNumOfToday(){
    let today = new Date();
    var d=new Date(today.getFullYear()+'/'+parseInt(today.getMonth()+1)+'/'+parseInt(today.getDate())).getTime();
    var sql="select count(1) from proxy where ctime >=?";
    var params=[d]
    var data=await dbdriver.getdata(sql,params);
    return data[0]['count(1)'];   

}


async function getProxyDataClassify(){
    //得到总的主机名字的个数
    var sql="select hostname as name,count(1) as value from ( select * from proxy order by hostname ) as t group by hostname";
    var params=[];
    var data=await dbdriver.getdata(sql,params);
    return data; 
}

//返回近7天的数据
async function getProxyDataOf7days(){
    //1.获取7天组成的数据
    var ret={};
    for (let index = 6; index > -1; index--) {
        var c=new Date(new Date().getTime() - 1000 * 60 * 60 * 24*index);
        var year=c.getFullYear();
        var month=c.getMonth();
        if(month==12){
            month=1
        }else{
            month=parseInt(month+1);
        }
        month=(Array(2).join('0') + month).slice(-2);
        var day=(Array(2).join('0') + c.getDate()).slice(-2);
        ret[year+'-'+month+'-'+day]=0;
        // ret.push({
        //     createTime:year+'-'+month+'-'+day,
        //     total:0
        // });
    }

    var sql="select from_unixtime(ctime/1000, '%Y-%m-%d')as createTime,count(1) as total from proxy where 1 group by createTime order by createTime desc limit 7"
    var params=[]
    var data=await dbdriver.getdata(sql,params);

    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if(ret.hasOwnProperty(element.createTime)){
            ret[element.createTime]=element.total;
        }
        
        // for (let index_ = 0; index_ < ret.length; index_++) {
        //     if(element.createTime==ret[index_].createTime){
        //         ret[index_].total=element.total;
        //     }
            
        // }
    }

    return ret;
}

module.exports={
    getProxyData,
    getProxyDataTotal,
    getProxyDataClassify,
    getProxyNumOfToday,
    getProxyDataOf7days
}