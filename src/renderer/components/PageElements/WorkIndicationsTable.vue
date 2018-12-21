<template>
<div id="table" class="table-editable">
    <table class="table table-bordered table-responsive-md table-striped">
    <tr>
      <th></th>
      <th>Descripción</th>
      <th class="text-right">Precio</th>
    </tr>
    <tr v-for="indication in data" v-bind:key="indication.IdTrabajoDetalle">
      <td class="pt-3" style="width: 41px;">
        <i class="fa fa-times-circle" v-on:click="deleteRow(indication.IdTrabajoDetalle)" v-if="canBeDeleted(indication)"></i>
      </td>
      <td class="pt-3-half" contenteditable="true">
        {{indication.Descripcion}}
      </td>
      <td class="pt-3-half text-right" contenteditable="true">{{indication.Precio}}</td>
    </tr>
    </table>
    <p class="text-right pr-1">
      Total: {{getSum()}}€
    </p>
</div>
</template>

<script>
import _ from 'lodash'

class changeLogItem {
  constructor(changeType, id, value) {
    this.changeType = changeType
    this.id = id
    this.value = value
  }
  get ChangeType () {
    return this.changeType
  }
  get Id  () {
    return this.id
  }
  get Value() {
    return this.value
  }
}

export default {
  name: 'workIndicationsTable',
  props: {
    workIndications: {
      type: [Object, Array],
      required: true
    }
  },
  data () {
    return {
      data: [],
      changes: []
     }
  },
  methods: {
    getSum: function () {
      return _.sumBy(['Precio'], _.partial(_.sumBy, this.data))
    },
    deleteRow: function (rowId) {
      this.data = _.remove(this.data, function (n) {
        return n.IdTrabajoDetalle !== rowId
      })
      this.changes.push(new changeLogItem('delete', rowId, null))
    },
    canBeDeleted(value){
      // if (value === null || value === undefined) {
      //   return false
      // }
      return this.isNotEmpty(value.Descripcion) && this.isNotEmpty(value.Precio)
    },
    isNotEmpty(value){
      return !(value === null || value === undefined || value === '')
    }
  },
  mounted () {
    // Data is not loaded here because the container component (i.e. WorkDetail) would need also the dataset for this component and another child one (tha label ones). Therefore, for saving one call to the db, the dataset is loaded once there and propagated to the child components like this.

    // Vue doesn't want to manipulate directly the dataset passed as prop. So we made a copy of it for safe inserting, editing and deleting.
    // this.data = this.workIndications

    // The dataset is loaded in the container component, so it could be not available during the mount because this load is async. This line will be invoked whenever the prop dataset is updated in the container component.
    this.$watch('workIndications', function (newVal, oldVal) {
      this.data = newVal.slice(0) // For cloning the array, not passing the reference. This way the watcher doesn't  went bananas.
      console.log('workIndications updated')
      this.data.push({Descripcion: '', IdTrabajoDetalle: null, Precio: ''})
    })
  }
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
}
</style>
