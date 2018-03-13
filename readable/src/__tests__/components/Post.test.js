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

const getDefaultEvent = () => ({
  preventDefault: jest.fn(),
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


  it('renders a Operations component', () => {
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

      expect(operationEdit.onRequest).toBe(post.instance().handleUpdateRequest);
      expect(operationEdit.onSubmit).toBe(post.instance().handleUpdateSubmit);
      expect(operationEdit.onAbort).toBe(post.instance().handleUpdateAbort);
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


  describe('edit mode', () => {
    describe('inputs', () => {
      it('are rendered to edit the post title and body', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const titleInput = post.find('.post-title.input-edit');
        const bodyInput = post.find('.post-body.input-edit');

        expect(titleInput.length).toBe(1);
        expect(bodyInput.length).toBe(1);
      });

      it('blocks click events', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const titleInput = post.find('.post-title.input-edit');
        const bodyInput = post.find('.post-body.input-edit');

        const event = getDefaultEvent();
        titleInput.simulate('click', event);
        expect(event.preventDefault).toHaveBeenCalled();

        event.preventDefault.mockClear();
        bodyInput.simulate('click', event);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('update state on value change', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const titleInput = post.find('.post-title.input-edit');
        const bodyInput = post.find('.post-body.input-edit');

        const newTitleValue = 'new post title';
        const titleChangeEvent = {
          target: { value: newTitleValue },
        };
        titleInput.simulate('change', titleChangeEvent);
        expect(post.state('titleInputValue')).toBe(newTitleValue);

        const newBodyValue = 'new post body';
        const bodyChangeEvent = {
          target: { value: newBodyValue },
        };
        bodyInput.simulate('change', bodyChangeEvent);
        expect(post.state('bodyInputValue')).toBe(newBodyValue);
      });
    });

    describe('methods', () => {
      it('initializes the edit mode', () => {
        const postData = getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post } = setup({ postData });

        post.instance().handleUpdateRequest();

        expect(post.state('editMode')).toBe(true);
        expect(post.state('titleInputValue')).toBe(postData.title);
        expect(post.state('bodyInputValue')).toBe(postData.body);
      });

      it('aborts the edit operation', () => {
        const postData = getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post } = setup({ postData });

        post.setState({
          editMode: true,
          titleInputValue: postData.title,
          bodyInputValue: postData.body,
        });

        post.instance().handleUpdateAbort();

        expect(post.state('editMode')).toBe(false);
        expect(post.state('titleInputValue')).toBe('');
        expect(post.state('bodyInputValue')).toBe('');
      });

      it('submits the edit operation when valid and different', async () => {
        const { post, props } = setup();
        const updatedPostData = {
          title: 'updated post title',
          body: 'updated post body',
        };

        post.setState({
          editMode: true,
          titleInputValue: updatedPostData.title,
          bodyInputValue: updatedPostData.body,
        });

        await post.instance().handleUpdateSubmit();

        expect(post.state('editMode')).toBe(false);
        expect(post.state('titleInputValue')).toBe('');
        expect(post.state('bodyInputValue')).toBe('');
        expect(props.onUpdate).toHaveBeenCalledWith(props.postData, updatedPostData);
      });

      it('leaves the edit mode when submitted data is equal to current data', async () => {
        const postData = getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post, props } = setup({ postData });

        post.setState({
          editMode: true,
          titleInputValue: postData.title,
          bodyInputValue: postData.body,
        });

        await post.instance().handleUpdateSubmit();

        expect(post.state('editMode')).toBe(false);
        expect(post.state('bodyInputValue')).toBe('');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no title is provided', async () => {
        const { post, props } = setup();

        post.setState({
          editMode: true,
          titleInputValue: '',
        });

        await post.instance().handleUpdateSubmit();

        expect(post.state('editMode')).toBe(true);
        expect(post.state('titleInputErrorClass')).toBe('input-error');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no body is provided', async () => {
        const { post, props } = setup();

        post.setState({
          editMode: true,
          bodyInputValue: '',
        });

        await post.instance().handleUpdateSubmit();

        expect(post.state('editMode')).toBe(true);
        expect(post.state('bodyInputErrorClass')).toBe('input-error');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
