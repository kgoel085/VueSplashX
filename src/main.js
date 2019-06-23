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

  // If session storage is avaialble
  if(sessionStorage.getItem('usto')) config.headers['X-USRR-CRED'] = sessionStorage.getItem('usto');
  
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
        returnVal.origHeight = mainObj.height;
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
    },
    // Get the session val for usrCred 
    userCred(){
      let val = (sessionStorage.getItem('usto')) ? sessionStorage.getItem('usto') : false;
      if(val){
        //Set in store for global access
        store.dispatch('getUserDetails', {value: val, key: this.apiKey});
        return val;
      }
      return false;
    }
  },
  methods:{
    // Initiaite the login process
    initLogin(){
      let vm = this;
      axios.get('/initLogin').then(resp => {
        let data = (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success')) ? resp.data.success : false;
        if(data){
          // Redirect URL
          let port = (window.location.port) ? window.location.port : 80;
          let loginUrl = window.location.protocol+'//'+window.location.hostname+':'+port+'/login';
          data['redirect_uri'] = loginUrl;

          let params = [];
          for(let key of Object.keys(data)){
              let str = ((key == 'cd') ? 'client_id' : key) +'='+data[key];
              params.push(str);
          }

          let scopes = ['public','read_user','read_photos','read_collections'].join('+');

          params = (params.length > 0) ? '?'+params.join('&') : '?';

          let newWindow = window.open('https://unsplash.com/oauth/authorize'+params+'&scope='+scopes, 'vuesplashlog','_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
          newWindow.onbeforeunload = function(){ 
            if(this.token) sessionStorage.setItem('usto', this.token);
          };
        }
      }).catch(err => {
        this.$store.commit('setApiErr', err.message);
      });
    }
  }

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
