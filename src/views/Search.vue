<template>
   <v-layout row wrap class="searchPage">
        <v-flex xs12 v-if="searchQry">
            <v-tabs centered icons-and-text color="primary" v-model="currentTab" mandatory fixed>
                <v-tabs-slider color="white"></v-tabs-slider>

                <v-tab v-for="(tab, indx) in dataObj" :key="indx" :href="'#tab-'+indx" class="white--text">
                    {{ tab.title }}
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-tab>

                <v-tab-item v-for="(tab, indx) in dataObj" :key="indx" :value="'tab-'+indx" lazy>
                    <Loader v-if="!tab.hasOwnProperty('component') && tab.data.length == 0"></Loader>
                    <v-layout row wrap v-else :id="'tab-'+indx">

                        <!-- No result or any error block -->
                        <template v-if="typeof tab.data == 'object' && tab.data.hasOwnProperty('error')">
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
                            <template v-if="indx !== 'users'">
                                <!-- Photos, Collection tabs -->
                                <component v-for="(data, indx) in tab.data" :key="indx" :is="tab.component" :obj="data"></component>
                            </template>
                            <template v-else>
                                <!-- User tabs -->
                                <v-flex xs12 class="pa-1 ma-1">
                                    <v-text-field
                                        placeholder="Filter User"
                                        color="white"
                                        clearable
                                        flat
                                        light
                                        class="px-4"
                                        v-model="searchText"
                                        @keyup="doSearch()"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-for="(data, indx) in tab.data" :key="indx" class="py-1 mt-1">
                                    <v-card flat :height="100">
                                    <User :obj="data" :userShow="true"></User>
                                    </v-card>
                                </v-flex>
                            </template>
                        </template>
                    </v-layout>
                    <!-- load next result page for current tab -->
                    <div class="text-xs-center">
                        <v-slide-y-transition>
                            <v-btn flat fixed bottom class="primary small elevation-6" v-if="showLoadMore && !pageEnd" @click="fetchData(indx)">Load More</v-btn>
                        </v-slide-y-transition>
                    </div>
                </v-tab-item>
            </v-tabs>
        </v-flex>
        <v-flex v-else>
            <v-tabs grow>
                <v-tab>
                    No Record found
                </v-tab>
            </v-tabs>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
import Loader from'@/components/Loader';
import Picture from '@/components/Picture';
import Collection from '@/components/Collection';
import User from '@/components/UserAvatar';

export default {
    data(){
        return {
            dataObj: {
                photos: {data: [], params: {page: 1, per_page: 20, total_pages: 0}, icon: 'insert_photo', title: 'Photos', component: 'Picture'}, 
                collections: {data: [], params: {page: 1, per_page: 10, total_pages: 0}, icon: 'collections', title: 'Collections', component: 'Collection'},
                users: {data: [], params: {page: 1, per_page: 50, total_pages: 0}, icon: 'people', title: 'Users', component: 'User'}, 
            },
            currentTab: null,
            scrollEvent: false,
            showLoadMore: false,
            searchText: null
        }
    },
    components:{
        Loader,
        Picture,
        Collection,
        User
    },
    methods:{
        // Fetches all the data, when component mounts or new value provided
        getData(reset = false){

            // Create param arr for searched sections
            let queryObj = {query: this.searchQry};
            Object.keys(this.dataObj).forEach(section => {
                queryObj[section] = this.dataObj[section].params;
            });

            // Get all the data for the searched query first time on page load
            axios.get('/search', {params: queryObj}).then(resp => {
                let data = (resp.data.hasOwnProperty('success') && Object.keys(resp.data.success).length > 0) ?resp.data.success : false;

                if(data){
                    Object.keys(data).forEach((section, indx) => {
                        let obj = (this.dataObj.hasOwnProperty(section)) ? this.dataObj[section] : false;
                        if(obj){
                            // Params to fetch next page result
                            obj['params']['page'] = 2;
                            obj['params']['total_pages'] = data.total_pages;

                            // Store the received data
                            let response = data[section]['data']['results'];
                            if(data[section]['data']['results'] && data[section]['data']['results'].length > 0) response.forEach(elem => obj['data'].push(elem));
                            else obj['data'] = {error: 'No results found !'};
                        }
                    });
                }
            }).catch(err => {
                this.$store.commit('setApiErr', err.message);
            });
        },

        // Add data to the called section initial load
        async fetchData(section = false){
            if(!section || !this.dataObj.hasOwnProperty(section)) return false;
            let obj = this.dataObj[section];

            await axios.get(`/search/${section}/${this.searchQry}`, {params: obj['params']}).then(function(resp){

                // Set dat in their relative objects
                if(resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success')){

                    // Hide load more button
                    if(this.showLoadMore) this.showLoadMore = false;

                    // Set Data
                    let data = (resp.data.hasOwnProperty('success') && resp.data.success.data.total > 0) ? resp.data.success.data.results : false;
                    if(data){
                        // First time call
                        if(obj['data'].length == 0) obj['data'] = data;

                        // Fetching new details
                        data.forEach(row => obj['data'].push(row));
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
                    } 
                }
            }.bind(this)).catch(err => {
                this.$store.commit('setApiErr', err.message);
            });
        },

        // Currently filter users
        doSearch(){
            let searchVal = (this.searchText) ? this.searchText.toLowerCase() : false;
            let parent = document.querySelector('#'+this.currentTab);
            let child = parent.querySelectorAll('.v-list__tile[data-user]');

            if(child) child = Array.from(child);

            if(child.length > 0){
                
                child.forEach(elem => {
                    let name = elem.getAttribute('data-user');
                    let parentNode = elem.parentElement.parentElement.parentElement;
                    if(name.indexOf(searchVal) > -1){
                        parentNode.style.display = "";
                    }else{
                        if(searchVal) parentNode.style.display = "none";
                        else parentNode.style.display = "";
                    }
                })
            } 
        }
    },
    watch:{
        // If search query is changed, trigger new update 
        searchQry(val){
            if(val) this.getData(true);
        }
    },
    computed:{
        // Returns the searched query
        searchQry(){
            if(this.$route.query.hasOwnProperty('t') && this.$route.query.t) return this.$route.query.t;
            return false;
        },
        // Check whether we have more pages to load or not from server
        pageEnd(){
            if(this.currentTab && this.dataObj[this.currentTab.replace('tab_', '')]){
                let obj = this.dataObj[this.currentTab.replace('tab_', '')];
                if(obj['params']['total_pages'] && obj['params']['page'] <= obj['params']['total_pages']) return true;
            }
            return false;
        }
    },
    mounted(){
        // Fetch all search data when component is created
        if(this.apiKey) this.getData();

        // On scroll,
        this.scrollEvent = () => {

            // Call next api batch after reaching end of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) this.showLoadMore = true;
            else this.showLoadMore = false;

            // Set search Tabs fixed on scroll
            let tabBar = document.querySelector('div.v-tabs__bar');
            if(tabBar && (window.scrollY > tabBar.clientHeight)){
                let fixedClass = tabBar.className.includes('fixed');
                if(!fixedClass) tabBar.classList.add('fixedBar');
            }else tabBar.classList.remove('fixedBar');
        };

        // On scroll, call next batch
        if(this.scrollEvent) window.addEventListener('scroll', this.scrollEvent);
    },
    beforeDestroy(){
        // Remove scroll event
        if(this.scrollEvent) window.removeEventListener('scroll', this.scrollEvent);
    }
}
</script>

<style>
    /* This fixes the header on the top after scroll */
    .searchPage .fixedBar{
        position:fixed !important;
        width: 100%;
        z-index:999999
    }
</style>
