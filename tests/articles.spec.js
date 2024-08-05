const request = require('supertest');
const { app } = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mockingoose = require('mockingoose');
const Article = require('../api/articles/articles.schema');

describe('Articles API', () => {
  let token;
  const ARTICLE_ID = 'article_id';
  const USER_ID = 'user_id';
  const MOCK_DATA = [
    {
      _id: ARTICLE_ID,
      title: 'Test Article',
      content: 'Contenu article',
      user: USER_ID,
    },
  ];
  const MOCK_DATA_CREATED = {
    title: 'New Article',
    content: 'Contenu nouvel article',
    user: USER_ID,
  };
  const MOCK_DATA_UPDATED = {
    title: 'Updated Article',
    content: 'MAJ contenu',
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_DATA, 'find');
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, 'save');
    mockingoose(Article).toReturn(MOCK_DATA_UPDATED, 'findOneAndUpdate');
    mockingoose(Article).toReturn({ _id: ARTICLE_ID }, 'findByIdAndDelete');
  });

  test('[Articles] Create Article', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send(MOCK_DATA_CREATED)
      .set('x-access-token', token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test('[Articles] Update Article', async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_DATA_UPDATED)
      .set('x-access-token', token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title);
  });

  test('[Articles] Delete Article', async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set('x-access-token', token);
    expect(res.status).toBe(204);
  });
});
