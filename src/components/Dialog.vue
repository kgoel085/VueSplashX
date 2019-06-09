<template>
    <v-layout row justify-center class="picDialog">
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" light full-width max-width="90%" :loading="loading" @input="v = v || hideDialogBox()" transition="dialog-bottom-transition">
            <v-layout row wrap>
                <v-flex xs12>
                    <!-- Loader -->
                    <v-card color="primary" dark v-if="!dataLoaded">
                        <v-card-text>
                        Please stand by
                        <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                        ></v-progress-linear>
                        </v-card-text>
                    </v-card>
                    <!-- Actual content -->
                    <v-card flat v-else>
                        <v-card-title class="primary secondary--text pa-0 ma-0 px-1">
                            <v-list-tile>
                                <v-list-tile-avatar color="grey darken-3 elevation-10" size="70" @click="showUser = !showUser">
                                    <v-img
                                        class="elevation-2"
                                        :src="getImg('user')"
                                    ></v-img>
                                </v-list-tile-avatar>

                                <v-list-content>
                                    <v-slide-x-transition>
                                        <v-chip class="font-weight-bold text-capitalize white--text" color="secondary" v-show="showUser">
                                            <span>{{ '@'+data.user.name }}</span>
                                        </v-chip>
                                    </v-slide-x-transition>

                                    <v-slide-y-transition>
                                        <v-chip class="font-weight-bold text-capitalize" v-if="picDescription">
                                            <span class="text-truncate">{{ picDescription }}</span>
                                        </v-chip>
                                    </v-slide-y-transition>
                                </v-list-content>
                                <v-spacer></v-spacer>
                                <v-layout align-center justify-end>
                                    <v-slide-x-reverse-transition>
                                        <v-chip flat light color="white--text red" v-show="showUser">
                                            <v-icon left>favorite</v-icon>
                                            <span right class="subheading mr-2 white--text font-weight-heavy">{{ data.likes }}</span>
                                        </v-chip>
                                    </v-slide-x-reverse-transition>
                                </v-layout>
                            </v-list-tile>

                            <v-btn right flat @click="hideDialogBox()" class="px-3 mr-0 white--text" absolute icon>
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-card-title>

                        <v-card-text    >
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-parallax :src="getImg()" :height="dimensionObj.origHeight"></v-parallax>
                                </v-flex>
                                <v-flex xs12>
                                    <v-tabs fixed-tabs slider-color="secondary" align-with-title centered grow v-model="currentTab">
                                        <v-tab v-for="(tab, indx) in tabs" :key="indx">
                                            {{ tab.title }}
                                        </v-tab>
                                    </v-tabs>
                                    <keep-alive>
                                        <v-slide-y-reverse-transition>
                                            <v-layout row wrap v-if="Object.keys(tabContent).length > 0">
                                                <v-flex xs12>
                                                    <template v-if="currentTab == 0">
                                                        <v-layout row wrap>
                                                            <v-flex xs12 v-if="!tabContent">
                                                                <v-card>
                                                                    No Content found
                                                                </v-card>
                                                            </v-flex>
                                                            <v-flex xs12 v-else>
                                                                <v-layout row wrap>
                                                                    <v-flex xs12>
                                                                        <v-card flat tile>
                                                                            <v-card-title class="pa-0 px-3 pt-3">
                                                                                <strong>Collections</strong>
                                                                            </v-card-title>
                                                                        </v-card>
                                                                    </v-flex>
                                                                    <v-flex class="grow" v-for="(collection, indx) in tabContent"  :key="indx">
                                                                        <Collection :obj="collection"></Collection>
                                                                    </v-flex>
                                                                </v-layout>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>

                                                    <template v-if="currentTab == 1">
                                                        <v-layout row wrap>
                                                            <v-flex xs4 v-for="(blck, indx) in tabContent" :key="indx">
                                                                <v-card hover flat class="pa-2 ma-1">
                                                                    <strong class="text-capitalize grey--text">{{ indx.replace('_', ' ') }}: </strong> <span class="">{{ (blck) ? (blck) : '--' }}</span>
                                                                </v-card>
                                                            </v-flex>
                                                        </v-layout>

                                                        <v-layout row wrap v-if="data.tags.length > 0" class="pa-1">
                                                            <v-flex xs12>
                                                                <v-chip @click="showTags = !showTags">
                                                                    Related Tags
                                                                </v-chip>
                                                                <v-slide-y-transition>
                                                                    <v-tabs
                                                                        show-arrows
                                                                        class="secondary"
                                                                        v-if="showTags"
                                                                    >
                                                                        <v-tabs-slider color="primary"></v-tabs-slider>

                                                                        <v-tab
                                                                        v-for="(tag, indx) in data.tags"
                                                                        :key="indx"
                                                                        >
                                                                        {{ tag.title }}
                                                                        </v-tab>
                                                                    </v-tabs>
                                                                </v-slide-y-transition>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>

                                                    <template v-if="currentTab == 2">
                                                        <PicStat :id="tabContent" v-if="tabContent"></PicStat>
                                                    </template>
                                                </v-flex>
                                            </v-layout>
                                        </v-slide-y-reverse-transition>
                                    </keep-alive>
                                    
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios';
import PicStat from '../components/PicStats';
import Collection from '../components/Collection';

export default {
    data(){
        return {
            dialog: this.value,
            loading: true,
            data: null,
            showUser: false,
            zoomIcn: 'fullscreen',
            showTags: false,
            tabs: [
                {title: 'Related'},
                {title: 'Info'},
                {title: 'Stats'},
            ],
            currentTab: 1
        }
    },
    components:{
        PicStat,
        Collection
    },
    computed:{
        picId(){
            if(this.$store.state.showPic) return this.$store.state.showPic;
            return false;
        },
        picObj(){
            if(this.$store.state.picObj) return this.$store.state.picObj;
            return false;
        },
        dataLoaded(){
            if((this.picId || this.picObj) && this.data){
                this.loading = false;
                return true;
            }
            return false;
        },
        cardHeight(){
            if(this.dimensionObj.origHeight) return this.dimensionObj.origHeight
            return 0;
        },
        picDescription(){
            var returnVal = null;
            if(this.data.description) returnVal = this.data.description;
            if(!returnVal && this.data.alt_description) returnVal = this.data.alt_description;

            if(returnVal && returnVal.length > 100) returnVal = returnVal.substring(0, 100)+'...';

            return returnVal;
        },
        tabContent(){
            let returnVal = {};

            switch(this.currentTab){
                case 0:
                    if(this.data.hasOwnProperty('related_collections') && this.data.related_collections.results) returnVal = this.data.related_collections.results
                break;

                case 1:
                    if(this.data.exif) returnVal = this.data.exif;
                break;

                case 2:
                    returnVal = this.picId;
                break;
            }

            return returnVal;
        }
    },
    props:{
        value: {
            default: false,
            type: Boolean
        }
    },
    methods:{
        // Returns pic based on current resolution
        getImg(picType){
            let returnVal = this.data.urls[this.dimensionObj.imgType]+'&auto=format';
            switch(this.dimensionObj.imgType){
                case 'full':
                case 'regular':
                case 'small':
                    if(picType == 'user') returnVal = this.data.user.profile_image.large+'&auto=format';
                break;
                default:
                    if(picType == 'user') returnVal = this.data.user.profile_image.medium+'&auto=format';
            }

            return returnVal;
        },

        // When dialog box closes, clear the state variable for the dialog 
        hideDialogBox(){
            this.$store.commit('showPictureId', null);
            this.$store.commit('setPicDetails', null);
        },

        // Check for picture details 
        getPicDetails(){
            let vm = this;

            // If picture obj is available, then return that
            if(vm.picObj){
                vm.data = vm.picObj;
                return false;
            }

            // Get the picture from id if available
            if(vm.picId){
                axios.get('/photos/' + vm.picId, {}).then(resp => {
                    if(resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success') && resp.data.success.hasOwnProperty('data')){
                        var resp = resp.data.success.data;
                        if(Object.keys(resp).length) vm.data = resp;
                    }
                }).catch(err => {
                    this.$store.commit('setApiErr', err.message);
                });
            }
        }
    },
    mounted(){
        this.getPicDetails();
    },
    beforeDestroy(){
         this.$store.commit('showPictureId', null);
         this.$store.commit('setPicDetails', null);
    }
}
</script>

<style>

</style>
