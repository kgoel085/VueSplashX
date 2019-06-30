<template>
    <span>{{ searchQry }}</span>
</template>

<script>
export default {
    data(){
        return {
            dataObj: []
        }
    },
    computed:{
        searchQry(){
            if(this.$route.params.hasOwnProperty('t') && this.$route.params.t) return this.$route.params.t;
            return false;
        }
    }
}
</script>

<style>

</style>
