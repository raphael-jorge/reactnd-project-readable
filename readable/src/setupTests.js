import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.localStorage = {};

global.testUtils = {
  convertArrayToNormalizedObject: function(array, idKey, additionalKeys={}) {
    const arrayWithAdditionalKeys = this.addKeysToObjectsInArray(array, additionalKeys);

    return arrayWithAdditionalKeys.reduce((object, arrayElement) => {
      object[arrayElement[idKey]] = { ...arrayElement };
      return object;
    }, {});
  },

  addKeysToObjectsInArray: function(array, keys) {
    const keysToAdd = Object.keys(keys);

    return array.map((arrayElement) => {
      const newElement = { ...arrayElement };
      keysToAdd.forEach((key) => newElement[key] = keys[key]);
      return newElement;
    });
  },

  getDefaultCategoriesArray: function(numberOfCategories=2) {
    const categoriesArray = [];
    for (let i = 0; i < numberOfCategories; i++) {
      categoriesArray.push({
        name: `testCategory${i}`,
        path: `testCategoryPath${i}`,
      });
    }
    return categoriesArray;
  },

  getDefaultPostsArray: function(numberOfPosts=2) {
    const postsArray = [];
    for (let i = 0; i < numberOfPosts; i++) {
      postsArray.push({
        id: `testPostId${i}`,
        author: `testPostAuthor${i}`,
        title: `test post title${i}`,
        body: `test post body${i}`,
        category: `testCategory${i}`,
        commentCount: i,
        voteScore: i,
        timestamp: i,
      });
    }
    return postsArray;
  },

  getDefaultPostData: function() {
    return this.getDefaultPostsArray(1)[0];
  },

  getDefaultCommentsArray: function(numberOfComments=2) {
    const commentsArray = [];
    for (let i = 0; i < numberOfComments; i++) {
      commentsArray.push({
        id: `testCommentId${i}`,
        author: `testCommentAuthor${i}`,
        body: `test comment body${i}`,
        parentId: 'testParentPostId',
        timestamp: i,
        voteScore: i,
      });
    }
    return commentsArray;
  },

  getDefaultCommentData: function() {
    return this.getDefaultCommentsArray(1)[0];
  },

  getDefaultReduxState: function() {
    return {
      categories: {
        loading: {
          isLoading: false,
          hasErrored: false,
        },
        categories: {},
      },
      posts: {
        loading: {
          id: null,
          isLoading: false,
          hasErrored: false,
        },
        posts: {},
      },
      comments: {
        loading: {
          id: null,
          isLoading: false,
          hasErrored: false,
        },
        comments: {},
        parentPostId: null,
      },
    };
  },

  getDefaultEvent: function({ targetValue }={ targetValue: null }) {
    return {
      preventDefault: () => {},
      target: { value: targetValue },
    };
  },
};
