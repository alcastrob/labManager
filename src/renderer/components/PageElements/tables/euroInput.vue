<template>
  <textarea v-model="displayValue" @blur="isInputActive = false" @focus="isInputActive = true" ref="textArea"></textarea>
</template>

<script>
export default {
  name: 'euroInput',
  data () {
    return {
      isInputActive: false,
      moneyFormatter: new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    })
    }
  },
  props: ["value"],
  computed: {
    displayValue: {
      get: function() {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.value.toString()
        } else {
          // User is not modifying now. Format display value for user interface
          return this.moneyFormatter.format(this.value)
        }
      },
      set: function(modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ""))
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
            newValue = 0
        }
        // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
        // $emit the event so that parent component gets it
        this.$emit('input', newValue)
        this.$emit('change', null)
      }
    }
  },
  mounted () {
    this.$refs.textArea.classList = this.$el.classList.value
  }
}
</script>