import app from "./app.js";
import connectionDB from "./database/db.js"

await connectionDB().then(async()=>{
    app.listen(8080);
    console.log("Api--> http://127.0.0.1:8080/api/");
    console.log("AdminUi--> http://127.0.0.1:8080/_/");
});