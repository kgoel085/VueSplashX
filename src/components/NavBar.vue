<template>
    <nav v-if="hideNav">
        <v-toolbar app dense fixed flat card class="primary navBar">
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
                <v-btn flat class="white--text" @click="initLogin()">Login</v-btn>
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
                    <v-list-tile-action>
                        <v-icon left color="white">
                            {{ item.icon }}
                        </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title flat class="white--text">{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import axios from 'axios';

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

        hideNav(){
            return this.$store.state.hideNav;
        },

        //Manages request loader
        reqLoader(){
            return this.$store.state.reqLoading;
        },
    },
    methods:{
        initLogin(){
            axios.get('/initLogin').then(resp => {
                let data = (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('success')) ? resp.data.success : false;
                if(data){
                    // Redirect URL
                    let port = (window.location.port) ? window.location.port : 80;
                    let loginUrl = window.location.protocol+'//'+window.location.hostname+':'+port+'/login';
                    data['redirect_uri'] = loginUrl;

                    let params = [];
                    for(let key of Object.keys(data)){
                        let str = key+'='+data[key];
                        params.push(str);
                    }

                    let scopes = ['public','read_user','read_photos','read_collections'].join('+');

                    params = (params.length > 0) ? '?'+params.join('&') : '?';

                    let newWindow = window.open('https://unsplash.com/oauth/authorize'+params+'&scope='+scopes, 'vuesplashlog','_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
                }
            }).catch(err => {
                this.$store.commit('setApiErr', err.message);
            });
        }
    }
}
</script>

<style>
    .navBar{
        z-index: 99
    }
</style>
