import app from "./app.js";
import connectionDB from "./database/db.js"

await connectionDB().then(async()=>{
    app.listen(8080);
});