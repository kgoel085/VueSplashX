<template>
  <div class="home">
    <!-- <v-toolbar flat>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn-toggle v-model="currentLayout" right>
					<v-btn flat>
						<v-icon class="mt-1">view_column</v-icon>
					</v-btn>
					<v-btn flat>
						<v-icon class="mt-1">view_stream</v-icon>
					</v-btn>
        </v-btn-toggle>
      </v-toolbar-items>
    </v-toolbar> -->
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
      axios.get('/photos', this.params).then(resp => {
        let vm = this;
        let data = resp.data.success.data;

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
    if(this.apiKey) this.getData();
  }
}
</script>

<style>

</style>