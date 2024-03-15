import mongoose from "mongoose";

const  schemaSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
});

const collectionSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    schema:{
        type: [schemaSchema],
        required: true,
        default:undefined
    },
    rules:{
        listRule:String,
        viewRule:String,
        createRule:String,
        updateRule:String,
        deleteRule:String
    }
}, {timestamps: true});

const collection = mongoose.model("collections", collectionSchema);

export default collection;