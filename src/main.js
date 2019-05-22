import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

//Axios default configurations
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.common['Accepts'] = 'application/json';

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
