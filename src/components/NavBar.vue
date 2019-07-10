<template>
    <div v-if="hideNav">
        <v-toolbar app dense fixed flat card class="primary navBar">
            <!-- Title -->
            <v-toolbar-title class="headline text-uppercase">
                <span class="blue--text">VUE </span>
                <span class="font-weight-light secondary--text">SPLASH X</span>
            </v-toolbar-title>

            <!-- Request Loader -->
            <v-btn color="secondary" flat :loading="true" v-if="reqLoader" />
            
            <!-- Search Bar -->
            <v-slide-x-transition>
                <v-text-field
                    placeholder="Search"
                    v-if="showSearch"
                    color="white"
                    clearable
                    flat
                    light
                    class="px-4"
                    v-model="searchText"
                    @keyup.enter="doSearch()"
                ></v-text-field>
            </v-slide-x-transition>

            <v-spacer></v-spacer>

            <v-toolbar-items class="">
                <v-btn flat icon class="white--text" @click="showSearch = !showSearch">
                    <v-icon>search</v-icon>
                </v-btn>

                <v-btn flat class="white--text" v-for="item in listItems" :key="item.title" router :to="item.path" :disabled="!apiKey">
                    {{ item.title }}
                </v-btn>

                <template v-if="!$store.state.usrDetails || usrToken === false">
                    <v-btn flat class="white--text" @click="initLogin()" >Login</v-btn>
                </template>
                <template v-else>
                    <v-menu :nudge-width="100">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" flat class="white--text" >{{ $store.state.usrDetails.name }} <v-icon dark>arrow_drop_down</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-tile :to="'/user/@'+$store.state.usrDetails.username">
                                <v-list-tile-title >View Profile</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>View Collections</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>View Photos</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title @click="$store.dispatch('logoutUsr')">Logout</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </template>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            showSearch: false,
            searchText: null,

            // List of items to show in navbar
            listItems:[
                {icon: 'dashboard', title: 'Home', path: '/'},
                {icon: 'category', title: 'Collections', path: '/collections'}
            ]
        }
    },
    computed:{
        hideNav(){
            return this.$store.state.hideNav;
        },

        //Manages request loader
        reqLoader(){
            return this.$store.state.reqLoading;
        }
    },
    methods:{
        doSearch(){
            this.$router.push({
                name: 'search',
                query: {
                    't': this.searchText
                }
            });
        }
    }
}
</script>

<style>
    .navBar{
        z-index: 99
    }

    .navBar .v-input input{
        color:#fff !important;
    }
</style>
