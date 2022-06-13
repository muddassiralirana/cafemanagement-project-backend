const { query } = require("express");
const express = require("express");
const req = require("express/lib/request");
const { send } = require("express/lib/response");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const add_user = require("../functions/userFunctions");
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

// change password APi

router.post("/changePassword",  auth.authenticateToken,(req, res) => {
  let user = req.body;
  let email = res.locals.email;
  let query = "select * from users where email=? and password=?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "inccorect old password" });
      } else if (results[0].password === user.oldPassword) {
        let query2 = "update users set password=? where email=?";
        connection.query(query2, [user.newPassword, email], (err, results) => {
          if (!err) {
            return res.status(200).json({ message: "password updated" });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res
          .status(400)
          .json({ message: "someting went wrong, please try again later" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

// checkToken API

router.get(
  "/checkToken",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    return res.status(200).json({ message: "true" });
  }
);

// update USER API

router.post(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let user = req.body;
    console.log(user);
    let query = "update users set  status=?  where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "User id does not exist" });
        } else {
          return res.status(200).json({ message: "user updated sucessfully" });
        }
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

// get users API

router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let query =
    "select id , name, email, contactNumber, status from users where role='user' ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

// forgot Password APi

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotpassword", (req, res) => {
  let user = req.body;
  let query = "select email,password from users where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .send(200)
          .json({ message: "password successfully send to you main" });
      } else {
        let mailOption = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password by cafe management",
          html:
            "<p><b>your login detail</b>" +
            results[0].email +
            "<b>pass</b>" +
            results[0].password +
            '<a href="url">click</a></p>',
        };
        transporter.sendMail(mailOption, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("email sent:" + info.response);
          }
        });
        return res
          .send(200)
          .json({ message: "password successfully send to you main" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

// login api
router.post("/login", (req, res) => {
  let user = req.body;
  let query = "select email,password,role,status from users where email =?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res
          .status(401)
          .json({ message: "incorrect username or password" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "wait for admin approval" });
      } else if (results[0].password === user.password) {
        let response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "4h",
        });
        res.status(200).json({ token: accessToken });
      } else {
        return res
          .status(400)
          .json({ message: "something went wrong plz try again later" });
        // res.send(err);
      }
    } else {
      return res.status(580).json(err);
      // res.send(err);
    }
  });
});

// signup Api
router.post("/signup", async (req, res) => {
  try {
    console.log("user/signup called");
    let user = req.body;
    console.log(user);
    let data = await add_user(user);
    res.send("Added");
  } catch (err) {
    res.send(err);
  }
});

// router.post("/signup", (req, res) => {
//   // res.send("user/signup called");
//   console.log("user/signup called");
//   let user = req.body;
//   console.log(user);
//   let query = "select email, password, role, status from users where email=?";
//   connection.query(query, [user.email], (err, results) => {
//     if (!err) {
//       if (results.lenght <= 0) {
//         let query ="insert into users (name,contactNumber,email,password,status,role) values(?,?,?,?,false,user)";
//         connection.query(
//           query,
//           [user.name, user.contactNumber, user.email, user.password],
//           (err, results) => {
//             if (!err) {
//               return res
//                 .status(200)
//                 .json({ message: "successfully registerd" })
//                 .send("Added successfully");
//             } else {
//               return res.sataus(500).json(err);
//             }
//           }
//         );
//       } else {
//         return res.status(400).json({ message: "email already exist" });
//       }
//     } else {
//       return res.status(500).json(err);
//     }
//   });
// });

module.exports = router;

// require("crypto").randomBytes(64).toString('hex') // yeh command cmd main chala kar hex number ko env main poaste karne hain
