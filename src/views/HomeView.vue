<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/tradeup.png">
    <HelloWorld msg="Sistema de busca de endereço por cep "/>
  </div>
  <main class="px-3 text-warning">
    <h1>Desenvolvido com VueJs - Docker - Nginx - Bootstrap-5 </h1>
    <p class="lead">Sistema busca dados na API do ViaCep, retornando os dados quando encontrados e retornado erro
      especifico quando o cep não existe ou não é um Cep válido.</p>
    <p class="lead">
      <a href="https://viacep.com.br/" class="btn btn-lg btn-light fw-bold border-white bg-white">API - ViaCep</a>
    </p>
  </main>


  <FooterVue></FooterVue>
</template>

<script>
// @ is an alias to /src
import FooterVue from '@/components/FooterVue.vue';
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    FooterVue
}
}
</script>
