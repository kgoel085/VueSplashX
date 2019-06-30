import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import helper from './helper';

Vue.use(Vuex)

// Constant function to load usrCred
const usrCredDt = async (commit) => {
  if(!helper.getCookie(process.env.VUE_APP_LOGIN_KEY)){
    commit('setUsrDetails', false);
    return false;
  }
  await axios.get('/users/init/action/me').then(resp => {
    if(resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success')){
      // Set the received object in store
      commit('setUsrDetails', resp.data.success.data);
    }
  }).catch(err => {
    commit('setApiErr', 'Invalid login. Please try again');
    commit('setUsrDetails', false);
  });
}

export default new Vuex.Store({
  state: {
    // Stores the API token 
    token: null,

    // Stores the error messages
    tokenErr: null,

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

    // User login token
    usrDetails: false
  },
  mutations: {
    // Set API token
    setToken(state, tkn = null){
      if(tkn) state.tokenErr = null;
      state.token = tkn;
    },

    // Removes the current API token value and set error msg, if received
    removeToken(state, msg){
      state.token = null;

      if(msg) state.tokenErr = msg;
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

    // Set user token
    setUsrDetails(state, val = false){
      state.usrDetails = val;
    }
  },
  actions: {
    getUsrDetails({commit}){
      usrCredDt(commit);
    }
  }
})
