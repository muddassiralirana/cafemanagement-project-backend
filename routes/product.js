const express = require("express");
const connection = require("../connection");
const router = express.Router();
const checkRole = require("../services/checkRole");
const auth = require("../services/authentication");
const req = require("express/lib/request");
const res = require("express/lib/response");

router.post("/add", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let product = req.body;

  let query =
    "insert into product (name, categoryId, description, price , status) values (?,?,?,?,'true') ";
  connection.query(
    query,
    [product.name, product.categoryId, product.description, product.price],
    (err, results) => {
      if (!err) {
        res.status(200).json({ message: "product add successfully" });
      } else {
        res.status(500).json(err);
      }
    }
  );
});

router.get("/get", auth.authenticateToken, (req, res, next) => {
  let query =
    "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId=c.id";
  connection.query(query, (err, results) => {
    if (!err) {
      res.status(200).json(results);
    } else {
      res.status(500).json({ message: "not work" });
    }
  });
});

router.get("/getByCategory/:id", auth.authenticateToken, (req, res, next) => {
  let id = req.params.id;
  let query = "select id ,name from product where id =? and status='true' ";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      res.status(200).json(results);
    } else {
      res.status(500).json(err);
    }
  });
});

router.get("/getById/:id", auth.authenticateToken, (req, res, next) => {
  let id = req.params.id;
  let query = "select id, name, description,price from product where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      res.status(200).json(results[0]);
    } else {
      res.status(500).json(err);
    }
  });
});

router.post(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let product = req.body;
    let query =
      "update product set name=?,categoryId=?, description=?, price=? where id=?";
    connection.query(
      query,
      [
        product.name,
        product.categoryId,
        product.description,
        product.price,
        product.id,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            res.status(404).json({ message: "product id does not found" });
          } else {
            res.status(200).json({ message: "product updated" });
          }
        } else {
          res.status(500).json(err);
        }
      }
    );
  }
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let id = req.params.id;
    let query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          res.status(400).json({ message: "product id does not found" });
        } else {
          res.status(200).json({ message: "deleted product" });
        }
      } else {
        res.status(500).json({ err });
      }
    });
  }
);

router.post(
  "/updateStatus",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let user = req.body;
    let query = "update product set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "product id does not macth" });
        } else {
          res.status(200).json({ message: "status updated" });
        }
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

module.exports = router;
