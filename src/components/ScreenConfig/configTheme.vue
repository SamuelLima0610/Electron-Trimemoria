<template>
    <v-app>
        <v-container class="mt-15">
            <!--Inicio do Formulario -->
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
                        <v-btn class="mr-4 text-button" @click="submit" color="warning" >{{mode}}</v-btn>
                        <v-btn @click="clear" v-if="mode === 'Novo'" color="warning" >Limpar</v-btn>
                        <v-btn @click="del" v-else color="warning">Excluir</v-btn>
                    </v-col>
                </v-row>
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
            <!--Fim do Snackbar (Aviso do resultado da ação) -->
            <!--Inicio da tabela (Listagem de todas as instâncias cadastradas) -->
            <v-data-table
                :headers="headers"
                :items="themes"
                :items-per-page="5"
                class="elevation-1"
                @click:row="selectedRow"
            ></v-data-table>
        </v-container>
        <!--Fim da tabela -->
    </v-app>
</template>

<script>
import axios from 'axios'
export default {
    name: "Themes",
    data(){
        return{
            theme:{}, //variavel por armazenar as informações fornecidas pelo form
            themes: [],// lista das instâncias cadastradas
            headers: [//cabeçalho da tabela
                { text: 'Id',align: 'center',sortable: true,value: 'id',},
                { text: 'Nome',align: 'center',sortable: true,value: 'name',},
                { text: 'Quantidade de Peças',align: 'center',sortable: true,value: 'qntd',},
            ],
            linkDelete: '',// link para remover a instância escolhida
            linkPut: '',// link para editar a instância escolhida
            mode:'Novo',//Saber a ação a ser realizada, ('Novo' = criar) ('Editar' = editar)
            //regra para validação do formulario
            rules:{
                required: value => !!value || 'Inserir'
            },
            id: 0, // id da instância escolhida (Tabela)
            snackbar: false,//controle da snackbar 
            textSnackbar: '',//Texto a ser mostrado no snackbar
            timeout: 5000,//duração do snackbar
            url: "https://rest-api-trimemoria.herokuapp.com/config/themes", // a url do terminal da api para configuraçao do tema
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
                this.put()// requisição Put para a API
            }
        },
        getThemes(){
            //Pedir a lista das instâncias armazenadas (GET)
            axios.get(this.url,this.header).then(res => {
                this.themes = res.data.data;
            })
        },
        selectedRow(value){
            //Carregamento das informações da instância escolhida na tabela
            this.theme = {...value}
            this.getThemeById(value.id)
        },
        getThemeById(id){ 
            //Requisição das informações da instância escolhida na tabela
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
            this.theme.name = ''
            this.theme.qntd = 0
            this.mode = 'Novo'
            this.getThemes();
        },
        new(){
            if(this.$refs.form.validate()){ //verifica se o form foi validado
                //Enviar a requisição POST para a API
                axios.post(this.url,{name: this.theme.name, qntd: this.theme.qntd},this.header).then((res) => {
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
            //Enviar a requisição PUT para a API
            if(this.$refs.form.validate()){ //verifica se o form foi validado
                let change = {...this.theme, id: this.id} //organiza a informação a ser enviada para a API
                axios.put(this.linkPut,change,this.header).then(res => {
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
            //Enviar a requisição DELETE para a API
            axios.delete(this.linkDelete,this.header).then(res => {
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
        //chama o metodo para requisitar API o recebimento das instâncias armazenadas
        this.getThemes()
    }
}
</script>

<style>

.text-button{
    color: white
}

</style>