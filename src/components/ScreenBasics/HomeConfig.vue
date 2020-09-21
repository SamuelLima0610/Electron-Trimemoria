<template>
    <v-container class="mt-15">
        <v-row dense>
            <v-col cols="12">
                <v-card
                    color="#385F73"
                    dark
                >
                    <v-card-title class="headline">Temas</v-card-title>

                    <v-card-subtitle>Gerencie os temas que poderão ser utilizados no jogo Trimemória</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goThemes">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card
                    color="#1F7087"
                    dark
                >
                    <v-card-title class="headline">Tags</v-card-title>

                    <v-card-subtitle>Gerencie as posições das Tags que serão utilizadas no jogo</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goTags">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" class="mb-10">
                <v-card
                    color="#952175"
                    dark
                >
                    <v-card-title class="headline">Imagens</v-card-title>

                    <v-card-subtitle>Configure as imagens das cartas de um determinado tema.</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goImage">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>    
    </v-container>        
</template>

<script>
export default {
    name:'HomeConfig',
    methods:{
        goThemes(){
            this.$router.push({path: '/temas'})
        },
        goTags(){
            this.$router.push({path: '/organizacao'})
        },
        goImage(){
            this.$router.push({path: '/imagem'})
        },
    }
}
</script>

<style>

</style>
