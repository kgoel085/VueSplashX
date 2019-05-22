import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Axios from 'axios'

Vue.use(Router);

// Generates a new API token 
const generateToken = async (nxtFunc) => {
  let loginDt = {email: process.env.VUE_APP_EMAIL, password: process.env.VUE_APP_PASSWORD, account: process.env.VUE_APP_ACCOUNT};
  await Axios.post('/generateToken', loginDt).then(resp => {
    if(resp.data.success.token){
      localStorage.setItem(process.env.VUE_APP_TOKEN_KEY, resp.data.success.token);
      nxtFunc();
    }
  }).catch(error => {
    store.commit('removeToken', 'Error in connection.');

    nxtFunc(false);
  });
};

let router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

// Checks whether API token is valid or not before going to a route
router.beforeEach((to, from, nxt) => {
  let usrToken = localStorage.getItem(process.env.VUE_APP_TOKEN_KEY);

  if(!usrToken){

    // Generate new token, if no token found 
    generateToken(nxt);
    return false;

  }else{
    //Extract token vars
    let tmpVars = JSON.parse(atob(usrToken.split('.')[1]));
    if(tmpVars){

      //Check the expiry time
      let currentTime = (new Date().getTime() / 1000).toFixed(0);
  
      // If expired
      if(currentTime > tmpVars.exp){

        //Remove current & generate new one
        store.commit('removeToken');
        generateToken(nxt);

        return false;
      }
    }
  }
  
  nxt();
});

export default router