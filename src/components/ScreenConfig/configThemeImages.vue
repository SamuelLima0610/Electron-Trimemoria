<template>
  <v-app>
    <v-container class="mt-15">
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

          <v-row v-if="image.file != undefined" justify="center">
            <v-col cols="12" md="12">
              <v-img :src="showImage" aspect-ratio="2" contain max-height="600" max-width="600"></v-img>
            </v-col>
          </v-row>

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
        :items="saved"
        :items-per-page="5"
        class="elevation-1"
        @click:row="selectedRow"
      ></v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import "../../storage";
var storageRef = firebase.storage().ref();

export default {
  data() {
    return {
      themes: [],
      image: {},
      index: 0,
      theme: "",
      headers: [
        { text: "Id", align: "center", sortable: true, value: "id" },
        { text: "Tema", align: "center", sortable: true, value: "theme" },
        { text: "Grupo", align: "center", sortable: true, value: "group" },
        { text: "Caminho", align: "center", sortable: true, value: "path" },
      ],
      rules: {
        required: (value) => !!value || "Inserir",
      },
      saved: [],
      linkDelete: "",
      linkPut: "",
      mode: "Novo",
      id: 0,
      snackbar: false,
      textSnackbar: '',
      timeout: 5000,
    };
  },
  computed: {
    showImage() {
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
    show(value) {
      this.image.theme = value;
    },
    submit() {
      if (this.mode == "Novo") {
        this.new();
      } else if (this.mode == "Editar") {
        this.put();
      }
    },
    getImages() {
      axios.get("https://rest-api-trimemoria.herokuapp.com/image").then((res) => {
        this.saved = res.data.data;
      });
    },
    getThemes() {
      axios.get("https://rest-api-trimemoria.herokuapp.com/theme").then((res) => {
        this.themes = res.data.data;
      });
    },
    selectedRow(value) {
      this.clear();
      this.image = { ...value };
      this.theme = this.image.theme;
      this.getImageById(value.id);
    },
    getImageById(id) {
      axios.get(`https://rest-api-trimemoria.herokuapp.com/image/${id}`).then((res) => {
        this.mode = "Editar";
        this.id = id;
        let links = res.data._links;
        this.linkDelete = links[0].href;
        this.linkPut = links[1].href;
      });
    },
    clear() {
      this.image = {};
      this.config = [];
      this.mode = "Novo";
      this.index = 0;
      this.getImages();
    },
    new() {
      if (this.$refs.form.validate()) {
        let functionClear = (text) => {
          this.clear()
          this.snackbar = true
          this.textSnackbar = text
        }
        let path = `${this.image.theme}/${this.image.file.name}`;
        let { theme, group } = this.image;
        var imagesRef = storageRef.child(path);
        imagesRef.put(this.image.file).then(function (snapshot) {
          console.log(snapshot);
          storageRef.child(path).getDownloadURL().then(function (url) {
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
        let functionClear = (text) => {
          this.clear()
          this.snackbar = true
          this.textSnackbar = text
        }
        if (this.image.file != undefined){
            let path = `${this.image.theme}/${this.image.file.name}`;
            let { theme, group } = this.image;
            let id = this.id
            let imagesRef = storageRef.child(path);
            this.delFile(this.image.path, () => {
                console.log("Excluido com sucesso");
            });
            imagesRef.put(this.image.file).then(function (snapshot) {
              console.log(snapshot);
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
    delFile(path, funcDel) {
      // Create a reference to the file to delete
      var desertRef = storageRef.child(path);
      // Delete the file
      desertRef
        .delete()
        .then(funcDel)
        .catch(function (error) {
          // Uh-oh, an error occurred!
          console.log(error);
        });
    },
    del() {
      let functionAxios = axios.delete(this.linkDelete).then((res) => {
        this.clear();
        console.log(res.data);
      });
      this.delFile(this.image.path, functionAxios);
    },
    arrowRight() {
      this.index++;
    },
    arrowLeft() {
      this.index--;
    },
  },
  created() {
    this.getImages();
    this.getThemes();
  },
};
</script>

<style>
</style>