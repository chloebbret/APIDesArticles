const articlesService = require('./articles.services');
const UnauthorizedError = require("../../errors/unauthorized");
const Article = require("./articles.schema");

const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Vous n'êtes pas connecté");
    }

    const newArticle = new Article({
      title,
      content,
      user: user._id
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);

  } catch (err) {
    next(err);
  }
};

async function updateArticle(req, res, next) {
  try {
    const articleId = req.params.id;
    const updatedData = req.body;
    const user = req.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedError("Aucune authorisation de mettre à jour l'article");
    }

    const article = await Article.findByIdAndUpdate(articleId, updatedData, { new: true });

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(article);
  } catch (error) {
    next(error);
  }
}

async function deleteArticle (req, res, next) {
  try {
    const articleId = req.params.id;
    const user = req.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedError("Aucune authorisation pour supprimer l'article");
    }

    const article = await Article.findByIdAndDelete(articleId);

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json({ message: 'Suppression validée' });
  } catch (error) {
    next(error);
  }
}

const getAllA = async (req, res, next) => {
  try {
    const articles = await Article.find().populate('user', '-password');
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

const getAByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const articles = await articlesService.getArticlesByUser(userId);
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getAByUser,
  getAllA
};
