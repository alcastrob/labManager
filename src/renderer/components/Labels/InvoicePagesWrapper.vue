<template>
  <div ref="container"></div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    append: function(instance){
      this.$refs.container.appendChild(instance)
    },
    remove: function(){
      this.$refs.container.removeChild(instance)
    },
    printPDF: function(){
      debugger
      const ipc = require('electron').ipcRenderer
      ipc.send('print-to-pdf')
    }
  }
}
</script>

<style>
</style>
