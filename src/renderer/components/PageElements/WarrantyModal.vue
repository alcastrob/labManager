<template>
  <div>
    <b-modal ref="printWarrantyLabelModal" title="Imprimir etiqueta de garantía" hide-footer>
      <div class="modal-body">
        <label for="meses">Número de meses de garantía</label>
        <input type="number" name="meses" v-model="$v.warrantyPeriod.$model" class="form-control" :class="{'is-invalid': $v.warrantyPeriod.$error}" @change="isDirty=true">
        <small class="text-danger" v-if="$v.warrantyPeriod.$error">Es necesario especificar un número entero y positivo de meses.</small>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$refs.printWarrantyLabelModal.hide()"><i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar</button>
        <button class="btn btn-secondary" @click="printLabelAndHide"><i class="fas fa-print mr-2 position-relative" style="top: 1px;"></i>Imprimir</button>
      </div>
      <warrantyLabel :logo="logo" :workData="work" ref="warrantyLabel" :period="warrantyPeriod" class="visuallyhidden"></warrantyLabel>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { integer, minValue } from 'vuelidate/lib/validators'
import warrantyLabel from '../Labels/LabelGarantia'
import { getConfigValue } from '../../../main/dal.js'
import bModal from 'bootstrap-vue'

export default {
  name: 'warrantyModal',
  components: {
    warrantyLabel
  },
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      warrantyPeriod: 12,
      logo: ''
    }
  },
  validations: {
    warrantyPeriod: {
      integer,
      minValue: minValue(0)
    }
  },
  methods: {
    show(){
      this.$refs.printWarrantyLabelModal.show()
      this.warrantyPeriod = 12
    },
    printLabelAndHide() {
      this.print()
      this.$refs.printWarrantyLabelModal.hide()
    },
    print(){
      this.$refs.warrantyLabel.waitLogoAndPrint()
    },
    loadData: async function(){
      var logoData = await getConfigValue('logo')
      this.logo = await getConfigValue('logo')
    }
  },
  created (){
    this.loadData()
  }
}
</script>

<style>
</style>
