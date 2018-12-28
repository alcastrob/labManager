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
  props: {
    workIndications: {
      type: Array,
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
    // Checked -------------------------------------------------
    addLastRow(){
      if (this.isNotEmpty(this.$refs.newDescripcion.value) || this.isNotEmpty(this.$refs.newPrecio.value)) {
        this.data.push({
          Descripcion: this.$refs.newDescripcion.value,
          IdTrabajoDetalle: newIds++,
          Precio: this.$refs.newPrecio.value})
        this.$refs.newDescripcion.value = ''
        this.$refs.newPrecio.value = ''
        this.$refs.newPrecio.parentElement.parentElement.children[1].focus()
      }
    },
    deleteRow: function (rowId) {
      this.data = _.remove(this.data, function (n) {
        return n.IdTrabajoDetalle !== rowId
      })
      this.changes.push(new changeLogItem('delete', rowId, null))
    },

    getSum: function () {
      try {
        var sum = _.sumBy(this.data, function(n) {
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
    isNotANumber(price){
      if (this.isEmpty(price))
        return true
      return (isNaN(parseFloat(price)))
    },
    updatePrice(event, id) {
      var elementInArray = _.find(this.data, ['IdTrabajoDetalle', id])
      if (this.isEmpty(event.srcElement.value)) {
        elementInArray.Precio = 0
      } else {
        elementInArray.Precio =  event.srcElement.value
      }
    },
    isEmpty(value){
      return (value === null || value === undefined || value === '')
    },
    isNotEmpty(value){
      return !this.isEmpty(value)
    },

    // Not checked ---------------------------------------------

    
    
    // canBeDeleted(value){
    //   return this.isNotEmpty(value.Descripcion) && this.isNotEmpty(value.Precio)
    // },
    
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

