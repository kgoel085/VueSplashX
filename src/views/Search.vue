<template>
   <v-layout row wrap>
        <v-flex xs12 v-if="searchQry">
            <v-tabs centered icons-and-text color="primary" v-model="currentTab" mandatory fixed>
                <v-tabs-slider color="white"></v-tabs-slider>

                <v-tab v-for="(tab, indx) in dataObj" :key="indx" :href="'#tab-'+indx" class="white--text">
                    {{ tab.title }}
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-tab>

                <v-tab-item v-for="(tab, indx) in dataObj" :key="indx" :value="'tab-'+indx" lazy>
                    <Loader v-if="!tab.hasOwnProperty('component') && tab.data.length == 0"></Loader>
                    <v-layout row wrap v-else>
                        <component v-for="(data, indx) in tab.data" :key="indx" :is="tab.component" :obj="data"></component>
                    </v-layout>
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
// import User from '@/components/User';

export default {
    data(){
        return {
            dataObj: {
                photos: {data: [], params: {}, icon: 'insert_photo', title: 'Photos', component: 'Picture'}, 
                collections: {data: [], params: {}, icon: 'collections', title: 'Collections', component: 'Collection'},
                users: {data: [], params: {}, icon: 'people', title: 'Users'}, 
            },
            currentTab: null
        }
    },
    components:{
        Loader,
        Picture,
        Collection
    },
    methods:{
        // Fetches all the data
        getData(){
            // Get all the data for the searched query
            let photos = function(){return axios.get(`/search/photos/${this.searchQry}`)}.bind(this);
            let collections = function(){return axios.get(`/search/collections/${this.searchQry}`)}.bind(this);
            let users = function(){return axios.get(`/search/users/${this.searchQry}`)}.bind(this);

            axios.all([photos(), collections(), users()]).then(axios.spread(function(photos, collections, users){
                // Photos data
                if(photos.hasOwnProperty('data') && photos.data.hasOwnProperty('success')) this.fetchData('photos', photos.data.success.data.results);

                // Collections data
                if(photos.hasOwnProperty('data') && photos.data.hasOwnProperty('success')) this.fetchData('collections', collections.data.success.data.results);

                // Users data
                if(photos.hasOwnProperty('data') && photos.data.hasOwnProperty('success')) this.fetchData('users', users.data.success.data.results);

            }.bind(this)));
        },

        // Add data to the called sections
        fetchData(section = false, data = false){
            if(!section || !data) return false;

            if(this.dataObj[section]) data.forEach(row => this.dataObj[section]['data'].push(row));
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
    }
}
</script>

<style>

</style>
