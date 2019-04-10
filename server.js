const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose")
const path = require("path")

let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use("/static",express.static("uploads"))

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb+srv://medapp:admin123@cluster0-pj0vn.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connected")
});

let Application = require("./models/application")
let User = require("./models/user")

var applicationsRouter = require("./routers/applicationsRouter")
var clientRouter = require("./routers/clientRouter")
app.use("/app",applicationsRouter())
app.use("/admin",clientRouter())
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"home.html"))
})
app.listen(port, () => {
    console.log("App running on port: " + port)
  });
