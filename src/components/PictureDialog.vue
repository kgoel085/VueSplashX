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
                            <UserAvatar :obj="data.user" :showDescription="true"></UserAvatar>

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

                                        <v-tab-item v-for="(tab, indx) in tabs" :key="indx">
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <template v-if="indx == 0">
                                                        <v-layout row wrap>
                                                            <v-flex xs12 v-if="!data.hasOwnProperty('related_collections') || !data.related_collections.results">
                                                                <v-card>
                                                                    No Content found
                                                                </v-card>
                                                            </v-flex>
                                                            <v-flex xs12 v-else>
                                                                <v-layout row wrap>
                                                                    <Collection :obj="collection" v-for="(collection, indx) in data.related_collections.results"  :key="indx"></Collection>
                                                                </v-layout>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>
                                                    <template v-if="indx == 1">
                                                        <v-layout row wrap>
                                                            <v-flex xs4 v-for="(blck, indx) in data.exif" :key="indx">
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
                                                                    <Tags :obj="data.tags" v-if="showTags"></Tags>
                                                                </v-slide-y-transition>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>

                                                    <template v-if="indx == 2">
                                                        <PicStat :id="picId"></PicStat>
                                                    </template>
                                                </v-flex>
                                            </v-layout>
                                        </v-tab-item>
                                    </v-tabs>
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
import PicStat from '@/components/PicStats';
import Collection from '@/components/Collection';
import Tags from '@/components/Tag';
import UserAvatar from '@/components/UserAvatar';

export default {
    data(){
        return {
            dialog: this.value,
            loading: true,
            data: null,
            showTags: false,
            tabs: [
                {title: 'Related Collections'},
                {title: 'Info'},
                {title: 'Stats'},
            ],
            currentTab: 1
        }
    },
    components:{
        PicStat,
        Collection,
        Tags,
        UserAvatar
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
