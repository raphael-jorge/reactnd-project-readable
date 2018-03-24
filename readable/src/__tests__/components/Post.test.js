import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Post from '../../components/Post';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    postData: global.testUtils.getDefaultPostData(),
    onVote: () => {},
    onRemove: () => {},
    onUpdate: () => {},
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


// Tests
describe('<Post />', () => {
  it('renders a post article', () => {
    const { post } = setup();

    expect(post.find('article.post').length).toBe(1);
  });


  it('renders a loading cover placeholder', () => {
    const { post } = setup();

    const placeholder = post.find('Placeholder');

    expect(placeholder.length).toBe(1);
    expect(placeholder.prop('fallback')).toBe(post.instance().LOADING_COVER_COMPONENT);
  });


  describe('operations', () => {
    it('renders an Operations component', () => {
      const { post } = setup();

      expect(post.find('Operations').length).toBe(1);
      expect(post.find('.post-operations').length).toBe(1);
    });

    it('sets vote operations to vote up on the post', () => {
      const onVote = jest.fn();
      const { post, props } = setup({ onVote });

      const operations = post.find('Operations');
      const voteHandler = operations.prop('voteHandler');

      voteHandler.voteUp();
      expect(props.onVote).toHaveBeenCalledWith(props.postData, 1);
    });

    it('sets vote operations to vote down on the post', () => {
      const onVote = jest.fn();
      const { post, props } = setup({ onVote });

      const operations = post.find('Operations');
      const voteHandler = operations.prop('voteHandler');

      voteHandler.voteDown();
      expect(props.onVote).toHaveBeenCalledWith(props.postData, -1);
    });

    it('handles the post remove operation', async () => {
      const onRemove = jest.fn();
      const { post, props } = setup({ onRemove });

      const operations = post.find('Operations');
      const removeHandler = operations.prop('removeHandler');
      await removeHandler.onSubmit();

      expect(props.onRemove).toHaveBeenCalledWith(props.postData);
    });

    it('sets edit operation methods correctly', () => {
      const { post } = setup();

      const operations = post.find('Operations');
      const editHandler = operations.prop('editHandler');

      expect(editHandler.onRequest).toBe(post.instance().handleEditModeEnter);
      expect(editHandler.onSubmit).toBe(post.instance().handleEditSubmit);
      expect(editHandler.onAbort).toBe(post.instance().handleEditModeLeave);
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

        const newTitle = 'new post title';
        const titleChangeEvent = global.testUtils.getDefaultEvent({ targetValue: newTitle });
        post.instance().handleTitleInputChange(titleChangeEvent);

        expect(post.state('titleInput')).toBe(newTitle);
      });

      it('updates bodyInput state on body value change', () => {
        const { post } = setup();
        post.setState({ editMode: true });

        const newBody = 'new post body';
        const bodyChangeEvent = global.testUtils.getDefaultEvent({ targetValue: newBody });
        post.instance().handleBodyInputChange(bodyChangeEvent);

        expect(post.state('bodyInput')).toBe(newBody);
      });

      it('sets titleInputErrorClass state on an empty title value change', () => {
        const { post } = setup();
        post.setState({
          editMode: true,
          titleInput: 'post title',
        });

        const newTitle = '';
        const titleChangeEvent = global.testUtils.getDefaultEvent({ targetValue: newTitle });
        post.instance().handleTitleInputChange(titleChangeEvent);

        expect(post.state('titleInput')).toBe(newTitle);
        expect(post.state('titleInputErrorClass')).toBe('input-error');
      });

      it('sets bodyInputErrorClass state on an empty body value change', () => {
        const { post } = setup();
        post.setState({
          editMode: true,
          bodyInput: 'post body',
        });

        const newBody = '';
        const bodyChangeEvent = global.testUtils.getDefaultEvent({ targetValue: newBody });
        post.instance().handleBodyInputChange(bodyChangeEvent);

        expect(post.state('bodyInput')).toBe(newBody);
        expect(post.state('bodyInputErrorClass')).toBe('input-error');
      });
    });

    describe('methods', () => {
      it('enters the edit mode', () => {
        const postData = global.testUtils.getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post } = setup({ postData });

        post.instance().handleEditModeEnter();

        expect(post.state('editMode')).toBe(true);
        expect(post.state('titleInput')).toBe(postData.title);
        expect(post.state('bodyInput')).toBe(postData.body);
      });

      it('leaves the edit mode', () => {
        const postData = global.testUtils.getDefaultPostData();
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
        const onUpdate = jest.fn();
        const { post, props } = setup({ onUpdate });
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
        const onUpdate = jest.fn();
        const postData = global.testUtils.getDefaultPostData();
        postData.title = 'test post title';
        postData.body = 'test post body';
        const { post, props } = setup({ postData, onUpdate });

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
        const onUpdate = jest.fn();
        const { post, props } = setup({ onUpdate });

        post.setState({
          editMode: true,
          titleInput: '',
        });

        await post.instance().handleEditSubmit();

        expect(post.state('editMode')).toBe(true);
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no body is provided', async () => {
        const onUpdate = jest.fn();
        const { post, props } = setup({ onUpdate });

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
