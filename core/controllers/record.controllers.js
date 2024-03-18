import createError from "http-errors";
import jwt from "jsonwebtoken";
import admin from "../models/admin.models.js";
import users from "../models/user.models.js";

async function listRecord(req, res, next) {
    /* 
    1.from req.params.collectionId get listRule from process.model.get(),if not send 400
    2.if,listRule == locked,i.e admins only,
        -check if authorization header present,if not send 401
        -if ok,verify jwt and check if admin,if error or not admin send 401
        -if admin,return the records of collectionId collection
    3.if,listRule == null,i.e anyone,
        -read the records of collectionId collection,if ok send 200 else 400
    4.if,listRule == userId,i.e only the owner,
        -check if authorization header present,if not send 401
        -if ok,verify jwt and check if user,if error or not user send 401
        -if user,read the records of collectionId collection with filter {userid:jwt.id} ,if ok send 200 else 400
    */
    if (process.models.get(req.params.collectionId) === undefined) {
        next(new createError[400]);
        return;
    }
    let listRule = process.models.get(req.params.collectionId).rules.listRule;

    if (listRule === "locked") {
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
            let records = await process.models.get(req.params.collectionId).model.find();
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send(JSON.stringify({
                items: records
            }));
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (listRule == "null") {
        try {
            let records = await process.models.get(req.params.collectionId).model.find();
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send(JSON.stringify({
                items: records
            }));
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (listRule == "userId") {
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
        let isadmin = true;
        let result;
        result = await admin.findOne({ _id: verifiedJWT.id });
        if (result === null) {
            isadmin = false;
            result = await users.findOne({ _id: verifiedJWT.id });
            if (result === null) {
                next(new createError[401]);
                return;
            }
        }

        try {
            let records;
            if (isadmin) {
                records = await process.models.get(req.params.collectionId).model.find();
            }
            else {
                records = await process.models.get(req.params.collectionId).model.find({ userId: verifiedJWT.id });
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send(JSON.stringify({
                items: records
            }));
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
}

async function createRecord(req, res, next) {
    /* 
    1.from req.params.collectionId get createRule from process.model.get(),if not send 400
    2.if,createRule == locked,i.e admins only,
        -check if authorization header present,if not send 401
        -if ok,verify jwt and check if admin,if error or not admin send 401
        -if admin,create the records of collectionId collection and set userId to jwt.id,if ok send 200 else 400
    3.if,createRule == null,i.e anyone
        -,create the records of collectionId collection and set userId to unkown,if ok send 200 else 400
    4.if,createRule == userId,i.e only the owner user,
        -check if authorization header present,if not send 401
        -if ok,verify jwt and check if user,if error or not user send 401
        -if user,create the records of collectionId collection  and set userId to jwt.id,if ok send 200 else 400
    */
    if (process.models.get(req.params.collectionId) === undefined) {
        next(new createError[400]);
        return;
    }
    let createRule = process.models.get(req.params.collectionId).rules.createRule;

    if (createRule === "locked") {
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
            await process.models.get(req.params.collectionId).model.create({ userId: verifiedJWT.id, ...req.body });
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (createRule == "null") {
        let verifiedJWT = undefined;
        try {
            verifiedJWT = jwt.verify(req.get("Authorization"), process.env.SECRET_KEY, 'HS256');
        } catch (error) { }

        try {
            await process.models.get(req.params.collectionId).model.create({ userId: verifiedJWT?.id ?? "unkown", ...req.body });
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (createRule == "userId") {
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
        let result;
        result = await admin.findOne({ _id: verifiedJWT.id });
        if (result === null) {
            result = await users.findOne({ _id: verifiedJWT.id });
            if (result === null) {
                next(new createError[401]);
                return;
            }
        }

        try {
            await process.models.get(req.params.collectionId).model.create({ userId: verifiedJWT.id, ...req.body });
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
}

async function deleteRecord(req, res, next) {
    /* 
    1.from req.params.collectionId get deleteRule from process.model.get(),if not send 400
    2.if,deleteRule == locked,i.e admins only,
        -check if authorization header present,if not send 401
        -if ok,verify jwt and check if admin,if error or not admin send 401
        -if admin,findOneAndDelete() to delete,if ok send 200 else 400
    3.if,deleteRule == null,i.e anyone
        -delete the reocrds,if ok send 200 else 400
    4.if,deleteRule == userId,i.e only the owner user,
        -check if authorization header present,if not send 401
        -if ok,verify jwt and check if user,if error or not user send 401
        -if user,create the records of collectionId collection  and set userId to jwt.id,if ok send 200 else 400
    */
    if (process.models.get(req.params.collectionId) === undefined) {
        next(new createError[400]);
        return;
    }
    let deleteRule = process.models.get(req.params.collectionId).rules.deleteRule;

    if (deleteRule === "locked") {
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
            let result = await process.models.get(req.params.collectionId).model.findOneAndDelete({ _id: req.params.recordId });
            if (result === null) throw new Error();
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (deleteRule == "null") {
        try {
            let result = await process.models.get(req.params.collectionId).model.findOneAndDelete({ _id: req.params.recordId });
            if (result === null) throw new Error();
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (deleteRule == "userId") {
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
        let isadmin = true;
        let result;
        result = await admin.findOne({ _id: verifiedJWT.id });
        if (result === null) {
            isadmin = false;
            result = await users.findOne({ _id: verifiedJWT.id });
            if (result === null) {
                next(new createError[401]);
                return;
            }
        }

        try {
            let result;
            if (isadmin) {
                result = await process.models.get(req.params.collectionId).model.findOneAndDelete({ _id: req.params.recordId });
                console.log('admin');
            }
            else {
                result = await process.models.get(req.params.collectionId).model.findOneAndDelete({ _id: req.params.recordId, userId: verifiedJWT.id });
            }
            if (result === null) throw new Error();
            res.sendStatus(200);
        } catch (error) {
            next(new createError[403]);
            return;
        }
    }
}

export { listRecord, createRecord, deleteRecord }