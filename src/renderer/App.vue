<template>
  <div id="app">
    <mainPage></mainPage>
  </div>
</template>

<script>
  import mainPage from './components/pages/mainPage.vue'
  import 'jquery/dist/jquery.min.js'
  import 'bootstrap/dist/js/bootstrap.min.js'
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
  @import url('~@/assets/css/bootstrap-vue.min.css');

  body {
    background-color: #E4DFDA;
    color: #150626;
    font-family: 'Nunito', sans-serif;
  }
  .btn-warning {
    background-color: #D4B483;
    border-color: #D4B483;
  }
  .bg-dark {
    background-color: #4A4D4F!important;
  }
  table.table-bordered tr th {
    background-color:#AFA8A1;
  }
  table.table-bordered tr th:hover {
    background-color:#AFA8A1;
    color: #fff!important;
  }
  table.table-bordered tfoot tr td {
    background-color:#AFA8A1;
  }
  table.table-bordered tr:nth-child(odd) {
    background-color: #F2ECE6;
  }
  table.table-bordered tr:nth-child(even) {
    background-color: #FFF6ED;
  }

  .deaggregated {
    background-color: #FBC2B5!important;
  }
  table.table-bordered tr.deaggregated:hover {
    background-color:#DDAB9F!important;
  }

  table.table-bordered tr:not(.deaggregated):hover td {
    background-color:#DDD8D2;
  }
  table.table-bordered th,
  table.table-bordered td {
    border: 1px solid #454849;
  }
  table.table-bordered i {
    display:none;
  }
  table.table-bordered tr:hover > td >  i {
    display:block;
  }
  .pagination>li>a,
  .pagination>li>span
  .pagination>li.disabled>a {
    border: 1px solid #AFA8A1!important;
    color: #150626;
  }
  .pagination>li.active>a {
    background: #AFA8A1!important;
    color: #fff;
  }
</style>
