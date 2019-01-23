<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Catálogo de Productos y Servicios</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <catalogTable ref="catalog"></catalogTable>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <button class="btn btn-secondary btn-block" type="button" @click="save">
          <i class="fas fa-save"></i>
          Guardar
        </button>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
  </div>
</template>

<script>
import catalogTable from '../PageElements/tables/catalogTable'
import { mixin as clickaway } from 'vue-clickaway'
import tableMixin from '../PageElements/tables/TablesWithEmptyRowsMixin'
import _ from 'lodash'

export default {
  name: 'products',
  mixins: [ clickaway, tableMixin ],
  components: {
    catalogTable
  },
  data () {
    return {
    }
  },
  methods: {
    save() {
      this.$refs.catalog.save()
    }
  },
}
</script>

<style>
</style>
