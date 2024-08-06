const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("Article API", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA_CREATED = {
    title: "Test Article",
    content: "This is a test article",
    user: USER_ID
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
    mockingoose.resetAll();
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Article] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
