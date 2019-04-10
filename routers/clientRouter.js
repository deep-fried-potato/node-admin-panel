let express = require('express')
let path = require('path');
let bcrypt = require("bcrypt")
module.exports = function(){
  let router = express.Router()
  router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","login.html"))
  })
  router.get("/applications",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","applications.html"))
  })
  router.post("/applications",(req,res)=>{
        res.sendFile(path.join(__dirname,"../client","applications.html"))
  })
  router.get("/newAdmin",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","newadmin.html"))
  })
  return router
}
function verifyUser(username,password){
  return new Promise((resolve,reject)=>{
    let User = require("../models/user")
    User.findOne({username:username},(err,result)=>{
      if(!result){
        resolve(false);
      }
      else if(bcrypt.compareSync(password,result.password)){
        resolve(true);
      }
      else{
        resolve(false)
      }
    })
  })

}
