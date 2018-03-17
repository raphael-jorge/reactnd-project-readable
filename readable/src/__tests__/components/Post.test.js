import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Post from '../../components/Post';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    postData: getDefaultPostData(),
    onVote: jest.fn(),
    onRemove: jest.fn(),
    onUpdate: jest.fn(),
    linkMode: undefined,
    readMode: undefined,
  }, propOverrides);

  const post = shallow(
    <MemoryRouter>
      <Post {...props} />
    </MemoryRouter>
  ).find(Post).dive();

  return {
    props,
    post,
  };
};

const getDefaultPostData = () => ({
  id: 'testId',
  category: 'testCategory',
  timestamp: Date.now(),
  title: '',
  author: '',
  body: '',
  voteScore: 0,
  commentCount: 0,
});

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('<Post />', () => {
  it('renders without crashing', () => {
    const { post } = setup();
    expect(post.find('.post').length).toBe(1);
    expect(post.find('.post-info').length).toBe(1);
    expect(post.find('.post-title').length).toBe(1);
    expect(post.find('.post-body').length).toBe(1);
    expect(post.find('.post-comments-info').length).toBe(1);
  });


  it('renders an Operations component', () => {
    const { post } = setup();
    expect(post.find('Operations').length).toBe(1);
    expect(post.find('.post-operations').length).toBe(1);
  });


  describe('operations', () => {
    it('sets vote operations to vote up and down on the post', () => {
      const { post, props } = setup();

      const operations = post.find('Operations');
      const operationVote = operations.prop('voteData');

      operationVote.onVoteUp();
      expect(props.onVote).toHaveBeenCalledWith(props.postData, 1);

      props.onVote.mockClear();
      operationVote.onVoteDown();
      expect(props.onVote).toHaveBeenCalledWith(props.postData, -1);
    });

    it('sets remove operation submit to remove the post', () => {
      const { post, props } = setup();

      const operations = post.find('Operations');
      const operationRemove = operations.prop('onRemove');
      operationRemove.onSubmit();

      expect(props.onRemove).toHaveBeenCalledWith(props.postData);
    });

    it('sets edit operation methods correctly', () => {
      const { post } = setup();

      const operations = post.find('Operations');
      const operationEdit = operations.prop('onEdit');

      expect(operationEdit.onRequest).toBe(post.instance().handleEditModeEnter);
      expect(operationEdit.onSubmit).toBe(post.instance().handleEditSubmit);
      expect(operationEdit.onAbort).toBe(post.instance().handleEditModeLeave);
    });
  });


  describe('link mode', () => {
    it('does not render the post body', () => {
      const { post } = setup({ linkMode: true });
      expect(post.find('post-body').length).toBe(0);
    });

    it('renders a link to the post route', () => {
      const { post, props } = setup({ linkMode: true });
      const postData = props.postData;

      const link = post.find('Link');

      expect(link.length).toBe(1);
      expect(link.prop('to')).toBe(`/${postData.category}/${postData.id}`);
    });
  });

  describe('read mode', () => {
    it('does not render the Operations component', () => {
      const { post } = setup({ readMode: true });

      expect(post.find('Operations').length).toBe(0);
      expect(post.find('.post-operations').length).toBe(0);
    });

    it('does not render the comments info', () => {
      const { post } = setup({ readMode: true });

      expect(post.find('.post-comments-info').length).toBe(0);
    });
  });


  describe('edit mode', () => {
    describe('input', () => {
      it('is rendered to edit the post title', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const titleInput = post.find('.post-title.input-edit');

        expect(titleInput.length).toBe(1);
        expect(titleInput.prop('onChange')).toBe(post.instance().handleTitleInputChange);
      });

      it('is rendered to edit the post body', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const bodyInput = post.find('.post-body.input-edit');

        expect(bodyInput.length).toBe(1);
        expect(bodyInput.prop('onChange')).toBe(post.instance().handleBodyInputChange);
      });

      it('updates titleInput state on title value change', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const newTitleValue = 'new post title';
        const titleChangeEvent = {
          target: { value: newTitleValue },
        };
        post.instance().handleTitleInputChange(titleChangeEvent);

        expect(post.state('titleInput')).toBe(newTitleValue);
      });

      it('updates bodyInput state on body value change', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const newBodyValue = 'new post body';
        const bodyChangeEvent = {
          target: { value: newBodyValue },
        };
        post.instance().handleBodyInputChange(bodyChangeEvent);

        expect(post.state('bodyInput')).toBe(newBodyValue);
      });

      it('sets titleInputErrorClass state on an empty title value change', () => {
        const { post } = setup();
        post.setState({
          editMode: true,
          titleInput: 'post title',
        });

        const newTitleValue = '';
        const titleChangeEvent = {
          target: { value: newTitleValue },
        };
        post.instance().handleTitleInputChange(titleChangeEvent);

        expect(post.state('titleInput')).toBe(newTitleValue);
        expect(post.state('titleInputErrorClass')).toBe('input-error');
      });

      it('sets bodyInputErrorClass state on an empty body value change', () => {
        const { post } = setup();
        post.setState({
          editMode: true,
          bodyInput: 'post body',
        });

        const newBodyValue = '';
        const bodyChangeEvent = {
          target: { value: newBodyValue },
        };
        post.instance().handleBodyInputChange(bodyChangeEvent);

        expect(post.state('bodyInput')).toBe(newBodyValue);
        expect(post.state('bodyInputErrorClass')).toBe('input-error');
      });
    });

    describe('methods', () => {
      it('enters the edit mode', () => {
        const postData = getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post } = setup({ postData });

        post.instance().handleEditModeEnter();

        expect(post.state('editMode')).toBe(true);
        expect(post.state('titleInput')).toBe(postData.title);
        expect(post.state('bodyInput')).toBe(postData.body);
      });

      it('leaves the edit mode', () => {
        const postData = getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post } = setup({ postData });

        post.setState({
          editMode: true,
          titleInput: postData.title,
          bodyInput: postData.body,
        });

        post.instance().handleEditModeLeave();

        expect(post.state('editMode')).toBe(false);
        expect(post.state('titleInput')).toBe('');
        expect(post.state('bodyInput')).toBe('');
      });

      it('submits the edit operation when data is valid and different', async () => {
        const { post, props } = setup();
        const updatedPostData = {
          title: 'updated post title',
          body: 'updated post body',
        };

        post.setState({
          editMode: true,
          titleInput: updatedPostData.title,
          bodyInput: updatedPostData.body,
        });

        await post.instance().handleEditSubmit();

        expect(post.state('editMode')).toBe(false);
        expect(post.state('titleInput')).toBe('');
        expect(post.state('bodyInput')).toBe('');
        expect(props.onUpdate).toHaveBeenCalledWith(props.postData, updatedPostData);
      });

      it('leaves the edit mode when submitted data is equal to current data', async () => {
        const postData = getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post, props } = setup({ postData });

        post.setState({
          editMode: true,
          titleInput: postData.title,
          bodyInput: postData.body,
        });

        await post.instance().handleEditSubmit();

        expect(post.state('editMode')).toBe(false);
        expect(post.state('bodyInput')).toBe('');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no title is provided', async () => {
        const { post, props } = setup();

        post.setState({
          editMode: true,
          titleInput: '',
        });

        await post.instance().handleEditSubmit();

        expect(post.state('editMode')).toBe(true);
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no body is provided', async () => {
        const { post, props } = setup();

        post.setState({
          editMode: true,
          bodyInput: '',
        });

        await post.instance().handleEditSubmit();

        expect(post.state('editMode')).toBe(true);
        expect(props.onUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
