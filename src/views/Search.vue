<template>
   <v-layout row wrap>
        <v-flex xs12 v-if="searchQry">
            <v-tabs centered icons-and-text color="primary" v-model="currentTab" mandatory>
                <v-tabs-slider color="white"></v-tabs-slider>

                <v-tab v-for="(tab, indx) in dataObj" :key="indx" :href="'#tab-'+indx" class="white--text">
                    {{ tab.title }}
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-tab>

                <v-tab-item v-for="(tab, indx) in dataObj" :key="indx" :value="'tab-'+indx" lazy>
                    <template></template>
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

export default {
    data(){
        return {
            dataObj: {
                photos: {data: [], params: {}, icon: 'insert_photo', title: 'Photos', component: 'Photos'}, 
                colelction: {data: [], params: {}, icon: 'collections', title: 'Collections'}, 
                users: {data: [], params: {}, icon: 'people', title: 'Users'}, 
            },
            currentTab: null
        }
    },
    components:{
        Loader
    },
    computed:{
        searchQry(){
            if(this.$route.query.hasOwnProperty('t') && this.$route.query.t) return this.$route.query.t;
            return false;
        }
    }
}
</script>

<style>

</style>
