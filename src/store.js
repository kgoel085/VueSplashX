import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Stores the API token 
    // token: localStorage.getItem(process.env.VUE_APP_TOKEN_KEY),
    token: null,

    // Stores the error messages
    tokenErr: null,

    // Show hide side bar
    showSideBar: false,

    // Shows loader in between request cycles
    reqLoading: false,

    // Stores any error in API request
    apiErr: null
  },
  mutations: {
    // Set API token
    setToken(state, tkn){
      if(tkn){
        state.token = tkn;
        state.tokenErr = null;
      }
    },

    // Removes the current API token value and set error msg, if received
    removeToken(state, msg){
      //localStorage.removeItem(process.env.VUE_APP_TOKEN_KEY);
      state.token = null;

      if(msg) state.tokenErr = msg;
    },

    // Show / Hide sidebar
    setSideBar(state, sideBar = false){
      state.showSideBar = sideBar;
    },

    // Show hide API request laoder
    setReqLoader(state, reqStat = false){
      state.reqLoading = reqStat;
    },

    // Set API error 
    setApiErr(state, err = null){
      if(err && state.reqLoading) state.reqLoading = false;
      state.apiErr = err;
    }
  },
  actions: {

  }
})
