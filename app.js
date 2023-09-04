const express= require('express')
const path= require('path')
const http= require('http')
const app= express()
const server= http.createServer(app)
const socketio= require('socket.io')
const io= socketio(server)
const routes= require('./routes')
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, "views")));
const messages= require('./utilities/messages')
const {joinuser,getuser,leave,getallusers}=require('./utilities/users')

app.use('/',routes) 

//run  when someone connects
io.on('connection',socket=>{

    socket.on('joinaroom',({username,room})=>{
        const user= joinuser(socket.id,username,room)

        socket.join(user.room)
        socket.emit('message',messages('chatApp',`welcome ${user.username}`))
        socket.broadcast.to(user.room).emit('message',messages('chatApp',`${user.username} joined`))

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getallusers(user.room),
          });
    })
    
    socket.on('chatmessage',(msg)=>{
        // console.log(msg);
        const user=getuser(socket.id)
        io.to(user.room).emit('message',messages(`${user.username}`,msg))
    })

    socket.on('disconnect',()=>{
        const user1=getuser(socket.id)

        const user=leave(socket.id)
        console.log(user);
        // io.to(user.room).emit('message',messages('chatapp',`${user.username} left`))
        if(user){
            io.to(user.room).emit('message',messages('chatApp',`${user.username} has left`))
        }

        io.to(user1.room).emit("roomUsers", {
            room: user1.room,
            users: getallusers(user1.room),
          });
    })
})

server.listen(3000)
