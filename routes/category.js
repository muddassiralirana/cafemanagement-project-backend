const express= require("express");
const connection= require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");


router.post("/add",auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category=req.body;
    let query= "insert into category (name) values(?)";
    connection.query(query,[category.name],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"category add successfully"})
        }else{
            return res.status(500).json(err);   
        }
    })
});

router.get("/get",auth.authenticateToken,(req,res,next)=>{
    let query="select * from category order by name";
    connection.query(query,(err,results)=>{
        if (!err){
            return res.status(200).json(results)
        }else{
            return res.status(500).json(err);
        }
    })
});


router.post("/update", auth.authenticateToken, checkRole.checkRole,(req, res, next)=>{
    let product=req.body;
    let query ="update category set name=? where id=?";
    connection.query(query, [product.name,product.id],(err,results)=>{
        if (!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:"category id does not found"});

            }
            else{
                return res.status(200).json({message:"updated successfully"});
            }
        }else{
            return res.status(500).json(err)
        }
    })
} )



module.exports= router;