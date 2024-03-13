import createError from "http-errors";
import express from "express";
import { dirname,join } from "node:path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
import morgan from "morgan";

// setting middlewares to be used in application
let app = express();

app.use(morgan('dev')); //logging
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/pub",express.static(join(dirname(fileURLToPath(import.meta.url)),'public')));

// routing according to path
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js"

app.use("/api/admins",adminRouter);
app.use("/api/users",userRouter);

// handling error
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.send("error")
// });

export default app;