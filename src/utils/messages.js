

const generatemessage = (username,text)=>{
      return {
          username,
          text,
          createdat: new Date().getTime()
      }
}
const generatelocation = (username,url)=>{
    return {
        username,
        url,
        createdat: new Date().getTime()
    }
}


module.exports = {
     generatemessage,
     generatelocation
}
