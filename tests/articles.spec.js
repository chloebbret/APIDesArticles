const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("Article API", () => {
  let token;
  const USER_ID = "fake_user_id";
  const ARTICLE_ID = "fake_article_id";

  const MOCK_DATA_CREATED = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "Article test",
    user: USER_ID,
  };

  const MOCK_DATA_UPDATED = {
    _id: ARTICLE_ID,
    title: "MAJ OK : Test article",
    content: "Article mis à jour",
    user: USER_ID,
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
    mockingoose.resetAll();
  });

  test("[Article] Create Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");

    const res = await request(app)
        .post("/api/articles")
        .send({
          title: MOCK_DATA_CREATED.title,
          content: MOCK_DATA_CREATED.content,
          user: USER_ID,
        })
        .set("x-access-token", token);

    console.log("res create :", res.body);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
    expect(res.body.content).toBe(MOCK_DATA_CREATED.content);
  });

  test("[Article] Update Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "findOne");
    mockingoose(Article).toReturn(MOCK_DATA_UPDATED, "save");

    const res = await request(app)
        .put(`/api/articles/${ARTICLE_ID}`)
        .send({
          title: MOCK_DATA_UPDATED.title,
          content: MOCK_DATA_UPDATED.content,
        })
        .set("x-access-token", token);

    console.log("res update:", res.body);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title);
    expect(res.body.content).toBe(MOCK_DATA_UPDATED.content);
  });

  test("[Article] Delete Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "findOne");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "findOneAndDelete");

    const res = await request(app)
        .delete(`/api/articles/${ARTICLE_ID}`)
        .set("x-access-token", token);

    console.log("res Delete:", res.status);

    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
