<template>
    <div class="container border border-2 border-primary p-2">

        <div>
            <div class="input-group mb-1 mt-1">
                <input type="text" class="form-control" v-model="cep" id="cep" placeholder="Digite o cep"
                    aria-label="Username" aria-describedby="basic-addon1" @input="handleCepInput"
                    @keyup.enter="zipcodeSearch" />

                <button type="button" class="btn btn-primary" @click="zipcodeSearch" data-bs-toggle="modal"
                    data-bs-target="#cepModal">
                    Buscar
                </button>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                    Excluir Todos os Dados
                </button>
            </div>
        </div>


        <!-- Modal -->
        <div class="modal fade" id="cepModal" tabindex="-1" aria-labelledby="cepModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="cepModalLabel">Dados da Pesquisa</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="container mb-1" @submit.prevent="saveChanges">
                            <!-- Adicione v-model para criar a ligação bidirecional -->
                            <input v-model="address.cep" type="text" class="form-control mb-1" placeholder="CEP">
                            <input v-model="address.logradouro" type="text" class="form-control mb-1"
                                placeholder="Logradouro">
                            <input v-model="address.bairro" type="text" class="form-control mb-1" placeholder="Bairro">
                            <input v-model="address.localidade" type="text" class="form-control mb-1" placeholder="Cidade">
                            <input v-model="address.uf" type="text" class="form-control mb-1" placeholder="UF">
                            <input v-model="address.ddd" type="text" class="form-control mb-1" placeholder="DDD">

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="button" class="btn btn-primary" @click="saveChanges"
                                    data-bs-dismiss="modal">Salvar</button>

                            </div>
                        </form>
                        <div v-if="erroZipcode" class="error-message">
                            <!-- Mostra mensagem de erro -->
                            <p>{{ erroZipcode }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover table align-middle">
                <thead>
                    <tr>
                        <th scope="col" class="sortable">#</th>
                        <th>CEP</th>
                        <th>Logradouro</th>
                        <th>Bairro</th>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>DDD</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody class="table-striped-columns table-group-divider">
                    <tr class="align-bottom" v-for="(item, index) in dataTable" :key="index">
                        <th scope="row">{{ index + 1 }}</th> <!-- Use index + 1 para começar de 1 -->
                        <td>{{ item.cep }}</td>
                        <td>{{ item.logradouro }}</td>
                        <td>{{ item.bairro }}</td>
                        <td>{{ item.localidade }}</td>
                        <td>{{ item.uf }}</td>
                        <td>{{ item.ddd }}</td>
                        <td>
                            <button type="button" class="btn btn-danger" @click="showConfirmDeleteModal(index)">
                                Excluir
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

        <!-- Modal de confirmação -->
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmDeleteModalLabel">Confirmação</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Tem certeza que deseja excluir todos os dados do armazenamento local?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="clearStorage">Limpar
                            Storage</button>

                    </div>
                </div>
            </div>
        </div>
        <!-- Modal de confirmação para exclusão -->
        <div class="modal fade" id="confirmDeleteItemModal" tabindex="-1" aria-labelledby="confirmDeleteItemModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmDeleteItemModalLabel">Confirmação</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Tem certeza que deseja excluir este item?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                            @click="confirmDeleteItem">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';


export default {
    data() {
        return {
            cep: '',
            // address: null,
            erroZipcode: '',
            address: {
                cep: '',
                logradouro: '',
                bairro: '',
                localidade: '',
                uf: '',
                ddd: '',
            },
            dataTable: JSON.parse(localStorage.getItem('dataTable')) || [],
            cepModal: null,
        };
    },
    mounted() {
        this.$nextTick(() => {
            // Inicialize o modal de exclusão
            const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
            this.confirmDeleteModal = confirmDeleteModal;

            // Adicione a funcionalidade sortable às colunas
            const sortableColumns = document.querySelectorAll('.sortable');
            const options = {
                animation: 150, // Tempo de animação em milissegundos
            };

            // Importe e inicialize o Sortable
            import('sortablejs/modular/sortable.complete.esm.js').then((module) => {
                const Sortable = module.default;
                new Sortable(document.querySelector('tbody'), options);
            });

            // Adicione eventos de clique para classificar os dados ao clicar nas colunas
            sortableColumns.forEach(column => {
                column.addEventListener('click', () => this.sortTable(column));
            });
        });
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
                this.erroZipcode = 'Por favor, insira um CEP válido com 8 dígitos.';
                return;
            }

            axios.get(`https://viacep.com.br/ws/${numericCep}/json/`)
                .then(response => {
                    this.address = response.data;
                    // Limpa o campo de input após a pesquisa
                    this.cep = '';
                    // Limpa a mensagem de erro
                    this.erroZipcode = '';
                })
                .catch(error => {
                    console.error('Erro na busca de CEP:', error);
                    // Exibe mensagem de erro na interface
                    this.erroZipcode = 'Erro na busca de CEP. Por favor, tente novamente.';
                });
        },
        formatCep(cep) {
            // Adiciona um traço entre os primeiros 5 caracteres e os últimos 3 caracteres do CEP
            return `${cep.slice(0, 5)}${cep.slice(5)}`;
        },
        saveChanges() {
            // Adiciona os dados do endereço à tabela de dados
            this.dataTable.push({ ...this.address });

            // Limpa os campos do formulário após salvar
            this.clearForm();
            localStorage.setItem('dataTable', JSON.stringify(this.dataTable));
            if (this.cepModal) {
                this.cepModal.hide();
            }

            // Exibe a tabela de dados no console (para fins de demonstração)
            // console.log('Tabela de Dados:', this.dataTable);
        },
        clearForm() {
            // Limpa os campos do formulário
            this.address = {
                cep: '',
                logradouro: '',
                bairro: '',
                localidade: '',
                uf: '',
                ddd: '',
            };
        },
        clearStorage() {
            // Limpa o localStorage
            localStorage.clear();

            // Atualiza a tabelaDeDados no componente
            this.dataTable = [];
            const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
            confirmDeleteModal.hide();
        },
        deleteItem(index) {
            // Remove o item da tabela de dados
            this.dataTable.splice(index, 1);

            // Atualiza o armazenamento local
            localStorage.setItem('dataTable', JSON.stringify(this.dataTable));
        },
        showConfirmDeleteModal(index) {
            this.itemToDeleteIndex = index;
            const confirmDeleteItemModal = new bootstrap.Modal(document.getElementById('confirmDeleteItemModal'));
            confirmDeleteItemModal.show();
        },

        confirmDeleteItem() {
            // Remova o item da tabela de dados
            this.dataTable.splice(this.itemToDeleteIndex, 1);

            // Atualize o armazenamento local
            localStorage.setItem('dataTable', JSON.stringify(this.dataTable));

            // Feche o modal de confirmação
            const confirmDeleteItemModal = new bootstrap.Modal(document.getElementById('confirmDeleteItemModal'));
            confirmDeleteItemModal.hide();
        },
        sortTable(column) {
            const columnIndex = Array.from(column.parentNode.children).indexOf(column);

            // Lógica de classificação - exemplo: ordenar por número da coluna
            this.dataTable.sort((a, b) => {
                const valueA = a[columnIndex];
                const valueB = b[columnIndex];

                if (valueA < valueB) {
                    return -1;
                }
                if (valueA > valueB) {
                    return 1;
                }
                return 0;
            });
        },

    },

};
</script>

<style>
.container {
    width: 65%;
    margin: 0 auto;

}

.form-control {
    background-color: aqua;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}
</style>
