<template>
<div id="table" class="table-editable">
    <table class="table table-bordered table-responsive-xs table-striped">
    <tr>
      <th style="width: 4%;"></th>
      <th style="width: 80%;">Descripción</th>
      <th style="width: 16%;" class="text-right">Precio</th>
    </tr>
    <tr v-for="indication in data" v-bind:key="indication.IdTrabajoDetalle">
      <td class="pt-3-half">
        <i class="fa fa-times-circle" v-on:click="deleteRow(indication.IdTrabajoDetalle)"></i>
      </td>
      <td class="noMargins" v-on:keyup="trackChanges($event, indication.IdTrabajoDetalle)">
        <input type="text" v-model="indication.Descripcion" class="inputInTd">
        <div class="typeahead-dropdown list-group myTypeahead" v-if="canDisplayDropdown()">
          <span class="list-group-item clickable">
            <i class="fas fa-align-left mr-1"></i>
            Usar como texto libre</span>
        </div>
      </td>
      <td class="noMargins">
        <input type="text" class="inputInTd text-right" @blur="updatePrice($event, indication.IdTrabajoDetalle)" v-model="indication.Precio" :class="{'bg-danger text-white animated flash': isNotANumber(indication.Precio)}" v-on:keydown="filterJustNumberKeystrokes">
      </td>
    </tr>
    <tr>
      <td class="pt-3-half"></td>
      <td class="noMargins">
        <input type="text" class="inputInTd" ref="newDescripcion">
      </td>
      <td class="noMargins">
        <input type="text" class="inputInTd text-right" ref="newPrecio" @blur="addLastRow()" v-on:keydown="filterJustNumberKeystrokes">
      </td>
    </tr>
    </table>
    <div>
      <p class="float-right text-right pr-1" :class="{'d-inline-block text-danger animated shake': sumError}">{{getSum()}}</p>
    </div>
</div>
</template>

<script>

import workIndicationsMixin from './WorkIndicationsTableMixin'

export default {
  name: 'workIndicationsTable',
  mixins: [workIndicationsMixin],
  methods: { 
    filterJustNumberKeystrokes(event){
      if (!(event.key === '0' || event.key === '1' || event.key === '2' ||
        event.key === '3' || event.key === '4' || event.key === '5' ||
        event.key === '6' || event.key === '7' || event.key === '8' ||
        event.key === '9' || event.key === '.' || event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End' ||
        event.key === '-' || (event.key === 'c' && event.ctrlKey === true) ||
        event.key === 'Delete' || (event.key === 'v' && event.ctrlKey === true) ||
        event.key === 'Backspace' || event.key === 'Tab' || event.key === 'Enter'
      ))
        event.preventDefault()
    }
  }
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
    height: 49px;
}
.noMargins {
  padding: 0px 0px 0px 0px!important;
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
