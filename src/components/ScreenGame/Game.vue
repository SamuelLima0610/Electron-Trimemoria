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
                                        <v-img v-if="cards[n-1].isFlipped == false"
                                            :src="`https://picsum.photos/500/300?image=${0}`"
                                            aspect-ratio="1"
                                            class="grey lighten-2"
                                            @click="takeCard(n)"
                                        />
                                        <v-img v-else
                                            :src="showImage(n)"
                                            aspect-ratio="1"
                                            class="grey lighten-2"
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
import Vue from 'vue'
import io from 'socket.io-client';
let socket = null
export default {
    data(){
        return {
            rows: 0,
            columns: 0,
            config: null,
            length: 0,
            images: [],
            cards:[],
            pickedCards: [],
            quantCard: 0,
        }
    },
    methods:{
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
        },
        takeCard(n){
            this.pickedCards.push({group:this.images[n - 1].group,index: n -1})
            this.quantCard++
            Vue.set(this.cards[n-1],'isFlipped',true)
            if(this.quantCard == 2){
                setTimeout(()=>{
                    if(this.pickedCards[0].group == this.pickedCards[1].group){
                        console.log('Encontrou', this.pickedCards[0].index)
                        Vue.set(this.cards[this.pickedCards[0].index],'isFlipped',true)
                        Vue.set(this.cards[this.pickedCards[1].index],'isFlipped',true)
                    }else{
                        console.log('Não Encontrou')
                        Vue.set(this.cards[this.pickedCards[0].index],'isFlipped',false)
                        Vue.set(this.cards[this.pickedCards[1].index],'isFlipped',false)
                    }
                this.quantCard = 0
                this.pickedCards = []
                }, 3000);
            }
        },
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
            this.cards.push({isFlipped: false})
        })
        this.length = index
        socket = io("http://localhost:4000") 
        socket.on('tag', (data) => {
            let index = 0
            let aux = 1
            coordinates.forEach(element => {
                let position = ''
                for(let chave in element){
                    position = `${chave}`
                    if(element[position] == data.tag) index = aux
                }
                aux++
            })
            this.takeCard(index)
        })
    },
    destroyed(){
        if(socket != null) socket.disconnect(true)
    }
}
</script>

<style>
    
</style>