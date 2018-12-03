<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <dashboard></dashboard>
  </div>
</template>

<script>
  import dashboard from './components/Dashboard.vue'
  export default {
    name: 'labManager',
    components: {
      dashboard
    }
  }
</script>

<style>
  /* CSS */
</style>
