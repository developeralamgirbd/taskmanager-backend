const  mongoose=require('mongoose');

const otpSchema= mongoose.Schema({
    email:{
        type:String
    },
    otp:{
        type:String
    },
    status:{
        type:Number,
        default:0
    },
    createdDate:{
        type:Date,
        default:Date.now()
    }
},{versionKey:false});
const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP