<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Catálogo de Productos y Servicios</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div>
     <!-- <catalogTable v´model="xxxx" ref="catalog"></catalogTable> -->
    </div> <!-- row -->
  </div>
</template>

<script>
import catalogTable from '../PageElements/tables/catalogTable'
import { getCatalogList } from '../../../main/dal.js'
import { mixin as clickaway } from 'vue-clickaway'
import tableMixin from '../PageElements/tables/TablesWithEmptyRowsMixin'
import _ from 'lodash'

export default {
  name: 'catalog',
  mixins: [ clickaway, tableMixin ],
  components: {
    catalogTable
  },
  data () {
    return { }
  },
  methods: {},
  mounted () {
    getCatalogList('labManager.sqlite').then((catalog) => {
      //this.$refs.catalogTable.setDataset(catalog)
    })
  }
}
</script>

<style>
</style>
