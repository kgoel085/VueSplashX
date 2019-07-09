<template>
    <v-layout class="user_page" fill-height align-center justify-center row wrap>

        <!-- User Block -->
        <v-flex xs12 fill-height align-self-center v-if="callPoints.user.data">
            <v-card flat :height="getHeight(30)+'px'" class="pa-3">
                <v-layout row>
                    <v-flex xs12 sm12 md2 lg2 xl2 offset-md4 offset-lg4>
                        <v-avatar :size="getHeight(80, getHeight(30))+'px'">
                            <v-img :src="callPoints.user.data.profile_image.large" :lazy-src="`https://picsum.photos/10/6?image`" aspect-ratio="1" class="white lighten-2 pa-4" height="100%">
                                <template v-slot:placeholder>
                                <Loader></Loader>
                                </template>
                            </v-img>
                        </v-avatar>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6 xl6>
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">Test User</div>
                            </div>
                        </v-card-title>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
import Loader from '@/components/Loader';

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
    components:{
        Loader
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
        },

        // Returns a specific percent of available height or given height
        getHeight(percent = 100, specificHeight = 0){
            if(!percent || parseInt(percent) === 0) percent = 100;

            let totalHeight = (specificHeight || parseInt(specificHeight) === true) ? specificHeight : this.dimensionObj.origHeight;
            return (totalHeight * percent) / 100;
        }
    },
    mounted(){
        this.getData();
    }
}
</script>

<style>
    
</style>
