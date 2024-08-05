const Article = require('./articles.schema');

async function createA (aData) {
  try {
    const article = new Article(aData);
    return await article.save();
  } catch (error) {
    throw new Error(`Erreur pendant la création: ${error.message}`);
  }
}

async function updateA (aId, updateData) {
  try {
    const article = await Article.findByIdAndUpdate(aId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      throw new Error('Article non trouvé');
    }

    return article;
  } catch (error) {
    throw new Error(`Erreur pendant la maj : ${error.message}`);
  }
}

async function deleteA (aId) {
  try {
    const article = await Article.findByIdAndDelete(aId);

    if (!article) {
      throw new Error('Article non trouvé');
    }

    return article;
  } catch (error) {
    throw new Error(`Error pendant la suppression : ${error.message}`);
  }
}

const getArticlesByUser = async (userId) => {
  try {
    return await Article.find({ user: userId }).populate('user', '-password');
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createA,
  updateA,
  deleteA,
  getArticlesByUser
};
