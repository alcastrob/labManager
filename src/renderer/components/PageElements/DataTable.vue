<template>
<div class="card mb-3">
    <div class="card-header">
        <i class="fas fa-teeth"></i>
        Trabajos</div>
    <div class="card-body">
        <div class="table-responsive">
        <button v-on:click="fillTable">X</button>
        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
            <thead>
            <tr>
                <th>Estado</th>
                <th>Clínica</th>
                <th>Paciente</th>
                <th>Pruebas</th>
                <th>Fecha Entrada</th>
                <th>Fecha Terminación</th>
                <th>Tipo</th>
                <th>Color</th>
                <th>Importe</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td></td>
                <td>Clínica Importante Doce</td>
                <td>Nombre Apellido Apellido </td>
                <td>0</td>
                <td>01/02/2018</td>
                <td>08/02/2018</td>
                <td>Resina</td>
                <td>1C-140</td>
                <td>5000€</td>
            </tr>
            <tr>
                <td></td>
                <td>Clínica La Veloz S.L.</td>
                <td>Nombre Apellido Apellido </td>
                <td>0</td>
                <td>01/02/2018</td>
                <td>08/02/2018</td>
                <td>Resina</td>
                <td>1C-140</td>
                <td>5000€</td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
    <div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
</div>
</template>

<script>
import { getWorks } from '../../../main/dal.js'

export default {
  name: 'dataTable',
  data () {
    return {}
  },
  methods: {
    fillTable: function () {
      getWorks()
    }
  }
}
</script>

<style>
</style>
