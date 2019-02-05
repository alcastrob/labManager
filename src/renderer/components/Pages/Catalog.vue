<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Mantenimiento de Catálogo</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <catalogTable ref="catalogTable"></catalogTable>
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
  },
  methods: {
    save() {
      this.$refs.catalog.save()
    }
  },
  computed: {
    // isDirty: {
    //   get: function () {
    //     //   //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
    //     this.$refs.catalog.addLastRow()
    //     var result = this.$refs.catalogTable.isDirty()
    //     return result
    //   },
    //   set: function(x) {
    //   }
    // },
    isError() {
      //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
      this.$refs.catalog.addLastRow()
      var result = this.$refs.catalogTable.isError()
      return result
    }
  },
  mounted () {
    this.$root.$on('topbar:save', this.save)
  }
}
</script>

<style>
</style>
