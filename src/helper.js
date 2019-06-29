import Axios from 'axios';
import store from './store';
import router from './router';

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
        let loginDt = {email: process.env.VUE_APP_EMAIL, password: process.env.VUE_APP_PASSWORD, account: process.env.VUE_APP_ACCOUNT};
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

    checkCookie: function(){
        // Check for token
        let usrToken = (store.state.token) ? store.state.token : false;
        let cook = this.getCookie(process.env.VUE_APP_TOKEN_KEY);

        if(cook && !usrToken){
            store.commit('setToken', cook);
            return true;
        }

        store.commit('setToken', null);
        return false;
    }
};

export default helper;