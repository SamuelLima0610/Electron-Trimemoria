<template>
        <v-row class="mt-15 mb-5 ml-5 mr-5">
            <v-col cols="12">
                <v-row>
                    <v-col
                        v-for="n in length"
                        :key="n"
                        class="d-flex child-flex"
                        :cols=columns
                    >
                        <v-card outlined>
                        <!--Imagem de fundo-->
                        <v-img v-if="cards[n-1].isFlipped == false"
                            contain
                            class="ml-2 mr-2"
                            :src="`https://firebasestorage.googleapis.com/v0/b/trimemoria.appspot.com/o/sun.png?alt=media&token=8c4c2c80-ee81-4ded-8df6-f59fc22bc2fd`"
                            aspect-ratio="1"
                            @click="takeCard(n)"
                        >
                            <template v-slot:placeholder>
                                <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <v-progress-circular
                                    indeterminate
                                    color="grey lighten-5"
                                    ></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                        <!-- Imagem da carta-->
                        <v-img v-else
                        contain
                        :src="showImage(n)"
                        aspect-ratio="1.4"
                        > 
                            <template v-slot:placeholder>
                                    <v-row
                                        class="fill-height ma-0"
                                        align="center"
                                        justify="center"
                                    >
                                        <v-progress-circular
                                        indeterminate
                                        color="grey lighten-5"
                                        ></v-progress-circular>
                                    </v-row>
                            </template>
                        </v-img>
                        </v-card> 
                    </v-col>
                </v-row>
            </v-col>
            <v-dialog
                v-model="dialog"
                max-width="290"
            >
                <v-card>
                    <v-card-title class="text-h5">
                    Deseja conitunar jogando?
                    </v-card-title>

                    <v-card-text>
                        Caso queira jogar com o mesmo tema clique em Jogar novamente, senão clique em ínicio!
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="yellow darken-1"
                        text
                        @click="goBack"
                    >
                        Ínicio
                    </v-btn>

                    <v-btn
                        color="yellow darken-1"
                        text
                        @click="playAgain"
                    >
                        Jogar Novamente!!!
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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
            publicPath: process.env.BASE_URL,
            rows: 0, //responsavel por armazenar a quantidade de linhas da grid
            columns: 0, //responsavel por armazenar a quantidade de colunas da grid
            config: null,
            length: 0,
            images: [], //imagens do tema escolhido
            cards:[],//estados das cartas (Se esta virada ou não)
            pickedCards: [], //Armazenas as cartas escolhidas na jogada
            quantCard: 0, // quantidade de jogadas realizadas
            header: {
                headers: {
                    'Authorization': `Bearer pyzdQxKCneRl` 
                }
            },
            dialog: false,
        }
    },
    methods:{
        goBack(){
          this.dialog = false
          //retorna para a home
          this.$router.push({path: '/'}) 
        },
        playAgain(){
          this.dialog = false
          //vai para a rota de configuração do jogo
          this.$router.push({path: '/setup'}) 
        },
        async getOrganizationById(id){
            //Solicita a API a organização das tags 
            await axios.get(`https://rest-api-trimemoria.herokuapp.com/config/configuration/${id}`,this.header).then(res => {
                this.config = res.data.data             
            })
        },
        async getThemeImages(theme){ 
            //Solicita a API as imagens do tema escolhido 
            axios.get(`https://rest-api-trimemoria.herokuapp.com/config/image/imageTheme/theme/${theme}`, this.header).then(res => {
              this.images = res.data.data
            })
        },
        showImage(n) {
            //retorna a imagem que o jogador clicou na grid
            return this.images[n - 1].url
        },
        takeCard(n){
            //realização do turno
            this.pickedCards.push({group:this.images[n - 1].group,index: n -1}) //escolha
            this.quantCard++
            Vue.set(this.cards[n-1],'isFlipped',true) // muda o estado isFlipped para true (Virada)
            if(this.quantCard == 3){
                //Timeout para mostrar todas as cartas escolhidas
                setTimeout(()=>{
                    if(this.pickedCards[0].group == this.pickedCards[1].group &&  this.pickedCards[1].group ==  this.pickedCards[2].group){//verifica se pertence ao mesmo grupo
                        //Deixa as cartas virada até o final do jogo
                        console.log('Encontrou', this.pickedCards[0].index)
                        Vue.set(this.cards[this.pickedCards[0].index],'isFlipped',true)
                        Vue.set(this.cards[this.pickedCards[1].index],'isFlipped',true)
                        Vue.set(this.cards[this.pickedCards[2].index],'isFlipped',true)
                        setTimeout(() =>{
                            let founded = this.cards.filter(element => element['isFlipped'] == false);
                            if(founded.length == 0) this.dialog = true;
                        }, 1000)
                    }else{
                        //Se não encontrou o grupo certo
                        //Desvira todas as cartas
                        console.log('Não Encontrou')
                        Vue.set(this.cards[this.pickedCards[0].index],'isFlipped',false)
                        Vue.set(this.cards[this.pickedCards[1].index],'isFlipped',false)
                        Vue.set(this.cards[this.pickedCards[2].index],'isFlipped',false)
                    }
                this.quantCard = 0 // limpa a quantidade de jogadas realizadas
                this.pickedCards = [] // limpa a lista das cartas escolhidas
                }, 3000);
            }
        },
    },
    async created(){
        let index = 0
        //pega a organização das tags escolhidas pelo jogador
        await this.getOrganizationById(this.$route.params.config)
        //pega as imagens do tema escolhido
        await this.getThemeImages(this.$route.params.theme)
        let coordinates = this.config.configurationTag
        //a partir das configurações determinar a quantidade de linhas e colunas da grid
        coordinates.forEach(coordinate => {
            for(let chave in coordinate){ //pega as chaves do JSON
                if(index == coordinates.length - 1){ //o ultimo json armazenado no vetor
                    let position = `${chave}`
                    this.rows = parseInt(position[0])
                    this.columns = Math.round( 12 / parseInt(position[1])) //tamanho da coluna
                    console.log(this.columns)
                }
                index++
            }
            this.cards.push({isFlipped: false}) //coloca para a carta ficar desvirada
        })
        this.length = index
        //criação de um websocket com a api para ficar recebendo as tags detectadas pelo dispositivo
        socket = io("https://rest-api-trimemoria.herokuapp.com") // se conecta a API
        socket.on('tag', (data) => {
            let index = 0
            let aux = 1
            //procura o index da tag detectada
            coordinates.forEach(element => {
                let position = ''
                for(let chave in element){
                    position = `${chave}`
                    if(element[position] == data.tag) index = aux
                }
                aux++
            })
            this.takeCard(index)//realiza a jogada
        })
    },
    destroyed(){
        //desconecta o socket
        if(socket != null) socket.disconnect(true)
    }
}
</script>

<style>
    
</style>