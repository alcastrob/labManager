<template>
  <a
    href="#"
    class="btn"
    @click="click"
    ref="button"
    :class="{ 'btn-warning btn-collapsible': !disabled, 'btn btn-outline-secondary': disabled }"
  >
    <i v-bind:class="this.iconCss"></i>
    <span v-if="!disabled">{{text}}</span>
  </a>
</template>

<script>
export default {
	name: 'collapsibleActionButton',
	data() {
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
		callback: {
			type: Function,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false
		}
	},
	methods: {
		click() {
			if (!this.disabled) {
				this.callback()
			}
		}
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