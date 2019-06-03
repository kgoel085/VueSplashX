<template>
    <nav>
        <v-toolbar app dense fixed flat card class="primary">
            <!-- Sidebar / Navbar toggle -->
            <!-- <v-toolbar-side-icon @click="showNav = !showNav" :disabled="!apiKey"></v-toolbar-side-icon> -->

            <!-- Title -->
            <v-toolbar-title class="headline text-uppercase">
                <span class="blue--text">VUE </span>
                <span class="font-weight-light secondary--text">SPLASH X</span>
            </v-toolbar-title>

            <!-- Request Loader -->
            <v-btn color="secondary" flat :loading="true" v-if="reqLoader" />

            <v-spacer></v-spacer>

            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat class="white--text" v-for="item in listItems" :key="item.title" router :to="item.path" :disabled="!apiKey">
                    {{ item.title }}
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <!-- Side Drawer -->
        <v-navigation-drawer app v-model="showNav" class="primary">
            <v-list>
                <!-- Logo -->
                <v-list-tile class="pa-5">
                    <v-layout align-center justify-center row fill-height>
                        <v-flex class="text-xs-center">
                            <v-avatar size="100" :tile="true">
                                <img src="../assets/logo.svg" alt="">
                            </v-avatar>
                        </v-flex>
                    </v-layout>
                </v-list-tile>
                
                <!-- Nav items -->
                <v-list-tile v-for="item in listItems" :key="item.title" router :to="item.path" :disabled="!apiKey">
                    <v-list-tile-actions>
                        <v-icon left color="white">
                            {{ item.icon }}
                        </v-icon>
                    </v-list-tile-actions>
                    <v-list-tile-content>
                        <v-list-tile-title flat class="white--text">{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
export default {
    data(){
        return {
            // List of items to show in navbar
            listItems:[
                {icon: 'dashboard', title: 'Home', path: '/'},
                {icon: 'category', title: 'Collections', path: '/collections'}
            ]
        }
    },
    computed:{
        // Controls the navbar
        showNav:{
            get(){
                return (this.$store.state.showSideBar) ? this.$store.state.showSideBar : false;
            },
            set(val){
                this.$store.commit('setSideBar', val);
            }
        },

        //Manages request loader
        reqLoader(){
            return this.$store.state.reqLoading;
        },
    }
}
</script>

<style>

</style>
