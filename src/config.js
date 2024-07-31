const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");

//check database connect or not
connect.then(() =>{
    console.log("Database connected Succefully");
})
.catch(()=>{
    console.log("Database cannot be connected");
})
// create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type:String,
        required: true
    }
});

//colection part
const collection = new mongoose.model("clientes", LoginSchema);

module.exports = collection;