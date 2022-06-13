const connection = require("../connection");

add_user = (user) => {
  return new Promise((resolve, reject) => {
    query =
      "insert into users (name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
    connection.query(
      query,
      [user.name, user.contactNumber, user.email, user.password],
      (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      }
    );
  });
};


module.exports= add_user