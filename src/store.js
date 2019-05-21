import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('jTokn')
  },
  mutations: {
    setToken(state, usrTkn){
      if(usrTkn){
        localStorage.setItem("jTokn", usrTkn);
        state.token = usrTkn;
      }
    },
    removeToken(state){
      localStorage.removeItem("jTokn");
      state.token = null;
    }
  },
  actions: {
    // Generate JWT token and stores it in the local storage
    async generateToken({commit, state}){
      let loginDt = {email: process.env.VUE_APP_EMAIL, password: process.env.VUE_APP_PASSWORD, account: process.env.VUE_APP_ACCOUNT};
      await Axios.post('/generateToken', loginDt).then(resp => {
        if(resp.data.success.token) commit('setToken', resp.data.success.token);
      }).catch(error => {
        //console.log(error);
      });
    }
  }
})
