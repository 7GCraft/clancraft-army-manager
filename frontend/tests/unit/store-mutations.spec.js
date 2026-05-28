import mutations from '@/store/mutation';

describe('Vuex mutations', () => {
  test('replace state slices with provided values', () => {
    const state = {
      armyList: {},
      currencyList: {},
      stateList: {},
      stateMap: {},
      unitList: [],
    };

    mutations.setArmyList(state, { army: true });
    mutations.setCurrencyList(state, { gold: 10 });
    mutations.setStateList(state, { state: true });
    mutations.setStateMap(state, { map: true });
    mutations.setUnitList(state, [{ ID: 'U1' }]);

    expect(state).toEqual({
      armyList: { army: true },
      currencyList: { gold: 10 },
      stateList: { state: true },
      stateMap: { map: true },
      unitList: [{ ID: 'U1' }],
    });
  });
});
