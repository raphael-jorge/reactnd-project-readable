import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '../../components/NotFound';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
  }, propOverrides);

  const notFound = shallow(<NotFound {...props} />);

  return {
    props,
    notFound,
  };
};


// Tests
describe('<NotFound />', () => {
  it('renders a Post component on readMode with a title "404: Not Found"', () => {
    const { notFound } = setup();

    const post = notFound.find('Post');
    const expectedTitle = '404: Not Found';

    expect(post.prop('postData').title).toBe(expectedTitle);
    expect(post.prop('readMode')).toBe(true);
  });
});
