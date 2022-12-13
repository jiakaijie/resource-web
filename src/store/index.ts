import { createStore } from 'vuex';
import { getUserInfo, getAllUsersList } from '../api/login';


export default createStore({
  state: {
    user: {},
    allUserList: [],
  },
  mutations: {
    'USER': (state, data) => {
      state.user = data;
    },
    'ALL_USER_LIST': (state, data) => {
      state.allUserList = data;
    }
  },
  actions: {
    'GET_USER': async ({ commit }) => {
      const data = await getUserInfo();
      commit('USER', data);
    },
    'GET_ALL_USER': async ({ commit }) => {
      const data = await getAllUsersList();
      commit('ALL_USER_LIST', data);
    }
  },
  modules: {
  }
})
