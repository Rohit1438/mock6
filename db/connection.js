const { connect, disconnect } = require("mongoose");

const connection = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("connected to database")
  } catch (error) {
    console.log(error);
  }
};

const disconnection = async () => {
  try {
    await disconnect();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connection, disconnection };
