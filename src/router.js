import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Axios from 'axios'

Vue.use(Router);

// Get cookie based from name
const getCookie = (name = false) => {
  let returnVal = false;
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match && match.hasOwnProperty(2)) returnVal = match[2];
  
  return returnVal;
};

// Generates a new API token 
const generateToken = async (nxtFunc) => {
  let loginDt = {email: process.env.VUE_APP_EMAIL, password: process.env.VUE_APP_PASSWORD, account: process.env.VUE_APP_ACCOUNT};
  await Axios.post('/generateToken', loginDt).then(resp => {
    if(resp.data.success){
      let tokenVal = getCookie(process.env.VUE_APP_TOKEN_KEY);
      if(tokenVal) store.commit('setToken', tokenVal);
      
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
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('./views/Collection.vue')
    },
    {
      path: '/collections/:id',
      name: 'collections.single',
      component: () => import('./views/SingleCollection.vue')
    }
  ]
})

router.beforeEach((to, from, nxt) => {
  // Checks whether API token is valid or not before going to a route
  let usrToken = store.state.token;
  let cook = getCookie(process.env.VUE_APP_TOKEN_KEY);

  if(cook && !usrToken){
    store.commit('setToken', cook);
    usrToken = cook;
  } 

  if(!usrToken){

    // Generate new token, if no token found 
    generateToken(nxt);
    return false;

  }else{
    //Extract token vars
    //let tmpVars = JSON.parse(atob(usrToken.split('.')[1]));
    // if(tmpVars){

    //   //Check the expiry time
    //   let currentTime = (new Date(new Date(Date.now() + (5 * 60 * 1000))).getTime() / 1000).toFixed(0);
  
    //   // If expired
    //   if(currentTime > tmpVars.exp){

    //     //Remove current & generate new one
    //     store.commit('removeToken');
    //     generateToken(nxt);

    //     return false;
    //   }
    // }
  }

  // Reset API error msg before hitting API request
  if(store.state.apiErr) store.commit('setApiErr', null);
  
  nxt();
});

router.afterEach((to, frm) => {
  //Check if side navbar is open or not
  let navStat = store.state.showSideBar;
  if(navStat) store.commit('setSideBar', !navStat);

  if(store.state.showPic) store.commit('showPictureId', null);
});

export default router