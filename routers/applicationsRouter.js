let express = require('express')
let bcrypt = require('bcrypt')
let multer = require('multer')
let path = require('path');

module.exports = function () {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+"-"+file.originalname)
    }
  })
  var upload = multer({ storage: storage })
  let router = express.Router()
  let Application = require("../models/application");
  let User = require("../models/user")
  router.post("/apply",upload.single("document"),(req,res)=>{
    const file = req.file
    let newApplication = new Application();
    newApplication.name = req.body.name
    newApplication.username = req.body.username
    newApplication.date = new Date().toJSON()
    newApplication.status = false
    newApplication.document = file.filename
    newApplication.save((err,result)=>{
      if(err){
        console.log(err)
        res.status(400).json("An error has occured")
      }
      else{
        res.send(result)
      }
    })
  })
  router.post("/applications",(req,res)=>{
    verifyUser(req.body.username,req.body.password).then((verified)=>{
      if(verified){
        Application.find({},(err,result)=>{
          if(err){
            console.log(err)
            res.status(400).json("An error has occured")
          }
          else{
            res.json(result)
          }
        })
      }
      else{
        res.status(403).json("Wrong Credentials")
      }
    })
  })
  router.get("/newApplication",(req,res)=>{
    res.sendFile(path.join(__dirname,"../","apply.html"))
  })
  router.post("/setstatus",(req,res)=>{
    verifyUser(req.body.username,req.body.password).then((verified)=>{
      if(verified){
        Application.findByIdAndUpdate(req.body.id,{status:req.body.status},(err,result)=>{
          if(err){
            console.log(err)
            res.status(400).json("An error has occured")
          }
          else{
            res.json(result)
          }
        })
      }
      else{
        res.status(403).json("Wrong Credentials")
      }
    })
  })

  router.post("/login",(req,res)=>{
    verifyUser(req.header("username"),req.header("password")).then((verified)=>{
      if(verified){
        res.json("verified")
      }
      else{
        res.status(403).json("Wrong Credentials")
      }
    })
  })

  router.post("/createuser",(req,res)=>{
    newUser = new User()
    newUser.username = req.body.username
    newUser.password = bcrypt.hashSync(req.body.password,8)
    newUser.save((err,result)=>{
      if(err){
        console.log(err)
        res.status(400).json("An error has occured")
      }
      else{
        res.json(result)
      }
    })
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
