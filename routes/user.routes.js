const express=require("express")
const userRouter=express.Router()
const {UserModel}=require("../models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,city,age}=req.body
    try {
      bcrypt.hash(password, 5, async(err, hash)=>{
        if(err){
          res.status(400).send({msg:"Something went wrong"})
        }
        if(hash){
          const user=new UserModel({name,email,password:hash,city,age})
          await user.save()
          res.status(200).send({msg:"New user has been register successfully"})
        }
    });
    } catch (error) {
      res.status(400).send({msg:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
      const user=await UserModel.findOne({email})
      if(user){
        bcrypt.compare(password, user.password, async(err, result)=>{
          if(result){
            res.status(200).send({msg:"Login Successfull!!","token":jwt.sign({ "userID": user._id ,"user":user.name}, "masai")})
          }else{
            res.status(400).send({msg:"Wrong credentials"})
          }
      });
      //console.log(user)
      }
    } catch (error) {
      res.status(400).send({msg:error.message})
    }
})





module.exports={userRouter}

// name:{type:String, required:true},
// email:{type:String, required:true},
// password:{type:String, required:true},
// city:{type:String, required:true},
// age:{type:Number, required:true}