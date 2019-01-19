<template>
  <div class="container-fluid">
    <h1>Hola</h1>
    <div class="row">
      <div class="col-md-12">
        <h1>Factura {{$route.params.id}}</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div>
     <!-- <catalogTable v´model="xxxx" ref="catalog"></catalogTable> -->
    </div> <!-- row -->
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'invoice',
  data () {
    return { }
  },
  methods: {},
  mounted () {
    debugger
  }
}
</script>

<style>
</style>
