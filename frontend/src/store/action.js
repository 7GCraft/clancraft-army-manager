import axios from 'axios';
import { sortObjectKeys } from '@/helper';
export default {
  async getStateData(context) {
    const response = await axios.get(
      process.env.VUE_APP_GET_STATE_LIST_URL
    );
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

    await axios.post(process.env.VUE_APP_ADD_NEW_STATE_URL, {
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

    await axios.post(process.env.VUE_APP_DELETE_STATE_URL, {
      armyMap: payload,
      armyData: payload,
      currency: payload,
    });
  },
};
