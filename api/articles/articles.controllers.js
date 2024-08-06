const Article = require("./articles.schema");

exports.createArticle = async (req, res, next) => {
  try {
    const article = new Article({
      ...req.body,
      user: req.user.userId
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    if (article.user.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    Object.assign(article, req.body);
    await article.save();
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    if (article.user.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getAllA = async (req, res, next) => {
  try {
    const articles = await Article.find().populate("user", "name email");
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

exports.getAById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate("user", "name email");
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

exports.getAByUser = async (req, res, next) => {
  try {
    const articles = await Article.find({ user: req.params.userId }).populate("user", "name email");
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};
