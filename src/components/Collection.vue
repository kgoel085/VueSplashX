<template>
    <v-flex :[blockSize] = true class="collection_mod">
        <v-card flat tile hover ripple class="pa-1 ma-0">
            <v-carousel hide-delimiters class="collection_carousel" :cycle="false">
                <v-card light flat tile class="grow collection_details transparent top">
                    <v-card-title class="pa-1">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <UserAvatar :obj="data.user"></UserAvatar>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                </v-card>

                <v-carousel-item
                v-for="(item,i) in data.preview_photos"
                :key="i"
                 @click="showCollectionPic(data.id)"
                :alt="data.title"
                >
                    <v-img :src="item.urls[dimensionObj.imgType]" aspect-ratio="1" class="white lighten-2 pa-4" height="100%">
                        <!-- Image Loader -->
                        <template v-slot:placeholder>
                            <Loader ></Loader>
                        </template>
                    </v-img>
                </v-carousel-item>

                <v-card light flat tile class="grow collection_details transparent">
                    <v-card-title class="pa-1">
                        <v-layout row wrap>
                            <v-flex class="grow white--text">
                                <h3 class="font-weight-regular display-1" hover >{{ data.title }}</h3>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                </v-card>
            </v-carousel>
        </v-card>
    </v-flex>
</template>

<script>
import axios from 'axios';
import UserAvatar from '@/components/UserAvatar';
import Loader from '@/components/Loader'

export default {
    data(){
        return {
            data: (Object.keys(this.obj).length > 0) ? this.obj : null,
        }
    },
    components:{
        UserAvatar,
        Loader
    },
    computed:{
        blockSize(){
            return this.dimensionObj.breakpoint+this.dimensionObj.size;
        }
    },
    methods:{
        showCollectionPic(id){
            this.$router.push({name: 'collections.single', params: {'id': id}});
        }
    },
    props:{
        colKey:{
            default: null,
            type: String
        },
        obj:{
            default: {},
            type: Object
        }
    }
}
</script>

<style>
    .collection_mod .collection_carousel{
        position: relative;
    }

    .collection_mod .collection_details{
        position:absolute;
        bottom:0;
        width:100%;
    }

    .collection_mod .collection_details.top{
        position:absolute;
        bottom:85%;
        width:100%;
        z-index:9
    }

    .collection_mod .v-chip .v-avatar{
        width:50px !important;
        height: 50px !important;
    }
</style>
