<template>
   <v-layout row wrap>
        <v-flex xs12 v-if="searchQry">
            <v-tabs centered icons-and-text color="primary" v-model="currentTab" mandatory fixed>
                <v-tabs-slider color="white"></v-tabs-slider>

                <v-tab v-for="(tab, indx) in dataObj" :key="indx" :href="'#tab-'+indx" class="white--text" :disabled="tab.data.length == 0">
                    {{ tab.title }}
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-tab>

                <v-tab-item v-for="(tab, indx) in dataObj" :key="indx" :value="'tab-'+indx" lazy>
                    <Loader v-if="!tab.hasOwnProperty('component') && tab.data.length == 0"></Loader>
                    <v-layout row wrap v-else :id="'tab-'+indx">
                        <template v-if="indx !== 'users'">
                            <component v-for="(data, indx) in tab.data" :key="indx" :is="tab.component" :obj="data"></component>
                        </template>
                        <template v-else>
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
                    </v-layout>
                    <div class="text-xs-center">
                        <v-slide-y-transition>
                            <v-btn flat fixed bottom class="primary small elevation-6" v-if="showLoadMore && tab.data.length > 0 && (tab.params.page <= tab.params.total_pages)" @click="fetchData(indx)">Load More</v-btn>
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
        getData(){
            // Get all the data for the searched query
            Object.keys(this.dataObj).forEach(type => {
                // Empty all objects before calling all
                this.dataObj[type]['data'] = [];
                
                // Fetch the data for each single request
                this.fetchData(type);
            });
        },

        // Add data to the called sections
        async fetchData(section = false){
            if(!section || !this.dataObj.hasOwnProperty(section)) return false;
            let obj = this.dataObj[section];

            // Check if we have already reached last pagination page or not
            if(obj['params']['total_pages'] && obj['params']['page'] >= obj['params']['total_pages']){
                this.showLoadMore = false;
                return false;
            }

            await axios.get(`/search/${section}/${this.searchQry}`, {params: obj['params']}).then(function(resp){
                // Set dat in their relative objects
                if(resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success')){
                    // Hide load more button
                    if(this.showLoadMore) this.showLoadMore = false;
                    // Set Data
                    let data = (resp.data.hasOwnProperty('success')) ? resp.data.success.data.results : false;
                    if(data){
                        // First time call
                        if(obj['data'].length == 0) obj['data'] = data;

                        // Fetching new details
                        data.forEach(row => obj['data'].push(row));
                        
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
        searchQry(val){
            if(val) this.getData();
        }
    },
    computed:{
        searchQry(){
            if(this.$route.query.hasOwnProperty('t') && this.$route.query.t) return this.$route.query.t;
            return false;
        }
    },
    mounted(){
        if(this.apiKey) this.getData();

        // On scroll, call next batch
        this.scrollEvent = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) this.showLoadMore = true;
            else this.showLoadMore = false;
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

</style>
