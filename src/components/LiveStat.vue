<template>
    <v-layout row wrap class="liveStat" ref="liveStat">
        <v-flex xs12 align-self-center class="pa-0 ma-0 text-xs-center">
            <v-icon @click="showBox = !showBox" hover class="dragHandle jump" size="40" color="white">drag_handle</v-icon>
        </v-flex>
        <v-slide-y-reverse-transition>
            <v-flex xs12 align-content-center v-show="showBox" class="px-2 pb-1">
                <v-card tile raised>
                    <v-card-text>
                        
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-slide-y-reverse-transition>
    </v-layout>
</template>

<script>
export default {
    data(){
        return {
            showBox: false
        }
    },
    watch:{
        showBox(val){
            let elem = document.querySelector('.dragHandle');
            if(elem){
                if(val){
                    if(elem.classList.contains('jump')) elem.classList.remove('jump');
                }else{
                    if(!elem.classList.contains('jump')) elem.classList.add('jump');
                }
            }
        }
    },
    computed:{
        btnIcn(){
            if(this.showBox) return 'expand_more';
            return 'expand_less';
        }
    }
}
</script>

<style>
    .liveStat{
        position: fixed;
        bottom:0;
        left: 0;
        right: 0;
        z-index:99999
    }

    .liveStat .dragHandle.jump{
        animation-name: jump;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        cursor: pointer;
    }

    @keyframes jump {
    from, 20%, 53%, 80%, to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
    }

    40%, 43% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        -webkit-transform: translate3d(0, -30px, 0);
        transform: translate3d(0, -30px, 0);
    }

    70% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        -webkit-transform: translate3d(0, -15px, 0);
        transform: translate3d(0, -15px, 0);
    }

    90% {
        -webkit-transform: translate3d(0,-4px,0);
        transform: translate3d(0,-4px,0);
    }
    }

    .jump {
    -webkit-animation-name: bounce;
    animation-name: bounce;
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
    }
</style>