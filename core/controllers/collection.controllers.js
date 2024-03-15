import admin from "../models/admin.models.js";
import collection from "../models/collection.models.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";

async function listCollection(req, res, next) {
    /* 
    1.check if authorization header is present else send 401
    2.if ok,verify jwt and using id check if admin,if not send 401
    3.if ok,if req.params is present send collection as per id else,send data as json with 200
    */
    if ((req.get("Authorization") === "") || (req.get("Authorization") === undefined)) {
        next(new createError[401]);
        return;
    }

    let verifiedJWT;
    try {
        verifiedJWT = jwt.verify(req.get("Authorization"), process.env.SECRET_KEY, 'HS256');
    } catch (error) {
        next(new createError[401]);
        return;
    }
    let result = await admin.findOne({ _id: verifiedJWT.id });
    if (result === null) {
        next(new createError[401]);
        return;
    }

    if (Object.keys(req.params).length !== 0) {
        try {
            let collectiondata = await collection.findOne({ _id: req.params.collectionId });
            console.log(collectiondata);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else {
        let collectiondata = await collection.find();
        console.log(collectiondata);
    }
}

async function createCollection(req, res, next) {
    /* 
    1.check if authorization is present,else send 401
    2.if ok,verify jwt and verify admin,else send 401
    3.if ok,check if req.body not null else send 400
    4.if ok,add collection,if error send 400,else send 200
    */
    if ((req.get("Authorization") === "") || (req.get("Authorization") === undefined)) {
        next(new createError[401]);
        return;
    }

    let verifiedJWT;
    try {
        verifiedJWT = jwt.verify(req.get("Authorization"), process.env.SECRET_KEY, 'HS256');
    } catch (error) {
        next(new createError[401]);
        return;
    }
    let result = await admin.findOne({ _id: verifiedJWT.id });
    if (result === null) {
        next(new createError[401]);
        return;
    }

    if (Object.keys(req.body).length === 0) {
        next(new createError[400]);
        return;
    }

    try {
        await collection.create({
            name: req.body.name,
            schema: [...req.body.schema, { name: "createdAt", type: "date" }, { name: "updatedAt", type: "date" }],
            rules: req.body.rules
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        next(new createError[400]);
        return;
    }
}

async function updateCollection(req, res, next) {
    /* 
    1.check if authorization present if not send 401
    2.if ok,verify jwt and admin,if not verified or not admin send 401
    3.if ok,check if req.params.id present and matches any collection,if not send 400
    4.if ok,replace the document of provided,if error send 400,else 200
    */
    if ((req.get("Authorization") === "") || (req.get("Authorization") === undefined)) {
        next(new createError[401]);
        return;
    }

    let verifiedJWT;
    try {
        verifiedJWT = jwt.verify(req.get("Authorization"), process.env.SECRET_KEY, 'HS256');
    } catch (error) {
        next(new createError[401]);
        return;
    }
    let result = await admin.findOne({ _id: verifiedJWT.id });
    if (result === null) {
        next(new createError[401]);
        return;
    }

    let collectionToUpdate = undefined;
    if (req.params.collectionId === undefined) {
        next(new createError[400]);
        return;
    }
    else {
        try {
            collectionToUpdate = await collection.findOne({ _id: req.params.collectionId });
            if (collectionToUpdate === null) {
                throw new Error();
            }
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }

    try {
        await collection.findOneAndUpdate({ _id: req.params.collectionId }, req.body);
        res.sendStatus(200);
    } catch (error) {
        next(new createError(400));
        return;
    }
}

async function deleteCollection(req, res, next) {
    /* 
    1.check if authorization header present,else send 401
    2.if ok,check verify jwt and check amdin,if not or error send 401
    3.if ok,using req.params.id delete collection document,if error send 400 else 200
    */
    if ((req.get("Authorization") === "") || (req.get("Authorization") === undefined)) {
        next(new createError[401]);
        return;
    }

    let verifiedJWT;
    try {
        verifiedJWT = jwt.verify(req.get("Authorization"), process.env.SECRET_KEY, 'HS256');
    } catch (error) {
        next(new createError[401]);
        return;
    }
    let result = await admin.findOne({ _id: verifiedJWT.id });
    if (result === null) {
        next(new createError[401]);
        return;
    }

    try {
        let result = await collection.findOneAndDelete({_id:req.params.collectionId});
        if(result === null) throw new Error();
        res.sendStatus(200);
    } catch (error) {
        next(new createError[400]);
        return;
    }
}

export { listCollection, createCollection, updateCollection, deleteCollection }