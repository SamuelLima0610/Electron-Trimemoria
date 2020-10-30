<template>
  <v-app>
    <v-container class="mt-15">
      <!--Inicio do Formulario -->
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">Novo:</v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="image.group"
                label="Grupo: "
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="8">
              <v-select
                :items="themes"
                label="Tema:"
                item-text="name"
                :value="theme"
                @change="show"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
          </v-row>

          <v-row v-if="mode=='Novo'">
            <v-col cols="12" md="12">
              <v-file-input
                label="Selecione a imagem"
                chips
                v-model="image.file"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col cols="12" md="12">
              <v-file-input
                label="Selecione a imagem"
                chips
                v-model="image.file"
                outlined
              />
            </v-col>
          </v-row>
          <!-- Fim do Formulario -->
          <!-- (Inicio) Mostra como vai ficar a imagem -->
          <v-row v-if="image.file != undefined" justify="center">
            <v-col cols="12" md="12">
              <v-img :src="showImage" aspect-ratio="2" contain max-height="600" max-width="600"></v-img>
            </v-col>
          </v-row>
          <!-- (Fim) Mostra como vai ficar a imagem -->
          <v-row>
            <v-col cols="12" md="12">
              <v-btn class="mr-4" @click="submit">{{mode}}</v-btn>
              <v-btn @click="clear" v-if="mode === 'Novo'">Limpar</v-btn>
              <v-btn @click="del" v-else>Excluir</v-btn>
              <!--<v-btn class="ml-4" @click="arrowLeft" :disabled="index == 0">Anterior</v-btn>
              <v-btn class="ml-4" @click="arrowRight" :disabled="index == 0">proximo</v-btn>-->
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
      <!--Fim do Snackbar (Aviso do resultado da ação) -->
      <!--Inicio da tabela (Listagem de todas as instâncias cadastradas) -->
      <v-data-table
        :headers="headers"
        :items="saved"
        :items-per-page="5"
        class="elevation-1"
        @click:row="selectedRow"
      ></v-data-table>
      <!--Fim da tabela -->
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import "../../storage"; //Informações necessarias para a utilização do Firebase
var storageRef = firebase.storage().ref(); //instancia para o FirebaseStorage

export default {
  data() {
    return {
      themes: [],// lista das instâncias cadastradas(Temas)
      image: {}, //variavel por armazenar as informações fornecidas pelo form
      theme: "", //variavel responsavel por armazenar o tema escolhido pelo form
      headers: [//cabeçalho da tabela
        { text: "Id", align: "center", sortable: true, value: "id" },
        { text: "Tema", align: "center", sortable: true, value: "theme" },
        { text: "Grupo", align: "center", sortable: true, value: "group" },
        { text: "Caminho", align: "center", sortable: true, value: "path" },
      ],
      rules: { //regra para validação do formulario
        required: (value) => !!value || "Inserir",
      },
      saved: [], // lista das instâncias cadastradas(Imagens)
      linkDelete: "", // link para remover a instância escolhida
      linkPut: "", // link para editar a instância escolhida
      mode: "Novo",//Saber a ação a ser realizada, ('Novo' = criar) ('Editar' = editar)
      id: 0, // id da instância escolhida (Tabela)
      snackbar: false,//controle da snackbar 
      textSnackbar: '',//Texto a ser mostrado no snackbar
      timeout: 5000,//duração do snackbar
    };
  },
  computed: {
    showImage() { //propriada computada para termitir a visualização da imagem fornecida pela tabela
      let file = this.image.file;
      if (file) {
        let url = URL.createObjectURL(this.image.file);
        return url;
      } else {
        return null;
      }
    },
  },
  methods: {
    show(value) { //armazena o valor fornecido pelo select
      this.image.theme = value;
    },
    submit() {
      if (this.mode == "Novo") {
        this.new(); // requisição Post para a API
      } else if (this.mode == "Editar") {
        this.put(); // requisição Put para a API
      }
    },
    getImages() {
      //Pedir a lista das instâncias armazenadas (GET) (Imagens)
      axios.get("https://rest-api-trimemoria.herokuapp.com/image").then((res) => {
        this.saved = res.data.data;
      });
    },
    getThemes() {
      //Pedir a lista das instâncias armazenadas (GET) (Temas)
      axios.get("https://rest-api-trimemoria.herokuapp.com/theme").then((res) => {
        this.themes = res.data.data;
      });
    },
    selectedRow(value) {
      //Carregamento das informações da instância escolhida na tabela
      this.clear();
      this.image = { ...value };
      this.theme = this.image.theme;
      this.getImageById(value.id);
    },
    getImageById(id) {
      //Requisição das informações da instância escolhida na tabela
      axios.get(`https://rest-api-trimemoria.herokuapp.com/image/${id}`).then((res) => {
        this.mode = "Editar";
        this.id = id;
        let links = res.data._links;
        this.linkDelete = links[0].href;
        this.linkPut = links[1].href;
      });
    },
    clear() {
      //Limpar o formulario e atualizar a tabela
      this.image = {};
      this.config = [];
      this.mode = "Novo";
      //this.index = 0;
      this.getImages();
    },
    new() {
      if (this.$refs.form.validate()) {
        //verifica se o form foi validado
        let functionClear = (text) => {
          //Devido ao contexto da função que chama o upload da imagem no fireabse storage
          //Necessita dessa função para atualizar a tela
          this.clear()
          this.snackbar = true
          this.textSnackbar = text
        }
        //criação do path onde sera armazenado no storage
        let path = `${this.image.theme}/${this.image.file.name}`;
        //Organização da informação que será enviada para a API
        let { theme, group } = this.image;
        var imagesRef = storageRef.child(path);//pega a referencia do storage no path especifico
        //Código para upload da imagem no firebase
        imagesRef.put(this.image.file).then(function (snapshot) {
          console.log(snapshot)
          storageRef.child(path).getDownloadURL().then(function (url) {
              //ao ser armazenado no storage, recebe o link para que a imagem possa ser mostrada na aplicação
              //e envia os dados para a API
              axios.post("https://rest-api-trimemoria.herokuapp.com/image", {
                  theme: theme,
                  url: url,
                  group: group,
                  path: path
              }).then((res) => {
                  functionClear(res.data.data)
              }).catch((error) => {
                  functionClear(error.response.data.error)
              });
            }).catch(function (error) {
              console.log(error);
            });
        });
      }
    },
    put() {
      if (this.$refs.form.validate()) {
        //verifica se o form foi validado
        let functionClear = (text) => {
          //Devido ao contexto da função que chama o upload da imagem no fireabse storage
          //Necessita dessa função para atualizar a tela
          this.clear()
          this.snackbar = true
          this.textSnackbar = text
        }
        if (this.image.file != undefined){ //verifica se foi fornecida uma imagem nova para aquela instância da imagem
            //criação do path onde sera armazenado no storage
            let path = `${this.image.theme}/${this.image.file.name}`;
            //Organização da informação que será enviada para a API
            let { theme, group } = this.image;
            let id = this.id //id da instância escolhida na tabela
            let imagesRef = storageRef.child(path);
            //deleta a imagem que esta armazenada
            this.delFile(this.image.path, () => {
                console.log("Excluido com sucesso");
            });
            //armazena a nova imagem no storage
            imagesRef.put(this.image.file).then(function (snapshot) {
              console.log(snapshot)
              //ao ser armazenado no storage, recebe o link para que a imagem possa ser mostrada na aplicação
              //e envia os dados para a API
              storageRef.child(path).getDownloadURL().then(function (url) {
                axios.put(this.linkPut, {
                  theme: theme,
                  url: url,
                  group: group,
                  path: path,
                  id: id
                })
                .then((res) => {
                  functionClear(res.data.data)
                })
                .catch((error) => {
                  functionClear(error.response.data.error)
                });
              }).catch(function (error) {
                console.log(error);
              });
            });
        }else{
          //caso só informações básicas foram mudadas e a imagem continua a mesma
          //e envia os dados para a API
          axios.put(this.linkPut, {
            theme: this.image.theme,
            path: this.image.path,
            group: this.image.group,
            url: this.image.url,
            id: this.id
          })
          .then((res) => {
            this.clear();
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
        }
      }
    },
    delFile(path, funcDel) { //Deletar no Storage
      //Cria a referencia para o arquivo a ser deletado
      var desertRef = storageRef.child(path);
      // Deleta o arquivo
      desertRef
        .delete()
        .then(funcDel)
        .catch(function (error) {
          console.log(error);
        });
    },
    del() { //Deletar na API
      let functionAxios = axios.delete(this.linkDelete).then((res) => {
        this.clear();
        console.log(res.data);
      });
      this.delFile(this.image.path, functionAxios);
    },
  },
  created() {
    //chama o metodo para requisitar API o recebimento das instâncias armazenadas
    this.getImages();
    this.getThemes();
  },
};
</script>

<style>
</style>