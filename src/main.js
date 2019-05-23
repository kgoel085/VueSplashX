import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

//Axios default configurations
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.common['Accepts'] = 'application/json';

//Axios Interceptors
axios.interceptors.request.use(config => {
  // Start loading the request
  store.commit('setReqLoader', true);

  //Attach auth token in the headers
  if (store.state.token) config.headers.Authorization = `Bearer ${store.state.token}`;
    

  return config;
});

axios.interceptors.response.use(res => {
  // Finish the request
  store.commit('setReqLoader', false);
  
  return res;
});

Vue.config.productionTip = false

// Global vue mixin
Vue.mixin({

  computed:{

    // Returns API token 
    apiKey(){
      if(store.state.token) return store.state.token;
      return false;
    }
  }

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
