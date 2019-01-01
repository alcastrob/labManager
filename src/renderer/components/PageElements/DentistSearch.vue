<template>
  <div class="input-group">
    <input class="form-control typeahead-input" type="text" placeholder="Buscar por nombre..." @keyup="search" v-on:focus="search" v-model="query" autocomplete="off"  v-on-clickaway="hidePopup" ref="clinica" :class="{'is-invalid': isInvalid}">
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead">
      <span class="list-group-item clickable" v-on:click="createNew(query)" v-if="canCreate(query)"><i class="fas fa-plus-circle mr-1"></i>Crear nuevo/a dentista</span>
      <div v-for="dentist in candidateDentistsFromQuery" :key='dentist.IdDentista'>
        <span class="list-group-item clickable" v-on:click="selectDentist(dentist.NombreDentista, dentist.IdDentista)">{{dentist.NombreDentista}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { searchDentistsByName, getDentist } from '../../../main/dal.js'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'

export default {
  name: 'dentistSearch',
  mixins: [ clickaway ],
  data () {
    return {
      resultsVisible: false,
      query: '',
      candidateDentistsFromQuery: [],
      focus: false
    }
  },
  props: ['value', 'isInvalid'],
  methods: {
    search: function() {
      this.resultsVisible = true
      this.focus = true
      if (this.query.length > 3) {
        searchDentistsByName(this.query, 'labManager.sqlite').then((dentistDetails) => {
          this.candidateDentistsFromQuery = dentistDetails
        })
      } else {
        this.candidateDentistsFromQuery = []
        this.$emit('input', -1)
      }
    },
    selectDentist: function(name, id) {
      this.query = name
      this.resultsVisible = false
      this.$emit('input', id)
    },
    createNew: function(name) {
      this.$router.push({
        path: '/dentists/new',
        query: {
          name: name
        }
      })
    },
    canCreate: function(name) {
      return !(_.some(this.candidateDentistsFromQuery, {'NombreDentista': name}))
    },
    canDisplayDropdown: function() {
      this.resultVisible =  (this.query !== '' && this.canCreate(this.query) && this.focus)
      return this.resultVisible
    },
    hidePopup: function() {
      this.focus = false
    }
  },
  mounted () {
    this.$refs.clinica.focus()
    this.$watch('value', function (newVal, oldVal) {
      getDentist(newVal, 'labManager.sqlite').then((dentistDetail) => {
        if (dentistDetail !== undefined) {
          this.query = dentistDetail.NombreDentista
          this.hidePopup()
        }
      })
    })
  }
}
</script>

<style lang="scss">
@import url('~@/assets/css/typeaheadjs.css');

.myTypeahead {
  z-index: 100;
  box-shadow: 5px 5px 1px #CCCCCC;
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

.clickable{
  cursor: pointer;
}
</style>
