<template>
  <div id="app">
    <my-vuetable api-url="https://vuetable.ratiw.net/api/users"
      :fields="fields" :sort-order="sortOrder" :append-params="moreParams"
      detail-row-component="my-detail-row">
      <template slot="actions" scope="props">
        <i class="fa fa-times-circle" @click="onAction('delete-item', props.rowData, props.rowIndex)"></i>
      </template>
    </my-vuetable>
  </div>
</template>

<script>
import Vue from 'vue'
import FieldDefs from './FieldDefs.js'
import MyVuetable from '../ReusableTable/MyVuetable'
import DetailRow from '../ReusableTable/DetailRow'
Vue.component('my-detail-row', DetailRow)

export default {
  name: 'app',
  components: {
    MyVuetable
  },
  data () {
    return {
      fields: FieldDefs,
      sortOrder: [
        {
          field: 'email',
          sortField: 'email',
          direction: 'asc'
        }
      ],
      moreParams: {}
    }
  },
  methods: {
    onAction (action, data, index) {
      console.log('slot action: ' + action, data.name, index)
    },
  }
}
</script>
<style>
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap-theme.min.css'); */
</style>