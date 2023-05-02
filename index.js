const express=require("express")
const {connection}=require("./db")
const {userRouter}=require("./routes/user.routes")
const {articleRouter}=require("./routes/article.routes")
const {auth}=require("./middlewares/auth.middleware")
const morgan = require('morgan')
const fs=require("fs")
const {limiter}=require("./middlewares/rateLimiter")
require("dotenv").config()

const app=express()
app.use(express.json())


const tracker = fs.createWriteStream("./log.txt", { flags: 'a' })
app.use(morgan(':remote-addr :method :url HTTP/:http-version :date[web]\n', { stream: tracker }))

app.use(limiter)
app.use("/user",userRouter)

app.use(auth)
app.use("/articles",articleRouter)



app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to db")
        console.log(`Server is listening at port ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
    
})