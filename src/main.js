import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import helper from './helper';

//Axios default configurations
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.common['Accepts'] = 'application/json';
axios.defaults.withCredentials = true;

//Axios Interceptors
axios.interceptors.request.use(config => {
  // Start loading the request
  store.commit('setReqLoader', true);

  //Attach auth token in the headers
  //if (store.state.token) config.headers.Authorization = `Bearer ${store.state.token}`;
  if(helper.checkCookie() === false && config.url.indexOf('Token') < 0) helper.generateToken();

  // If session storage is available
  if(localStorage.getItem('usto')) config.headers['X-USRR-CRED'] = localStorage.getItem('usto');
  
  return config;
});

axios.interceptors.response.use(res => {
  // Finish the request
  store.commit('setReqLoader', false);

  // Clear error message
  if(store.state.apiErr) store.commit('setApiErr', null);
  
  return res;
});

Vue.config.productionTip = false

//Returns whole number in count format ( Million, Billion, Thousands etc )
Vue.filter('countNumber', (value = 0) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e+9

  ? (Math.abs(Number(value)) / 1.0e+9).toFixed(0) + " B"
  // Six Zeroes for Millions 
  : Math.abs(Number(value)) >= 1.0e+6

  ? (Math.abs(Number(value)) / 1.0e+6).toFixed(0) + " M"
  // Three Zeroes for Thousands
  : Math.abs(Number(value)) >= 1.0e+3

  ? (Math.abs(Number(value)) / 1.0e+3).toFixed(0) + " K"

  : Math.abs(Number(value));
});

// Global vue mixin
Vue.mixin({
  data(){
    return {
      
    }
  },
  computed:{

    // Returns API token 
    apiKey(){
      if(store.state.token) return store.state.token;
      return false;
    },

    //Login token
    usrToken(){
      if(helper.getCookie(process.env.VUE_APP_LOGIN_KEY)){
        if(!store.state.usrDetails) store.dispatch('getUsrDetails');
        return helper.getCookie(process.env.VUE_APP_LOGIN_KEY);
      }
      return false;
    },

    // Global obj to configure image related properties
    dimensionObj(){
      let mainObj = this.$vuetify.breakpoint;
      let returnVal = {
        height: 0,
        origHeight: 0,
        size: 4,
        breakpoint: mainObj.name,

        // full - Returns img with max resolution
        // regular - Returns img with width of 1080p
        // small - Returns img with width of 400p
        // thumb - Returns img with width of 200p
        // raw - Returns raw img that can be altered with custom dimensions
        imgType: 'small'
      };
      
      // Image height
      if(mainObj.height){
        returnVal.height = mainObj.height / 2;

        // Subtract header height
        let headerHeight = (document.querySelector('nav').clientHeight) ? mainObj.height - document.querySelector('nav').clientHeight : mainObj.height;
        returnVal.origHeight = headerHeight;
      }

      // Manage size & breakpoint
      switch(mainObj.name){
        
        // xs - Less than 600 px
        // sm - Less than 960 px
        // md - Less than 1264 px
        // lg - Less than 1904 px
        // xl - Greater than 1904 px

        case 'xs':
        case 'sm':
          returnVal.size = 12;
        break;

        case 'md':
        case 'lg':
          returnVal.imgType = 'regular';
        break;
        case 'xl':
          returnVal.imgType = 'full';
        break;
      }


      return returnVal;
    }
  },
  methods:{
    // Initiaite the login process
    initLogin(){
      helper.initLogin();
    }
  }

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
