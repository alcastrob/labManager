<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Mantenimiento de Catálogo</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <catalogTable ref="catalog"></catalogTable>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
  </div>
</template>

<script>
import catalogTable from '../PageElements/tables/catalogTable'
import { mixin as clickaway } from 'vue-clickaway'
import tableMixin from '../PageElements/tables/tablesWithEmptyRowsMixin'
import _ from 'lodash'

export default {
  name: 'catalog',
  mixins: [ clickaway, tableMixin ],
  components: {
    catalogTable
  }
}
</script>

<style>
</style>
