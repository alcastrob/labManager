<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Técnicos</h1>
      </div>
      <!-- col-md-12 -->
    </div>
    <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <techniciansTable ref="technicians"></techniciansTable>
      </div>
      <!-- col-md-12 -->
    </div>
    <!-- row -->
  </div>
</template>

<script>
import techniciansTable from '../PageElements/tables/techniciansTable'
import { mixin as clickaway } from 'vue-clickaway'
import tableMixin from '../PageElements/tables/tablesWithEmptyRowsMixin'

export default {
	name: 'catalog',
	mixins: [clickaway, tableMixin],
	components: {
		techniciansTable
	}
}
</script>

<style>
</style>
