<template>
    <v-layout row justify-center class="picDialog">
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" light full-width :loading="loading" @input="v = v || hideDialogBox()" transition="dialog-bottom-transition">
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
                    <!-- Actuall content -->
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
                            <v-btn right flat @click="showTruePic = !showTruePic" class="px-3 mr-3" fixed icon>
                                <v-icon v-if="showTruePic">fullscreen_exit</v-icon>
                                <v-icon v-else>fullscreen</v-icon>
                            </v-btn>
                        </v-card-title>

                        <v-card-text :style="{height: (cardHeight - (cardHeight* 30)/100)+'px', overflowY: 'auto'}">
                            <div :style="{height: cardHeight+'px'}" class="grow">
                                <v-img :src="getImg()" contain :height="picHeight"></v-img>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            dialog: this.value,
            loading: true,
            data: null,
            showUser: false,
            showTruePic: false,
            zoomIcn: 'fullscreen' 
        }
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
        picHeight(){
            if(this.showTruePic) return 'auto'; 
            return '100%';
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
