const moment= require('moment')

function fun(username,message){
    return{
        username:username,
        message:message,
        time:moment().format('h:mm a')
    }
}

module.exports=fun 