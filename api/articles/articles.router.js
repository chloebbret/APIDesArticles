const express = require("express");
const router = express.Router();
const articlesController = require("./articles.controllers");
const authMiddleware = require("../../middlewares/auth");

router.put("/:id", authMiddleware, articlesController.updateArticle);
router.delete("/:id", authMiddleware, articlesController.deleteArticle);
router.post("/", authMiddleware, articlesController.createArticle);
router.get("/", articlesController.getAllA);
router.get("/user/:userId", articlesController.getAByUser);


module.exports = router;
