const app = require('express')();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http , {cors:{
    origin: '*'
}});


app.use(cors());

let userDB = [];

io.on('connection' , function(socket){
    console.log(`${socket.id} connected`);

    socket.on("message-send" , function(msg){
        let id = socket.id;
        let name;
       
        for(let i=0;i<userDB.length;i++){
            if(userDB[i].id==id){
                name = userDB[i].name;
                break;
            }
        }

        socket.broadcast.emit("receive-msg",{name:name , message : msg});
    });

    socket.on("new-user-connected" , function(name){
        let obj = {id:socket.id , name:name};
        userDB.push(obj); 
        socket.broadcast.emit("new-user",name);
    });

    socket.on("disconnect" , function(){
        let id = socket.id;
        let name;
        let idx;
        for(let i=0;i<userDB.length;i++){
            if(userDB[i].id==id){
                name = userDB[i].name;
                idx = i;
                break;
            }
        }
        userDB.splice(idx,1);
        socket.broadcast.emit("left-chat", name);
    });
});

http.listen(3000,()=>{
    console.log('listening on : 3000');
});