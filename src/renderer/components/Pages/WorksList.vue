<template>
  <div id="app">
    <my-vuetable
      api-url="https://vuetable.ratiw.net/api/users"
      :fields="fields"
      :sort-order="sortOrder"
      :append-params="moreParams"
      detail-row-component="my-detail-row"
    >
      <template slot="actions" scope="props">
        <div class="custom-actions">
          <button class="btn btn-default btn-sm"
            @click="onAction('view-item', props.rowData, props.rowIndex)">
            <span class="glyphicon glyphicon-zoom-in"></span>
          </button>
          <button class="btn btn-default btn-sm"
            @click="onAction('edit-item', props.rowData, props.rowIndex)">
            <i class="glyphicon glyphicon-pencil"></i>
          </button>
          <button class="btn btn-default btn-sm"
            @click="onAction('delete-item', props.rowData, props.rowIndex)">
            <i class="glyphicon glyphicon-trash"></i>
          </button>
        </div>
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.7/semantic.min.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap-theme.min.css');
/* @import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'); */
</style>