// Importe os estilos do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importe o Bootstrap (certifique-se de que todas as dependências estejam instaladas)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importe o Sortable
import Sortable from 'sortablejs';

// Importe o Vue e outros módulos necessários
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Crie a instância do aplicativo Vue
const app = createApp(App);

// Use o router
app.use(router);

// Adicione o hook beforeMount para inicializar o Sortable
app.component('SortableTable', {
    beforeMount() {
        this.$nextTick(() => {
            const options = {
                animation: 150, // Tempo de animação em milissegundos
            };
            new Sortable(document.querySelector('tbody'), options);
        });
    }
});

// Monte o aplicativo no elemento #app
app.mount('#app');
