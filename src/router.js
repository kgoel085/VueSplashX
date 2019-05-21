import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

// Generates a new API token
const generateToken = async () => {
  await store.dispatch('generateToken');
};

// Check if token is expired or not , if yes, clear previous one and get new one
const checkToken = async() => {
  let tmpVars = (localStorage.getItem('jTokn')) ? JSON.parse(atob(localStorage.getItem('jTokn').split('.')[1])) : false;

  if(tmpVars){
    //Check the expiry time
    let currentTime = (new Date().getTime() / 1000).toFixed(0);

    // If expired
    if(currentTime > tmpVars.exp){
      //Remove current & generate new one
      store.commit('removeToken');
      await generateToken();
    }
  }
};

let router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
  let usrToken = localStorage.getItem('jTokn');
  
  if(!usrToken) generateToken();
  else checkToken();

  nxt();
});

export default router