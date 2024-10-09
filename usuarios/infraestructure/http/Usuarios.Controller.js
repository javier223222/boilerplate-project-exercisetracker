const UserSchema=require("../../domain/entities/Usuarios").User
const express=require("express")
const { User } = require("../../domain/entities/Usuarios")
const router=express.Router()

router.post("/api/users",async (req,res)=>{
    try{
        const {username}=req.body
        const user=new UserSchema({username})
        await user.save()
        return res.status(201).json({
            username:user.username,
            _id:user._id
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

router.get("/api/users",async (req,res)=>{
    try{
        let users=await UserSchema.find({})
        console.log(users)
       users= users.map(user=>
        {
            return {
                _id:user._id,
                username:user.username,
                __v:user.__v
            }
        }
       )
        return res.status(200).json(users)

    }catch(e){
        console.log(e)  
        return res.status(500).json({error:"Internal Server Error"})
    }
})
router.post("/api/users/:_id/exercises",async (req,res)=>{
    try{

    const {_id}=req.params
    const {description,duration,date}=req.body
    let user;
    if(!_id || !description || !duration ){
        return res.status(400).json({error:"Bad Request"})
    }
   
    
    
    if(date==undefined || date=="" || date==null || date==" "){

        
        user=await User.findByIdAndUpdate(_id,
            {$push:{log:{description,duration,date:new Date()}}},{new:true})

    }
     
    
    user=await User.findByIdAndUpdate(_id,{$push:{log:{description,duration,date}}},{new:true})
    if(!user){
        return res.status(404).json({error:"Not Found"})
    }
    return res.status(201).json({
        _id:user._id,
        username:user.username,
        date:date?new Date(date).toDateString():new Date().toDateString(),
        
        duration:parseInt(duration),
        description,
        
       
    })




    
    

    }catch(e){
        console.log(e)
        return res.status(500).json({error:"Internal Server Error"})
    }
     
})

router.get("/api/users/:_id/logs",async (req,res)=>{
   try{
    const {_id}=req.params
    const{from,to,limit}=req.query
    let user;
   
    if(!_id){
        return res.status(400).json({error:"Bad Request"})
    }
    
    if (from & to & limit){
        user=await User.findById(_id,{
            log:{
                $slice:parseInt(limit),
                $filter:{
                    input:"$log",
                    as:"log",
                    cond:{$and:[
                        {$gte:["$$log.date",new Date(from)]},
                        {$lte:["$$log.date",new Date(to)]}
                    ]}
                }

            }
            
        })

    }
     
    user=await User.findById(
        _id
    )
    
    return res.status(200).json({_id:user._id,username:user.username,count:user.log.length,log:user.log.map(log=>{
        return {
            description:log.description,
            duration:log.duration,
            date:log.date.toDateString()
        }
    })})

   }catch(e){
    console.log(e)
    return res.status(500).json({error:"Internal Server Error"})
   }
})
exports.router=router