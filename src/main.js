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
    },

    // Global obj to configure image related properties
    dimensionObj(){
      let mainObj = this.$vuetify.breakpoint;
      let returnVal = {
        height: 0,
        size: 12,
        breakpoint: mainObj.name,

        // full - Returns img with max resolution
        // regular - Returns img with width of 1080p
        // small - Returns img with width of 400p
        // thumb - Returns img with width of 200p
        // raw - Returns raw img that can be altered with custom dimensions
        imgType: 'small'
      };
      
      // Image height
      if(mainObj.height) returnVal.height = mainObj.height;

      // Manage size & breakpoint
      switch(mainObj.name){
        
        // xs - Less than 600 px
        // sm - Less than 960 px
        // md - Less than 1264 px
        // lg - Less than 1904 px
        // xl - Greater than 1904 px

        case 'xs':
        case 'sm':

        break;

        case 'md':
        case 'lg':
          returnVal.size = 4;
        case 'xl':
          returnVal.size = 4;
          returnVal.height = returnVal.height / 2;
          returnVal.imgType = 'full';
        break;
      }


      return returnVal;
    }
  }

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
