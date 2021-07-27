<template>
  <v-app>
    <v-container class="mt-15">
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">Configuração do jogo:</v-col>
          </v-row>
          <v-row>
            <!-- Select dos temas -->
            <v-col cols="12" md="8">
              <v-select
                :items="themes"
                label="Tema:"
                item-text="name"
                @change="showTheme"
                color="warning"
              ></v-select>
            </v-col>
            <!--Select das configurações das tags-->
            <v-col cols="12" md="8">
              <v-select
                :items="configsTag"
                label="Configuração:"
                item-text="name"
                @change="showConfig"
                color="warning"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-btn class="mr-4" @click="submit" color="warning">Jogar</v-btn>
              <v-btn @click="goBack" color="warning" >Voltar</v-btn>
            </v-col>
          </v-row>
          
          <v-snackbar v-model="snackbar" :timeout="timeout">
                {{ textSnackbar }}
                <template v-slot:action="{ attrs }">
                    <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                    >
                    Close
                    </v-btn>
                </template>
            </v-snackbar>
        </v-container>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
    name: "Setup",
    data(){
        return{
            themes:[],
            configsTag: [],
            theme: '',
            config: '',
            snackbar: false,
            timeout: 5000,
            textSnackbar: '',
            header: {
                headers: {
                    'Authorization': `Bearer pyzdQxKCneRl` 
                }
            }
        }
    },
    methods:{
        goBack(){
          //retorna para a home
          this.$router.push({path: '/'}) 
        },
        submit(){
          //Pega todas as imagens relacionados aquele tema
          console.log(this.theme)
          axios.get(`https://rest-api-trimemoria.herokuapp.com/config/image/imageTheme/theme/${this.theme}`,this.header).then(res => {
              console.log(res.data.data.length)
              if(res.data.data.length == this.config.configurationTag.length) this.$router.push({path: `/game/${this.theme}/${this.config.id}`})
              else{
                this.snackbar = true
                this.textSnackbar = 'A quantidade de peças do tema e da configuração não são iguais'
              }
          })
        },
        getThemes(){
            //Pega todos os temas cadastrados na API
            axios.get('https://rest-api-trimemoria.herokuapp.com/config/themes',this.header).then(res => {
                this.themes = res.data.data;
            })
        },
        getOrganizations(){
          //Pega todos as configurações das tags cadastrados na API
          axios.get('https://rest-api-trimemoria.herokuapp.com/config/configuration',this.header).then(res => {
                this.configsTag = res.data.data;
          })
        },
        showTheme(value){
          //armazena o tema escolhido
          this.theme = value
        },
        showConfig(value){
          //armazena a configuração escolhida
          this.configsTag.forEach( config => {
            if(config.name == value) this.config = config
          })
        }
    },
    created(){
        this.getThemes()
        this.getOrganizations()
    }
}
</script>

<style>

</style>