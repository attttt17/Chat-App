const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generatemessage} = require('./utils/messages')
const {generatelocation}= require('./utils/messages')
 const app = express()
 const server = http.createServer(app)
 const {adduser,removeuser,getuser, getuserinroom}= require('./utils/users')
 const io = socketio(server)

 const port  = process.env.PORT || 3000
 const publicDirectoryPath = path.join(__dirname,'../public')
  app.use(express.static(publicDirectoryPath))

 

io.on('connection',(socket) =>{
        console.log('new connection')

        
         
         socket.on('join',(options,callback)=>{

          const { error , user} = adduser({id : socket.id,...options})
                
           if(error){
               return  callback(error)
           }


           


             socket.join(user.room)
              
             socket.emit('message',generatemessage('Admin',`Welcome! ${user.username}`))
             socket.broadcast.to(user.room).emit('message',generatemessage('Admin', `${user.username} has joined `))


                   io.to(user.room).emit('roomdata',{
                        room : user.room,
                        users: getuserinroom(user.room)
                   })
               callback()

         })



          socket.on('send',(message,callback)=>{
               const user = getuser(socket.id)

               const filter = new Filter()
               
               if(filter.isProfane(message)){
                    return callback('Profanity  is not allowed')
               }
                io.to(user.room).emit('message',generatemessage(user.username,message))
                callback()
          })
     
 
   socket.on('send-location',(data,callback)=>{
     const user = getuser(socket.id)
        io.to(user.room).emit('sharedlocation',generatelocation(user.username,'https://google.com/maps?q='+data.lat+','+ data.long))
        callback()
   })
   socket.on('disconnect',()=>{
       const user =  removeuser(socket.id)
         
       if(user){
          io.to(user.room).emit('message',generatemessage('Admin',`${user.username} has left`))
          io.to(user.room).emit('roomdata',{
               room : user.room,
               users: getuserinroom(user.room)
          })
       }

})

})





server.listen(port,()=>{ 
    console.log('Server is up  '+ port)
})

 