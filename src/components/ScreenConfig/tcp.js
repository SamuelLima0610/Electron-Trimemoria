const net = require('net')

export default {
    data(){
        return{
            send:{}, //informação a ser enviada para o servidor TCP
            rules:{ //regra para validação dos campos inputs do form
                required: value => !!value || 'Inserir'
            },
            snackbar: false,
            textSnackbar: '',
            timeout: 5000,
            ip:'192.168.4.1',//todos os IP gerado pelo dispositivos são iguais
            port: '555', //Porta cadastrada nos dispositivos
            socket: null//responsavel por guardar o socket
        }
    },
    mounted() {
        const socket = new net.Socket() //criação do socket
        this.socket = socket
        //Código responsavel por receber informação do servidor TCP
        socket.on('data', (data) => {
            console.log(data.toString())
        })
    },
    methods: {
        connect() {
            //conecta a aplicação ao servidor TCP
            this.socket.connect(this.port, this.ip)
        },
        sendMessage() {
            //envia as informações do JSON send para o servidor TCP
            this.socket.write(`${this.send.name};${this.send.password}`)
        },
        clear(){
            //Limpa as informações armazenadas na variavel send
            this.send.name = '';
            this.send.password = '';
        },
        submit(){
            if(this.$refs.form.validate()){
                //Ao verificar que o form foi validado corretamente executa os metódos desejados
                this.connect()
                this.sendMessage()
            }
        },
        destroyed(){
            //destroi o socket criado, ao sair da tela de configuração de dispositivo
            this.socket.destroy();
        }
    }
}