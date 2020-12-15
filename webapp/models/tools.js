function checkhouzhui(req){
    if(checkhtml(req) || checkpng(req) || checkcss(req) || checkRoot(req)){
        return true;
    }else{
        return false;
    } 
}


function checkpng(req){
    if(req.url.endsWith('.png') || req.url.endsWith('.jpeg') || req.url.endsWith('.gif') || req.url.endsWith('.GIF') || req.url.endsWith('.JPEG') || req.url.endsWith('.PNG')){
        return true;
    }else{
        return false;
    }
}

function checkhtml(req){
    if(req.url.endsWith('.html') || req.url.endsWith('.HTML')){
        return true;
    }else{
        return false;
    }
}


function checkcss(req){
    if(req.url.endsWith('.css') || req.url.endsWith('.CSS')){
        return true;
    }else{
        return false;
    }
}

function checkRoot(req){
    if(req.url=='/' || req.url=='/index.html'){
        return true;
    }else{
        return false;
    }
}

module.exports={
    checkhouzhui
}