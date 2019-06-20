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
            axios.post('/oauth', {code: this.authCode}).then(resp => {
                
            }).catch(err => {
                console.log(err);
            });
        }
    },
    beforeCreate(){
        // Hide navbar before mounting
        this.$store.commit('hideNav', false);
    },
    mounted(){
       if(this.authCode) this.getCode();
       //if(this.authCode) document.getElementById('test').submit();
    }
}
</script>

<style>

</style>
