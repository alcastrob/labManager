<script>
import { Printd } from 'printd'
import log from 'loglevel'
var path = require('path')
var fs = require('fs')

export default {
	data() {
		return {
			cssText: '',
			name: ''
		}
	},
	props: {
		workData: {
			type: Object,
			required: true
		},
		workIndicationsText: {
			type: String,
			required: false
		},
		workAdjuncts: {
			type: Object,
			required: false
		}
	},
	methods: {
		print(label) {
			this.name = label
			this.$forceUpdate()
			const d = new Printd()
			d.print(this.$el, this.cssText)
			log.info(`Label printed ${this.name} for workId: ${this.workData.IdTrabajo}.`)
		},
		setName(name) {
			this.name = name
		}
	},
	computed: {
		labelName: function() {
			return this.name
		},
		labelCss: function() {
			return 'background-' + this.name
		}
	},
	mounted() {
		this.cssText += fs.readFileSync(path.resolve(__static, 'labelStyle.css'), 'UTF-8')
	}
}
</script>

<style>
@import url('~@/assets/css/labelStyle.css');
</style>
