import Axios from 'axios';
import store from './store';

let helper = {
    cookieVal: false,
    // Return cookie value based on provided name
    getCookie: (name = false) => {
        let returnVal = false;
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match && match.hasOwnProperty(2)) returnVal = match[2];
        
        return returnVal;
    },

    // Generates token if expired or not available
    generateToken: async function(nxtFunc){
        if(this.checkCookie() && !nxtFunc) return true;
        let loginDt = {account: process.env.VUE_APP_ACCOUNT};
        await Axios.post('/generateToken', loginDt).then(resp => {
            if(resp.data.success){
                let tokenVal = this.getCookie(process.env.VUE_APP_TOKEN_KEY);
                if(tokenVal) store.commit('setToken', tokenVal);
            
                if(nxtFunc) nxtFunc();
            }
        }).catch(error => {
            store.commit('removeToken', 'Error in connection.');

            if(nxtFunc) nxtFunc(false);
        });
    },

    // Checks whether cookie is available or not
    checkCookie: function(call = false){
        // Check for token
        let cName = (call === false) ? process.env.VUE_APP_TOKEN_KEY : process.env.VUE_APP_LOGIN_KEY;
        let setC = (call === false) ? 'setToken' : 'setLogin';

        let usrToken = (store.state.token) ? store.state.token : false;
        let cook = this.getCookie(cName);

        if(cook && !usrToken){
            store.commit(setC, cook);
            return true;
        }

        store.commit(setC, null);
        return false;
    },

    // Initiaite the login process
    initLogin: function(){
        Axios.get('/initLogin').then(resp => {
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
          }
        }).catch(err => {
          store.commit('setApiErr', err.message);
        });
      }
};

export default helper;