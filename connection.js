const mysql=require("mysql");
require("dotenv").config();

var connection=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    multipleStatements: true,
});

// Database Establishment
connection.connect((err)=>{
    if(err){
        console.log("error occured while connecting");
        console.log(err);
    }
    else{
        console.log(`Database connected`);
    }
});


// createTable=()=>{
//     return new Promise((resolve,reject)=>{
//         connection.query("create table names (name varchar(250))", (err, result, field) => {
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(result)
//             }
//         });
//     });
// }

// createTable();

module.exports= connection;