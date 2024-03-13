import users from "../models/user.models.js";
import admin from "../models/admin.models.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";

async function authUser(req, res, next) {
    /*
   1.check body from req if null return 404 bad request
   2.if ok,then check if email and password match if not 403 forbidden
   3.if ok,then generate jwt token from the userid and send to user to store in local storage 
    */
    if (Object.keys(req.body).length === 0) {
        next(new createError[400]);
        return;
    }

    let result = await users.findOne({ email: req.body.email, password: req.body.password });
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

async function listUser(req, res, next) {
    /* 
        1.check authorizatiion header is present and check for null and accordingly send 401
        2.if ok,then by using jsonwebtoken verify the received authorization token and check for error that is thrown. and send 400
        3.if ok,then using model check if id present in admin otherwise or user,if both null send 401
        4.if admin send list of users
        5.if user send only the user part
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

    let adminResult = await admin.findOne({ _id: verifiedJWT.id });
    let userResult = await users.findOne({ _id: verifiedJWT.id });
    if (adminResult === null && userResult === null) {
        next(new createError[401]);
        return;
    }

    if (adminResult !== null) {
        let result = await users.find();
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send(JSON.stringify({
            users: result
        }));
    }
    else if (userResult !== null) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send(JSON.stringify({
            users: userResult
        }));
    }
}

async function addUser(req, res, next) {
    /* 
    1.check req.body is not null if so send 400
    2.if ok,using body data create user,if error catch in this process send 400
    3.send 200
    */
    if (Object.keys(req.body).length === 0) {
        next(new createError[400]);
        return;
    }

    try {
        await users.create({
            email: req.body.email,
            password: req.body.password
        });
        res.sendStatus(200);
    } catch (error) {
        next(new createError[400]);
        return;
    }
}

async function updateUser(req, res, next) {
    /* 
    1.check for authorization header,if null send 401
    2.if ok,verify jwt and check it in admin as well user model,if null in both seend 401
    3.if req.body.email and req.body.password not present send 400
    4.if req.par.userid not in user send 400
    4.if admin not null then do update as per id return 200
    5.else if user not null if req.par.userid == verified.id then update and send 200,else send 401
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
    let adminResult = await admin.findOne({ _id: verifiedJWT.id });
    let userResult = await users.findOne({ _id: verifiedJWT.id });
    if (adminResult === null && userResult === null) {
        next(new createError[401]);
        return;
    }

    if (req.body.email === undefined || req.body.password == undefined) {
        next(new createError[400]);
        return
    }

    if (adminResult !== null) {
        try {
            let result = await users.updateOne({ _id: req.params.userId }, {
                email: req.body.email,
                password: req.body.password
            });
            console.log("admin",result);
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
    else if (userResult !== null) {
        if (verifiedJWT.id !== req.params.userId) {
            next(new createError[401]);
            return;
        }
        try {
            await users.updateOne({ _id: verifiedJWT.id }, {
                email: req.body.email,
                password: req.body.password
            });
            res.sendStatus(200);
        } catch (error) {
            next(new createError[400]);
            return;
        }
    }
}

export { addUser, authUser, listUser, updateUser };