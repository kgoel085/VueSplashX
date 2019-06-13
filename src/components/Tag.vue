<template>
    <v-tabs
        show-arrows
        class="secondary"
        v-if="data"
    >
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab
        v-for="(tag, indx) in data"
        :key="indx"
        >
            {{ tag.title }}
        </v-tab>
    </v-tabs>
    <Loader v-else />
</template>

<script>
import Loader from '@/components/Loader';

export default {
    data(){
        return {
            data: (this.obj.length > 0) ? this.obj : null
        }
    },
    components:{
        Loader
    },
    props:{
        obj:{
            type: Array,
            default: []
        }
    }
}
</script>

<style>

</style>
