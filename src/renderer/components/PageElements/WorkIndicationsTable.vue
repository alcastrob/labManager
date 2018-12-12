<template>
<div id="table" class="table-editable">
    <table class="table table-bordered table-responsive-md table-striped">
    <tr>
      <th></th>
      <th>Descripción</th>
      <th class="text-right">Precio</th>
    </tr>
    <tr v-for="indication in workIndications" v-bind:key="indication.IdTrabajoDetalle">
      <td class="pt-3" style="width: 41px;">
        <i class="fa fa-times-circle" v-on:click="deleteRow(indication.IdTrabajoDetalle)"></i>
      </td>
      <td class="pt-3-half" contenteditable="true">
        {{indication.Descripcion}}
      </td>
      <td class="pt-3-half text-right" contenteditable="true">{{indication.Precio}}</td>
    </tr>
    </table>
    <p class="text-right pr-1">
      Total: {{getSum()}}€
    </p>
</div>
</template>

<script>
import { getWorkIndications } from '../../../main/dal.js'
import _ from 'lodash'

export default {
  name: 'workIndicationsTable',
  props: {
    workId: Number
  },
  data () {
    return {
      workIndications: ''
    }
  },
  methods: {
    getSum: function () {
      return _.sumBy(['Precio'], _.partial(_.sumBy, this.workIndications))
    },
    deleteRow: function (rowId) {
      this.workIndications = _.remove(this.workIndications, function (n) {
        return n.IdTrabajoDetalle !== rowId
      })
    }
  },
  mounted () {
    getWorkIndications(this.workId, 'labManager.sqlite').then((workIndicat) => {
      this.workIndications = workIndicat
    })
  }
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
}
</style>
