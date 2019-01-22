<template>
  <router-link :to="pathTo" class="btn btn-warning btn-collapsible">
    <i v-bind:class="this.iconCss"></i>
    <span>{{text}}</span>
  </router-link>
</template>

<script>
import VueRouter from 'vue-router'

export default {
  name: 'collapsibleLinkButton',
  data () {
    return {}
  },
  props: {
    iconCss: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    pathTo: {
      type: String,
      required: true
    }
  },
  mounted() {
    // Check the required parameters (props)
    if (this.text === undefined || this.text === null)
      throw 'Missing prop value text in WorkDetail.vue'
    if (this.iconCss === undefined || this.iconCss === null)
      throw 'Missing prop value iconCss in WorkDetail.vue'
    if (this.pathTo === undefined || this.pathTo === null)
      throw 'Missing prop value pathTo in WorkDetail.vue'
  }
}
</script>

<style lang="scss">
@mixin transition($settings) {
  -webkit-transition: $settings;
  -moz-transition: $settings;
  -ms-transition: $settings;
  -o-transition: $settings;
  transition: $settings;
}

.btn-collapsible {
  overflow: hidden;
  @include transition(all 500ms ease-in-out);
  max-width: 40px;
  &.btn-xs {
    max-width: 25px;
  }
  &.btn-sm {
    max-width: 34px;
  }
  &.btn-lg {
    max-width: 50px;
  }
  span {
    opacity: 0;
    text-indent: -6px;
    display: inline-block;
    @include transition(all 500ms ease-in-out);
  }
  &:hover {
    max-width: 300px;
    @include transition(all 300ms ease-in-out);
    span {
      opacity: 1;
      text-indent: 0px;
      @include transition(all 300ms ease-in-out);
    }
  }
}
</style>