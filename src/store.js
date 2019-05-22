import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Stores the API token 
    token: localStorage.getItem(process.env.VUE_APP_TOKEN_KEY),

    // Stores the error messages
    tokenErr: null
  },
  mutations: {

    // Removes the current API token value and set error msg, if received
    removeToken(state, msg){
      localStorage.removeItem(process.env.VUE_APP_TOKEN_KEY);
      state.token = null;

      if(msg) state.tokenErr = msg;
    }
  },
  actions: {

  }
})
