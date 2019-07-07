import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import helper from './helper';

Vue.use(Router);

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
    },
    {
      path: '/search/:t?',
      name: 'search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/user/:user',
      name: 'user',
      component: () => import('./views/User.vue'),
      children:[
        {
          path: 'me',
          name: 'user.private',
          component: () => import('./views/User.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, nxt) => {
  // Checks whether API token is valid or not before going to a route
  let usrToken = helper.checkCookie();

  // If no token found then generate new one
  if(!usrToken){
    helper.generateToken(nxt);
    return false;
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