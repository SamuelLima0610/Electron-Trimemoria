<template>
    <v-container class="mt-15">
        <v-row dense>
            <v-col cols="12" class="mb-5">
                <v-card
                    color="#FC6600"
                    dark
                >
                    <v-card-title class="headline">Temas</v-card-title>

                    <v-card-subtitle>Gerencie os temas que poderão ser utilizados no jogo Trimemória</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goThemes">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" class="mb-5">
                <v-card
                    color="#EF7215"
                    dark
                >
                    <v-card-title class="headline">Tags</v-card-title>

                    <v-card-subtitle>Gerencie as posições das Tags que serão utilizadas no jogo</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goTags">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" class="mb-5">
                <v-card
                    color="#EF820D"
                    dark
                >
                    <v-card-title class="headline">Imagens</v-card-title>

                    <v-card-subtitle>Configure as imagens das cartas de um determinado tema.</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goImage">Editar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" class="mb-5">
                <v-card
                    color="#FDA50F"
                    dark
                >
                    <v-card-title class="headline">Configurar Dispositivo</v-card-title>

                    <v-card-subtitle>Gerencie os dispositivos a serem usados no jogo.</v-card-subtitle>

                    <v-card-actions>
                    <v-btn text @click="goDevice">Editar</v-btn>
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
            //Vai para a tela de gerenciamento de telas
            this.$router.push({path: '/temas'})
        },
        goTags(){
            //Vai para a tela de gerenciamento de configuração de telas
            this.$router.push({path: '/organizacao'})
        },
        goImage(){
            //Vai para a tela de gerenciamento de imagens
            this.$router.push({path: '/imagem'})
        },
        goDevice(){
            //Vai para a tela de gerenciamento de imagens
            this.$router.push({path: '/device'})
        },
    }
}
</script>

<style>

</style>
