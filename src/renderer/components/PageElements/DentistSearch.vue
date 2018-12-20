<template>
  <div class="input-group">
    <input class="form-control typeahead-input" type="text" placeholder="Buscar por nombre..." @keyup="search" v-on:focus="search" v-model="query" autocomplete="off"  v-on-clickaway="hidePopup">
    <div class="input-group-append">
    </div>
    <div v-if="resultsVisible" class="typeahead-dropdown list-group myTypeahead">
      <a href='#' class="list-group-item" v-on:click="createNew(query)"><i class="fas fa-plus-circle mr-1"></i>Crear nuevo/a dentista</a>
      <div v-for="dentist in data" :key='dentist.IdDentista'>
        <a href="#" class="list-group-item" v-on:click="selectDentist(dentist.NombreDentista, dentist.IdDentista)">{{dentist.NombreDentista}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { searchDentistsByName } from '../../../main/dal.js'
import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [ clickaway ],
  name: 'dentistSearch',
  data () {
    return {
      resultsVisible: false,
      query: '',
      data: [],
      selectedId: -1
    }
  },
  methods: {
    search: function() {
      this.resultsVisible = true
      if (this.query.length > 3) {
        searchDentistsByName(this.query, 'labManager.sqlite').then((dentistDetails) => {
          this.data = dentistDetails
        })
      } else {
        this.data = []
        this.selectedId = -1
      }
    },
    selectDentist: function(nombre, id) {
      this.query = nombre
      this.selectedId = id
      this.resultsVisible = false
      this.$root.$emit('work:dentistSelected', this.selectedId)
    },
    createNew: function(nombre) {
      console.log('New')
    },
    hidePopup: function() {
      this.resultsVisible = false
    }
  }
}
</script>

<style lang="scss">
@import url('~@/assets/css/typeaheadjs.css');

.myTypeahead {
  z-index: 100;
  box-shadow: 5px 5px 2px grey;
}

// Boostrap Typeahead CSS
$input-border-radius: 6px;
@mixin show-dropdown {
  z-index: 100;
  display: block;
  box-shadow: 10px 10px 5px grey;
  background-color: fuchsia;
}

a {
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
}

.input-inline-button {
  display: inline-block;
  position: absolute;
  z-index: 104;
  right: 0;
  top: 0;
  text-decoration: none;
  padding: 0.5em;
  color: #999;
}
.list-group-item {
  &.active {
    background: #eee;
    border-color: #eee;
    color: #333;
  }
}
.typeahead {
  position: relative;
  .input-group-addon {
    &:after {
      content: ':';
      display: inline;
    }
  }
  &-dropdown {
    display: none;
    // border-top: 1px solid #aaa;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: -2px;
    transition-delay: 0.75s;
    transition: display 1s;
    &:hover {
      display: block;
    }
    > .list-group-item {
      &:first-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        &:not(:last-child) {
          border-radius: 0;
        }
      }
    }
    &:focus {
      @include show-dropdown;
    }
  }
  &-input {
    z-index: 100;
    position: relative;
    &.form-control {
      border-top-right-radius: $input-border-radius !important;
      border-bottom-right-radius: $input-border-radius !important;
    }
    &:focus {
      z-index: 103;
      padding-bottom: 8px;
      height: 36px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0 !important;
      + .typeahead-dropdown {
        @include show-dropdown;
      }
    }
  }
  &-input-filter {
    // display: inline-block;
    // border: 1px solid;
    // @extend .input-group-addon ;
  }
}

.hover-reveal-group {
  .hover-reveal {
    visibility: hidden;
  }
  &:hover {
    .hover-reveal {
      visibility: visible;
    }
  }
}
</style>
