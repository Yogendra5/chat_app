const express= require('express')
const router= express.Router()
const controllers= require('./controllers')

router.get('/',controllers.indexpage) 
router.get('/chat',controllers.chatpage)

module.exports=router