<template>
  <div class="mt-1">
    {{description}}
    <template v-for="option in options">
      <optionButton :text="option" :eventName="eventName" :key="option" class="mr-1"></optionButton>
    </template>
  </div>
</template>

<script>
import optionButton from './optionButton'
import _ from 'lodash'
export default {
  name: 'optionLine',
  components: {
    optionButton
  },
  data () {
    return {}
  },
  props: {
    isMultiple: {
      type: Boolean,
      required: false
    },
    options: {
      type: Array,
      required: true
    },
    description: {
      type: String,
      required: false
    }
  },
  methods: {
    clear: function() {
      _.forEach(this.$children, function(child) {
        child.clear()
      })
    },
    getSelected: function() {
      var x = _.filter(this.$children, function(child) {
        return child._data.isSelected
      })
      var y = _.map(x, 'text')
      if (this.isMultiple) {
        return y
      } else {
        return _.first(y)
      }
    },
    select: function(selectedOption){
      _.forEach(_.filter(this.$children, ['text', selectedOption]), function(button) {
        button.select()
      })
    }
  },
  mounted () {
    if (this.$attrs.id === undefined || this.$attrs.id === null)
      throw 'Missing id in optionLine. This component requires an unique id.'
    if (this.options === undefined || this.options === null)
      throw 'Missing prop options in optionLine.vue'

    this.$root.$on(this.eventName, data => {
      if (!this.isMultiple) {
        _.forEach(this.$children, function(child) {
          if (child.text !== data.text){
            child.clear()
          }
        })
      }
      this.$root.$emit('optionLine:' + this.$attrs.id + ':updatedFilter')
    })
  },
  computed: {
    eventName: function() {
      return 'optionLine:' + this.$attrs.id + ':click'
    }    
  }
}
</script>

<style>
</style>
