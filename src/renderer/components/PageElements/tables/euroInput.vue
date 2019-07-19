<template>
	<textarea
		v-model="displayValue"
		@blur="blur($event)"
		@focus="isInputActive = true"
		@focusin="focused"
		class="noCornerTextArea"
		ref="textArea"
	></textarea>
</template>

<script>
export default {
	name: 'euroInput',
	data() {
		return {
			isInputActive: false,
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			})
		}
	},
	props: ['value'],
	methods: {
		blur: function(event) {
			this.isInputActive = false
			this.$emit('change', {
				currentTarget: {
					value: this.$refs.textArea.value
				}
			})
			this.$emit('blur', event)
		},
		focused(event) {
			this.$nextTick(() => {
				event.target.select()
			})
		}
	},
	computed: {
		displayValue: {
			get: function() {
				if (this.isInputActive) {
					// Cursor is inside the input field. unformat display value for user
					if (this.value !== undefined) {
						return this.value.toString()
					} else {
						// Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
						// $emit the event so that parent component gets it
						this.$emit('input', 0)
					}
				} else {
					// User is not modifying now. Format display value for user interface
					if (this.value === undefined) {
						return ''
					} else {
						return this.moneyFormatter.format(this.value)
					}
				}
			},
			set: function(modifiedValue) {
				// Recalculate value after ignoring "$" and "," in user input
				// eslint-disable-next-line
				let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''))
				// Ensure that it is not NaN
				if (isNaN(newValue)) {
					newValue = 0
				}
				// If you're in the middle of typing a decimal value, you can't filter the decimal point.
				if (modifiedValue === `${newValue}.`) {
					newValue = modifiedValue
				}

				// Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
				// $emit the event so that parent component gets it
				this.$emit('input', newValue)
				this.$refs.textArea.value = newValue
			}
		}
	},
	mounted() {
		this.$refs.textArea.classList = this.$el.classList.value
	}
}
</script>
<style>
.noCornerTextArea {
	vertical-align: text-top;
	resize: none;
	overflow: hidden;
}
</style>