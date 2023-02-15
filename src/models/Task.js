const  mongoose=require('mongoose');

const taskSchema= mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    groupName: {
        type: String,
        lowercase: true
    },
    status:{
        type: String,
        enum: ['new', 'progress', 'completed', 'canceled'],
        default: 'new'
    },
    email:{
        type:String
    },
    createdDate:{
        type:Date,default:Date.now()
    }
},{versionKey:false});
const Task = mongoose.model('Task', taskSchema);
module.exports = Task