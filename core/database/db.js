import mongoose from "mongoose";
import process from "node:process";
import users from "../models/user.models.js";
import collection from "../models/collection.models.js";

async function connectionDB() {
    try {
        await mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, { minPoolSize: 10 });
        console.log(`Monogobd connected:${mongoose.connection.host}`);
        process.models = new Map();
        let collectiondata = await collection.find();
        _makeModelDynamically(collectiondata);  //make models from collectionschema in database
        // update models onchange in database of collection named{collections}
        // below commented as local run should have replication set enabled
        // collection.watch().on('change', (change) => {
        //     _handleCollectionChange(change);
        // });
        console.log(mongoose.connection.modelNames());
    } catch (error) {
        console.log("Monogdb connection failed as:\n", error);
        process.exit(1);
    }
}

function _makeModelDynamically(collectiondata) {
    for (let collectionData of collectiondata) {
        let model = mongoose.model(collectionData.name, _makeSchemaDynamically(collectionData));
        let rules = JSON.parse(JSON.stringify(collectionData)).rules;
        process.models.set(collectionData._id.toString(), { model: model, rules: rules, name: collectionData.name });
    }
}

function _makeSchemaDynamically(collectionSchema) {
    let schemaToReturn = {};
    for (let schemaData of collectionSchema.schema) {
        schemaToReturn[schemaData.name] = _returnType(schemaData.type);
    }
    return mongoose.Schema(schemaToReturn,{timestamps: true});
}

function _returnType(type) {
    switch (type) {
        case "string":
            return String;
        case "number":
            return Number;
        case "date":
            return Date;
        default:
            break;
    }
}

async function _handleCollectionChange(changeObj) {
    if (changeObj["operationType"] === "insert") {
        let collectionData = changeObj.fullDocument;
        let model = mongoose.model(collectionData["name"], _makeSchemaDynamically(collectionData));
        let rules = JSON.parse(JSON.stringify(collectionData)).rules;
        process.models.set(collectionData._id.toString(), { model: model, rules: rules, name: collectionData.name });
        console.log(mongoose.connection.modelNames());
    }
    else if (changeObj["operationType"] === "update") {
        let collectionId = changeObj.documentKey["_id"].toString();
        mongoose.connection.deleteModel(process.models.get(collectionId)["name"]);
        process.models.delete(collectionId);
        let collectionData = await collection.findOne({ _id: collectionId });
        let model = mongoose.model(collectionData["name"], _makeSchemaDynamically(collectionData));
        let rules = JSON.parse(JSON.stringify(collectionData)).rules;
        process.models.set(collectionData._id.toString(), { model: model, rules: rules, name: collectionData.name });
        console.log(mongoose.connection.modelNames());
    }
    else if (changeObj["operationType"] === "delete") {
        let collectionId = changeObj.documentKey["_id"].toString();
        await mongoose.connection.dropCollection(process.models.get(collectionId)["name"]);
        mongoose.connection.deleteModel(process.models.get(collectionId)["name"]);
        process.models.delete(collectionId);
        console.log(mongoose.connection.modelNames());
    }
}

export default connectionDB;