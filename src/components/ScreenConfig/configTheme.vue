<template>
    <v-app>
        <v-container class="mt-15">
            <v-form ref="form">
                <v-row>
                    <v-col cols="12" md="12">
                        Novo:
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="theme.name"
                            label="Tema"
                            :rules="[rules.required]"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col  cols="12" md="4">
                        <v-text-field
                            v-model="theme.qntd"
                            :rules="[rules.required]"
                            label="Quantidade de peças:"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col  cols="12" md="4">
                        <v-btn class="mr-4" @click="submit">{{mode}}</v-btn>
                        <v-btn @click="clear" v-if="mode === 'Novo'">Limpar</v-btn>
                        <v-btn @click="del" v-else>Excluir</v-btn>
                    </v-col>
                </v-row>
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
                :items="themes"
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
    name: "Themes",
    data(){
        return{
            theme:{},
            themes: [],
            headers: [
                { text: 'Id',align: 'center',sortable: true,value: 'id',},
                { text: 'Nome',align: 'center',sortable: true,value: 'name',},
                { text: 'Quantidade de Peças',align: 'center',sortable: true,value: 'qntd',},
            ],
            linkDelete: '',
            linkPut: '',
            mode:'Novo',
            rules:{
                required: value => !!value || 'Inserir'
            },
            id: 0,
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
        getThemes(){
            axios.get('https://rest-api-trimemoria.herokuapp.com/theme').then(res => {
                this.themes = res.data.data;
            })
        },
        selectedRow(value){
            this.theme = {...value}
            this.getThemeById(value.id)
        },
        getThemeById(id){ 
            axios.get(`https://rest-api-trimemoria.herokuapp.com/theme/${id}`).then(res => {
                this.mode = 'Editar'
                this.id = id
                let links = res.data._links
                this.linkDelete = links[0].href
                this.linkPut = links[1].href
            })
        },
        clear(){
            this.theme.name = ''
            this.theme.qntd = 0
            this.mode = 'Novo'
            this.getThemes();
        },
        new(){
            if(this.$refs.form.validate()){
                axios.post('https://rest-api-trimemoria.herokuapp.com/theme',{name: this.theme.name, qntd: this.theme.qntd}).then((res) => {
                    this.snackbar = true
                    this.textSnackbar = res.data.data
                    this.clear()
                    console.log(res.data)
                }).catch( (error) => {
                    this.snackbar = true
                    this.textSnackbar = error.response.data.error
                })
            }    
        },
        put(){
            if(this.$refs.form.validate()){
                let change = {...this.theme, id: this.id}
                axios.put(this.linkPut,change).then(res => {
                    this.id=0
                    this.snackbar = true
                    this.textSnackbar = res.data.data
                    this.clear()
                }).catch(error => {
                    this.snackbar = true
                    this.textSnackbar = error.response.data.error
                })
            }    
        },
        del(){
            axios.delete(this.linkDelete).then(res => {
                this.snackbar = true
                this.textSnackbar = 'Excluido com sucesso'
                this.clear()
                console.log(res.data)
            }).catch(error => {
                this.snackbar = true
                this.textSnackbar = error.response.data.error
            })
        }
    },
    created(){
        this.getThemes()
    }
}
</script>

<style>

</style>