<template>
    <v-dialog v-model="dialog" fullscreen light full-width :loading="loading" @input="v => v || hideDialogBox()">
        Test Dialog
    </v-dialog>
</template>

<script>
export default {
    data(){
        return {
            dialog: this.value,
            loading: true
        }
    },
    props:{
        value: {
            default: false,
            type: Boolean
        }
    },
    methods:{
        hideDialogBox(){
            this.$store.commit('showPictureId', null);
        }
    },
    beforeDestroy(){
         this.$store.commit('showPictureId', null);
    }
}
</script>

<style>

</style>
