<template>
    <v-app>
        <v-container>
            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" md="12">
                            Novo:
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="image.group"
                                label="Grupo: "
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col  cols="12" md="8">
                            <v-select
                                :items="themes"
                                label="Tema:"
                                item-text="name"
                                item-value="name"
                                @change="show"
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col  cols="12" md="12">
                            <v-file-input 
                                label="Selecione a imagem" 
                                chips 
                                v-model="image.file" 
                                outlined
                            />
                        </v-col>    
                    </v-row>
                    <v-row>
                        <v-col  cols="12" md="12">
                            <v-btn class="mr-4" @click="submit">{{mode}}</v-btn>
                            <v-btn @click="clear" v-if="mode === 'Novo'">Limpar</v-btn>
                            <v-btn @click="del" v-else>Excluir</v-btn>
                            <!--<v-btn class="ml-4" @click="arrowLeft" :disabled="index == 0">Anterior</v-btn>
                            <v-btn class="ml-4" @click="arrowRight" :disabled="index == 0">proximo</v-btn> -->
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
            <v-data-table
                :headers="headers"
                :items="saved"
                :items-per-page="5"
                class="elevation-1"
                @click:row="selectedRow"
            ></v-data-table>
        </v-container>
    </v-app>
</template>

<script>
import axios from 'axios'
import FormData from 'form-data'

export default {
    data(){
        return{
            themes:[],
            image:{},
            index: 0,
            headers: [
                { text: 'Id',align: 'center',sortable: true,value: 'id',},
                { text: 'Tema',align: 'center',sortable: true,value: 'theme',},
                { text: 'Grupo',align: 'center',sortable: true,value: 'group',}
            ],
            saved:[],
            linkDelete: '',
            linkPut: '',
            mode:'Novo',
            id: 0,
        }
    },
    methods:{
        show(value){
            this.image.theme = value
        },
        submit(){
            if(this.mode == "Novo"){
                this.new()
            }else if(this.mode == 'Editar'){
                this.put()
            }
        },
        getImages(){
            axios.get('https://rest-api-trimemoria.herokuapp.com/image').then(res => {
                this.saved = res.data.data;
            })
        },
        getThemes(){
            axios.get('https://rest-api-trimemoria.herokuapp.com/theme').then(res => {
                this.themes = res.data.data
            })
        },
        selectedRow(value){
            this.clear()
            this.image = {...value}
            this.getImageById(value.id)
        },
        getImageById(id){ 
            axios.get(`https://rest-api-trimemoria.herokuapp.com/image/${id}`).then(res => {
                this.mode = 'Editar'
                this.id = id
                let links = res.data._links
                this.linkDelete = links[0].href
                this.linkPut = links[1].href
            })
        },
        clear(){
            this.image = {}
            this.config = []
            this.mode = 'Novo'
            this.index = 0
            this.getImages();
        },
        new(){
            let formData = new FormData()
            let date = new Date()
            let headers = {
                "Content-Type":  `multipart/form-data; boundary=${formData._boundary}`
            }
            formData.append('theme', this.image.theme)
            formData.append('extension', '.' + this.image.file.name.split('.')[1])
            formData.append('group', this.image.group)
            formData.append('number', date.getMilliseconds())
            formData.append("file",this.image.file);
            axios.post(
                'https://rest-api-trimemoria.herokuapp.com/image',formData,headers
            )
            .then((res) => {
                this.clear()
                console.log(res.data)
            }).catch( (error) => {
                console.log("Erro")
                console.log(error)
            })
        },
        put(){
            /*let {name} = this.organization
            let configCoordinates = this.takeTheCoordinates()
            let change = {name, id: this.id, configurationTag: configCoordinates}
            axios.put(this.linkPut,change).then(res => {
                this.id=0
                this.clear()
                console.log(res.data)
            }).catch(error => {
                console.log(error)
            })*/
        },
        del(){
            /*axios.delete(this.linkDelete).then(res => {
                this.clear()
                console.log(res.data)
            })*/
        },
        arrowRight(){
            this.index++
        },
        arrowLeft(){
            this.index--
        },
    },
    created(){
        this.getImages()
        this.getThemes()
    }
}
</script>

<style>

</style>