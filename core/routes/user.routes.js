import express from "express";
import { addUser, authUser, listUser, updateUser } from "../controllers/user.controllers.js";

// route for /api/users/
const router = express.Router();

router.route("/auth-with-password").post(authUser);
router.route("/").get(listUser).post(addUser);
router.route("/:userId").put(updateUser);

export default router;