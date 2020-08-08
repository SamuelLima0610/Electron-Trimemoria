<template>
    <v-app>
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12" md="4">
                        Novo:
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="theme.name"
                            label="Tema"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col  cols="12" md="4">
                        <v-text-field
                            v-model="theme.qntd"
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
                <v-data-table
                    :headers="headers"
                    :items="themes"
                    :items-per-page="5"
                    class="elevation-1"
                    @click:row="selectedRow"
                ></v-data-table>
            </v-container>
        </v-form>
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
            id: 0
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
            axios.get('http://localhost:4000/theme').then(res => {
                this.themes = res.data.data;
                console.log(this.themes)
            })
        },
        selectedRow(value){
            this.theme.name = ''
            this.getThemeById(value.id)
        },
        getThemeById(id){ 
            axios.get(`https://rest-api-trimemoria.herokuapp.com/theme/${id}`).then(res => {
                console.log(id)
                this.mode = 'Editar'
                let {name, qntd} =  res.data.data 
                this.theme.name = name
                this.theme.qntd = qntd
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
            console.log(this.theme)
            axios.post('https://rest-api-trimemoria.herokuapp.com/theme',{name: this.theme.name, qntd: this.theme.qntd}).then((res) => {
                this.clear()
                console.log(res.data)
            }).catch( (error) => {
                console.log(error)
            })
        },
        put(){
            let change = {...this.theme, id: this.id}
            axios.put(this.linkPut,change).then(res => {
                this.id = 0
                this.clear()
                console.log(res.data)
            }).catch(error => {
                console.log(error)
            })
        },
        del(){
            axios.delete(this.linkDelete).then(res => {
                this.clear()
                console.log(res.data)
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