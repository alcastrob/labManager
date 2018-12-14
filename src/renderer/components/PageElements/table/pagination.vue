<template>
  <nav class="float-right">
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
  </nav>
</template>

:class="{'active': n===this.$parent.currentPage}"

<script>

export default {
  name: 'pagination',
  props: {
  },
  methods: {
    loadPage: function (page) {
      console.log(page)
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
    }
  },
  computed: {
    pageSelectors () {
      var lastPage = Math.ceil(this.$parent.dataset.length/this.$parent.pageSize)
      if (lastPage === 0) {
        return []
      } else {
        var returnedValue = []
        if (this.$parent.currentPage <= 3) {
          returnedValue = [1, 2, 3, 4, 5]
        } else if (lastPage - this.$parent.currentPage <= 2) {
          for (var i = lastPage - 4; i <= lastPage; i++) {
            returnedValue.push(i)
          }
        } else {
          for (var i = this.$parent.currentPage - 2; i <= this.$parent.currentPage + 2; i++) {
            returnedValue.push(i)
          }
        }
        return returnedValue
      }
    },
    isOnFirstPage () {
      return this.$parent.currentPage === 1
    },
    isOnLastPage () {
      var lastPage = Math.ceil(this.$parent.dataset.length/this.$parent.pageSize)
      if (lastPage === 0) {
        return false
      } else {
        return this.$parent.currentPage === lastPage
      }
    }
  }
}
</script>


