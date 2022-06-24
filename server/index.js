const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const {Server} = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",//by using cors and setting the origin to this website
        //i am saying that the server can interact with 3000
        methods: ["GET", "POST"],//client can only get and post

    },

})


let users = [];
let user = "";
let rooms = [];
let roomID = "";

io.on("connection", (socket)=>{
    console.log(socket.id);

    socket.on("create_room", (room) =>{
        rooms.push(room);
        io.emit("roomsList", rooms);
    })

  
    //after receiving this info
    socket.on("join_room", (id, name)=>{
        user = name;
        //join the room
        socket.join(id);
        io.to(id).emit("newUserNotification",name);
        roomID = id;
        users.push({
            username:name,
            userid:socket.id,
            room:id,
        })
        io.to(id).emit("usersList", users);
        
       
        
    });

    socket.on("leaveChat", (room, name)=>{
        const usersModified = users.filter((user)=>{
            return user.userid!==socket.id;
        })

        users = usersModified;

        socket.to(room).emit("usersList", users);
        io.to(room).emit("leftChat",name);
        // socket.disconnect(true);
    })

    
    socket.on("send_message", (data)=>{
        //send this info to the client in the specific room
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id);
        const usersModified = users.filter((user)=>{
            return user.userid!==socket.id;
        })

        users = usersModified;

        socket.to(roomID).emit("usersList", users);
        io.to(roomID).emit("leftChat",user);
        
    });
})



server.listen(3001, ()=>{
    console.log("Server is running at porn 3001")
})