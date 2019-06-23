import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Stores the API token 
    token: null,

    // Stores the error messages
    tokenErr: null,

    // Show hide side bar
    showSideBar: false,

    // Shows loader in between request cycles
    reqLoading: false,

    // Stores any error in API request
    apiErr: null,

    // Show picture
    showPic: null,

    // If set, then picture details will be used from here, else showPic will be used
    picObj: null,

    // Hide navbar
    hideNav: true,

    // Stores the login user credentials
    loginCred: (sessionStorage.getItem('usto')) ? sessionStorage.getItem('usto') : false
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
    },

    // Set Picture id to show
    showPictureId(state, picId = null){
      state.showPic = picId;
    },

    // Store the current picture object
    setPicDetails(state, obj = null){
      state.picObj = obj
    },

    // hide navbar
    hideNav(state, val = false){
      state.hideNav = val;
    },

    //Set login cred from the SERVER
    setloginCred(state, val = false){
      state.loginCred = val;
    }
  },
  actions: {

  }
})
