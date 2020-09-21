<template>
        <v-row class="mt-15">
            <v-col cols="12" sm="6" offset-sm="3">
                <v-card>
                    <v-container fluid>
                        <v-row>
                            <v-col
                                v-for="n in length"
                                :key="n"
                                class="d-flex child-flex"
                                :cols=columns
                            >
                                <v-card flat tile class="d-flex" trasition="fab-transition">
                                        <v-img v-if="image!=n"
                                            :src="`https://picsum.photos/500/300?image=${0}`"
                                            aspect-ratio="1"
                                            class="grey lighten-2"
                                            @click="ImageClicked(n)"
                                        />
                                        <v-img v-else
                                            :src="showImage(n)"
                                            aspect-ratio="1"
                                            class="grey lighten-2"
                                            @click="ImageClicked(n)"
                                        />
                                </v-card>     
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            image:'',
            rows: 0,
            columns: 0,
            config: null,
            length: 0,
            images: [],
        }
    },
    methods:{
        ImageClicked(id){
            this.image = id
        },
        async getOrganizationById(id){ 
            await axios.get(`https://rest-api-trimemoria.herokuapp.com/configGame/${id}`).then(res => {
                this.config = res.data.data             
            })
        },
        async getThemeImages(theme){ 
            axios.get(`https://rest-api-trimemoria.herokuapp.com/theme/image/${theme}`).then(res => {
              this.images = res.data.data
            })
        },
        showImage(n) {
            return this.images[n - 1].href
        }
    },
    async created(){
        let index = 0
        await this.getOrganizationById(this.$route.params.config)
        await this.getThemeImages(this.$route.params.theme)
        let coordinates = this.config.configurationTag
        coordinates.forEach(coordinate => {
            for(let chave in coordinate){
                if(index == coordinates.length - 1){
                    let position = `${chave}`
                    this.rows = parseInt(position[0])
                    this.columns = Math.round( 12 / parseInt(position[1]))
                }
                index++
            }
        })
        this.length = index
        
    }
}
</script>

<style>
    
</style>