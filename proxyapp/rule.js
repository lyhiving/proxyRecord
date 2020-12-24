const Main=require('./main')
module.exports = {
  // 模块介绍
  summary: 'my customized rule for AnyProxy',
  remoteAddress:undefined,
  // 发送请求前拦截处理
  *beforeSendRequest(requestDetail) {  //发送请求包前添加header头，并且增加remoteAddress的值,这样请求头就会增加原始的客户端请求的ip地址了
    const newRequestOptions = requestDetail.requestOptions;
    newRequestOptions.headers['remoteAddress'] = this.remoteAddress;
    return {
      requestOptions: newRequestOptions
    };
    // 
    

  },
  // 发送响应前处理
  *beforeSendResponse(requestDetail, responseDetail) { 
    // if(responseDetail.response.statusCode!=404){
      Main.requestMain(requestDetail,responseDetail)
    // }
    // for(var header_item in responseDetail.response.header){
    //   Main.responseMain(responseDetail.response.header[header_item])
        
    // }
    // Main.responseMain(responseDetail)
  
   },
  // 是否处理https请求
  *beforeDealHttpsRequest(requestDetail) { 
    this.remoteAddress = requestDetail._req.connection.remoteAddress;  //https请求时将原始的客户端ip保存到remoteAddress变量
	  return true;
  },
  // 请求出错的事件
  *onError(requestDetail, error) { 
    if(error){
      console.log('error:'+requestDetail)
    }
   },
  // https连接服务器出错
  *onConnectError(requestDetail, error) { /* ... */ }
};
