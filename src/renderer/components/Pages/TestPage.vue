<template>
  <div>
    <button @click="insert">Insertar</button>
  </div>
</template>

<script>
import { insertWork } from '../../../main/dal.js'
import invoiceExtendedTable from '../PageElements/tables/invoiceExtendedTable'
export default {
  name: 'test',
  components: {
  },
  data () {
    return {
      work: {
        Color: "COLOR",
        FechaEntrada: "2019-01-30",
        FechaPrevista: "2019-01-31",
        FechaTerminacion: "2019-02-01",
        IdDentista: 28,
        IdTipoTrabajo: 1,
        IdTrabajo: 0,
        NombreDentista: "PACIENTE",
        Paciente: "PACIENTE",
        PrecioFinal: 123,
        PrecioMetal: 456
      }
    }
  },
  methods: {
    insert: async function() {
      await insertWork(this.work)
    }
  },
  mounted () {

  }
}
</script>

<style>
</style>
