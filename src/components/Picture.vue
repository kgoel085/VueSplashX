<template>
    <div class="picture">
        
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    computed:{
        data(){
            return this.details;
        }
    },
    props:{
        details:{
            default: {},
            type: Object
        }
    }
}
</script>

<style>

</style>
