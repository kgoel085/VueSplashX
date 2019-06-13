<template>
    <v-layout wrap row class="liveStat" ref="liveStat">
        <v-flex xs12 align-self-center class="pa-0 ma-0 text-xs-center">
            <v-icon @click="showBox = !showBox" hover class="dragHandle jump" size="40" color="white">drag_handle</v-icon>
        </v-flex>
        <v-slide-y-reverse-transition>
            <v-layout row wrap v-show="showBox" class="px-2 pb-1">
                <v-flex xs12>
                    <v-tabs v-model="activeTab" slider-color="primary" fixed-tabs show-arrows>
                        <v-tab v-for="tab in tabArr" :key="tab.id">
                            {{ tab.title }}
                        </v-tab>

                        <v-tabs-items v-model="activeTab">
                            <v-tab-item v-for="tab in tabArr" :key="tab.id">
                                <v-card flat >
                                    <Loader v-if="currentTabDt.length == 0"></Loader>
                                    <template v-if="activeTab == 0 && currentTabDt.length > 0">
                                        <!-- Collection slider -->
                                        <v-carousel :height="300" hide-delimiters :interval="3000">
                                            <v-carousel-item v-for="(item,i) in currentTabDt" :key="i">
                                                <v-card tile light class="px-2">
                                                    <v-img :src="item.cover_photo.urls[dimensionObj.imgType]" :height="210" ></v-img>

                                                    <v-card-title primary-title>
                                                        <div>
                                                            <div class="headline">{{ item.title }}</div>
                                                            <span class="grey--text" v-if="item.total_photos">Total photos: {{ item.total_photos }}</span>
                                                        </div>
                                                    </v-card-title>
                                                </v-card>
                                            </v-carousel-item>
                                        </v-carousel>
                                    </template>

                                    <!-- Photographers -->
                                    <template v-if="activeTab == 1 && currentTabDt.length > 0">
                                         <v-tabs
                                            light
                                            grow
                                            slider-color="secondary"
                                            show-arrows
                                        >
                                            <v-tab v-for="(item,i) in currentTabDt" :key="i">
                                                <v-list-tile class="grow">
                                                    <v-list-tile-avatar color="grey darken-3">
                                                        <v-img
                                                            class="elevation-6"
                                                            :src="item.profile_image.medium"
                                                        ></v-img>
                                                    </v-list-tile-avatar>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-tab>
                                        </v-tabs>
                                    </template>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </v-flex>
            </v-layout>
        </v-slide-y-reverse-transition>
    </v-layout>
</template>

<script>
import Loader from '@/components/Loader';
import axios from 'axios';

export default {
    data(){
        return {
            showBox: false,
            activeTab: null,
            tabArr:[
                {title: 'Top Collections', id: 'collections', key: 'collectionBlock'},
                {title: 'Top Photographers', id: 'photographers', key: 'photographerBlock'},
                //{title: 'Stats', id: 'stats', key: 'statBlock'},
            ],
            dataObj:{
                collectionBlock:[],
                photographerBlock: [],
                statBlock: []
            }
        }
    },
    components:{
        Loader
    },
    watch:{
        showBox(val){
            if(val && this.apiKey && this.currentTabDt.length == 0) this.getData();
            let elem = document.querySelector('.dragHandle');
            if(elem){
                if(val){
                    if(elem.classList.contains('jump')) elem.classList.remove('jump');
                }else{
                    if(!elem.classList.contains('jump')) elem.classList.add('jump');
                }
            }
        }
    },
    computed:{
        currentTabDt(){
            let returnVal = [];
            if(this.activeTab !== null) returnVal = this.dataObj[this.tabArr[this.activeTab].key];
            
            return returnVal;
        }
    },
    methods:{
        getData(){
            let vm = this;

            // Get featured collection & photographers
            axios.get('/collections/featured', {params: {per_page: 9}}).then(resp => {
                let respData = resp.data.success.data;

                if(respData.length > 0){
                    respData.forEach(element => {
                        // Get user info
                        if(element.hasOwnProperty('user')) vm.dataObj.photographerBlock.push(element.user);

                        // Get collection info
                        vm.dataObj.collectionBlock.push(element);
                    });
                }
            }).catch(error => {
                this.$store.commit('setApiErr', error.message);
            });
        }
    }
}
</script>

<style>
    .liveStat{
        position: fixed;
        bottom:0;
        left: 0;
        right: 0;
        z-index:99999
    }

    .liveStat .spinner{
        margin: 0px auto !important;
    }

    .liveStat .dragHandle.jump{
        animation-name: jump;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        cursor: pointer;
    }

    @keyframes jump {
    from, 20%, 53%, 80%, to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
    }

    40%, 43% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        -webkit-transform: translate3d(0, -30px, 0);
        transform: translate3d(0, -30px, 0);
    }

    70% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        -webkit-transform: translate3d(0, -15px, 0);
        transform: translate3d(0, -15px, 0);
    }

    90% {
        -webkit-transform: translate3d(0,-4px,0);
        transform: translate3d(0,-4px,0);
    }
    }

    .jump {
    -webkit-animation-name: bounce;
    animation-name: bounce;
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
    }
</style>
