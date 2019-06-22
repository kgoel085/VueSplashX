<template>
    <loader></loader>
</template>

<script>
import loader from '@/components/Loader';
import axios from 'axios';

export default {
    data(){
        return {
            
        }
    },
    components:{
        loader
    },
    computed:{
        authCode(){
            if(this.$route.query.code) return this.$route.query.code; 
            return false;
        }
    },
    methods:{
        // Get user details from auth code
        getCode(){
            axios.post('/oauth', {code: this.authCode},{withCredentials: true}).then(resp => {
                if(resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success')){
                    window.close();
                }
            }).catch(err => {
                
            });
        }
    },
    beforeCreate(){
        // Hide navbar before mounting
        this.$store.commit('hideNav', false);
    },
    mounted(){
       if(this.authCode) this.getCode();
       else{this.$store.commit('removeToken');this.$router.push({name: 'home', force: true});}
       //if(this.authCode) document.getElementById('test').submit();
    },
    beforeDestroy(){
        // Hide navbar before mounting
        this.$store.commit('hideNav', true);
    }
}
</script>

<style>

</style>
