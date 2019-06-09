<template>
    <span>{{ queryId }}</span>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    computed:{
        queryId(){
            if(this.$route.params.id) return this.$route.params.id;
            return null;
        }
    },
    methods:{
        getCollectionDetails(){
            console.log(this.queryId);
        }
    },
    mounted(){
        if(this.queryId && this.apiKey) this.getCollectionDetails();
    }
}
</script>

<style>

</style>
