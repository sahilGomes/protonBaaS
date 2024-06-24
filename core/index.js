import app from "./app.js";
import connectionDB from "./database/db.js"
import process from "node:process";

await connectionDB().then(async()=>{
    app.listen(process.env.PORT);
    console.log(`Api--> http://127.0.0.1:${process.env.PORT}/api/`);
    console.log(`AdminUi--> http://127.0.0.1:${process.env.PORT}/_/`);
});