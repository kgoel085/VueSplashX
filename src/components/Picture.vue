<template>
    <v-flex :[blockSize] = true class="pictureBlock">
        <v-card :height="dimensionObj.height+'px'" class="pa-2 ma-2" flat raised @click="showPic(data.id)" style="position:relative">
            <v-card-title primary-title class="px-0 pt-1 ma-0 picUsr">
                <UserAvatar :obj="data.user"></UserAvatar>
            </v-card-title>

            <v-img :src="blockImg" aspect-ratio="1" class="white lighten-2 pa-4" height="100%">
                <!-- Image Loader -->
                <template v-slot:placeholder>
                    <Loader ></Loader>
                </template>
            </v-img>

            <v-btn class="bottomSection" right fab light color="primary my-3" @click.stop="downloadPic(data.id)">
                <v-icon dark>arrow_downward</v-icon>
            </v-btn>
        </v-card>
    </v-flex>
</template>

<script>
import Loader from '@/components/Loader';
import UserAvatar from '@/components/UserAvatar';

export default {
    data(){
        return {
            showHover: 'hover'
        }
    },
    components:{
        Loader,
        UserAvatar
    },
    computed:{
        data(){
            return this.obj;
        },
        blockSize(){
            return this.dimensionObj.breakpoint+this.dimensionObj.size;
        },
        blockImg(){
            let vm = this;
            if(this.data){
                let img = this.data.urls[this.dimensionObj.imgType]+'&auto=format';
                return img;
            }
            return false;
        }
    },
    methods:{
        showPic(id){
            this.$store.commit('showPictureId', id);
            //this.$store.commit('setPicDetails', this.details);
        },

        downloadPic(id){
            this.$store.commit('downloadPictureId', this.data.urls['raw']);
        }
    },
    props:{
        obj:{
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
    }

    .pictureBlock .v-avatar img:hover{
        cursor:pointer
    }

    .pictureBlock .picUsr{
        position:absolute;
        z-index:9
    }
</style>
