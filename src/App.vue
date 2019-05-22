<template>
  <v-app>
    <NavBar/>

    <v-content>
      <HelloWorld/>
    </v-content>

    <!-- Connection snackbar -->
    <v-snackbar v-model="snackbar" top right color="red" class="white--text" :timeout = 0>
      {{ connError }}
      <v-btn
        color="red"
        class="white"
        flat
        @click="snackbar = false"
      >
        Retry !
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    HelloWorld,
    NavBar
  },
  data () {
    return {
      connError: null
    }
  },
  computed:{

    // Show/Hide snackbar based on current state error
    snackbar:{
      get(){
        if(this.$store.state.tokenErr){
          this.connError = this.$store.state.tokenErr;
          return true;
        }
        return false;
      },
      set(val){
        if(!val){
          this.$store.commit('removeToken');
          this.$router.go();
        }
      }
    }
  }
}
</script>
