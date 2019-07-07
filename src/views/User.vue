<template>
    <span>Test USer Component - {{ username }}</span>
</template>

<script>
import axios from 'axios';
import { close } from 'fs';

export default {
    data(){
        return {
            callPoints: {
                user: {data: false},
                portfolio: {action: 'portfolio', data: false},
                photos: {action: 'photos', data: false},
                collections: {action: 'collections', data: false},
                liked: {action: 'liked', data: false},
                statistics: {action: 'statistics', data: false},
            }
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
        getData(){
            let callPoints = Object.keys(this.callPoints);
            for(const point of callPoints){
                const data = this.fetchData(point);
                if(data) continue;
            }
        }
    },
    mounted(){
        this.getData();
    }
}
</script>

<style>

</style>
