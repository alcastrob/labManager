<template>
	<textarea
		v-model="displayValue"
		@blur="isInputActive = false"
		@focus="isInputActive = true"
		@focusin="focused"
		class="noCornerTextArea"
		ref="textArea"
	></textarea>
</template>

<script>
export default {
	name: 'percentageInput',
	data() {
		return {
			isInputActive: false
		}
	},
	props: ['value'],
	computed: {
		displayValue: {
			get: function() {
				if (this.isInputActive) {
					// Cursor is inside the input field. unformat display value for user
					// this.$el.select()
					return this.value.toString()
				} else {
					// User is not modifying now. Format display value for user interface
					return this.value + ' %'
				}
			},
			set: function(modifiedValue) {
				// Recalculate value after ignoring "%" and "," in user input
				// eslint-disable-next-line
				let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''))
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
	methods: {
		focused(event) {
			this.$nextTick(() => {
				event.target.select()
			})
		}
	},
	mounted() {
		this.$refs.textArea.classList = this.$el.classList.value
	}
}
</script>