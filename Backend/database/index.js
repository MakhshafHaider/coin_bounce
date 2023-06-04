const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../config/index');
const dbConnect = async() =>{
    try {
      mongoose.set('strictQuery', false);
      const conn =  await mongoose.connect(MONGODB_CONNECTION_STRING);
      console.log(`Database host is : ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in database connection : " + error);
    }
}

module.exports = dbConnect;