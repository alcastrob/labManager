<template>
<div id="table" class="table-editable">
  <table class="table table-bordered table-responsive-md table-striped">
    <tr>
      <th></th>
      <th class="">Prueba</th>
      <th class="">Fecha salida</th>
      <th class="">Fecha entrada</th>
      <th class="">Comentario</th>
    </tr>
    <tr v-for="test in tests" v-bind:key="test.IdPrueba">
      <td class="pt-3" style="width: 41px;">
        <i class="fa fa-times-circle" v-on:click="deleteRow(test.IdPrueba)"></i>
      </td>
      <td class="pt-3-half" contenteditable="true">{{test.Descripcion}}</td>
      <td class="pt-3-half text-right" contenteditable="true">{{test.FechaSalida | formatDateDMY}}</td>
      <td class="pt-3-half text-right" contenteditable="true">{{test.FechaEntrada | formatDateDMY}}</td>
      <td class="pt-3-half" contenteditable="true">{{test.Comentario}}</td>
    </tr>
  </table>
</div>
</template>

<script>
import { getWorkTests } from '../../../main/dal.js'
import _ from 'lodash'

export default {
  name: 'workTestsTable',
  props: {
    workId: Number
  },
  data () {
    return {
      tests: ''
    }
  },
  methods: {
    deleteRow: function (rowId) {
      this.tests = _.remove(this.tests, function (n) {
        return n.IdPrueba !== rowId
      })
    }
  },
  mounted () {
    getWorkTests(this.workId, 'labManager.sqlite').then((workTests) => {
      this.tests = workTests
    })
  }
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
}
</style>
