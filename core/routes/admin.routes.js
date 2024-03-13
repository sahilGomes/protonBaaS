import express from "express";
import { addAdmin, adminLogin,listAdmin } from "../controllers/admin.controllers.js";

// route for /api/admins/
const router = express.Router();

router.route("/").get(listAdmin).post(addAdmin);
router.post("/auth-with-password",adminLogin);

export default router;