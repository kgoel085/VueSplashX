<template>
    <div class="collection">
        <v-container fluid class="pa-1" :disabled="!apiKey">
            <v-layout row wrap v-if="data.length > 0">
                <Collection v-for="(object, indx) in data" :key="indx" :obj="object"></Collection>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import Collection from '../components/Collection';

export default {
    data(){
        return {
            data:[],
            params: {
                page: 1,
				per_page: 20,
				order_by: 'latest',
                total_pages: 0,
                featured: true
            }
        }
    },
    components:{
        Collection
    },
    methods:{
        getCollections(){
            let vm = this;
            axios.get('/collections', {params: vm.params}).then(resp => {
                let vm = this;
                let data = resp.data.success.data;

                // Check for pagination info
                if(resp.data.success.hasOwnProperty('extra_info')){
                    let pgInfo = resp.data.success.extra_info.pagination;
                    if(pgInfo.hasOwnProperty('page')) vm.params.page = pgInfo.page;
                }

                if(data.length > 0){
                    data.forEach(element => {
                        vm.data.push(element);
                    });
                }

            }).catch(error => {
                this.$store.commit('setApiErr', error.message);
            });
        }
    },
    mounted(){
        let vm = this;
        if(this.apiKey) this.getCollections();

        // On scroll, call next batch
        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !vm.tokenExpired) vm.getCollections();
        };
    }
}
</script>

<style>

</style>
