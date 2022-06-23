const express= require("express");
const connection = require("../connection");
const router = express.Router();
let ejs = require("ejs");
let pdf = require('html-pdf');
let path = require('path');
let fs = require('fs');
let uuid = require('uuid');
let auth = require("../services/authentication");


router.post("/generateReport",auth.authenticateToken,(req,res)=>{
    const generatedUuid= uuid.v1();
    const orderDetails= req.body;
    let productDetailsReport= JSON.parse(orderDetails.productDetails);
    let query="insert into bill (name,uuid,email,contactNumber,paymentmethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query,[orderDetails.name,generatedUuid,orderDetails.email,orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails,res.locals.email ], (err,results)=>{
if(!err){
ejs.renderFile(path,join(__dirname,"","report.ejs"),{
    productDetails:productDetailsReport,
    name:orderDetails.name,
    email:orderDetails.email,
    contactNumber:orderDetails.contactNumber,
    paymentMethod:orderDetails.paymentMethod,
    totalAmount:orderDetails.totalAmount},(err,results)=>{
        if(err){
            res.status(500).json(err)
        }else{
            pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf",function(err,data){
                if(err){
console.log(err);
res.status(500).json(err);
                }
                else{
                    res.status(200).json({uuid:generatedUuid});
                }
            })
        }
    })
}else{
    res.status(500).json(err)
}
    })

})


module.exports=router;