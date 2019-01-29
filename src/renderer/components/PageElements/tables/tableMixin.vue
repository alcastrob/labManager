<script>
import moment from 'moment'
import _ from 'lodash'

const PAGESIZE = 10
const MAXROWSTOEXCEL = 500

export default {
  props: {
    headers: {
      type: Array,
      required: true
    },
    searchFields: {
      type: Array,
      required: false
    },
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
    },
    masterKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      rawDataset: [],
      filteredDataset: [],
      pageSize: PAGESIZE,
      currentPage: 1,
      currentSortCriteria: '',
      currentSortDesc: '',
      currentSeachCriteria: '',
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }),
      paginationDisabled: false,
      isExporting: false,
      endExportingCallback: {}
    }
  },
  methods: {
    formatRow(row, formatter) {
      if(formatter === 'date' && row !== null && row !== undefined) {
        return moment(row).format('DD/MM/YYYY')
      } else if(formatter === 'money' && row !== null && row !== undefined && !this.isExporting) {
        return this.moneyFormatter.format(row)
      } else if(formatter === 'percentage' && row !== null && row !== undefined && !this.isExporting) {
        return row + ' %'
      } else {
      return row
      }
    },
    setDataset: function (dataset) {
      this.rawDataset = dataset
      //Let's check if the dataset contains the required Key column
      if (_.some(dataset, ['Key', undefined])) {
        throw 'Missing Key column in passed dataset in tableXXX.vue'
      }

      this.applyTextFilter('') // Just to load all the data
    },
    updateDataset: function(dataset) {
      this.rawDataset = dataset
      this.filteredDataset = dataset
    },
    clickOn: function(index) {
      this.$router.push({
        path: this.urlBase + index
      })
    },
    //Called by MonthCheck (or other containing page)
    beginExporting(callback) {
      this.selectedDentist = 0
      this.isExporting = true
      this.endExportingCallback = callback
    },
    //Called by the excel button
    endExporting (){
      this.isExporting = false
      if (this.endExportingCallback !== undefined){
        this.endExportingCallback()
      }
    },

    // Pagination -------------------------------------------------------------
    loadPage: function (page) {
      this.currentPage = page
    },
    getPaginatedData: function () {
      if (this.rawDataset.length === 0){
        return []
      }
      if (!this.paginationDisabled) {
        var arraySize = this.rawDataset.length - 1
        var left = (this.currentPage - 1) * this.pageSize
        var right = (this.currentPage * this.pageSize)
        if (right > arraySize) {
          right = arraySize + 1
        }
      } else {
        var left = 0
        var right = arraySize
      }

      if (left < 0 || left > arraySize)
        return []
      else {
        return _.slice(this.filteredDataset, left, right)
      }
    },
    enablePagination: function() {
      this.paginationDisabled = false
    },
    disablePagination: function(callback) {
      this.paginationDisabled = true
      setTimeout(() => {
        callback()
      }, 3000)
    },

    // Sorting ----------------------------------------------------------------
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
      this.filteredDataset = _.sortBy(this.filteredDataset, [this.currentSortCriteria, this.masterKey])
      if (!this.currentSortDesc) {
        this.filteredDataset = _.reverse(this.filteredDataset)
      }
    },

    // Filter -----------------------------------------------------------------
    applyTextFilter: function (searchCriteria) {
      if (searchCriteria !== '' && searchCriteria !== undefined && searchCriteria !== null && this.searchFields.length > 0) {
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
    moment.locale('es')
  }
}
</script>