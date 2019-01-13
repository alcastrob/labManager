<template>
  <div class="input-group">
    <input class="form-control typeahead-input" type="text" placeholder="Buscar por nombre..." @keyup="search" v-model="query" v-on-clickaway="hidePopup" ref="producto" :class="{'is-invalid': isInvalid}" :disabled="$attrs.disabled === true">
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead">
      <div v-for="product in candidateProductFromQuery" :key='product.IdProductoLote'>
        <span class="list-group-item clickable" v-on:click="selectProduct(product.Descripcion, product.IdProductoLote)">{{product.Descripcion}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { searchProductByName, getProduct } from '../../../main/dal.js'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'

export default {
  name: 'productSearch',
  mixins: [ clickaway ],
  data () {
    return {
      resultsVisible: false,
      query: '',
      candidateProductFromQuery: [],
      focus: false
    }
  },
  props: ['value', 'isInvalid'],
  methods: {
    search: function() {
      this.resultsVisible = true
      this.focus = true
      if (this.query.length > 3) {
        searchProductByName(this.query, 'labManager.sqlite').then((productDetails) => {
          this.candidateProductFromQuery = productDetails
        })
      } else {
        this.candidateProductFromQuery = []
        this.$emit('input', -1)
      }
    },
    selectProduct: function(name, id) {
      this.query = ''
      this.resultsVisible = false
      this.$emit('input', {IdProductoLote: id, Descripcion: name})
      this.$emit('change', null)
      this.hidePopup()
    },
    canDisplayDropdown: function() {
      this.resultVisible =  (this.query !== '' && this.focus)
      return this.resultVisible
    },
    hidePopup: function() {
      this.focus = false
    }
  },
  mounted () {
    this.$refs.producto.focus()
    this.$watch('value', function (newVal, oldVal) {
      getProduct(newVal, 'labManager.sqlite').then((dentistDetail) => {
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
