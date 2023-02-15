const  mongoose=require('mongoose');

const userSchema= mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    mobile:{
        type:String
    },
    password:{
        type:String
    },
    photo:{
        type:String
    },
    createdDate:{
        type: Date,
        default: Date.now()
    }
},{versionKey:false});
const User = mongoose.model('User', userSchema);
module.exports = User