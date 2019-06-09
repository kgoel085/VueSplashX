<template>
    <v-layout row wrap class="collection_mod">
        <v-flex xs12>
            <v-card flat tile class="pa-2 ma-2">
                <v-carousel hide-delimiters class="collection_carousel">
                    <v-carousel-item
                    v-for="(item,i) in data.preview_photos"
                    :key="i"
                    :src="item.urls[dimensionObj.imgType]"
                    >
                    </v-carousel-item>
                    <v-card light flat class="grow primary white--text collection_details">
                        <v-card-title class="pa-0 px-1">
                            <v-layout row wrap>
                                <v-flex class="grow">
                                    {{ data.title }}
                                </v-flex>
                                <v-flex class="shrink">
                                    <UserAvatar :obj="data.user" :avatarSize=45></UserAvatar>
                                </v-flex>
                            </v-layout>
                        </v-card-title>
                    </v-card>
                </v-carousel>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
import UserAvatar from '../components/UserAvatar';

export default {
    data(){
        return {
            data: (Object.keys(this.obj).length > 0) ? this.obj : null,
        }
    },
    components:{
        UserAvatar
    },
    methods:{
        getDetails(){

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
    },
    mounted(){
        if(this.colKey && !this.data) this.getDetails();
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
        width:100%
    }
</style>
