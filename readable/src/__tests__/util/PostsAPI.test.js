// Mock fetch
global.fetch = jest.fn(
  () => Promise.resolve({ json: () => {} })
);

const setup = () => {
  const api = require('../../util/PostsAPI');

  const apiUrl = 'http://localhost:3001';

  const getLastFetchCallConfig = () => {
    // Seleciona os argumentos da última chamada feita a fetch
    const fetchCallArgs = global.fetch.mock.calls.slice(-1)[0];
    const [fetchCallUrl, fetchCallConfig] = fetchCallArgs;

    // Configura url e body
    fetchCallConfig.url = fetchCallUrl;

    if (fetchCallConfig.body && typeof(fetchCallConfig.body) !== 'object') {
      fetchCallConfig.body = JSON.parse(fetchCallConfig.body);
    }

    return fetchCallConfig;
  };

  const getLastFetchCallBody = () => {
    const fetchCallConfig = getLastFetchCallConfig();
    return fetchCallConfig.body;
  };

  const verifyHeadersOnFetchCall = (fetchCallConfig) => {
    expect(fetchCallConfig.headers).toBeDefined();
    expect(fetchCallConfig.headers.Authorization).toBeDefined();
    expect(fetchCallConfig.headers.Accept).toBeDefined();
    expect(fetchCallConfig.headers['Content-Type']).toBeDefined();
  };

  const verifyMethodOnFetchCall = (expectedMethod, fetchCallConfig) => {
    if (expectedMethod === 'GET') {
      expect(fetchCallConfig.method).not.toBeDefined();
    } else {
      expect(fetchCallConfig.method).toBe(expectedMethod);
    }
  };

  const verifyLastFetchCallParameters = (expectedMethod, expectedUrl) => {
    const fetchCallConfig = getLastFetchCallConfig();
    verifyHeadersOnFetchCall(fetchCallConfig);
    verifyMethodOnFetchCall(expectedMethod, fetchCallConfig);
    expect(fetchCallConfig.url).toBe(expectedUrl);
  };

  return {
    api,
    apiUrl,
    verifyLastFetchCallParameters,
    getLastFetchCallBody,
  };
};

afterEach(() => {
  global.fetch.mockClear();
  global.localStorage = {};
  jest.resetModules();
});


// Tests
describe('PostsAPI', () => {
  it('sets the token once it is loaded if one is not defined', () => {
    setup();

    const token = global.localStorage.token;

    expect(token).toBeDefined();
  });


  it('uses the token available at localStorage if one is already defined', () => {
    const tokenValue = 'testToken';
    global.localStorage.token = tokenValue;

    setup();

    const tokenAtLocalStorage = global.localStorage.token;

    expect(tokenAtLocalStorage).toBe(tokenValue);
  });


  describe('GET methods', () => {
    const expectedMethod = 'GET';

    it('get all categories', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const expectedUrl = `${apiUrl}/categories`;

      await api.get.categories();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });

    it('get all posts', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const expectedUrl = `${apiUrl}/posts`;

      await api.get.posts();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });

    it('get all posts for a specific category', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const category = 'testCategory';
      const expectedUrl = `${apiUrl}/${category}/posts`;

      await api.get.posts(category);

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });

    it('get a specific post', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const testPostId = 'testId';
      const expectedUrl = `${apiUrl}/posts/${testPostId}`;

      await api.get.post(testPostId);

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });

    it('get all comments for a specific post', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const testPostId = 'testId';
      const expectedUrl = `${apiUrl}/posts/${testPostId}/comments`;

      await api.get.postComments(testPostId);

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });

    it('get details for a specific comment', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const testCommentId = 'testId';
      const expectedUrl = `${apiUrl}/comments/${testCommentId}`;

      await api.get.comment(testCommentId);

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });
  });


  describe('POST methods', () => {
    const expectedMethod = 'POST';

    it('add a new post', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const expectedUrl = `${apiUrl}/posts`;
      const postToAdd = {
        title: 'testTitle',
        body: 'testBody',
        author: 'testAuthor',
        category: 'testCategory',
      };

      await api.create.post(postToAdd);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.id).toBeDefined();
      expect(fetchBody.timestamp).toBeDefined();
      expect(fetchBody.title).toBe(postToAdd.title);
      expect(fetchBody.body).toBe(postToAdd.body);
      expect(fetchBody.author).toBe(postToAdd.author);
      expect(fetchBody.category).toBe(postToAdd.category);

    });

    it('vote to increase a post score', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const testPostId = 'testId';
      const testVote = 1;
      const expectedUrl = `${apiUrl}/posts/${testPostId}`;

      await api.create.voteOnPost(testPostId, testVote);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.option).toBe('upVote');
    });

    it('vote to decrease a post score', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const testPostId = 'testId';
      const testVote = -1;
      const expectedUrl = `${apiUrl}/posts/${testPostId}`;

      await api.create.voteOnPost(testPostId, testVote);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.option).toBe('downVote');
    });

    it('add a new comment to a post', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const expectedUrl = `${apiUrl}/comments`;
      const testPostId = 'testId';
      const testComment = {
        author: 'testAuthor',
        body: 'testBody',
      };

      await api.create.comment(testPostId, testComment);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.id).toBeDefined();
      expect(fetchBody.timestamp).toBeDefined();
      expect(fetchBody.parentId).toBe(testPostId);
      expect(fetchBody.author).toBe(testComment.author);
      expect(fetchBody.body).toBe(testComment.body);
    });

    it('vote to increase a comment score', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const testCommentId = 'testId';
      const expectedUrl = `${apiUrl}/comments/${testCommentId}`;
      const testVote = 1;

      await api.create.voteOnComment(testCommentId, testVote);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.option).toBe('upVote');
    });

    it('vote to decrease a comment score', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const testCommentId = 'testId';
      const expectedUrl = `${apiUrl}/comments/${testCommentId}`;
      const testVote = -1;

      await api.create.voteOnComment(testCommentId, testVote);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.option).toBe('downVote');
    });
  });


  describe('PUT methods', () => {
    const expectedMethod = 'PUT';

    it('edit a post', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const testPostId = 'testId';
      const expectedUrl = `${apiUrl}/posts/${testPostId}`;
      const testUpdatedPost = {
        title: 'testTitle',
        body: 'testBody',
      };

      await api.update.post(testPostId, testUpdatedPost);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.title).toBe(testUpdatedPost.title);
      expect(fetchBody.body).toBe(testUpdatedPost.body);
    });

    it('edit a comment', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters, getLastFetchCallBody } = setup();
      const testCommentId = 'testId';
      const expectedUrl = `${apiUrl}/comments/${testCommentId}`;
      const testUpdatedComment = {
        body: 'testBody',
      };

      await api.update.comment(testCommentId, testUpdatedComment);
      const fetchBody = getLastFetchCallBody();

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
      expect(fetchBody.timestamp).toBeDefined();
      expect(fetchBody.body).toBe(testUpdatedComment.body);
    });
  });


  describe('DELETE methods', () => {
    const expectedMethod = 'DELETE';

    it('delete a post', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const testPostId = 'testId';
      const expectedUrl = `${apiUrl}/posts/${testPostId}`;

      await api.del.post(testPostId);

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });

    it('delete a comment', async () => {
      const { api, apiUrl, verifyLastFetchCallParameters } = setup();
      const testCommentId = 'testId';
      const expectedUrl = `${apiUrl}/comments/${testCommentId}`;

      await api.del.comment(testCommentId);

      verifyLastFetchCallParameters(expectedMethod, expectedUrl);
    });
  });
});
