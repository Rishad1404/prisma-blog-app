import express from "express";
import { postRouter } from "./modules/post/post.router";

const app=express();


app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.use('/posts',postRouter);

export default app