const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth");

router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.delete);

router.get("/", authMiddleware, usersController.getAll);
router.post("/", authMiddleware, usersController.create);
router.delete("/:id", authMiddleware, usersController.delete);
module.exports = router;
