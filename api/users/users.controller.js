const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const usersService = require("./users.service");
const User = require('./users.model');
const Article = require('../articles/articles.schema');

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await usersService.get(id);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getUserArticles(req, res, next) {
    try {
      const userId = req.params.userId;

      const articles = await Article.find({ user: userId }).populate("user", "-password");

      if (!articles.length) {
        throw new NotFoundError("Aucun article trouvé pour cet user.");
      }

      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const {name, email, password} = req.body;

      console.log("Données reçues pour la création d'utilisateur:", req.body);

      const user = new User({name, email, password});
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur:", err.message);
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userModified = await usersService.update(id, data);
      userModified.password = undefined;
      res.json(userModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await usersService.delete(id);
      req.io.emit("user:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userId = await usersService.checkPasswordUser(email, password);
      if (!userId) {
        throw new UnauthorizedError();
      }
      const token = jwt.sign({ userId }, config.secretJwtToken, {
        expiresIn: "3d",
      });
      res.json({
        token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
