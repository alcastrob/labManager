<template>
<div>
  <div v-if="this.totalRecords !==0">
    <nav class="float-right" >
      Mostrando registros de {{recordFrom}} a {{recordTo}} de un total de {{totalRecords}}
      <br>
      <div class="float-right">
        <ul class="pagination">
          <li class="page-item" :class="{'disabled': isOnFirstPage}">
            <a class="page-link" href="#" @click.prevent="loadPage('prev')">
              <span>&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-for="n in pageSelectors" v-bind:key="n" :class="{'active': isCurrentPage(n)}">
            <a class="page-link" href="#" @click.prevent="loadPage(n)">{{n}}</a>
          </li>
          <li class="page-item" :class="{'disabled': isOnLastPage}">
            <a class="page-link" href="#" @click.prevent="loadPage('next')">
              <span>&raquo;</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <div v-else class="text-center">
    <b>No hay registros para mostrar con los criterios de búsqueda actuales</b>
  </div>
</div>
</template>

<script>

export default {
  name: 'pagination',
  props: {
  },
  methods: {
    loadPage: function (page) {
      if (page === 'prev') {
        this.$parent.currentPage --
      } else if (page === 'next') {
        this.$parent.currentPage ++
      } else {
        this.$parent.currentPage = page
      }
    },
    isCurrentPage(page) {
      return page === this.$parent.currentPage
    },
    lastPage() {
      return Math.ceil(this.$parent.filteredDataset.length/this.$parent.pageSize)
    }
  },
  computed: {
    pageSelectors() {
      if (this.lastPage() === 0) {
        return []
      } else {
        var array = []
        for (var i=4; i>0; i--) {
          var value = this.$parent.currentPage - i
          if (value > 0) array.push(value)
        }
        array.push(this.$parent.currentPage)
        if(this.lastPage() > this.$parent.currentPage+1 && this.$parent.currentPage > 3){
          array.shift()
        }
        var soFar = array.length
        for (var j=1; j<=(5-soFar); j++) {
          var value2 = this.$parent.currentPage + j
          if (value2 <= this.lastPage()) array.push(value2)
        }
        return array
      }
    },
    isOnFirstPage () {
      return this.$parent.currentPage === 1
    },
    isOnLastPage () {
      if (this.lastPage() === 0) {
        return false
      } else {
        return this.$parent.currentPage === this.lastPage()
      }
    },
    recordFrom () {
      return ((this.$parent.currentPage - 1) * this.$parent.pageSize) + 1
    },
    recordTo() {
      var to = this.$parent.currentPage * this.$parent.pageSize
      if (this.$parent.filteredDataset.length < to) {
        return this.$parent.filteredDataset.length
      } else {
        return to
      }
    },
    totalRecords() {
      return this.$parent.filteredDataset.length
    }
  }
}
</script>


