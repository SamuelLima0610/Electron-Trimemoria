<template>
    <v-app>
        <v-container class="mt-15">
            <v-form ref="form">
                <v-row>
                    <v-col cols="12" md="12">
                        Configurar Dispositivo(WiFi):
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="send.name"
                            label="Nome do WiFi:"
                            :rules="[rules.required]"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col  cols="12" md="4">
                        <v-text-field
                            v-model="send.password"
                            :rules="[rules.required]"
                            label="Senha do WiFi:"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col  cols="12" md="4">
                        <v-btn class="mr-4" @click="submit" color="warning">Enviar</v-btn>
                        <v-btn @click="clear" color="warning">Limpar</v-btn>
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
        </v-container>
    </v-app>
</template>

<script src="./tcp.js"> //script com para a conexão TCP
export default {
    name: "ConfigDevice",
}
</script>

<style>

</style>