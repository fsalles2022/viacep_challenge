<template>
  <div class="About">
    <img alt="Vue logo" src="../assets/tradeup.png">
    <h1>Pesquisar CEP</h1>
  </div>
    <ZipCodeSearch></ZipCodeSearch>
    <FooterVue></FooterVue>
</template>

<script>
// Importe o componente Vue
import FooterVue from "@/components/FooterVue.vue";
import ZipCodeSearch from "@/components/ZipCodeSearch.vue";

export default {
  components: {
    // Registre o componente Vue no componente pai
    ZipCodeSearch,
    FooterVue
}
};
</script>

/home/fabiosalles/www/challenge/src/components/ZipCodeSearch.vue