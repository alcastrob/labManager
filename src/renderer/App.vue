<template>
  <div id="app">
    <mainPage></mainPage>
  </div>
</template>

<script>
  import mainPage from './components/pages/mainPage.vue'
  export default {
    name: 'labManager',
    components: {
      mainPage
    }
  }
</script>

<style>
  /* Bootstrap */
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
  /* Custom fonts for this template */
  @import url('~@/assets/css/fontawesome-free/css/all.min.css');
  /* Page level plugin CSS */
  @import url('~@/assets/css/datatables/datatables.bootstrap4.min.css');
  /* Custom styles for this template */
  @import url('~@/assets/css/sb-admin.css');
  @import url('~@/assets/css/nunito/nunito.css');
  @import url('~@/assets/css/animate/animate.min.css');
</style>
