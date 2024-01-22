<template>
    <div class="container">
        <hr>
        <div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" v-model="cep" id="cep" placeholder="Digite o cep"
                    aria-label="Username" aria-describedby="basic-addon1" @input="handleCepInput"
                    @keyup.enter="zipcodeSearch" />
                <button type="button" class="btn btn-primary" @click="zipcodeSearch">Buscar</button>
            </div>


            <form>

                <div v-if="endereco && !erroCep">
                    <h2>Dados da Pesquisa:</h2>
                    <p v-if="endereco.cep && endereco.cep.length === 9">CEP: {{ formatCep(endereco.cep) }}</p>
                    <p v-else>O CEP fornecido não consta em nossa base de dados!<br> Digite um cep válido.</p>
                    <div class="mb-3">
                       <div id="logradouro" class="form-text" v-if="endereco.logradouro">Logradouro: {{ endereco.logradouro }}</div>
                    </div>

                     <div class="mb-3">
                       <div id="bairro" class="form-text" v-if="endereco.bairro">Bairro: {{ endereco.bairro}} </div>
                    </div>

                      <div class="mb-3">
                       <div id="localidade" class="form-text" v-if="endereco.localidade">Cidade: {{ endereco.localidade }} </div>
                    </div>

                     <div class="mb-3">
                       <div id="uf" class="form-text" v-if="endereco.uf">Cidade: {{ endereco.uf }} </div>
                    </div>

                     <div class="mb-3">
                       <div id="ddd" class="form-text" v-if="endereco.ddd">Cidade: {{ endereco.ddd}} </div>
                    </div>
                </div>



            </form>

            <div v-if="erroCep">
                <!-- Mostra mensagem de erro -->
                <p>{{ erroCep }}</p>
            </div>
        </div>
    </div>
</template>
  
  
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            cep: '',
            endereco: null,
            erroCep: '',
        };
    },
    methods: {
        handleCepInput() {
            // Remove qualquer caractere que não seja número
            let formattedCep = this.cep.replace(/\D/g, '');

            // Limita a 8 caracteres
            if (formattedCep.length > 8) {
                formattedCep = formattedCep.slice(0, 8);
            }

            // Formata o CEP como "06325-030"
            if (formattedCep.length >= 5) {
                formattedCep = `${formattedCep.slice(0, 5)}-${formattedCep.slice(5)}`;
            }

            // Atualiza o valor formatado no modelo
            this.cep = formattedCep;
        },
        zipcodeSearch() {
            // Remove qualquer caractere que não seja número antes de realizar a busca
            const numericCep = this.cep.replace(/\D/g, '');

            // Verifica se o CEP possui 8 caracteres numéricos
            if (numericCep.length !== 8 || isNaN(Number(numericCep))) {
                this.erroCep = 'Por favor, insira um CEP válido com 8 dígitos.';
                return;
            }

            axios.get(`https://viacep.com.br/ws/${numericCep}/json/`)
                .then(response => {
                    this.endereco = response.data;
                    // Limpa o campo de input após a pesquisa
                    this.cep = '';
                    // Limpa a mensagem de erro
                    this.erroCep = '';
                })
                .catch(error => {
                    console.error('Erro na busca de CEP:', error);
                    // Exibe mensagem de erro na interface
                    this.erroCep = 'Erro na busca de CEP. Por favor, tente novamente.';
                });
        },
        formatCep(cep) {
            // Adiciona um traço entre os primeiros 5 caracteres e os últimos 3 caracteres do CEP
            return `${cep.slice(0, 5)}-${cep.slice(5)}`;
        },
    },
};
</script>
  
