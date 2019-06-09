<template>
    <v-list-tile left class="grow usrAvataR">
        <template v-if="data">
            <!-- Show user with name -->
            <v-chip color="teal" text-color="white" @click.stop="showUser = !showUser">
                <v-avatar :size="userChipSize">
                    <img :src="userImg" :alt="data.name">
                </v-avatar>
                <v-slide-x-transition>
                    <span v-if="showUser">
                        {{ data.name }}
                    </span>
                </v-slide-x-transition>
            </v-chip>
        </template>
        <Loader v-else></Loader>
    </v-list-tile>
</template>

<script>
import Loader from '../components/Loader';

export default {
    data(){
        return{
            data: (Object.keys(this.obj).length > 0) ? this.obj : null,
            userChipSize: (this.avatarSize) ? this.avatarSize : 200,
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
            default: 200
        }
    }
}
</script>

<style>
    /* .v-chip .v-avatar{
        height: 52px !important;
        width: 52px !important;
    } */
</style>
