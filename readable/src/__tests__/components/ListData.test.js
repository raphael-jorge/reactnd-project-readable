import React from 'react';
import { shallow } from 'enzyme';
import ListData from '../../components/ListData';

const TestComponentToBeListted = (props) => {
  return (
    <div></div>
  );
};

const setup = (propOverrides) => {
  const props = Object.assign({
    ComponentToList: TestComponentToBeListted,
    componentProps: {
      dataPropName: 'testData',
      dataArr: [],
      individual: undefined,
      common: undefined,
    },
    isLoading: undefined,
    hasErrored: undefined,
    loadErrorMsg: undefined,
    noDataMsg: undefined,
  }, propOverrides);

  const listData = shallow(<ListData {...props} />);

  return {
    props,
    listData,
  };
};


describe('<ListData />', () => {
  it('renders without crashing', () => {
    const { listData } = setup();
    expect(listData.find('.data-list').length).toBe(1);
  });

  it('renders a ComponentToList for each data in dataArr', () => {
    const testDataArr = [
      { id: 'testId1' },
      { id: 'testId2' },
      { id: 'testId3' },
    ];
    const { listData } = setup({
      componentProps: { dataPropName: 'testData', dataArr: testDataArr },
    });
    expect(listData.find(TestComponentToBeListted).length).toBe(testDataArr.length);
  });

  it('sets common props on all listed components', () => {
    const testDataArr = [
      { id: 'testId1' },
      { id: 'testId2' },
      { id: 'testId3' },
    ];

    const commonProp = { testCommonProp: 'testPropValue' };

    const { listData } = setup({
      componentProps: {
        dataPropName: 'testData',
        dataArr: testDataArr,
        common: commonProp,
      },
    });

    for (let i = 0, n = testDataArr.length; i < n; i++) {
      expect(listData.find(TestComponentToBeListted).get(i).props)
        .toEqual(expect.objectContaining(commonProp));
    }
  });

  it('sets individual props on matching listed components', () => {
    const testDataArr = [
      { id: 'testId1' },
      { id: 'testId2' },
      { id: 'testId3' },
    ];

    const individualPropArr = testDataArr.map((data, i) => `testPropValue${i}`);
    const individualPropName = 'testIndividualProp';
    const inidividualProp = { [individualPropName]: individualPropArr };

    const { listData } = setup({
      componentProps: {
        dataPropName: 'testData',
        dataArr: testDataArr,
        individual: inidividualProp,
      },
    });

    for (let i = 0, n = testDataArr.length; i < n; i++) {
      expect(listData.find(TestComponentToBeListted).get(i).props)
        .toEqual(expect.objectContaining({ [individualPropName]: individualPropArr[i] }));
    }
  });

  it('handles empty individual and common props object', () => {
    const testDataArr = [
      { id: 'testId1' },
    ];

    const { listData } = setup({
      componentProps: {
        dataPropName: 'testData',
        dataArr: testDataArr,
        individual: {},
        common: {},
      },
    });
    expect(listData.find('.data-list').length).toBe(1);
  });

  it('renders a loading icon when isLoading is true', () => {
    let isLoading = false;
    const { listData } = setup({ isLoading });
    expect(listData.find('.loading-squares').length).toBe(0);

    isLoading = true;
    listData.setProps({ isLoading });
    expect(listData.find('.loading-squares').length).toBe(1);
  });

  describe('load error message', () => {
    const hasErrored = true;
    const loadErrorMsg = 'test load error message';

    it('is rendered when loadErrorMsg is set and hasErrored is true', () => {
      const { listData } = setup({ hasErrored, loadErrorMsg });
      expect(listData.find('.status-msg').length).toBe(1);
      expect(listData.find('.status-msg').text()).toBe(loadErrorMsg);
    });

    it('is not rendered when isLoading is true', () => {
      const isLoading = true;
      const { listData } = setup({ hasErrored, loadErrorMsg, isLoading });
      expect(listData.find('.status-msg').length).toBe(0);
    });
  });

  describe('no data message', () => {
    const noDataMsg = 'test no data message';

    it('is rendered when noDataMsg is set and dataArr is empty', () => {
      const { listData } = setup({ noDataMsg });
      expect(listData.find('.status-msg').length).toBe(1);
      expect(listData.find('.status-msg').text()).toBe(noDataMsg);
    });

    it('is not rendered when componentProps.dataArr is not empty', () => {
      const testDataArr = [{ id: 'testPost' }];
      const { listData } = setup({
        noDataMsg,
        componentProps: { dataPropName: 'testData', dataArr: testDataArr },
      });
      expect(listData.find('.status-msg').length).toBe(0);
    });

    it('is not rendered when isLoading is true', () => {
      const isLoading = true;
      const { listData } = setup({ noDataMsg, isLoading });
      expect(listData.find('.status-msg').length).toBe(0);
    });

    it('is not rendered when hasErrored is true', () => {
      const hasErrored = true;
      const { listData } = setup({ noDataMsg, hasErrored });
      expect(listData.find('.status-msg').length).toBe(0);
    });
  });
});
