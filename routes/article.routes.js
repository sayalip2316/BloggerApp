const express=require("express")
const articleRouter=express.Router()
const {ArticleModel}=require("../models/article.model")
const jwt=require("jsonwebtoken")


articleRouter.post("/add",async(req,res)=>{
    try {
        const article=new ArticleModel(req.body)
        await article.save()
        res.status(200).send({msg:"New Article has been added"})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

articleRouter.get("/",async(req,res)=>{
    try {
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    const {title,category,page,limit}=req.query;
    
    let skip;
    if(page){
        skip=(page-1)*limit
    }else{
        skip=0;
    }
    const query={userID:decoded.userID}

    if(title){
        query.title=title
    }
    if(category){
        query.category=category
    }

    const data=await ArticleModel.find(query).skip(skip).limit(limit)
    res.status(200).json(data)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
    

})

articleRouter.get("/:id",async(req,res)=>{
    const {id}=req.params
    try {
        const article=await ArticleModel.find({_id:id})
        res.status(200).send({Article:article})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

articleRouter.patch("/edit/:id",async(req,res)=>{
    const {id}=req.params
    const payload=req.body
    try {
        await ArticleModel.findByIdAndUpdate({_id:id},payload)
        res.status(200).send({msg:"Articles has been updated"})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
articleRouter.delete("/rem/:id",async(req,res)=>{
    const {id}=req.params
    try {
        await ArticleModel.findByIdAndDelete({_id:id})
        res.status(200).send({msg:"Articles has been deleted"})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
module.exports={articleRouter}



