<template>
    <v-flex :[blockSize] = true class="pictureBlock">
        <v-card :height="dimensionObj.height+'px'" class="pa-2 ma-2" flat :[showHover] = "imgLoaded" raised :img="blockImg" @click="showPic(data.id)">
            <Loader v-if="!imgLoaded"/>
            <template v-else>
                <v-card-title primary-title class="px-0 pt-1 ma-0" >
                    <v-list-tile left class="grow">
                        <!-- Show user with name -->
                        <v-chip color="teal" text-color="white" @click.stop="showUser = !showUser">
                            <v-avatar :size="userChipSize">
                                <img :src="userImg" alt="trevor">
                            </v-avatar>
                            <v-slide-x-transition>
                                <span v-if="showUser">
                                    {{ data.user.name }}
                                </span>
                            </v-slide-x-transition>
                        </v-chip>

                        <!-- Social Details -->
                        <v-slide-y-transition>
                            <v-layout align-center justify-end v-show="showUser">
                                <v-chip v-model="showUser" flat light color="white--text red " @click="showUser = false">
                                    <v-icon left>favorite</v-icon>
                                    <span right class="subheading mr-2 white--text font-weight-heavy">{{ data.likes }}</span>
                                </v-chip>
                            </v-layout>
                        </v-slide-y-transition>
                    </v-list-tile>
                </v-card-title>

                <!-- Sponsered texts -->
                <v-slide-y-reverse-transition>
                    <v-card-text class="bottomSection" v-show="showUser">
                        <v-flex xs12 v-if="captionText">
                            <v-btn small left color="teal white--text">{{ captionText }}</v-btn>
                        </v-flex>
                    </v-card-text>
                </v-slide-y-reverse-transition>
            </template>
        </v-card>
    </v-flex>
</template>

<script>
import Loader from '../components/Loader';
export default {
    data(){
        return {
            imgLoaded: false,
            showHover: 'hover',
            showUser: false,
            userChipSize: 200,
            userIntervalObj: null,
            userHideInterval:3000
        }
    },
    watch:{
        showUser(val){
            var vm =this;
            if(val){
                vm.userIntervalObj = setInterval(() => {
                    vm.showUser = false;
                }, vm.userHideInterval);
            }else{
                if(vm.userIntervalObj) clearInterval(vm.userIntervalObj);
            }
        }
    },
    components:{
        Loader
    },
    computed:{
        data(){
            return this.details;
        },
        blockSize(){
            return this.dimensionObj.breakpoint+this.dimensionObj.size;
        },
        blockImg(){
            let vm = this;
            if(this.data){
                let img = this.data.urls[this.dimensionObj.imgType]+'&auto=format';
                setTimeout(() => {
                    vm.imgLoaded = true;
                }, 1000);
                return img;
            }
            return false;
        },
        userImg(){
            switch(this.dimensionObj.imgType){
                case 'full':
                case 'regular':
                case 'small':
                    return this.data.user.profile_image.large+'&auto=format';
                break;
                default:
                    return this.data.user.profile_image.medium+'&auto=format';
            }
        },
        captionText(){
            let returnVal = "";
            if(this.data.sponsored){
                if(this.data.sponsored_by.twitter_username && !returnVal) returnVal = 'Sponsered by @'+this.data.sponsored_by.twitter_username;
                if(this.data.sponsored_by.name) returnVal = this.data.sponsored_by.name;
            }
            
            if(this.data.user.twitter_username && !returnVal) returnVal = '@'+this.data.user.twitter_username;

            return returnVal;
        },
    },
    methods:{
        showPic(id){
            this.$store.commit('showPictureId', id);
            this.$store.commit('setPicDetails', this.details);
        }
    },
    props:{
        details:{
            default: {},
            type: Object
        }
    }
}
</script>

<style>
    .pictureBlock .v-chip .v-avatar{
        height: 52px !important;
        width: 52px !important;
    }

    .pictureBlock{
        position:relative;
    }

    .pictureBlock .bottomSection{
        position:absolute;
        bottom:0;
        left:0
    }

    .pictureBlock .v-avatar img:hover{
        cursor:pointer
    }
</style>
