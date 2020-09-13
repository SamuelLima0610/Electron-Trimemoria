<template>
    <v-app>
        <v-container>
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
                    <v-row>
                        <v-col  cols="12" md="4">
                            <v-btn class="mr-4" @click="submit">{{mode}}</v-btn>
                            <v-btn @click="clear" v-if="mode === 'Novo'">Limpar</v-btn>
                            <v-btn @click="del" v-else>Excluir</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
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
            <v-data-table
                :headers="headers"
                :items="organizations"
                :items-per-page="5"
                class="elevation-1"
                @click:row="selectedRow"
            ></v-data-table>
        </v-container>
    </v-app>
</template>

<script>
import axios from 'axios'
export default {
    name: "OrganizationTagGame",
    data(){
        return{
            organization:{},
            organizations: [],
            config: [],
            index: 0,
            headers: [
                { text: 'Id',align: 'center',sortable: true,value: 'id',},
                { text: 'Nome',align: 'center',sortable: true,value: 'name',},
                { text: 'Quantidade(Tags)',align: 'center',sortable: true,value: 'qntd',}
            ],
            rules:{
                required: value => !!value || 'Inserir'
            },
            linkDelete: '',
            linkPut: '',
            mode:'Novo',
            id: 0,
            rows: 0,
            columns: 0,
            snackbar: false,
            textSnackbar: '',
            timeout: 5000,
        }
    },
    methods:{
        submit(){
            if(this.mode == "Novo"){
                this.new()
            }else if(this.mode == 'Editar'){
                this.put()
            }
        },
        getOrganizations(){
            axios.get('https://rest-api-trimemoria.herokuapp.com/configGame').then(res => {
                this.organizations = res.data.data;
            })
        },
        selectedRow(value){
            this.clear()
            this.organization = {...value}
            this.onlyTag(this.organization.configurationTag)
            this.getOrganizationById(value.id)
        },
        getOrganizationById(id){ 
            axios.get(`https://rest-api-trimemoria.herokuapp.com/configGame/${id}`).then(res => {
                this.mode = 'Editar'
                this.id = id
                let links = res.data._links
                this.linkDelete = links[0].href
                this.linkPut = links[1].href
            })
        },
        clear(){
            this.organization.name = ''
            this.rows = 0
            this.columns = 0
            this.config = []
            this.mode = 'Novo'
            this.index = 0
            this.getOrganizations();
        },
        new(){
            if(this.$refs.form.validate()){
                let configCoordinates = this.takeTheCoordinates()
                axios.post(
                    'https://rest-api-trimemoria.herokuapp.com/configGame',
                    {name: this.organization.name, qntd: this.length, configurationTag: configCoordinates})
                .then((res) => {
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
            if(this.$refs.form.validate()){
                let {name} = this.organization
                let configCoordinates = this.takeTheCoordinates()
                let change = {name, id: this.id, configurationTag: configCoordinates}
                axios.put(this.linkPut,change).then(res => {
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
            axios.delete(this.linkDelete).then(res => {
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
            this.index++
        },
        arrowLeft(){
            this.index--
        },
        takeTheCoordinates(){
            let configCoordinates = []
            let index = 0
            if(this.config.length == this.length){
                let row = 1
                let column = 1
                while(row <= this.rows){
                    while(column <= this.columns){
                        console.log(`{${row}${column}:"${this.config[index]}"}`)
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
            this.config = []
            let index = 0
            coordinates.forEach(coordinate => {
                for(let chave in coordinate){
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
            return this.columns * this.rows
        }
    },
    created(){
        this.getOrganizations()
    }
}
</script>

<style>

</style>