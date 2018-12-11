<template>
<div id="table" class="table-editable">
    <table class="table table-bordered table-responsive-md table-striped">
    <tr>
        <th class="">Descripción</th>
        <th class="text-right">Precio</th>
    </tr>
    <tr v-for="indication in workIndications" v-bind:key="indication.IdTrabajoDetalle">
        <td class="pt-3-half" contenteditable="true">{{indication.Descripcion}}</td>
        <td class="pt-3-half text-right" contenteditable="true">{{indication.Precio}}</td>
    </tr>
    </table>
</div>
</template>

<script>
import { getWorkIndications } from '../../../main/dal.js'

export default {
  name: 'workDetailTable',
  props: {
    workId: Number
  },
  data () {
    return {
      workIndications: ''
    }
  },
  methods: {},
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
