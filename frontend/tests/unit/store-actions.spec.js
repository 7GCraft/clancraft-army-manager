import axios from 'axios';
import actions from '@/store/action';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('Vuex actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('getStateData fetches and commits state reference data', async () => {
    axios.get.mockResolvedValue({
      data: {
        armyData: { ST: 'State' },
        armyMap: { ST: 'state' },
        currency: { ST: 'Gold' },
      },
    });
    const context = { commit: jest.fn() };

    await actions.getStateData(context);

    expect(axios.get).toHaveBeenCalledWith('/api/get-state-list');
    expect(context.commit).toHaveBeenNthCalledWith(1, 'setStateList', { ST: 'State' });
    expect(context.commit).toHaveBeenNthCalledWith(2, 'setStateMap', { ST: 'state' });
    expect(context.commit).toHaveBeenNthCalledWith(3, 'setCurrencyList', { ST: 'Gold' });
  });

  test('addNewState sorts, commits, and posts reference data', async () => {
    axios.post.mockResolvedValue({});
    const context = { commit: jest.fn() };
    const payload = {
      currency: { z: 'Z', a: 'A' },
      stateList: { z: 'Z', a: 'A' },
      stateMap: { z: 'Z', a: 'A' },
    };

    await actions.addNewState(context, payload);

    const sorted = { a: 'A', z: 'Z' };
    expect(context.commit).toHaveBeenNthCalledWith(1, 'setStateList', sorted);
    expect(context.commit).toHaveBeenNthCalledWith(2, 'setStateMap', sorted);
    expect(context.commit).toHaveBeenNthCalledWith(3, 'setCurrencyList', sorted);
    expect(axios.post).toHaveBeenCalledWith('/api/add-new-state', {
      armyData: sorted,
      armyMap: sorted,
      currency: sorted,
    });
  });

  test('deleteState removes the state and posts delete payload', async () => {
    axios.post.mockResolvedValue({});
    const stateList = { ST: 'State', XX: 'Other' };
    const stateMap = { ST: 'state', XX: 'other' };
    const currencyList = { ST: 'Gold', XX: 'Silver' };
    const context = {
      commit: jest.fn(),
      getters: {
        getCurrencyList: currencyList,
        getStateList: stateList,
        getStateMap: stateMap,
      },
    };

    await actions.deleteState(context, 'ST');

    expect(context.commit).toHaveBeenNthCalledWith(1, 'setStateList', { XX: 'Other' });
    expect(context.commit).toHaveBeenNthCalledWith(2, 'setStateMap', { XX: 'other' });
    expect(context.commit).toHaveBeenNthCalledWith(3, 'setCurrencyList', { XX: 'Silver' });
    expect(axios.post).toHaveBeenCalledWith('/api/delete-state', {
      armyData: 'ST',
      armyMap: 'ST',
      currency: 'ST',
    });
  });
});
