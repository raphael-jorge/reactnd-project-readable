import * as Api from '../../util/PostsAPI';

global.fetch = jest.fn(
  () => Promise.resolve({ json: () => {} })
);

const util = {
  apiUrl: 'http://localhost:3001',

  getFetchConfig: () => {
    // Seleciona os argumentos da última chamada feita a fetch
    const fetchCallArgs = global.fetch.mock.calls.slice(-1)[0];
    const [fetchCallUrl, fetchCallConfig] = fetchCallArgs;

    // Configura url e body
    fetchCallConfig.url = fetchCallUrl;

    if (fetchCallConfig.body) {
      fetchCallConfig.body = JSON.parse(fetchCallConfig.body);
    }

    return fetchCallConfig;
  },

  verifyHeaders: (fetchCallConfig) => {
    expect(fetchCallConfig.headers).toBeDefined();
    expect(fetchCallConfig.headers.Authorization).toBeDefined();
    expect(fetchCallConfig.headers.Accept).toBeDefined();
    expect(fetchCallConfig.headers['Content-Type']).toBeDefined();
  },

  verifyMethod: (expectedMethod, fetchCallConfig) => {
    if (expectedMethod === 'GET') {
      expect(fetchCallConfig.method).not.toBeDefined();
    } else {
      expect(fetchCallConfig.method).toBe(expectedMethod);
    }
  },
};

afterEach(() => {
  global.fetch.mockClear();
});


describe('API', () => {
  describe('GET methods', () => {
    const expectedMethod = 'GET';

    it('get all categories', () => {
      return Api.get.categories().then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/categories`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });

    it('get all posts', () => {
      return Api.get.posts().then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });

    it('get all posts for a specific category', () => {
      const category = 'testCategory';

      return Api.get.posts(category).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/${category}/posts`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });

    it('get a specific post', () => {
      const testPostId = 'testId';

      return Api.get.post(testPostId).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts/${testPostId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });

    it('get all comments for a specific post', () => {
      const testPostId = 'testId';

      return Api.get.postComments(testPostId).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts/${testPostId}/comments`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });

    it('get details for a specific comment', () => {
      const testCommentId = 'testId';
      return Api.get.comment(testCommentId).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/comments/${testCommentId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });
  });


  describe('POST methods', () => {
    const expectedMethod = 'POST';

    it('add a new post', () => {
      const testPost = {
        title: 'testTitle',
        body: 'testBody',
        author: 'testAuthor',
        category: 'testCategory',
      };

      return Api.create.post(testPost).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.id).toBeDefined();
        expect(fetchCallConfig.body.timestamp).toBeDefined();
        expect(fetchCallConfig.body.title).toBe(testPost.title);
        expect(fetchCallConfig.body.body).toBe(testPost.body);
        expect(fetchCallConfig.body.author).toBe(testPost.author);
        expect(fetchCallConfig.body.category).toBe(testPost.category);
      });
    });

    it('vote to increase a post score', () => {
      const testPostId = 'testId';
      const testVote = 1;
      return Api.create.voteOnPost(testPostId, testVote).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts/${testPostId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.option).toBe('upVote');
      });
    });

    it('vote to decrease a post score', () => {
      const testPostId = 'testId';
      const testVote = -1;
      return Api.create.voteOnPost(testPostId, testVote).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts/${testPostId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.option).toBe('downVote');
      });
    });

    it('add a new comment to a post', () => {
      const testPostId = 'testId';
      const testComment = {
        author: 'testAuthor',
        body: 'testBody',
      };

      return Api.create.comment(testPostId, testComment).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/comments`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.id).toBeDefined();
        expect(fetchCallConfig.body.timestamp).toBeDefined();
        expect(fetchCallConfig.body.parentId).toBe(testPostId);
        expect(fetchCallConfig.body.author).toBe(testComment.author);
        expect(fetchCallConfig.body.body).toBe(testComment.body);
      });
    });

    it('vote to increase a comment score', () => {
      const testCommentId = 'testId';
      const testVote = 1;

      return Api.create.voteOnComment(testCommentId, testVote).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/comments/${testCommentId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.option).toBe('upVote');
      });
    });

    it('vote to decrease a comment score', () => {
      const testCommentId = 'testId';
      const testVote = -1;

      return Api.create.voteOnComment(testCommentId, testVote).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/comments/${testCommentId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.option).toBe('downVote');
      });
    });
  });


  describe('PUT methods', () => {
    const expectedMethod = 'PUT';

    it('edit a post', () => {
      const testPostId = 'testId';
      const testUpdatedPost = {
        title: 'testTitle',
        body: 'testBody',
      };

      return Api.update.post(testPostId, testUpdatedPost).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts/${testPostId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.title).toBe(testUpdatedPost.title);
        expect(fetchCallConfig.body.body).toBe(testUpdatedPost.body);
      });
    });

    it('edit a comment', () => {
      const testCommentId = 'testId';
      const testUpdatedComment = {
        body: 'testBody',
      };

      return Api.update.comment(testCommentId, testUpdatedComment).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/comments/${testCommentId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);

        expect(fetchCallConfig.body.timestamp).toBeDefined();
        expect(fetchCallConfig.body.body).toBe(testUpdatedComment.body);
      });
    });
  });


  describe('DELETE methods', () => {
    const expectedMethod = 'DELETE';

    it('delete a post', () => {
      const testPostId = 'testId';

      return Api.del.post(testPostId).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/posts/${testPostId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });

    it('delete a comment', () => {
      const testCommentId = 'testId';

      return Api.del.comment(testCommentId).then(() => {
        const fetchCallConfig = util.getFetchConfig();

        expect(fetchCallConfig.url).toBe(`${util.apiUrl}/comments/${testCommentId}`);
        util.verifyHeaders(fetchCallConfig);
        util.verifyMethod(expectedMethod, fetchCallConfig);
      });
    });
  });
});
