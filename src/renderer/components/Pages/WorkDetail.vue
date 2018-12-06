<template>
    <div>
        <h1>Trabajo nº 3689  {{id}}</h1>
        <div class="container">
            <div class="row">
                <div class="d-flex justify-content-between row-hl">
                    <div class="p-4 item-hl" style="width: 800px">          
                        <label for="fEntrada">
                        Fecha entrada
                        </label>
                        <input type="text" class="form-control" id="fEntrada" placeholder="06/12/2018">
                        <br>
                        <label for="fSalida">
                        Fecha salida
                        </label>
                        <input type="text" class="form-control" id="fSalida" placeholder="08/12/2018">
                    </div>
                    <div class="p-4 item-hl">
                        <i class="fas fa-tags fa-2x" aria-hidden="true"></i>
                        <h4>Etiquetas</h4>
                        <button class="btn btn-info btn-sm mt-1">Cerámica</button>
                        <button class="btn btn-info btn-sm mt-1">Compostura</button>
                        <button class="btn btn-info btn-sm mt-1">Esqueléticos</button>
                        <button class="btn btn-info btn-sm mt-1">Ortodóncia</button>
                        <button class="btn btn-info btn-sm mt-1">Resina</button>
                        <button class="btn btn-info btn-sm mt-1">Garantía</button>
                    </div>
                </div>
            </div>            
            <div class="row">
                <h4>Clínica o Dr/a.</h4>
            </div>
            <div class="row">
                <div class="input-group mb-3">
                    <input class="form-control" type="text" id="clinica" placeholder="Buscar por nombre...">
                    <div class="input-group-append">
                        <button class="btn btn-secondary btn-outline-secondary" type="button">Buscar</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <h4>Indicaciones de trabajo</h4>
            </div>
            <div class="row">
                <workDetailTable></workDetailTable>
            </div>
            <div class="row">
                <h4>Pruebas</h4>
            </div>
            <div class="row">
                <test-table></test-table>
            </div>
        </div>
    </div>
</template>

<script>
import workDetailTable from '../PageElements/WorkDetailTable'
import testTable from '../PageElements/TestTable'

export default {
  name: 'workDetail',
  components: {
    workDetailTable,
    testTable
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
</style>
