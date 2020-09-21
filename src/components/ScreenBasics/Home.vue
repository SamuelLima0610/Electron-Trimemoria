<template>
  <v-container class="mt-15">
        <v-row dense>
            <v-col cols="12">
                <v-card
                    color="#385F73"
                    dark
                >
                    <v-card-title class="headline">Jogo</v-card-title>

                    <v-card-subtitle>Jogue Trimemória</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goSetup">Jogar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card
                    color="#1F7087"
                    dark
                >
                    <v-card-title class="headline">Configurações</v-card-title>

                    <v-card-subtitle>Gerencie as configurações do jogo: Imagens, Temas e Configurações de Tags</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goConfig">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>    
    </v-container>
</template>

<script>
export default {
    name: "Home",
    methods:{
        goSetup(){
            this.$router.push({path: '/setup'})
        },
        goConfig(){
            this.$router.push({path: '/config'})
        },
    }
}
</script>

<style>

</style>