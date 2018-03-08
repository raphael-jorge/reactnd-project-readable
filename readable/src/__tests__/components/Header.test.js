import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import Header from '../../components/Header';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    categories: [],
  }, propOverrides);

  const header = shallow(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>
  ).find(Header).dive();

  return {
    props,
    header,
  };
};

const getDefaultCategories = () => {
  const categoriesArray = [
    { name: 'category1', path: 'categoryPath1' },
    { name: 'category2', path: 'categoryPath2' },
  ];

  return {
    categoriesArray,
  };
};


// Tests
describe('<Header />', () => {
  it('renders a link to the root page', () => {
    const { header } = setup();
    const links = header.find('Link');
    const rootLink = links.findWhere((link) => link.prop('to') === '/');
    expect(rootLink.length).toBe(1);
  });


  it('renders a link to each category page for each category on categories', () => {
    const categories = getDefaultCategories();
    const { header } = setup({ categories: categories.categoriesArray });
    const renderedCategories = header.find('.category-item');

    categories.categoriesArray.forEach((testCategory) => {
      const matchingRenderedCategory = renderedCategories.filterWhere((category) => {
        return category.key() === testCategory.name;
      });

      const childrenLink = matchingRenderedCategory.find('Link');

      expect(matchingRenderedCategory.length).toBe(1);
      expect(childrenLink.length).toBe(1);
      expect(childrenLink.prop('to')).toBe(`/${testCategory.path}`);
    });
  });


  it('renders an active category item when activePath is set', () => {
    const categories = getDefaultCategories();
    const activePath = categories.categoriesArray[0].path;
    const { header } = setup({
      activePath,
      categories: categories.categoriesArray,
    });
    const renderedCategories = header.find('.category-item');

    categories.categoriesArray.forEach((testCategory) => {
      const matchingRenderedCategory = renderedCategories.filterWhere((category) => {
        return category.key() === testCategory.name;
      });

      if (testCategory === activePath) {
        expect(matchingRenderedCategory.prop('className'))
          .toBe(expect.stringContaining('active'));
      } else {
        expect(matchingRenderedCategory.prop('className'))
          .not.toBe(expect.stringContaining('active'));
      }
    });
  });
});
