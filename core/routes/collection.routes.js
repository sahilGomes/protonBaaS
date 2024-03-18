import express from "express";
import { listCollection, createCollection,updateCollection, deleteCollection } from "../controllers/collection.controllers.js";
import { createRecord, listRecord, deleteRecord, updateRecord } from "../controllers/record.controllers.js";

// route for /api/collections/
const router = express.Router();

router.route("/").get(listCollection).post(createCollection);
router.route("/:collectionId").get(listCollection).put(updateCollection).delete(deleteCollection);
router.route("/:collectionId/records/").get(listRecord).post(createRecord);
router.route("/:collectionId/records/:recordId").put(updateRecord).delete(deleteRecord);

export default router;