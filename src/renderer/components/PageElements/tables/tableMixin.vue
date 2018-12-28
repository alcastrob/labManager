<script>
import moment from 'moment'
import _ from 'lodash'

const pageSize = 10

export default {
  props: {
    headers: {
      type: Array,
      required: true
    },
    searchFields: {
      type: Array,
      required: true
    },
    // eventId: {
    //   type: String,
    //   required: true
    // },
    filterType: {
      type: String,
      required: false
    },
    filterName: {
      type: String,
      required: false
    },
    urlBase: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      rawDataset: [],
      filteredDataset: '',
      pageSize: pageSize,
      currentPage: 1,
      currentSortCriteria: '',
      currentSortDesc: '',
      currentSeachCriteria: '',
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
    }
  },
  methods: {
    formatRow(row, formatter) {
      if(formatter === 'date' && row !== null && row !== undefined) {
        return moment(row).format('DD/MM/YYYY')
      } else if(formatter === 'money' && row !== null && row !== undefined) {
        return this.moneyFormatter.format(row)
      } else {
      return row
      }
    },
    setDataset: function (dataset) {
      this.rawDataset = dataset
      //Let's check if the dataset contains the required Key column
      if (_.some(dataset, ['Key', undefined])) {
        throw 'Missing Key column in passed dataset in MyTable.vue'
      }

      this.applyTextFilter('') // Just to load all the data
    },
    clickOn: function(index) {
      this.$router.push({
        path: this.urlBase + index
      })
    },
    // Pagination
    loadPage: function (page) {
      this.currentPage = page
    },
    getPaginatedData: function () {
      if (this.rawDataset.length === 0){
        return []
      }
      var arraySize = this.rawDataset.length - 1
      var left = (this.currentPage - 1) * this.pageSize
      var right = (this.currentPage * this.pageSize)
      if (right > arraySize) {
        right = arraySize + 1
      }

      if (left < 0 || left > arraySize)
        return []
      else {
        return _.slice(this.filteredDataset, left, right)
      }
    },
    // Sorting
    sortByExpression: function(expression) {
      if (expression === this.currentSortCriteria) {
        this.currentSortDesc = !this.currentSortDesc
      } else {
        this.currentSortCriteria = expression
        this.currentSortDesc = true
      }
      this.sortBy()
    },
    sortBy: function() {
      var x = this.currentSortCriteria
      this.filteredDataset = _.sortBy(this.filteredDataset, function(row) {
        return row[x]
        })
      if (!this.currentSortDesc) {
        this.filteredDataset = _.reverse(this.filteredDataset)
      }
    },
    // Filter
    applyTextFilter: function (searchCriteria) {
      if (searchCriteria !== '' && this.searchFields.length > 0) {
        this.currentSeachCriteria = searchCriteria
        var lowercaseFilter = searchCriteria.toString().toLowerCase()
        this.filteredDataset = []

        for (var i=0; i != this.searchFields.length; i++){
          var currentSearchField = this.searchFields[i]
          var subset = _.filter(this.rawDataset, function(row){
            if (row[currentSearchField] === null) return false
            return row[currentSearchField].toString().toLowerCase().includes(lowercaseFilter)
          })
          this.filteredDataset = _.union(this.filteredDataset, subset, function(row) {
            return row.IdTrabajo})
        }
        this.sortBy()
      } else {
        this.filteredDataset = this.rawDataset
      }
      this.currentPage = 1
    }
  },
  mounted () {
    // Check the required parameters (props)
    if (this.headers === undefined || this.headers === null)
      throw 'Missing prop headers in myTable.vue'
    if (this.searchFields === undefined || this.searchFields === null)
      throw 'Missing prop searchFields in myTable.vue'
    // if (this.eventId === undefined || this.eventId === null)
    //   throw 'Missing prop eventId in myTable.vue'
    if (this.urlBase === undefined || this.urlBase === null)
      throw 'Missing prop urlBase in myTable.vue'

    moment.locale('es')
  }
}
</script>