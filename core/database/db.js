import mongoose from "mongoose";

const connectionDB = async ()=>{
    await mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`,{
        minPoolSize:10
    }).then((mongoose)=>{
        console.log(`Monogobd connected:${mongoose.connection.host}`);
    }).catch(e=>{
        console.log("Monogdb connection failed as:\n",e);
        process.exit(1);
    });
}

export default connectionDB;