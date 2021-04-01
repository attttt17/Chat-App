


const socket = io()
const $messageform = document.querySelector('#message1')
const $messageinput = document.querySelector('input')
const $messagebutton =  document.querySelector('button') 
const $sendlocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//template

const messagetemplate= document.querySelector('#message-template').innerHTML

const locationtemplate=document.querySelector('#location-template').innerHTML

const sidebartemplate = document.querySelector('#sidebar-template').innerHTML
//option
 const {username , room}= Qs.parse(location.search,{ignoreQueryPrefix : true})
 
 const autoscroll = ()=>{
   
     const $newmessage = $messages.lastElementChild


    const newmessagestyle = getComputedStyle($newmessage)

    const newmessagemargin = parseInt(newmessagestyle.marginBottom)
     const newmessageheight = $newmessage.offsetHeight+newmessagemargin
        
    
     const visibleheight = $messages.offsetHeight


     const container = $messages.scrollHeight

     const scrolloffset = $messages.scrollTop + visibleheight


     if(container - newmessageheight <= scrolloffset){
         
        $messages.scrollTop = $messages.scrollHeight
           
     }

 }


  socket.on('message',(message)=>{
      
       console.log(message)
       const html = Mustache.render(messagetemplate,{
           username : message.username,
           message : message.text,
           createdat: moment(message.createdat).format('h:mm a')
       })

       $messages.insertAdjacentHTML('beforeend',html)


           autoscroll()
  })


  socket.on('sharedlocation',(url)=>{
       console.log(url)
       const html = Mustache.render(locationtemplate,{
        username: url.username,
        url:url.url,
        createdat:moment(url.createdat).format('h:mm a')


    })

    $messages.insertAdjacentHTML('beforeend',html)


           autoscroll()
  })


 const  message1= document.querySelector('form')
  const message2 = document.querySelector('input')

  socket.on('roomdata',({ room, users})=>{
       const html= Mustache.render(sidebartemplate,{
           room,
           users
       })
       document.querySelector('#sidebar').innerHTML= html

  })

   message1.addEventListener('submit',(e)=>{
          e.preventDefault()
          
          $messagebutton.setAttribute('disabled','disabled')
          const value = e.target.elements.message.value

          socket.emit('send',value,(error)=>{

          
            $messagebutton.removeAttribute('disabled')
            $messageinput.value = '' 
            $messageinput.focus()


              if(error){
                  return console.log(error)
              }
              console.log('The Message is sent')
          })


   })

   
document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    return alert('geolocation is not supported')
     
     $sendlocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
         console.log(position)
        
         socket.emit('send-location',{

             lat: position.coords.latitude,
             long: position.coords.longitude
         },()=>{
            $sendlocation.removeAttribute('disabled')
             console.log('location is shared')
         })
       
         

    
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})
  

