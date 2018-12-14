<script>
export default {
  props: {
    css: {
      type: Object,
      default() {
        return {
          infoClass: 'left floated left aligned six wide column'
        }
      }
    },
    infoTemplate: {
      type: String,
      default() {
        return "Mostrando de {from} a {to} de {total} elementos"
      }
    },
    noDataTemplate: {
      type: String,
      default() {
        return 'No hay datos que mostrar'
      }
    },
  },
  data: function() {
    return {
      tablePagination: null
    }
  },
  computed: {
    paginationInfo () {
      if (this.tablePagination == null || this.tablePagination.total == 0) {
        return this.noDataTemplate
      }

      return this.infoTemplate
        .replace('{from}', this.tablePagination.from || 0)
        .replace('{to}', this.tablePagination.to || 0)
        .replace('{total}', this.tablePagination.total || 0)
    },
  },
  methods: {
    setPaginationData (tablePagination) {
      this.tablePagination = tablePagination
    },
    resetData () {
      this.tablePagination = null
    }
  },
}
</script>
