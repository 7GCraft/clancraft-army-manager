import axios from 'axios';
import { sortObjectKeys } from '@/helper';
export default {
  async getStateData(context) {
    const response = await axios.get('/api/get-state-list');
    const responseData = response.data;

    const { armyData, armyMap, currency } = responseData;
    console.log('gommanderev', responseData);

    context.commit('setStateList', armyData);
    context.commit('setStateMap', armyMap);
    context.commit('setCurrencyList', currency);
  },
  async addNewState(context, payload) {
    console.log('rasukardasu', payload);
    const newStateMap = sortObjectKeys(payload.stateMap);
    const newStateList = sortObjectKeys(payload.stateList);
    const newCurrencyList = sortObjectKeys(payload.currency);

    context.commit('setStateList', newStateList);
    context.commit('setStateMap', newStateMap);
    context.commit('setCurrencyList', newCurrencyList);

    await axios.post('/api/add-new-state', {
      armyMap: newStateMap,
      armyData: newStateList,
      currency: newCurrencyList,
    });
  },
  async deleteState(context, payload) {
    let newStateMap = context.getters.getStateMap;
    let newStateList = context.getters.getStateList;
    let newCurrencyList = context.getters.getCurrencyList;

    delete newStateList[payload];
    delete newStateMap[payload];
    delete newCurrencyList[payload];

    context.commit('setStateList', newStateList);
    context.commit('setStateMap', newStateMap);
    context.commit('setCurrencyList', newCurrencyList);

    await axios.post('/api/delete-state', {
      armyMap: payload,
      armyData: payload,
      currency: payload,
    });
  },
};
