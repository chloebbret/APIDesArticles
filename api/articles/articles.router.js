const express = require("express");
const router = express.Router();
const articlesController = require("./articles.controllers");
const authMiddleware = require("../../middlewares/auth");

router.post("/", authMiddleware, articlesController.createArticle);
router.put("/:id", authMiddleware, articlesController.updateArticle);
router.delete("/:id", authMiddleware, articlesController.deleteArticle);
router.get("/", articlesController.getAllA);
router.get("/:id", articlesController.getAByUser);
router.get("/user/:userId", articlesController.getAByUser);

module.exports = router;
