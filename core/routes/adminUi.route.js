import express from "express";

// route for /_/
const router = express.Router()
router.get("/",(req,res,next)=>{
    res.sendFile("./dist/index.html")
});

export default router;