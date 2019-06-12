<template>
    <div class="singleCollection">
        <v-container fluid class="pa-1" :disabled="!apiKey">
            <v-layout row wrap v-if="data !== null">
                <v-flex xs12 >
                    
                </v-flex>

                <v-flex xs12 v-if="picData.length > 0">
                    <v-layout row wrap>
                        <Picture v-for="(colData,indx) in picData" :details="colData" :key="indx"></Picture>
                    </v-layout>
                </v-flex>
                
            </v-layout>
            <Loader v-else></Loader>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import Picture from '@/components/Picture';
import Loader from '@/components/Loader';

export default {
    data(){
        return {
            data:null,
            picData: [],
            params: {
                page: 1,
                per_page: 15
            }
        }
    },
    components:{
        Picture,
        Loader
    },
    computed:{
        queryId(){
            if(this.$route.params.id) return this.$route.params.id;
            return null;
        }
    },
    methods:{
        // Get collection related data
        getCollectionDetails(){
            if(!this.queryId) return false;

            let vm = this;
            
            axios.get('/collections/'+this.queryId).then(resp => {
                let vm = this;
                let data = resp.data.success.data;

                if(data){
                    vm.data = data;
                    vm.getCollectionPhotos();
                }
            }).catch(err => {
               this.$store.commit('setApiErr', err.message);
            });
        },

        // Get colelction related photos
        getCollectionPhotos(){
            if(!this.queryId) return false;

             axios.get('/collections/'+this.queryId+'/photos').then(resp => {
                let vm = this;
                let data = resp.data.success.data;

                // Check for pagination info
                if(resp.data.success.hasOwnProperty('extra_info')){
                    let pgInfo = resp.data.success.extra_info.pagination;
                    if(pgInfo.hasOwnProperty('page')) vm.params.page = pgInfo.page;
                }

                if(data.length > 0){
                    data.forEach(element => {
                        vm.picData.push(element);
                    });
                }
            }).catch(err => {
               this.$store.commit('setApiErr', err.message);
            });
        }
    },
    mounted(){
        if(this.queryId && this.apiKey) this.getCollectionDetails();
    }
}
</script>

<style>

</style>
