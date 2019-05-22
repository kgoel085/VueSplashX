<template>
    <nav>
        <v-toolbar app dense fixed>
            <v-toolbar-side-icon @click="showNav = !showNav"></v-toolbar-side-icon>
            <v-toolbar-title class="headline text-uppercase">
                <span class="primary--text">VUE </span>
                <span class="font-weight-light secondary--text">SPLASH X</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-navigation-drawer app v-model="showNav" class="primary">
            <v-list>
                <v-list-tile class="pa-5">
                    <v-layout align-center justify-center row fill-height>
                        <v-flex class="text-xs-center">
                            <v-avatar size="100" :tile="true">
                                <img src="../assets/logo.svg" alt="">
                            </v-avatar>
                        </v-flex>
                    </v-layout>
                </v-list-tile>
                
                <v-list-tile v-for="item in listItems" :key="item.title" router :to="item.path">
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
            showNav: false,
            listItems:[
                {icon: 'dashboard', title: 'Home', path: '/'},
                {icon: 'category', title: 'Collections', path: '/collections'}
            ]
        }
    }
}
</script>

<style>

</style>
