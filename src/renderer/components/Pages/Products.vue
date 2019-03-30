<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Mantenimiento de Productos y Lotes</h1>
      </div>
      <!-- col-md-12 -->
    </div>
    <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <productsTable ref="products"></productsTable>
      </div>
      <!-- col-md-12 -->
    </div>
    <!-- row -->
  </div>
</template>

<script>
import productsTable from '../PageElements/tables/productsTable'
import { mixin as clickaway } from 'vue-clickaway'
import tableMixin from '../PageElements/tables/tablesWithEmptyRowsMixin'

export default {
	name: 'products',
	mixins: [clickaway, tableMixin],
	components: {
		productsTable
	}
}
</script>

<style>
</style>
