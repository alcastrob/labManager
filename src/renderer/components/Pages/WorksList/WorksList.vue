<template>
  <div id="app">
    <my-vuetable :fields="fields" :data="data" :sort-order="sortOrder" :append-params="moreParams">
      <template slot="actions" scope="props">
        <i class="fa fa-times-circle" @click="onAction('delete-item', props.rowData, props.rowIndex)"></i>
      </template>
    </my-vuetable>
  </div>
</template>

<script>
import Vue from 'vue'
import FieldDefs from './FieldDefs.js'
import MyVuetable from '../../ReusableTable/MyVuetable'

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
      moreParams: {},
      data: [{
        name: 'Angel',
        surname: 'Castro'
      },
      {
        name: 'Angel2',
        surname: 'Castro2'
      }]
    }
  },
  methods: {
    onAction (action, data, index) {
      console.log('slot action: ' + action, data.name, index)
    }
  },
}
</script>
<style>
</style>