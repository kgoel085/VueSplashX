<template>
    <v-layout align-center class="user_page">
        
    </v-layout>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            callPoints: {
                user: {data: false},
                portfolio: {data: false},
                photos: {data: false, params: {total: 0, page: 1}},
                collections: {data: false, params: {total: 0, page: 1}},
                likes: {data: false, params: {total: 0, page: 1}},
                statistics: {data: false},
            },
            currentWindow: 0
        }
    },
    computed:{
        // User name received
        username(){
            if(this.$route.params.user) return this.$route.params.user.replace('@', '');
            return false;            
        }
    },
    methods:{
        // Fetches main details for the user
        async fetchData(callPoint = false){
            if(callPoint === false || !this.callPoints.hasOwnProperty(callPoint)) return false;

            // Extract action and data from current callPoint object
            let {action: action, data: endData} = this.callPoints[callPoint];
            action = (action !== undefined) ? `/action/${action}` : '';

            // Endpoint to hit
            let endpoint = `/users/${this.username}${action}`;

            await axios.get(endpoint).then(function(resp){
                if(resp.data.hasOwnProperty('success')){
                    endData = resp.data.success.data;
                }
            }.bind(this)).catch(err => {
                this.$store.commit('setApiErr', err.message);
            });
        },

        // Fetches all the other information like photos, collections etc
        async getData(){
            if(!this.username) return false;
            await axios.get(`/users/${this.username}/details`).then(resp => {
                let data = (resp.data.hasOwnProperty('success')) ? resp.data.success : false;
                if(data){

                    // Loop through each action item
                    Object.keys(data).forEach(section => {
                        //If some data is there , store it
                        if(Object.keys(data[section]).length > 0 && this.callPoints.hasOwnProperty(section) && data[section].hasOwnProperty('data')){
                            this.callPoints[section]['data'] = data[section]['data'];
                        }
                    });
                }
            }).catch(err => {
                this.$store.commit('setApiErr', err.message);
            })
        }
    },
    mounted(){
        this.getData();
    }
}
</script>

<style>

</style>
