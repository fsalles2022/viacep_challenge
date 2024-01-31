<template>
    <div class="container border border-2 border-primary p-2">

        <div>
            <div class="input-group mb-1 mt-1">
                <input type="text" class="form-control" v-model="zipcode" id="zipcode" placeholder="Digite o cep"
                    aria-label="Username" aria-describedby="basic-addon1" @input="handlezipcodeInput"
                    @keyup.enter="zipcodeSearch" />

                <button type="button" class="btn btn-primary" @click="zipcodeSearch" data-bs-toggle="modal"
                    data-bs-target="#zipcodeModal">
                    Buscar
                </button>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                    Excluir Todos os Dados
                </button>
            </div>
        </div>

        <!-- Modal apresenta o resultado da pesquisa-->
        <div class="modal fade" id="zipcodeModal" tabindex="-1" aria-labelledby="zipcodeModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="zipcodeModalLabel">Dados da Pesquisa</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="address && !erroZipcode">
                            <p v-if="address.zipcode && address.zipcode.length === 9">zipcode: {{
                                formatzipcode(address.zipcode) }}</p>

                            <form class="container mb-1" @submit.prevent="saveChanges">

                                <input v-model="address.cep" type="text" class="form-control mb-1" placeholder="Cep">
                                <input v-model="address.logradouro" type="text" class="form-control mb-1"
                                    placeholder="Logradouro">
                                <input v-model="address.bairro" type="text" class="form-control mb-1" placeholder="Bairro">
                                <input v-model="address.localidade" type="text" class="form-control mb-1"
                                    placeholder="Cidade">
                                <input v-model="address.uf" type="text" class="form-control mb-1" placeholder="UF">
                                <input v-model="address.ddd" type="text" class="form-control mb-1" placeholder="DDD">

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                    <button type="button" class="btn btn-primary" @click="saveChanges"
                                        data-bs-dismiss="modal">Salvar</button>

                                </div>
                            </form>
                        </div>
                        <!-- Mostra mensagem de erro -->
                        <div v-if="erroZipcode" class="error-message">
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
                        <th>cep</th>
                        <th>Logradouro</th>
                        <th>Bairro</th>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>DDD</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody class="table-striped-columns table-group-divider">
                    <tr class="align-bottom" v-for="(item, index) in paginateData()" :key="index">
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
            <!-- Adicione a marcação de paginação abaixo da tabela no centro da pagina-->
            <nav aria-label="Page navigation mx-auto">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                        <button class="page-link" @click="prevPage" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li class="page-item" v-for="page in pages" :key="page" :class="{ 'active': currentPage === page }">
                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                    </li>

                    <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                        <button class="page-link" @click="nextPage" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>

        </div>
        <!-- Modal de confirmação de deleção de todos os dados do Storeage-->
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
import Sortable from 'sortablejs';

export default {
    data() {
        return {
            zipcode: '',
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
            zipcodeModal: null,

            itemsPerPage: 3, // Número de itens por página
            currentPage: 1,

        };
    },

    computed: {
        totalPages() {
            return Math.ceil(this.dataTable.length / this.itemsPerPage);
        },
        pages() {
            const pagesArray = [];
            for (let i = 1; i <= this.totalPages; i++) {
                pagesArray.push(i);
            }
            return pagesArray;
        },
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
            new Sortable(document.querySelector('tbody'), options);

            // Adicione eventos de clique para classificar os dados ao clicar nas colunas
            sortableColumns.forEach(column => {
                column.addEventListener('click', () => this.sortTable(column));
            });
        });
    },



    methods: {
        handlezipcodeInput() {
            // Remove qualquer caractere que não seja número
            let formattedzipcode = this.zipcode.replace(/\D/g, '');

            // Limita a 8 caracteres
            if (formattedzipcode.length > 8) {
                formattedzipcode = formattedzipcode.slice(0, 8);
            }

            // Formata o zipcode como "06325-030"
            if (formattedzipcode.length >= 5) {
                formattedzipcode = `${formattedzipcode.slice(0, 5)}-${formattedzipcode.slice(5)}`;
            }

            // Atualiza o valor formatado no modelo
            this.zipcode = formattedzipcode;
        },

        zipcodeSearch() {
            // Remove qualquer caractere que não seja número antes de realizar a busca
            const numericzipcode = this.zipcode.replace(/\D/g, '');

            // Verifica se o zipcode possui 8 caracteres numéricos
            if (numericzipcode.length !== 8 || isNaN(Number(numericzipcode))) {
                this.erroZipcode = 'Por favor, insira um cep válido com 8 dígitos.';
                return;
            }
            // Verifica se o CEP já está cadastrado no localStorage
            const storedAddress = localStorage.getItem(`cep_${numericzipcode}`);
            if (storedAddress) {
                // Se já estiver no localStorage, utiliza esses dados em vez de fazer a requisição
                this.address = JSON.parse(storedAddress);
                this.zipcode = '';
                this.erroZipcode = 'Cep já cadastrado no sistema';
                return;
            }

            axios.get(`https://viacep.com.br/ws/${numericzipcode}/json/`)
                .then(response => {
                    if (response.data.erro) {
                        // Se 'erro' estiver presente nos dados da resposta, significa que o CEP não existe
                        this.erroZipcode = 'O CEP digitado não existe. Por favor digite um cep válido!';
                        this.zipcode = '';
                        this.address = {
                            cep: '',
                            logradouro: '',
                            bairro: '',
                            localidade: '',
                            uf: '',
                            ddd: '',
                        };
                    } else {
                        // Caso contrário, os dados do endereço são válidos
                        this.address = response.data;
                        // Armazena os dados no localStorage para reutilização
                        localStorage.setItem(`cep_${numericzipcode}`, JSON.stringify(response.data));
                        this.zipcode = '';
                        this.erroZipcode = '';
                    }
                })
                .catch(error => {
                    console.error('Erro na busca de zipcode:', error);
                    // Exibe mensagem de erro na interface
                    this.erroZipcode = 'Erro na busca do cep. Por favor, digite um cep válido.';
                    this.zipcode = '';
                    this.address = {
                        cep: '',
                        logradouro: '',
                        bairro: '',
                        localidade: '',
                        uf: '',
                        ddd: '',
                    };
                });
        },

        formatzipcode(zipcode) {
            // Adiciona um traço entre os primeiros 5 caracteres e os últimos 3 caracteres do zipcode
            return `${zipcode.slice(0, 5)}${zipcode.slice(5)}`;
        },
        saveChanges() {
            // Adiciona os dados do endereço à tabela de dados
            this.dataTable.push({ ...this.address });

            // Limpa os campos do formulário após salvar
            this.clearForm();
            localStorage.setItem('dataTable', JSON.stringify(this.dataTable));
            if (this.zipcodeModal) {
                this.zipcodeModal.hide();
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
        changePage(page) {
            this.currentPage = page;
            this.paginateData();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.paginateData();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.paginateData();
            }
        },
        paginateData() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.dataTable.slice(startIndex, endIndex);
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
    