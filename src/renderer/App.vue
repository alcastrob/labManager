<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <dashboard></dashboard>
  </div>
</template>

<script>
  import dashboard from './components/pages/Dashboard.vue'
  export default {
    name: 'labManager',
    components: {
      dashboard
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
