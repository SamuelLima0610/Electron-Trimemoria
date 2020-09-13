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
                                            src="https://firebasestorage.googleapis.com/v0/b/trimemoria.appspot.com/o/Aves%2F20200728_134410.jpg?alt=media&token=1520ba04-d162-4a42-9ada-d5a90f734644"
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
            length: 0
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
        }
    },
    async created(){
        let index = 0
        await this.getOrganizationById('3526')
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