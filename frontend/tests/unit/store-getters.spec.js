import getters from '@/store/getters';

describe('Vuex getters', () => {
  test('return values from state', () => {
    const state = {
      armyList: { army: true },
      currencyList: { gold: 10 },
      stateList: { state: true },
      stateMap: { map: true },
      unitList: [{ ID: 'U1' }],
    };

    expect(getters.getArmyList(state)).toBe(state.armyList);
    expect(getters.getCurrencyList(state)).toBe(state.currencyList);
    expect(getters.getStateList(state)).toBe(state.stateList);
    expect(getters.getStateMap(state)).toBe(state.stateMap);
    expect(getters.getUnitList(state)).toBe(state.unitList);
  });
});
