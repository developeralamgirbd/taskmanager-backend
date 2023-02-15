const Task = require('../models/Task');

// Update a task
exports.createTask= async (req,res)=>{
    let {groupName, exitGroup, title, description} = req.body;
    const email = req.headers['email'];

    if (groupName){
        const isTask = await Task.aggregate([
            {$match: {email, groupName}}
        ]);

        if (isTask[0]){
            return res.status(400).json({
                status:"fail",
                error: 'Group name already exit'
            })
        }

        Task.create({groupName, title, description, email},(err,data)=>{
            if(err){
                res.status(400).json({
                    status:"fail",
                    error:err.message
                })
            }
            else{
                res.status(200).json({
                    status:"success",
                    data:data
                })
            }
        })

    }else {
        Task.create({groupName: exitGroup, title, description, email},(err,data)=>{
            if(err){
                res.status(400).json({
                    status:"fail",
                    error:err.message
                })
            }
            else{
                res.status(200).json({
                    status:"success",
                    data:data
                })
            }
        })

    }




}

// Delete Task
exports.deleteTask=(req,res)=>{
    let id= req.params.id;
    let Query={_id:id};

    Task.remove(Query,(err,data)=>{
        if(err){
            res.status(400).json({
                status:"fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data: data
            })
        }
    })
}

// Update Task status
exports.updateTaskStatus= async (req,res)=>{
    let id= req.params.id;
    let status = req.params.status;
    let Query = {_id:id};
    let reqBody = { status: status }

    const isTask = await Task.findById(id);
    if (!isTask) {
       return res.status(404).json({
            status:"fail",
            error: 'Not found'
        })
    }

    Task.updateOne(Query, reqBody,(err, data)=>{
        if(err){
            res.status(400).json({
                status:"fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data: data
            })
        }
    })
}

// Get Task by status
exports.listTaskByStatus=(req,res)=>{
    let status= req.params.status;
    let email=req.headers['email'];

    Task.aggregate([
        {$match:{ status: status, email:email }},
        {$project:{
                _id:1,title:1,description:1, status:1,groupName: 1,
                createdDate:{
                    $dateToString:{
                        date:"$createdDate",
                        format:"%d-%m-%Y"
                    }
                }
            }},
        {$sort: {_id: -1}}
    ], (err, data)=>{
        if(err){
            res.status(500).json({
                status: "fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data:data})
        }
    })
}

// Get Task by group
exports.listTaskByGroup=(req,res)=>{
    let status = req.params.status;
    let group= req.params.group;
    let email = req.headers['email'];

    Task.aggregate([
        {$match:{ email:email, groupName: group, status }},
        {$project:{
                _id:1,title:1,description:1, status:1, groupName: 1,
                createdDate:{
                    $dateToString:{
                        date:"$createdDate",
                        format:"%d-%m-%Y"
                    }
                }
            }},
        {$sort: {_id: -1}}
        
    ], (err, data)=>{
        if(err){
            res.status(500).json({
                status: "fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data:data})
        }
    })
}

// Get Task all group
exports.listTaskGroup=(req,res)=>{

    let email = req.headers['email'];

    Task.aggregate([
        {$match:{ email:email }},
        {$group: {_id: {groupName: '$groupName'}, }},

    ], (err, data)=>{
        if(err){
            res.status(500).json({
                status: "fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data:data})
        }
    })
}

// Get Task by group and status
exports.listTaskGroupByStatus=(req,res)=>{
    let status= req.params.status;
    let email = req.headers['email'];

    Task.aggregate([
        {$match:{ status: status, email:email }},

       /* {$project:{
                _id:1, groupName: 1,
            }},
        {$sort: {_id: -1}}*/
        {$group: {_id: {groupName: '$groupName'}, }},

    ], (err, data)=>{
        if(err){
            res.status(500).json({
                status: "fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data:data})
        }
    })
}

// Get Task status count
exports.taskStatusCount=(req,res)=>{
    let email = req.headers['email'];
    Task.aggregate([
        {$match: { email: email }},
        {$group: { _id:"$status", sum:{ $count: {} } }}
    ], (err, data)=>{
        if(err){
            res.status(400).json({
                status:"fail",
                error: err.message})
        }
        else{
            res.status(200).json({
                status:"success",
                data:data
            })
        }
    })
}

// Get Task group count
exports.taskGroupCount=(req,res)=>{
    let email = req.headers['email'];

    Task.aggregate([
        {$match: { email: email }},
        {$group: { _id: '$groupName', sum:{ $count: {} } }}
    ], (err, data)=>{
        if(err){
            res.status(400).json({
                status:"fail",
                error: err.message})
        }
        else{
            res.status(200).json({
                status:"success",
                data:data
            })
        }
    })
}

// Get Task by status
exports.searchTask = (req,res)=>{
    let keyword = req.params.keyword;
    let email=req.headers['email'];

    let SearchRgx = {"$regex": keyword, "$options": "i"}
    let SearchQuery = { $or: [ {title: SearchRgx}, {groupName: SearchRgx}] , email:email }

    Task.aggregate([
        {$match: SearchQuery },
        {$project:{
                _id:1,title:1,description:1, status:1,groupName: 1,
                createdDate:{
                    $dateToString:{
                        date:"$createdDate",
                        format:"%d-%m-%Y"
                    }
                }
            }},
        {$sort: {_id: -1}}
    ], (err, data)=>{
        if(err){
            res.status(500).json({
                status: "fail",
                error: err.message
            })
        }
        else{
            res.status(200).json({
                status:"success",
                data:data})
        }
    })
}
