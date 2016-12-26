var http=require("http");
var fs=require("fs");
var mime=require("mime");
var server=http.createServer(handle).listen(3002,function(){
    console.log("启动成功")
});
var io=require("socket.io")(server);

function handle(req,res) {
    var filePath="";
    if(req.url=="/"){
        filePath="./HTML/index.html";
    }else{
        filePath="."+req.url;
    }
    fs.exists(filePath,function(exists){
        if(exists){
            fs.readFile(filePath,function(err,data){
                if(err){
                    send404(res)
                }
                res.writeHead(200,{"Content-type":mime.lookup(filePath)})
                res.end(data)
            })
        }
    })
}

var num=0;
var user="";
var userArr=[];
io.on('connection', function (socket) {
    num++;
    user="用户"+num;
    if(userArr.indexOf(user)==-1){
        userArr.push(user);
    }
    socket.on('disconnect', function(){
        var removenum=userArr.indexOf(user);
        userArr.splice(removenum,1);
        num--;
        io.sockets.emit('news', { number:num ,userArr:userArr});
    });
    io.sockets.emit('news', { number:num ,userArr:userArr});
    socket.on('message', function (data) {
        console.log(username);
        io.sockets.emit('fasong', { number:num,data:data,user:username});
    });
});

function send404(res) {
    res.writeHead(404)
    res.end("找不到页面");
}