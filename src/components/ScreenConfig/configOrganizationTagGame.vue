<template>
    <v-app>
        <v-container>
            <!--Inicio do Formulario -->
            <v-form ref="form">
                <v-container class="mt-15">
                    <v-row>
                        <v-col cols="12" md="12">
                            Novo:
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="8">
                            <v-text-field
                                v-model="organization.name"
                                label="Nome"
                                required
                                :rules="[rules.required]"
                            ></v-text-field>
                        </v-col>

                        <v-col  cols="12" md="2">
                            <v-text-field
                                v-model="rows"
                                label="Linhas:"
                                required
                                :rules="[rules.required]"
                            ></v-text-field>
                        </v-col>

                        <v-col  cols="12" md="2">
                            <v-text-field
                                v-model="columns"
                                label="Colunas:"
                                required
                                :rules="[rules.required]"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <!-- Inicio Parte do cadastrado do arranjo das tags-->
                    <v-row>
                        <v-col cols="1" md="1">
                            <v-btn color="warning" fab x-small dark @click="arrowLeft" :disabled="index == 0">
                                <v-icon>mdi-arrow-left</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col  cols="1" md="1">
                            <v-text-field
                                v-model="index"
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col  cols="9" md="9">
                            <v-text-field
                                v-model="config[index]"
                                label="Tag:"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="1" md="1">
                            <v-btn color="warning" fab x-small dark @click="arrowRight" :disabled="index == length - 1">
                                <v-icon>mdi-arrow-right</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!-- Fim Parte do cadastrado do arranjo das tags-->
                    <v-row>
                        <v-col  cols="12" md="4">
                            <v-btn class="mr-4" @click="submit" color="warning">{{mode}}</v-btn>
                            <v-btn @click="clear" v-if="mode === 'Novo'" color="warning">Limpar</v-btn>
                            <v-btn @click="del" v-else color="warning">Excluir</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
            <!--Fim do Formulario -->
            <!--Inicio do Snackbar (Aviso do resultado da ação) -->
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
            <!--Fim do Snackbar -->
            <!--Inicio da tabela (Listagem de todas as instâncias cadastradas) -->
            <v-data-table
                :headers="headers"
                :items="organizations"
                :items-per-page="5"
                class="elevation-1"
                @click:row="selectedRow"
            ></v-data-table>
            <!--Fim da tabela -->
        </v-container>
    </v-app>
</template>

<script>
import axios from 'axios'
export default {
    name: "OrganizationTagGame",
    data(){
        return{
            organization:{},//variavel por armazenar as informações fornecidas pelo form
            organizations: [], // lista das instâncias cadastradas
            config: [], // arranjo das tags
            index: 0, // index auxiliar para percorrer o arranjo
            headers: [ //cabeçalho da tabela
                { text: 'Id',align: 'center',sortable: true,value: 'id',},
                { text: 'Nome',align: 'center',sortable: true,value: 'name',},
                { text: 'Quantidade(Tags)',align: 'center',sortable: true,value: 'qntd',}
            ],
            //regra para validação do formulario
            rules:{
                required: value => !!value || 'Inserir'
            },
            linkDelete: '', // link para remover a instância escolhida
            linkPut: '',// link para editar a instância escolhida
            mode:'Novo', //Saber a ação a ser realizada, ('Novo' = criar) ('Editar' = editar)
            id: 0, // id da instância escolhida (Tabela)
            rows: 0, // quantidade de linhas no arranjo
            columns: 0,// quantidade de colunas no arranjo
            snackbar: false, //controle da snackbar 
            textSnackbar: '',//Texto a ser mostrado no snackbar
            timeout: 5000,//duração do snackbar
            url: "https://rest-api-trimemoria.herokuapp.com/config/configuration",
            header: {
                headers: {
                    'Authorization': `Bearer pyzdQxKCneRl` 
                }
            }
        }
    },
    methods:{
        submit(){
            if(this.mode == "Novo"){
                this.new() // requisição Post para a API
            }else if(this.mode == 'Editar'){
                this.put() // requisição Put para a API
            }
        },
        getOrganizations(){
            //Pedir a lista das instâncias armazenadas (GET)
            axios.get(this.url,this.header).then(res => {
                this.organizations = res.data.data;
            })
        },
        selectedRow(value){
            //Carregamento das informações da instância escolhida na tabela
            this.clear() 
            this.organization = {...value}
            this.onlyTag(this.organization.configurationTag)
            this.getOrganizationById(value.id)
        },
        getOrganizationById(id){ 
            //Pedir uma instância armazenadas (GET)
            axios.get(`${this.url}/${id}`,this.header).then(res => {
                this.mode = 'Editar'
                this.id = id
                let links = res.data._links
                this.linkDelete = links[0].href
                this.linkPut = links[1].href
            })
        },
        clear(){
            //Limpar o formulario e atualizar a tabela
            this.organization.name = ''
            this.rows = 0
            this.columns = 0
            this.config = []
            this.mode = 'Novo'
            this.index = 0
            this.getOrganizations();
        },
        new(){
            //Enviar a requisição POST para a API
            if(this.$refs.form.validate()){
                let configCoordinates = this.takeTheCoordinates() //organiza o arranjo para o padrão desejado pela API
                axios.post(
                    this.url,
                    {name: this.organization.name, qntd: this.length, configurationTag: configCoordinates},
                    this.header
                ).then((res) => {
                    this.clear()
                    this.snackbar = true
                    this.textSnackbar = res.data.data
                }).catch( (error) => {
                    this.snackbar = true
                    this.textSnackbar = error.response.data.error
                })
            }    
        },
        put(){
            //Enviar a requisição PUT para a API
            if(this.$refs.form.validate()){
                let {name} = this.organization
                let configCoordinates = this.takeTheCoordinates() //organiza o arranjo para o padrão desejado pela API
                //organiza a informação a ser enviada para a API
                let change = {name, id: this.id, configurationTag: configCoordinates}
                axios.put(this.linkPut,change,this.header).then(res => {
                    this.id=0
                    this.clear()
                    this.snackbar = true
                    this.textSnackbar = res.data.data
                }).catch(error => {
                    this.snackbar = true
                    this.textSnackbar = error.response.data.error
                })
            }    
        },
        del(){
            //Enviar a requisição DELETE para a API
            axios.delete(this.linkDelete,this.header).then(res => {
                this.clear()
                this.snackbar = true
                this.textSnackbar = res.data.data
                console.log(res.data)
            }).catch(error => {
                this.snackbar = true
                this.textSnackbar = error.response.data.error
            })
        },
        arrowRight(){
            //controle do arranjo pelo form
            this.index++
        },
        arrowLeft(){
            //controle do arranjo pelo form
            this.index--
        },
        takeTheCoordinates(){
            //Organizar a lista do arranjo
            let configCoordinates = []
            let index = 0
            //verifica se o arranjo foi completado
            if(this.config.length == this.length){
                let row = 1
                let column = 1
                while(row <= this.rows){
                    while(column <= this.columns){
                        //coloca para o padrão JSON desejado (ex: 11: '6G 90 K8')
                        let json = JSON.parse(`{"${row}${column}":"${this.config[index]}"}`)
                        configCoordinates.push(json)
                        index++
                        column++
                    }
                    row++
                    column = 1
                }
            }
            return configCoordinates
        },
        onlyTag(coordinates){
            //pegar somente as tags do arranjo escolhido
            this.config = []
            let index = 0
            coordinates.forEach(coordinate => {
                //pega as chaves do JSON
                for(let chave in coordinate){
                    //ultimo armazenado
                    if(index == coordinates.length - 1){
                        let position = `${chave}`
                        this.rows = parseInt(position[0])
                        this.columns = parseInt(position[1])
                    }
                    this.config.push(coordinate[chave])
                    index++
                }
            })
        }
    },
    computed:{
        length(){
            //pega o comprimento do arranjo
            return this.columns * this.rows
        }
    },
    created(){
        //chama o metodo para requisitar API o recebimento das instâncias armazenadas
        this.getOrganizations()
    }
}
</script>

<style>

</style>