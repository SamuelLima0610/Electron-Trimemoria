<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link to="/temas">
          <v-list-item-action>
            <v-icon>mdi-brush</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Temas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/organizacao">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Configurações de Tags</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/imagem">
          <v-list-item-action>
            <v-icon>mdi-image</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Imagens</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/device">
          <v-list-item-action>
            <v-icon>mdi-microsoft-xbox-controller</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Configurar Dispositivo</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="goHome">Jogo Trimemória</v-toolbar-title>
    </v-app-bar>
    <router-view></router-view>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data(){
    return {
      drawer: null,
    }
  },
  methods:{
    goHome(){
      this.$router.push({path: `/`})
    }
  }
}
</script>

<style>

</style>
