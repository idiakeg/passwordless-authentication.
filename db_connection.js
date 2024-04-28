const { connect } = require("mongoose");

const connectToDB = async () => {
    const uri = process.env.MONGO_URI;
    let client = await connect(uri);
    console.log("Connected to DB");
    return client;
};

module.exports = connectToDB;
