<template>
    <div class="singleCollection">
        <v-container fluid class="pa-1" :disabled="!apiKey">
            <v-layout row wrap v-if="data !== null">
                <v-flex xs12 >
                    <v-parallax :src="coverPhoto.img" v-if="coverPhoto.img" :alt="(coverPhoto.alt) ? coverPhoto.alt : ''" :height="dimensionObj.origHeight">
                        <v-layout align-center column justify-center>
                            <h1 class="display-2 font-weight-thin mb-3">{{ data.title }}</h1>
                            <h4 class="subheading">
                                <v-chip v-if="data.user.name">
                                    <v-avatar class="primary white--text">@</v-avatar>
                                    {{ data.user.name }}
                                </v-chip>

                                <v-chip v-if="data.total_photos">
                                    <v-avatar class="secondary white--text">
                                        <v-icon>collections</v-icon>
                                    </v-avatar>
                                    {{ data.total_photos }}
                                </v-chip>
                            </h4>
                        </v-layout>
                    </v-parallax>
                </v-flex>

                <v-flex xs12 v-if="picData.length > 0">
                    <v-layout row wrap>
                        <Picture v-for="(colData,indx) in picData" :details="colData" :key="indx"></Picture>
                    </v-layout>
                </v-flex>
                
            </v-layout>
            <Loader v-else></Loader>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import Picture from '@/components/Picture';
import Loader from '@/components/Loader';

export default {
    data(){
        return {
            data:null,
            picData: [],
            blurFunction: null,
            scrollFunction: null,
            params: {
                page: 1,
                per_page: 15
            }
        }
    },
    components:{
        Picture,
        Loader
    },
    computed:{
        queryId(){
            if(this.$route.params.id) return this.$route.params.id;
            return null;
        },
        coverPhoto(){
            let returnVal = {
                img: null,
                alt: null
            };

            if(this.data && this.data.hasOwnProperty('cover_photo')){
                if(this.data.cover_photo.urls[this.dimensionObj.imgType]){
                    returnVal['img'] = this.data.cover_photo.urls[this.dimensionObj.imgType];

                    // Bind blur scroll event 
                    setTimeout(() => {
                        this.setBlur();
                    }, 1000);
                    
                }
                if(this.data.cover_photo.alt_description) returnVal['alt'] = this.data.cover_photo.alt_description;
            }

            return returnVal;
        }
    },
    methods:{
        // Get collection related data
        getCollectionDetails(){
            if(!this.queryId) return false;

            let vm = this;
            
            axios.get('/collections/'+this.queryId).then(resp => {
                let vm = this;
                let data = resp.data.success.data;

                if(data){
                    vm.data = data;
                    vm.getCollectionPhotos();
                }
            }).catch(err => {
               this.$store.commit('setApiErr', err.message);
            });
        },

        // Get colelction related photos
        getCollectionPhotos(){
            if(!this.queryId) return false;

             axios.get('/collections/'+this.queryId+'/photos', {params: this.params}).then(resp => {
                let vm = this;
                let data = resp.data.success.data;

                // Check for pagination info
                if(resp.data.success.hasOwnProperty('extra_info')){
                    let pgInfo = resp.data.success.extra_info.pagination;
                    if(pgInfo.hasOwnProperty('page')) vm.params.page = pgInfo.page;
                }

                if(data.length > 0){
                    data.forEach(element => {
                        vm.picData.push(element);
                    });
                }
            }).catch(err => {
               this.$store.commit('setApiErr', err.message);
            });
        },

        // Set blur for Hero image on scroll
        setBlur(){
            let elem = document.querySelector('img.v-parallax__image');
            this.blurFunction = () => {
                let origScroll = (window.scrollY > 50) ? (window.scrollY / 100) : 0;
                elem.style.filter = `blur(${origScroll}px)`;
            }

            window.addEventListener('scroll', this.blurFunction);
        }
    },
    mounted(){
        if(this.queryId && this.apiKey){
            this.getCollectionDetails();

            this.scrollFunction = () => {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.tokenExpired) this.getCollectionPhotos();
            };

            // On scroll, call next batch
            window.addEventListener('scroll', this.scrollFunction);
        }
    },
    beforeDestroy(){
        if(this.scrollFunction) window.removeEventListener('scroll', this.scrollFunction);
        if(this.blurFunction) window.removeEventListener('scroll', this.blurFunction);
    }
}
</script>

<style>

</style>
