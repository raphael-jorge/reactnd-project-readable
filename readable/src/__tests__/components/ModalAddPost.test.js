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
      expect(modal.find('#input-author').length).toBe(1);
    });

    it('updates the author state once the author input value changes', () => {
      const { modal } = setup();

      const input = modal.find('#input-author');

      const newAuthor = 'new author value';
      const changeEvent = getDefaultEvent();
      changeEvent.target.value = newAuthor;
      input.simulate('change', changeEvent);

      expect(modal.state('author')).toBe(newAuthor);
    });

    it('renders a title input', () => {
      const { modal } = setup();
      expect(modal.find('#input-title').length).toBe(1);
    });

    it('updates the title state once the title input value changes', () => {
      const { modal } = setup();

      const input = modal.find('#input-title');

      const newTitle = 'new title value';
      const changeEvent = getDefaultEvent();
      changeEvent.target.value = newTitle;
      input.simulate('change', changeEvent);

      expect(modal.state('title')).toBe(newTitle);
    });

    it('renders a body input', () => {
      const { modal } = setup();
      expect(modal.find('#input-body').length).toBe(1);
    });

    it('updates the body state once the body input value changes', () => {
      const { modal } = setup();

      const input = modal.find('#input-body');

      const newBody = 'new body value';
      const changeEvent = getDefaultEvent();
      changeEvent.target.value = newBody;
      input.simulate('change', changeEvent);

      expect(modal.state('body')).toBe(newBody);
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
      });
    });

    it('updates the category state once the category input value changes', () => {
      const categories = getDefaultCategoriesArray();
      const { modal } = setup({ categories });

      const renderedRadioInputs = modal.find('.option input[type="radio"]');

      categories.forEach((category) => {
        const matchingRadioInput = renderedRadioInputs.filterWhere((input) => (
          input.prop('value') === category.path
        ));
        const notMatchingRadioInput = renderedRadioInputs.filterWhere((input) => (
          input.prop('value') !== category.path
        ));

        const changeEvent = getDefaultEvent();
        const newCategory = notMatchingRadioInput.prop('value');
        changeEvent.target.value = newCategory;
        matchingRadioInput.simulate('change', changeEvent);

        expect(modal.state('category')).toBe(newCategory);
      });
    });

    it('sets the category state when activaCategoryPath is set', () => {
      const activeCategoryPath = 'activeCategory';
      const { modal } = setup({ activeCategoryPath });

      expect(modal.state('category')).toBe(activeCategoryPath);
    });

    it('sets the category state when a new activaCategoryPath is set', () => {
      const { modal } = setup();
      const activeCategoryPath = 'activeCategory';

      modal.setProps({ activeCategoryPath });
      expect(modal.state('category')).toBe(activeCategoryPath);
    });

    it('does not set the category state when a falsy activaCategoryPath is set', () => {
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

      jest.spyOn(modal.instance(), 'resetState');

      modal.instance().handleModalClose();

      expect(props.onModalClose).toHaveBeenCalled();
      expect(modal.instance().resetState).toHaveBeenCalled();
    });

    it('handles a valid submit', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'resetState');

      const postDataToSubmit = {
        title: 'test title',
        body: 'test body',
        author: 'test author',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).toHaveBeenCalledWith(postDataToSubmit);
      expect(modal.instance().resetState).toHaveBeenCalled();
    });

    it('handles an unvalid submit (missing title)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'resetState');

      const postDataToSubmit = {
        title: '',
        body: 'test body',
        author: 'test author',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().resetState).not.toHaveBeenCalled();
      expect(modal.state('titleErrorClass')).toBe('input-error');
    });

    it('handles an unvalid submit (missing body)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'resetState');

      const postDataToSubmit = {
        title: 'test title',
        body: '',
        author: 'test author',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().resetState).not.toHaveBeenCalled();
      expect(modal.state('bodyErrorClass')).toBe('input-error');
    });

    it('handles an unvalid submit (missing author)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'resetState');

      const postDataToSubmit = {
        title: 'test title',
        body: 'test body',
        author: '',
        category: 'test category',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().resetState).not.toHaveBeenCalled();
      expect(modal.state('authorErrorClass')).toBe('input-error');
    });

    it('handles an unvalid submit (missing category)', async () => {
      const onPostAdd = jest.fn();
      const { modal, props } = setup({ onPostAdd });

      jest.spyOn(modal.instance(), 'resetState');

      const postDataToSubmit = {
        title: 'test title',
        body: 'test body',
        author: 'test author',
        category: '',
      };
      modal.setState(postDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onPostAdd).not.toHaveBeenCalled();
      expect(modal.instance().resetState).not.toHaveBeenCalled();
      expect(modal.state('categoryErrorClass')).toBe('input-error');
    });
  });
});
