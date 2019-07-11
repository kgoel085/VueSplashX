<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" light full-width max-width="90%" :loading="loading" @input="v = v || hideDialogBox()" transition="dialog-bottom-transition" class="downloadDiag" >
            
            <!-- Loader -->
            <v-layout row wrap v-if="!dataLoaded">
                <v-flex xs12>
                    <v-card color="primary" dark >
                        <v-card-text>
                        Please stand by
                        <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                        ></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

            <!-- Load Content -->
            <v-layout row wrap v-else>

                <!-- Image Container -->
                <v-flex xs12>
                    <v-card class="text-xs-center">
                        <v-layout row wrap>
                            <v-flex xs12 pa-1>
                                <v-card :height="getHeight(60)+'px'">
                                     <v-img :src="imgUrl" :height="'100%'" :width="'100%'">
                                        <!-- Image Loader -->
                                        <template v-slot:placeholder>
                                            <Loader ></Loader>
                                        </template>
                                    </v-img>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 pa-3>
                                <v-layout row wrap>
                                    <v-flex xs6 pa-2>
                                        <v-slider :min="screenDim.width.min" :max="screenDim.width.max" v-model="screenDim.width.value"></v-slider>
                                    </v-flex>
                                    <v-flex xs6 pa-2>
                                        <v-slider :min="screenDim.height.min" :max="screenDim.height.max" v-model="screenDim.height.value"></v-slider>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12>
                                
                                
                            </v-flex>
                            <v-flex xs12 class="text-xs-center">
                                <v-btn class="" flat @click="download(imgUrl)" >
                                    Download
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios';
import Loader from '@/components/Loader';

export default {
    data(){
        return {
            dialog: this.value,
            loading: true,
            dataLoaded: false,
            screenDim:{
                width: {min: 300, max: 2600, value: 2600},
                height: {min: 300, max: 2600, value: this.mainHeight}
            }
        }
    },
    components:{
        Loader
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
            //this.$store.commit('downloadPictureId', null);
        }
    },
    computed:{
        imgUrl(){
            return `${this.$store.state.downloadPic}`;
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
