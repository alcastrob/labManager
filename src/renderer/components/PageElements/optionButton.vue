<template>
  <a class="btn btn-outline-info btn-sm" :class="{active: this.isSelected}" href="#" v-on:click="sendEvent()">
    <span>{{text}}</span>
  </a>
</template>

<script>
export default {
  name: 'optionButton',
  data () {
    return {
      isSelected: false
    }
  },
  props: {
    text: {
      type: String,
      required: true
    },
    eventName: {
      type: String,
      required: true
    }
  },
  methods: {
    sendEvent: function() {
      this.toggleState()
      this.$root.$emit(this.eventName, {text: this.text, isSelected: this.isSelected})
    },
    toggleState: function() {
      this.isSelected = !this.isSelected
    },
    clear: function() {
      this.isSelected = false
    }
  },
  mounted() {
    // Check the required parameters (props)
    if (this.text === undefined || this.text === null)
      throw 'Missing prop value workId in WorkDetail.vue'
    if (this.eventName === undefined || this.eventName === null)
      throw 'Missing prop value workId in WorkDetail.vue'
  }
}
</script>