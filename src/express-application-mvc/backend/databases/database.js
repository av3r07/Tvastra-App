
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://abhishek:abhishek@cluster0.iszbe.mongodb.net/<dbname>?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
.then(()=>{
    console.warn("db connected");
})
.catch(err=>{
    console.warn("db not connecting",err)
})

module.exports = db;