import express from "express";
import { dirname,join } from "node:path";
import { fileURLToPath } from "node:url";

// route for /_/
const router = express.Router()
router.get("/",(req,res,next)=>{
    res.sendFile(join(dirname(fileURLToPath(import.meta.url)),"..",'dist',"index.html"))
});

export default router;