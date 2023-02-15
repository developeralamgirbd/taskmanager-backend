const User = require("../models/User");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const SendEmailUtility = require("../utility/sendEmailUtility");

// Registration
exports.register= (req, res)=>{
    let reqBody = req.body;

    if (reqBody.password !== reqBody.confirmPassword){
        return res.status(400).json({
            status:"fail",
            error: 'Password not match'
        })
    }

    User.create(reqBody,(err, user)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                status:"fail",
                error:err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data: user
            })
        }
    })
}

// Login
exports.login=(req,res)=>{
    let {email, password} = req.body;

    User.aggregate([
        {$match: {email, password}},
        {$project:{_id:0,email:1,firstName:1,lastName:1,mobile:1,photo:1}}
    ],( err, data)=>{
        if(err){
            console.log(err)
            res.status(400).json({
                status:"fail",
                error: err.message
            })
        } else {
            if(data.length > 0){
                const Payload={exp: Math.floor(Date.now() / 1000) + (24*60*60), data:data[0]['email']}
                let token = jwt.sign(Payload,'SecretKey123456789');
                res.status(200).json({
                    status:"success",
                    token: token,
                    user: data[0]
                })
            }
            else {
                res.status(400).json({error:"Credential do not match our records"})
            }
        }
    })
}

// User Profile update
exports.profileUpdate=(req,res)=>{
    let email= req.headers['email'];
    let reqBody=req.body;
    User.updateOne({email:email},reqBody,{new: true},(err,data)=>{
        if(err){
            res.status(400).json({status:"fail",error:err.message})
        }
        else{
            res.status(200).json({status:"success", data:data})
        }
    })

}

// Get user details
exports.profileDetails=(req,res)=>{
    let email = req.headers['email'];

    User.aggregate([
        {$match:{email:email}},
        {$project:{_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1,password:1}}
    ],(err,data)=>{
        if(err){
            res.status(400).json({
                status:"fail",
                error: err.message
            })
        }
        else {
            res.status(200).json({
                status:"success",
                data: data
            })
        }
    })
}

// resend Verify Email recover
exports.RecoverVerifyEmail=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000);
    try {
        // Email Account Query
        let UserCount = (await User.aggregate([{$match: {email: email}}, {$count: "total"}]))
        if(UserCount.length > 0){
            // OTP Insert

            const isExitEmail = await OTP.findOne({email})

            if (isExitEmail){
               await OTP.updateOne({email: email}, {$set: {otp: OTPCode, status: 0}});
            }else {
                await OTP.create({email: email, otp: OTPCode})
            }

            // Email Send
            let SendEmail = await SendEmailUtility(email,"Your PIN Code is= "+OTPCode,"Task Manager PIN Verification")
            res.status(200).json({
                status: "success",
                data: SendEmail
            })
        }
        else{
            res.status(400).json({
                status: "fail",
                error: "No User Found"
            })
        }

    }catch (err) {
        console.log(err)
        res.status(500).json({
            status: "fail",
            error: err.message
        })
    }
}


exports.RecoverVerifyOTP=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = req.params.otp;
    let status=0;
    let statusUpdate=1;
    try {
        let OTPCount = await OTP.aggregate([
            {$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}
        ])
        if (OTPCount.length > 0) {
            let OTPUpdate = await OTP.updateOne({email: email, otp: OTPCode, status: status}, {
                email: email,
                otp: OTPCode,
                status: statusUpdate
            })
            res.status(200).json({
                status: "success",
                data: OTPUpdate
            })
        } else {
            res.status(400).json({
                status: "fail",
                error: "Invalid OTP Code"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            error: err.message
        })
    }
}

exports.RecoverResetPass= async (req,res)=>{

    let email = req.body['email'];
    let OTPCode = req.body['otp'];
    let NewPass =  req.body['password'];
    let statusUpdate = 1;

    try {
        let OTPUsedCount = await OTP.aggregate([
            {$match: {email: email, otp: OTPCode, status: statusUpdate}}, {$count: "total"}
        ])
        console.log(OTPUsedCount.length)

        if (OTPUsedCount.length > 0) {
            let PassUpdate = await User.updateOne({email: email}, {
                password: NewPass
            });

            await OTP.updateOne({email: email, otp: OTPCode, status: 1}, {
                otp: '',
            })

            res.status(200).json({
                status: "success",
                data: PassUpdate})
        } else {
            res.status(400).json({
                status: "fail",
                error: "Invalid Request"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            error: err.message
        })
    }
}


