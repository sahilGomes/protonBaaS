import express from "express";
import { listCollection, createCollection,updateCollection, deleteCollection } from "../controllers/collection.controllers.js";

// route for /api/collections/
const router = express.Router();

router.route("/").get(listCollection).post(createCollection);
router.route("/:collectionId").get(listCollection).put(updateCollection).delete(deleteCollection);

export default router;