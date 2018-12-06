<template>
    <div>
        <h1>Trabajo</h1>
        <div class="container">
            <div class="row">
                Nº trabajo
            </div>
            <div class="row">
                Fecha entrada
            </div>
            <div class="row">
                Fecha terminación
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
