const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema   数据库结构，每个schema会映射到MongoDB的一个collection
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    identity:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
})
module.exports = User = mongoose.model("users",UserSchema);