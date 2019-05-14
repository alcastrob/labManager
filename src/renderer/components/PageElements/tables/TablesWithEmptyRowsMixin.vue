<script>
export default {
	props: ['value'],
	data() {
		return {
			newIds: 10000000,
			data: [],
			insertedRows: [],
			updatedRows: [],
			deletedRows: [],
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			})
		}
	},
	methods: {
		isNotANumber(data) {
			if (data !== 0 && !data) {
				return true
			}
			return isNaN(parseFloat(data))
		},
		isDirty() {
			return this.insertedRows.length !== 0 || this.updatedRows.length !== 0 || this.deletedRows.length !== 0
		}
		// isError() {
		//   return document.getElementsByClassName('bg-danger').length > 0
		// }
	},
	mounted() {
		// Data is not loaded here because the container component (i.e. WorkDetail) would need also the dataset for this component and another child one (tha label ones). Therefore, for saving one call to the db, the dataset is loaded once there and propagated to the child components like this.

		// The dataset is loaded in the container component, so it could be not available during the mount because this load is async. This line will be invoked whenever the prop dataset is updated in the container component.
		this.$watch('value', function(newVal, oldVal) {
			if (Array.isArray(newVal)) {
				this.data = newVal.slice(0) // For cloning the array, not passing the reference. This way the watcher doesn't go bananas.
			}
		})
	}
}
</script>
<style>
.pt-3-half {
	padding-top: 1.4rem;
	height: 49px;
}
.noMargins {
	padding: 0px 0px 0px 0px !important;
	margin: 0px;
	position: relative;
}
.inputInTd {
	width: 100%;
	height: 80px;
	padding: 10px;
	margin: 0px;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;

	position: absolute;
	top: 0px;
	height: 100%;

	border: 0px;
	background: transparent;
}
</style>
