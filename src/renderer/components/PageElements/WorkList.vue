<template>
<div class="card mb-3">
  <div class="card-header">
    <i class="fas fa-teeth"></i>
    Trabajos</div>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-bordered" id="workList" width="100%" cellspacing="0">
        <thead>
          <tr>
            <th>Dentista</th>
            <th>Paciente</th>
            <th>Tipo</th>
            <th>Color</th>
            <th>F. Entrada</th>
            <th>F. Prevista</th>
            <th>F. Terminación</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in workList" v-bind:key="work.IdTrabajo" v-on:click="showWork(work.IdTrabajo)">
            <td>{{work.NombreDentista}}</td>
            <td>{{work.Paciente}}</td>
            <td>{{work.TipoTrabajo}}</td>
            <td>{{work.Color}}</td>
            <td>{{work.FechaEntrada | formatDateDMY}}</td>
            <td>{{work.FechaPrevista | formatDateDMY}}</td>
            <td>{{work.FechaSalida | formatDateDMY}}</td>
            <td>{{work.Precio}} €</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import { getWorksList } from '../../../main/dal.js'

export default {
  name: 'workList',
  data () {
    return {
      workList: ''
    }
  },
  methods: {
    showWork: function (idWork) {
      this.$parent.$parent.navigateTo('workDetail', idWork)
    }
  },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
      this.workList = works
    })
  }
}
</script>

<style>
</style>
