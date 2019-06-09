<template>
    <v-flex :[blockSize] = true class="pictureBlock">
        <v-card :height="dimensionObj.height+'px'" class="pa-2 ma-2" flat :[showHover] = "imgLoaded" raised :img="blockImg" @click="showPic(data.id)">
            <Loader v-if="!imgLoaded"/>
            <template v-else>
                <v-card-title primary-title class="px-0 pt-1 ma-0" >
                    <UserAvatar :obj="data"></UserAvatar>
                </v-card-title>
            </template>
        </v-card>
    </v-flex>
</template>

<script>
import Loader from '../components/Loader';
import UserAvatar from '../components/UserAvatar';

export default {
    data(){
        return {
            imgLoaded: false,
            showHover: 'hover'
        }
    },
    components:{
        Loader,
        UserAvatar
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
        }
    },
    methods:{
        showPic(id){
            this.$store.commit('showPictureId', id);
            //this.$store.commit('setPicDetails', this.details);
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
