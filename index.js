const app = require("./app.js");
const { connection } = require("./db/connection.js");

connection()
  .then(() => {
    app.listen(8080, () => {
      console.log("server running on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
