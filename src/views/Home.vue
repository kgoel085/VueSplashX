<template>
  <div class="home">
    <v-container fluid class="pa-1" :disabled="!apiKey">
      <v-layout :[layout]=true wrap v-if="dataObj.length > 0">
          <Picture v-for="(data, indx) in dataObj" :key="indx" :details=data></Picture>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import Picture from '../components/Picture'

export default {
  data(){
    return {
      currentLayout: 0,
      dataObj: [],
      sortArr: ['latest', 'oldest', 'popular'],
      params: {
        page: 1,
        per_page: 15
      }
    }
  },
  components:{
    Picture
  },
  computed:{
    // Controls the layout of the page
    layout(){
      if(this.currentLayout == 1) return 'column';

      return 'row';
    }
  },
  methods:{
    // Retreive photos 
    getData(){
      axios.get('/photos', {params: this.params}).then(resp => {
        let vm = this;
        let data = resp.data.success.data;

        // Check for pagination info
        if(resp.data.success.hasOwnProperty('extra_info')){
          let pgInfo = resp.data.success.extra_info.pagination;
          if(pgInfo.hasOwnProperty('page')) vm.params.page = pgInfo.page;
        }

        if(data.length > 0){
          data.forEach(element => {
            vm.dataObj.push(element);
          });
        }

      }).catch(error => {
        this.$store.commit('setApiErr', error.message);
      });
    }
  },
  mounted(){
    let vm = this;
    if(this.apiKey) this.getData();

    // On scroll, call next batch
    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !vm.tokenExpired) vm.getData();
    };
  }
}
</script>

<style>

</style>