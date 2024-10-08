const mongoose=require("mongoose")
const {Schema}=mongoose

const UserSchema=new Schema({
    username :{type:String,required:true,unique:true},
    
    log:[{
        _id:{type:Schema.Types.ObjectId,required:true},
        description:{type:String,required:true},
        duration:{type:Number,required:true},
        date:{type:Date,required:true}

    }]
})

exports.User=mongoose.model("User",UserSchema)