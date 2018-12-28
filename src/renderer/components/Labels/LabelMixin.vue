<script>
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')

export default {
  data () {
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
    // workIndications: {
    //   type: [Object, Array],
    //   required: true
    // },
    workAdjunts: {
      type: Object,
      required: false
    }
  },
  methods: {
    print (label) {
      this.name = label
      this.$forceUpdate()
      const d = new Printd()
      d.print(this.$el, this.cssText)
    },
    setName (name) {
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
  mounted () {
    this.cssText = fs.readFileSync(path.resolve(__dirname, '../../assets/css/labelStyle.css'), 'UTF-8')
    // Check the required parameters (props)
    if (this.workData === undefined || this.workData === null)
      throw 'Missing prop workData in PrintedLabel1.vue'
    // if (this.workIndications === undefined || this.workIndications === null)
    //   throw 'Missing prop workindications in PrintedLabel1.vue'
  }
}
</script>

<style>
  @import url('~@/assets/css/labelStyle.css');
</style>
