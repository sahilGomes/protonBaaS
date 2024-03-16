import admin from "../models/admin.models.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

async function adminLogin(req, res, next) {
    /*
    1.check body from req if null return 404 bad request
    2.if ok,then check if email and password match if not 403 forbidden
    3.if ok,then generate jwt token from the userid and send to user to store in local storage 
     */
    if (Object.keys(req.body).length === 0) {
        next(new createError[400]);
        return;
    }

    let result = await admin.findOne({ email: req.body.email, password: req.body.password });
    if (result === null) {
        next(new createError[400]);
        return;
    }

    let signtoken = jwt.sign(JSON.stringify({ id: result._id.toString() }), process.env.SECRET_KEY);
    res.set('Content-Type', 'application/json; charset=UTF-8');
    let resObj = {
        token: signtoken
    }
    res.send(JSON.stringify(resObj));
}

async function listAdmin(req, res, next) {
    /* 
    1.check authorizatiion header is present and check for null and accordingly send 401
    2.if ok,then by using jsonwebtoken verify the received authorization token and check for error that is thrown. and send 400
    3.if ok,then using model check if id present in admin otherwise 401
    4.send list of admin
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

    let adminArray = await admin.find();
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(JSON.stringify({ admins: adminArray }));
}

async function addAdmin(req, res, next) {
    /* 
    0.check if,admins collection present and go to next,if not add current admin from body and send 200
    1.check authorization header is present, or else send 401
    2.if ok,check authorization if not authorized send 401
    3.if ok,and req.body is not null add the admin using provided data,if data is not validated catch it and send 400
    4.if ok,send 200
    */
    if(await admin.find() === null){
        try {
            let result = await admin.create({
                email: req.body.email,
                password: req.body.password
            });
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }

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
        let result = await admin.create({
            email: req.body.email,
            password: req.body.password
        });
        res.sendStatus(200);
    } catch (error) {
        next(new createError[400]);
        return;
    }
}


export { adminLogin, listAdmin, addAdmin }