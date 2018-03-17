import React from 'react';
import { shallow } from 'enzyme';
import ModalAddPost from '../../components/ModalAddPost';

jest.mock('react-modal');

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    isOpen: true,
    onModalClose: () => {},
    onPostAdd: () => {},
    categories: [],
    activeCategoryPath: undefined,
  }, propOverrides);

  const modal = shallow(<ModalAddPost {...props} />);

  return {
    props,
    modal,
  };
};

const getDefaultEvent = () => ({
  target: {
    value: null,
  },
});

const getDefaultCategoriesArray = () => {
  const categoriesArray = [
    { name: 'category1', path: 'categoryPath1' },
    { name: 'category2', path: 'categoryPath2' },
  ];

  return categoriesArray;
};


// Tests
describe('<ModalAddPost />', () => {
  it('renders an OperationConfirm conponent', () => {
    const { modal } = setup();

    const operationConfirm = modal.find('OperationConfirm');

    expect(operationConfirm.length).toBe(1);
    expect(operationConfirm.prop('onConfirm')).toBe(modal.instance().handleSubmit);
    expect(operationConfirm.prop('onCancel')).toBe(modal.instance().handleModalClose);
  });


  describe('inputs', () => {
    it('renders an author input', () => {
      const { modal } = setup();

      const authorInput = modal.find('#input-author');

      expect(authorInput.length).toBe(1);
      expect(authorInput.prop('onChange')).toBe(modal.instance().handleAuthorChange);
    });

    it('renders a title input', () => {
      const { modal } = setup();

      const titleInput = modal.find('#input-title');

      expect(titleInput.length).toBe(1);
      expect(titleInput.prop('onChange')).toBe(modal.instance().handleTitleChange);
    });

    it('renders a body input', () => {
      const { modal } = setup();

      const bodyInput = modal.find('#input-body');

      expect(bodyInput.length).toBe(1);
      expect(bodyInput.prop('onChange')).toBe(modal.instance().handleBodyChange);
    });

    it('renders a radio input for each category', () => {
      const categories = getDefaultCategoriesArray();
      const { modal } = setup({ categories });

      const renderedRadioInputs = modal.find('.option input[type="radio"]');

      categories.forEach((category) => {
        const matchingRadioInput = renderedRadioInputs.filterWhere((input) => (
          input.prop('value') === category.path
        ));

        expect(matchingRadioInput.length).toBe(1);
        expect(matchingRadioInput.prop('onChange')).toBe(modal.instance().handleCategoryChange);
      });
    });

    it('updates the author state once the author input value changes', () => {
      const { modal } = setup();

      const newAuthor = 'new author value';
      const changeAuthorEvent = getDefaultEvent();
      changeAuthorEvent.target.value = newAuthor;

      modal.instance().handleAuthorChange(changeAuthorEvent);

      expect(modal.state('author')).toBe(newAuthor);
    });

    it('updates the title state once the title input value changes', () => {
      const { modal } = setup();

      const newTitle = 'new title value';
      const changeTitleEvent = getDefaultEvent();
      changeTitleEvent.target.value = newTitle;

      modal.instance().handleTitleChange(changeTitleEvent);

      expect(modal.state('title')).toBe(newTitle);
    });

    it('updates the body state once the body input value changes', () => {
      const { modal } = setup();

      const newBody = 'new body value';
      const changeBodyEvent = getDefaultEvent();
      changeBodyEvent.target.value = newBody;

      modal.instance().handleBodyChange(changeBodyEvent);

      expect(modal.state('body')).toBe(newBody);
    });

    it('updates the category state once the category input value changes', () => {
      const { modal } = setup();

      const newCategory = 'new category value';
      const changeCategoryEvent = getDefaultEvent();
      changeCategoryEvent.target.value = newCategory;

      modal.instance().handleCategoryChange(changeCategoryEvent);

      expect(modal.state('category')).toBe(newCategory);
    });

    it('sets authorErrorClass state on an empty author value change', () => {
      const { modal } = setup();
      modal.setState({ author: 'post author' });

      const newAuthorValue = '';
      const changeAuthorEvent = getDefaultEvent();
      changeAuthorEvent.target.value = newAuthorValue;
      modal.instance().handleAuthorChange(changeAuthorEvent);

      expect(modal.state('author')).toBe(newAuthorValue);
      expect(modal.state('authorErrorClass')).toBe('input-error');
    });

    it('sets titleErrorClass state on an empty title value change', () => {
      const { modal } = setup();
      modal.setState({ title: 'post title' });

      const newTitleValue = '';
      const changeTitleEvent = getDefaultEvent();
      changeTitleEvent.target.value = newTitleValue;
      modal.instance().handleTitleChange(changeTitleEvent);

      expect(modal.state('title')).toBe(newTitleValue);
      expect(modal.state('titleErrorClass')).toBe('input-error');
    });

    it('sets bodyErrorClass state on an empty body value change', () => {
      const { modal } = setup();
      modal.setState({ body: 'post body' });

      const newBodyValue = '';
      const changeBodyEvent = getDefaultEvent();
      changeBodyEvent.target.value = newBodyValue;
      modal.instance().handleBodyChange(changeBodyEvent);

      expect(modal.state('body')).toBe(newBodyValue);
      expect(modal.state('bodyErrorClass')).toBe('input-error');
    });

    it('sets categoryErrorClass state on an empty category value change', () => {
      const { modal } = setup();
      modal.setState({ category: 'post category' });

      const newCategoryValue = '';
      const changeCategoryEvent = getDefaultEvent();
      changeCategoryEvent.target.value = newCategoryValue;
      modal.instance().handleCategoryChange(changeCategoryEvent);

      expect(modal.state('category')).toBe(newCategoryValue);
      expect(modal.state('categoryErrorClass')).toBe('input-error');
    });

    it('sets the category state when the activeCategoryPath prop is set', () => {
      const activeCategoryPath = 'activeCategory';
      const { modal } = setup({ activeCategoryPath });

      expect(modal.state('category')).toBe(activeCategoryPath);
    });

    it('updates the category state when a new activeCategoryPath is set', () => {
      const { modal } = setup();

      const activeCategoryPath = 'activeCategory';
      modal.setProps({ activeCategoryPath });

      expect(modal.state('category')).toBe(activeCategoryPath);
    });

    it('does not update the category state when a falsy activeCategoryPath is set', () => {
      const activeCategoryPath = 'activeCategory';
      const { modal } = setup({ activeCategoryPath });

      const newActiveCategoryPath = null;
      modal.setProps({ activeCategoryPath: newActiveCategoryPath });

      expect(modal.state('category')).toBe(activeCategoryPath);
    });
  });


  describe('methods', () => {
    it('handles modal close', () => {
      const onModalClose = jest.fn();
      const { modal, props } = setup({ onModalClose });

      modal.instance().handleModalClose();

      expect(props.onModalClose).toHaveBeenCalled();
    });

    it('handles a valid submit', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const postDataToSubmit = {
        title: 'test title',
        body: 'test body',
        author: 'test author',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).toHaveBeenCalledWith(postDataToSubmit);
      expect(modal.instance().handleModalClose).toHaveBeenCalled();
    });

    it('handles an unvalid submit (missing title)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const postDataToSubmit = {
        title: '',
        body: 'test body',
        author: 'test author',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().handleModalClose).not.toHaveBeenCalled();
    });

    it('handles an unvalid submit (missing body)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const postDataToSubmit = {
        title: 'test title',
        body: '',
        author: 'test author',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().handleModalClose).not.toHaveBeenCalled();
    });

    it('handles an unvalid submit (missing author)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const postDataToSubmit = {
        title: 'test title',
        body: 'test body',
        author: '',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().handleModalClose).not.toHaveBeenCalled();
    });

    it('handles an unvalid submit (missing category)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const postDataToSubmit = {
        title: 'test title',
        body: 'test body',
        author: 'test author',
        category: '',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().handleModalClose).not.toHaveBeenCalled();
    });
  });
});
