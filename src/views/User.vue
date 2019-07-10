<template>
    <v-layout class="user_page" fill-height align-center justify-center row wrap>
        <!-- User Block -->
        <v-flex xs12 align-self-center v-if="dataObj.hasOwnProperty('user')">
            <v-card flat class="pa-3">
                <v-layout row wrap>
                    <v-flex xs12 sm3 md2 lg2 xl2 offset-sm2 offset-md2 offset-lg2 class="text-xs-center">
                        <v-avatar class="user_avatar" :size="getHeight(80, getHeight(30))+'px'">
                            <v-img :src="dataObj.user.profile_image.large" aspect-ratio="1" class="white lighten-2 pa-4" height="100%">
                                <template v-slot:placeholder>
                                <Loader></Loader>
                                </template>
                            </v-img>
                            <span class="badge secondary pa-1 elevation-5" v-if="dataObj.user.hasOwnProperty('badge') && dataObj.user.badge && dataObj.user.badge.title == 'Verified'">
                                <v-icon color="white">done_all</v-icon>
                            </span>
                        </v-avatar>
                    </v-flex>
                    <v-flex xs12 sm7 md6 lg6 xl6>
                        <v-card-title primary-title>
                            <div>
                                <h2 class="display-2 font-weight-bold">{{dataObj.user.name}}</h2>
                                <v-btn class="grey--text" color="transparent" @click="openWindow(dataObj.user.portfolio_url)" flat small v-if="dataObj.user.hasOwnProperty('portfolio_url') && dataObj.user.portfolio_url">
                                    <v-icon left>location_on</v-icon>
                                    {{ dataObj.user.portfolio_url }}
                                </v-btn>
                                <p v-if="dataObj.user.hasOwnProperty('bio')">
                                    {{ dataObj.user.bio }}
                                </p>
                            </div>
                        </v-card-title>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>

        <v-flex xs12 v-if="dataObj.hasOwnProperty('user') && Object.keys(dataObj.tab).length > 0">
            <v-tabs fixed-tabs centered v-model="currentTab">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab v-for="(data,indx) in dataObj['tab']" :key="indx" :disabled="data === false">
                    {{ `${indx} ( ${Object.keys(data).length} )` }} 
                </v-tab>
                <v-tab-item v-for="(data,indx) in dataObj['tab']" :key="indx" :disabled="data === false && data.hasOwnProperty('component')">
                    <v-layout row wrap>
                        <!-- No result or any error block -->
                        <template v-if="typeof data == 'object' && data.hasOwnProperty('error')">
                            <v-flex xs12 align-content-center="">
                                <v-card flat tile class="pa-3 ma-3 text-xs-center">
                                    <v-card-text>
                                       <p>
                                           <v-icon>face</v-icon>
                                       </p>
                                       <p>
                                           {{ tab.data.error }}
                                       </p>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </template>
                        <template v-else>
                            <!-- Photos, Collection tabs -->
                            <component v-for="(data, indx1) in data" :key="indx1" :is="callPoints[indx].component" :obj="data"></component> 
                        </template> 
                    </v-layout>

                    <!-- load next result page for current tab -->
                    <div class="text-xs-center">
                        <v-slide-y-transition>
                            <v-btn :loading="showLoading" flat fixed bottom class="primary small elevation-6" v-if="!pageEnd && showLoadMore" @click="fetchData(indx)">Load More</v-btn>
                        </v-slide-y-transition>
                    </div>
                </v-tab-item>
            </v-tabs>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
import Loader from '@/components/Loader';
import Picture from '@/components/Picture';
import Collection from '@/components/Collection';

export default {
    data(){
        return {
            callPoints: {
                user: {data: false},
                photos: {data: false, params: {total_pages: 0, page: 2}, component: 'Picture'},
                collections: {data: false, params: {total_pages: 0, page: 2}, component: 'Collection'},
                likes: {data: false, params: {total_pages: 0, page: 2}, component: 'Picture'},
                statistics: {data: false},
            },
            currentWindow: 0,
            currentTab: 0,
            scrollEvent: false,
            showLoadMore: false,
            showLoading: false
        }
    },
    components:{
        Loader,
        Picture,
        Collection
    },
    computed:{
        // User name received
        username(){
            if(this.$route.params.user) return this.$route.params.user.replace('@', '');
            return false;            
        },

        // Returns the object containing data for the mentioned call points $callPoints
        dataObj(){
            let returnVal = {
                tab: {}
            };

            Object.keys(this.callPoints).forEach(point => {
                let {data: pointData, params: params, component: comp} = this.callPoints[point];
                
                if(params) returnVal['tab'][point] = pointData;
                else returnVal[point] = pointData;
            });

            return returnVal;
        },

        // Check whether we have more pages to load or not from server
        pageEnd(){
            let objKeys = Object.keys(this.dataObj['tab']);
            if(this.dataObj['tab'].hasOwnProperty(objKeys[this.currentTab])){
                let obj = this.dataObj['tab'][objKeys[this.currentTab]];
                let {total_pages: total} = this.callPoints[objKeys[this.currentTab]]['params'];
                if(typeof obj == 'object' && obj.length <= total) return true;
            }
            return false;
        }
    },
    methods:{
        // Fetches main details for the user
        async fetchData(callPoint = false){
            if(callPoint === false || !this.callPoints.hasOwnProperty(callPoint)) return false;
            this.showLoading = true;

            // Endpoint to hit
            let endpoint = `/users/${this.username}/action/${callPoint}`;
            let obj = this.callPoints[callPoint];

            await axios.get(endpoint, {params: obj['params']}).then(function(resp){
                if(resp.data.hasOwnProperty('success')){
                    this.showLoading = false;
                    let endData = resp.data.success.data;

                    // Fetching new details
                    endData.forEach(row => obj['data'].push(row));
                }else{
                    // If no result found or any other error
                    obj['data'] = {error: 'No results found !'};
                }

                // Set pagination
                if(resp.data.success.hasOwnProperty('extra_info')){
                    let pgInfo = resp.data.success.extra_info.pagination;
                    Object.keys(obj['params']).forEach(key => {
                        if(pgInfo.hasOwnProperty(key)) obj['params'][key] = pgInfo[key];
                    });

                    this.showLoadMore = false;
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
        },

        // Open new window with given url
        openWindow(url){
            window.open(url);
        }
    },
    mounted(){
        this.getData();

        // On scroll,
        this.scrollEvent = () => {

            // Call next api batch after reaching end of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) this.showLoadMore = true;
            else this.showLoadMore = false;
        };

        // On scroll, call next batch
        if(this.scrollEvent) window.addEventListener('scroll', this.scrollEvent);
    }
}
</script>

<style>
    .user_page .user_avatar{
        position: relative;
    }

    .user_page .user_avatar > .badge{
        position: absolute;
        top: 0;
        right:0;
        border-radius: 100%
    }
</style>
