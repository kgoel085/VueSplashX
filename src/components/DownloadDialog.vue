<template>
    <v-layout row justify-center class="downloadDiag">
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
                    <v-card v-else :height="getHeight(90)+'px'">
                        <v-img :src="$store.state.downloadPic" :height="getHeight(80, getHeight(90)) + 'px'"></v-img>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex class="grow">
                                    <v-slider
                                        v-model="screen"
                                        :tick-labels="screenSize"
                                        :max="screenSize.length - 1"
                                        step="1"
                                        ticks="always"
                                        tick-size="1"
                                    ></v-slider>
                                </v-flex>
                                <v-flex class="shrink">
                                    <v-btn flat @click="download($store.state.downloadPic)">
                                        Download
                                    </v-btn>
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

export default {
    data(){
        return {
            dialog: this.value,
            loading: true,
            dataLoaded: false,
            screen: false,
            screenSize: [
                '300px', '600px', '800px', '1080px', '2560px'
            ]
        }
    },
    methods:{
        // When dialog box closes, clear the state variable for the dialog 
        hideDialogBox(){
            this.$store.commit('downloadPictureId', null);
        },

        // Returns a specific percent of available height or given height
        getHeight(percent = 100, specificHeight = 0){
            if(!percent || parseInt(percent) === 0) percent = 100;

            let totalHeight = (specificHeight || parseInt(specificHeight) === true) ? specificHeight : this.dimensionObj.origHeight;
            return (totalHeight * percent) / 100;
        },
        download(picId){
            window.open(picId);
            this.$store.commit('downloadPictureId', null);
        }
    },
    props:{
        value: {
            default: false
        }
    },
    mounted(){
        this.dataLoaded = true;
        this.loading = true;
    }
}
</script>

<style>

</style>
