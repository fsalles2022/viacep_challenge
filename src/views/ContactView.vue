<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/tradeup.png">
    <HelloWorld msg="Sistema de busca de endereço por cep " />
    <h4>Entre em Contato Conosco!</h4>
    <ContactForm></ContactForm>
  </div>
  <div>
    <FooterVue></FooterVue>
  </div>
</template>

<script>
import ContactForm from '@/components/ContactForm.vue';
import FooterVue from '@/components/FooterVue.vue';

export default {
  components: {
    ContactForm,
    FooterVue
  }
}

</script>
  