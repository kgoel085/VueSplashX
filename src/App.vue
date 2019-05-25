<template>
  <v-app>
    <!-- Main content container -->
    <v-content>
      <!-- Header & Navbar  -->
      <NavBar/>

      <!-- Router views -->
      <router-view></router-view>
    </v-content>

    <!-- Connection snackbar -->
    <v-snackbar v-model="connSnackbar" top right color="red" class="white--text" :timeout = 0>
      {{ connError }}
      <v-btn color="red" class="white" flat @click="connSnackbar = false">
        Retry !
      </v-btn>
    </v-snackbar>

    <!-- API Error snackbar -->
    <v-snackbar v-model="snackbar" bottom right color="red" class="white--text" :timeout = 0>
      <span left>{{ apiError }}</span>
      <!-- <v-icon right class="white--text" flat @click="snackbar = false">close</v-icon> -->
    </v-snackbar>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    NavBar
  },
  data () {
    return {
      connError: null,
      apiError: null
    }
  },
  computed:{

    // Show/Hide snackbar based on current token state error
    connSnackbar:{
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
    },

    // Show/Hide snackbar based on current API state error
    snackbar:{
      get(){
        if(this.$store.state.apiErr){
          this.apiError = this.$store.state.apiErr;
          return true;
        }
        return false;
      },
      set(val){
        if(!val){
          this.apiError = null;
          this.$store.commit('setApiErr', null);
        }
      }
    }
  }
}
</script>
