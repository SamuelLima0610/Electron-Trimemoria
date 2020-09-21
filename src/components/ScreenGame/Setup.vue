<template>
  <v-app>
    <v-container class="mt-15">
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">Configuração do jogo:</v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-select
                :items="themes"
                label="Tema:"
                item-text="name"
                @change="showTheme"
              ></v-select>
            </v-col>

            <v-col cols="12" md="8">
              <v-select
                :items="configsTag"
                label="Configuração:"
                item-text="name"
                @change="showConfig"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-btn class="mr-4" @click="submit">Jogar</v-btn>
              <v-btn @click="goBack" >Voltar</v-btn>
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
            textSnackbar: ''
        }
    },
    methods:{
        goBack(){

        },
        submit(){
          axios.get(`https://rest-api-trimemoria.herokuapp.com/theme/image/${this.theme}`).then(res => {
              if(res.data.data.length == this.config.configurationTag.length) this.$router.push({path: `/game/${this.theme}/${this.config.id}`})
              else{
                this.snackbar = true
                this.textSnackbar = 'A quantidade de peças do tema e da configuração não são iguais'
              }
          })
        },
        getThemes(){
            axios.get('https://rest-api-trimemoria.herokuapp.com/theme').then(res => {
                this.themes = res.data.data;
            })
        },
        getOrganizations(){
          axios.get('https://rest-api-trimemoria.herokuapp.com/configGame').then(res => {
                this.configsTag = res.data.data;
          })
        },
        showTheme(value){
          this.theme = value
        },
        showConfig(value){
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