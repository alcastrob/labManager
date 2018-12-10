<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-6 col-md-8">
          <h1>Trabajo nº {{workData.IdTrabajo}}</h1>
        </div>
        <div class="col-sm-6 col-md-4">
          <div class="float-right">
            <button class="btn btn-info btn-sm mt-1">
              <i class="fas fa-tags pr-2"></i>Imprimir etiqueta
            </button>
          </div>
        </div>
      </div>
      <div class="row">
          <div class="col-md-6 mb-3 mt-3">
            <label for="clinica">Clínica o Dr/a</label>
            <div class="input-group">
              <input class="form-control" type="text" id="clinica" placeholder="Buscar por nombre...">
              <div class="input-group-append">
                <button class="btn btn-secondary btn-outline-secondary" type="button">Buscar</button>
              </div>
            </div> <!-- input-group -->
          </div> <!-- col-md-6 -->
          <div class="col-md-6 mt-3">
            <label for="nombre">Nombre</label>
            <input type="text" class="form-control" v-model="workData.Nombre">
          </div> <!-- col-md-6 -->
          <div class="col-md-5">
            <label for="paciente">Paciente</label>
            <input type="text" class="form-control" v-model="workData.Paciente">
          </div> <!-- col-md-6 -->
        <div class="col-md-3">
          <label for="tipoTrabajo">Tipo trabajo</label>
          <select class="form-control" id="tipoTrabajo" v-model="workData.IdTipoTrabajo">
            <option disabled value="">Seleccione un opción</option>
            <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
          </select>
        </div> <!-- col-md-6 -->
        <div class="col-md-2">
            <label for="precioMetal">Precio metal</label>
            <input type="text" class="form-control" id="precioMetal" placeholder="€" v-model="workData.PrecioMetal">
        </div> <!-- col-md-2 -->
        <div class="col-md-2">
            <label for="color">Color</label>
            <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="workData.Color">
        </div> <!-- col-md-2 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <h4>Indicaciones</h4>
          <workDetailTable></workDetailTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-8 mt-3">
          <h4>Pruebas</h4>
          <test-table></test-table>
        </div> <!-- col-md-8 -->
        <div class="col-md-4 mt-3">
          <label for="fEntrada">Fecha entrada</label>
          <input type="text" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="workData.FechaEntrada">
          <br>
          <label for="fPrevista">Fecha prevista</label>
          <input type="text" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="workData.FechaPrevista">
          <br>
          <label for="fSalida">Fecha salida</label>
          <input type="text" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="workData.FechaTerminacion">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
    </div> <!-- container -->
  </div>
</template>

<script>
import workDetailTable from '../PageElements/WorkDetailTable'
import testTable from '../PageElements/TestTable'
import { getWorkDetails, getWorkTypes } from '../../../main/dal.js'

export default {
  name: 'workDetail',
  components: {
    workDetailTable,
    testTable
  },
  data () {
    return {
      workData: '',
      workTypes: ''
    }
  },
  methods: {
    init: function () { }
  },
  mounted () {
    getWorkTypes('labManager.sqlite').then((types) => {
      this.workTypes = types
    })
    getWorkDetails(1, 'labManager.sqlite').then((work) => {
      this.workData = work
    })
  }
}
</script>

<style>
</style>
