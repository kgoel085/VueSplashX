import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('jTokn'),
    tokenErr: null
  },
  mutations: {
    setToken(state, usrTkn){
      if(usrTkn){
        localStorage.setItem("jTokn", usrTkn);
        state.token = usrTkn;
      }
    },
    removeToken(state, msg){
      localStorage.removeItem("jTokn");
      state.token = null;

      if(msg) state.tokenErr = msg;
    }
  },
  actions: {
    // Generate JWT token and stores it in the local storage
    async generateToken({commit, state}){
      let loginDt = {email: process.env.VUE_APP_EMAIL, password: process.env.VUE_APP_PASSWORD, account: process.env.VUE_APP_ACCOUNT};
      await Axios.post('/generateToken', loginDt).then(resp => {
        if(resp.data.success.token) commit('setToken', resp.data.success.token);
      }).catch(error => {
        let errorMsg;

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var dataArr = error.response.data;

          if(typeof dataArr == 'object') errorMsg = 'Unable to connect to the server !';
          else errorMsg = dataArr.error;
        }else {
          // Something happened in setting up the request that triggered an Error
          errorMsg = error.message;
        }

        commit('removeToken', errorMsg);
      });
    }
  }
})
