<template>
    <v-layout row wrap>
        <v-flex xs12 v-if="!data">
            <Loader></Loader>
        </v-flex>

        <v-flex xs12 v-else >
            <v-layout align-center justify-center>
                <v-flex class="grow" v-for="(tab, indx) in tabObj" :key="indx">
                    <v-card class="ma-2" hover flat >
                        <v-list-tile @click="graphBlock = tab.link">
                            <v-list-tile-avatar>
                                <v-icon :size="40" :color="tab.color">{{ tab.icon }}</v-icon>
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title left>
                                    <small class="grey--text">Total {{ tab.link }} in past {{ data[tab.link]['historical']['quantity'] }} {{ data[tab.link]['historical']['resolution'] }} :  </small> <span class="font-weight-medium">{{ data[tab.link]['total'] | countNumber }}</span>
                                </v-list-tile-title>
                                <v-list-tile-sub-title right>
                                    <small class="grey--text">Average {{ tab.link }} in past {{ data[tab.link]['historical']['quantity'] }} {{ data[tab.link]['historical']['resolution'] }} : </small> <span>{{ data[tab.link]['historical']['change'] | countNumber }} </span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex v-if="graphShow" xs12 >
                    <v-sheet >
                        <v-sparkline
                        :value="graphObj"
                        color="rgba(255, 255, 255, .7)"
                        height="100"
                        padding="14"
                        stroke-linecap="round"
                        smooth
                        auto-draw
                        fill
                        :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                        >
                        <template v-slot:label="item">
                            <!-- {{ currentLabels[item.index] }} -->
                        </template>
                        </v-sparkline>
                    </v-sheet>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
import Loader from '@/components/Loader';

export default {
    data(){
        return {
            data: null,
            graphBlock: null,
            tabObj:[
                {link: 'downloads', icon: 'arrow_downward', color: 'teal'},
                {link: 'likes', icon: 'favorite', color: 'red'},
                {link: 'views', icon: 'visibility', color: 'orange'}
            ]
        }
    },
    components:{
        Loader
    },
    computed:{
        picId(){
            return this.id;
        },
        graphObj(){
            var returnObj = [];

            if(this.data[this.graphBlock] && this.data[this.graphBlock].hasOwnProperty('historical')){
                var tmpObj = this.data[this.graphBlock]['historical'];
                if(tmpObj.values && Object.keys(tmpObj.values).length > 0){
                    tmpObj.values.forEach(element => {
                        returnObj.push(element.value);
                    });
                }
            }

            return returnObj;
        },
        graphShow(){
            if(this.graphBlock && this.data[this.graphBlock]){
                return true;
            }

            return false;
        }
    },
    methods:{
        // Get Picture stat
        getPicStat(){
            let vm = this;

            // Get the picture stats from id
            if(vm.picId){
                axios.get('/photos/' + vm.picId + '/action/statistics', {}).then(resp => {
                    if(resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success') && resp.data.success.hasOwnProperty('data')){
                        var resp = resp.data.success.data;
                        if(resp) vm.data = resp;
                    }
                }).catch(err => {
                    this.$store.commit('setApiErr', err.message);
                });
            }
        }
    },
    props:{
        id:{
            default: null,
            type: String
        }
    },
    mounted(){
        if(this.picId) this.getPicStat();
    }
}
</script>

<style>

</style>
