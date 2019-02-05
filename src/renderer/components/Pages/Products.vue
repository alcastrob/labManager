<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Mantenimiento de Productos y Lotes</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <productsTable ref="products"></productsTable>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
  </div>
</template>

<script>
import productsTable from '../PageElements/tables/productsTable'
import { mixin as clickaway } from 'vue-clickaway'
import tableMixin from '../PageElements/tables/tablesWithEmptyRowsMixin'
import _ from 'lodash'

export default {
  name: 'products',
  mixins: [ clickaway, tableMixin ],
  components: {
    productsTable
  },
  computed: {
    isDirty() {
      //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
      this.$refs.products.addLastRow()
      var result = this.$refs.products.isDirty()
      return result
    },
    isError() {
      //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
      this.$refs.products.addLastRow()
      var result = this.$refs.products.isError()
      return result
    }
  }
}
</script>

<style>
</style>
