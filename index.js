const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
// const connection =require('./connection');
const userRoute= require("./routes/user");
const categoryRoute= require("./routes/category")
const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hi its running")
})

app.use('/user', userRoute);
app.use("/category", categoryRoute);


module.exports = app;