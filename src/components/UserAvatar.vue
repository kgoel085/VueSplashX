<template>
    <v-list-tile left class="grow usrAvataR">
        <template v-if="data">
            <!-- Show user with name -->
            <v-list-tile-avatar text-color="white" @click.stop="showUser = !showUser" :size="userChipSize">
                <img :src="userImg" :alt="data.name">
            </v-list-tile-avatar>

            <v-list-tile-content>
                <v-slide-x-transition>
                    <v-chip class="font-weight-bold text-capitalize white--text" color="secondary" v-show="showUser">
                        <span>{{ '@'+data.name }}</span>
                    </v-chip>
                </v-slide-x-transition>

                <v-slide-y-transition>
                    <v-chip class="font-weight-bold text-capitalize" v-if="picDescription">
                        <span class="text-truncate strictDescription">{{ picDescription }}</span>
                    </v-chip>
                </v-slide-y-transition>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-layout align-center justify-end>
                <v-slide-x-reverse-transition>
                    <v-chip flat light color="white--text red" v-show="showUser && obj.hasOwnProperty('likes')">
                        <v-icon left>favorite</v-icon>
                        <span right class="subheading mr-2 white--text font-weight-heavy">{{ obj.likes }}</span>
                    </v-chip>
                </v-slide-x-reverse-transition>
            </v-layout>
        </template>
        <Loader v-else></Loader>
    </v-list-tile>
</template>

<script>
import Loader from '@/components/Loader';

export default {
    data(){
        return{
            data: (Object.keys(this.obj).length > 0 && this.obj.hasOwnProperty('user')) ? this.obj.user : null,
            userChipSize: (this.avatarSize) ? this.avatarSize : 50,
            userIntervalObj: null,
            userHideInterval:3000,
            usrVisible: (this.userShow) ? this.userShow : false
        }
    },
    components:{
        Loader
    },
    watch:{
        showUser(val){
            var vm =this;
            if(val){
                vm.userIntervalObj = setInterval(() => {
                    vm.showUser = false;
                }, vm.userHideInterval);
            }else{
                if(vm.userIntervalObj) clearInterval(vm.userIntervalObj);
            }
        }
    },
    computed:{
        showUser:{
            get(){
                if(this.usrVisible) return this.usrVisible;
                return false;
            },
            set(val){
                this.usrVisible = val;
            }
        },
        userImg(){
            let returnVal = false;

            if(this.data && this.data.hasOwnProperty('profile_image')){
                switch(this.dimensionObj.imgType){
                    case 'full':
                    case 'regular':
                    case 'small':
                        returnVal = this.data.profile_image.large+'&auto=format';
                    break;
                    default:
                        returnVal = this.data.profile_image.medium+'&auto=format';
                }
            }

            return returnVal;
        },
        picDescription(){
            var returnVal = null;
            if(!this.showDescription) return returnVal; 

            if(this.obj.description) returnVal = this.obj.description;
            if(!returnVal && this.obj.alt_description) returnVal = this.obj.alt_description;

            if(returnVal && returnVal.length > 50) returnVal = returnVal.substring(0, 50)+'...';

            return returnVal;
        }
    },
    props:{
        obj:{
            type: Object,
            default: {}
        },
        userShow:{
            type: Boolean,
            default: false
        },
        avatarSize:{
            type: Number,
            default: 50
        },
        showDescription:{
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
    /* .v-chip .v-avatar{
        height: 52px !important;
        width: 52px !important;
    } */
    .strictDescription{
        white-space: nowrap;
        overflow: hidden;
        max-width:90%
    }
</style>
