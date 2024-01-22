<template>
  <div>
    <h1>Pesquisar CEP</h1>
    
    <!-- Chame o componente Vue aqui -->
    <ZipCodeSearch></ZipCodeSearch>
  </div>
</template>

<script>
// Importe o componente Vue
import ZipCodeSearch from "@/components/ZipCodeSearch.vue";

export default {
  components: {
    // Registre o componente Vue no componente pai
    ZipCodeSearch
  }
};
</script>

/home/fabiosalles/www/challenge/src/components/ZipCodeSearch.vue