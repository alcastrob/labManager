<template>
<div id="table" class="table-editable">
    <table class="table table-bordered table-responsive-xs table-striped">
    <tr>
      <th></th>
      <th>Descripción</th>
      <th class="text-right">Precio</th>
    </tr>
    <tr v-for="indication in data" v-bind:key="indication.IdTrabajoDetalle">
      <td class="pt-3" style="width: 41px;"><i class="fa fa-times-circle" v-on:click="deleteRow(indication.IdTrabajoDetalle)"></i></td>

      <td class="noMargins" v-on:keyup="trackChanges($event, indication.IdTrabajoDetalle)">
        <input type="text" v-model="indication.Descripcion" class="inputInTd">
        <div class="typeahead-dropdown list-group myTypeahead" v-if="canDisplayDropdown()">
          <span class="list-group-item clickable">
            <i class="fas fa-align-left mr-1"></i>
            Usar como texto libre</span>
        </div>
      </td>

      <td class="pt-3-half text-right" contenteditable="true" v-on:blur="updatePrice($event, indication.IdTrabajoDetalle)" :class="{'bg-danger text-white shake': isPriceNotANumber(indication.Precio)}">{{indication.Precio}}</td>
    </tr>
    <tr>
      <td class="pt-3" style="width: 41px;">
      </td>
      <td class="pt-3-half" contenteditable="true" ref="newDescripcion"></td>
      <td class="pt-3-half text-right" contenteditable="true" ref="newPrecio" @blur="lostFocusOnLastRow()"></td>
    </tr>
    </table>
    <div>
      <p class="float-right text-right pr-1" :class="{'d-inline-block text-danger shake': sumError}">{{getSum()}}</p>
    </div>
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

var newIds = 10000000

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
      changes: [],
      dataLoaded: false,
      sumError: false,
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
     }
  },
  methods: {
    getSum: function () {
      try {
        var sum = _.sumBy(this.data, function(n) {
          if (n.Precio.indexOf(',') !== -1){
            throw 'comma'
          }
          var temp = parseFloat(n.Precio)
          if (isNaN(temp)){
            throw 'NaN'
          } else {
            return temp
          }
        })
        this.sumError = false
        return 'Total: ' + this.moneyFormatter.format(sum)
      }
      catch(err){
        this.sumError = true
        return 'Error en los datos a sumar'
      }
    },
    updatePrice(event, id) {
      var elementInArray = _.find(this.data, ['IdTrabajoDetalle', id])
      if (this.isEmpty(event.srcElement.innerText)) {
        elementInArray.Precio = 0
      } else {
        elementInArray.Precio =  event.srcElement.innerText
      }
    },
    isPriceNotANumber(price){
      if (price.indexOf(',') !== -1){
        return true
      }
      return (isNaN(parseFloat(price)))
    },
    deleteRow: function (rowId) {
      this.data = _.remove(this.data, function (n) {
        return n.IdTrabajoDetalle !== rowId
      })
      this.changes.push(new changeLogItem('delete', rowId, null))
    },
    canBeDeleted(value){
      return this.isNotEmpty(value.Descripcion) && this.isNotEmpty(value.Precio)
    },
    isEmpty(value){
      return (value === null || value === undefined || value === '')
    },
    isNotEmpty(value){
      return !this.isEmpty(value)
    },
    lostFocusOnLastRow(){
      if (this.isNotEmpty(this.$refs.newDescripcion.innerText) || this.isNotEmpty(this.$refs.newPrecio.innerText)) {
        this.data.push({
          Descripcion: this.$refs.newDescripcion.innerText,
          IdTrabajoDetalle: newIds++,
          Precio: this.$refs.newPrecio.innerText})
        this.$refs.newDescripcion.innerText = ''
        this.$refs.newPrecio.innerText = ''
        this.$refs.newPrecio.parentElement.children[1].focus()
      }
    },
    trackChanges(event, id) {
      // if (event.currentTarget.innerText !== _.find(data.currentId, value))
        //Look for the last UPDATE on the stack, and rewrite it with the new value
        //If doesn't exist, create an UPDATE
    },
    canDisplayDropdown: function() {
      return false
    }
  },
  mounted () {
    // Data is not loaded here because the container component (i.e. WorkDetail) would need also the dataset for this component and another child one (tha label ones). Therefore, for saving one call to the db, the dataset is loaded once there and propagated to the child components like this.

    // Vue doesn't want to manipulate directly the dataset passed as prop. So we made a copy of it for safe inserting, editing and deleting.
    // this.data = this.workIndications

    // The dataset is loaded in the container component, so it could be not available during the mount because this load is async. This line will be invoked whenever the prop dataset is updated in the container component.
    this.$watch('workIndications', function (newVal, oldVal) {
      this.data = newVal.slice(0) // For cloning the array, not passing the reference. This way the watcher doesn't  went bananas.
      // this.data.push({Descripcion: '', IdTrabajoDetalle: null, Precio: ''})
    })

    this.$watch('data', function(newVal, oldVal) {
      if (!(_.some(this.data, {'Descripcion': '', 'Precio': ''}))) {
        //this.data.push({Descripcion: '', IdTrabajoDetalle: null, Precio: ''})
      }
    }, { deep: true })
  }
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
}
.noMargins {
  padding: 0px!important;
  margin: 0px;
  position:relative;
}
.inputInTd {
    width: 100%;
    height: 80px;
    padding: 10px;
    margin: 0px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    position:absolute;
    top:0px;
    height:100%;

    border: 0px;
    background: transparent;
}
</style>
