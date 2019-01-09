<template>
<div class="container printed">
  <div class="row">
    <div class="col-sm-6">
      <h1 class="text-uppercase">Declaración de Conformidad</h1>
      <span>(Real Decreto 414/96 sobre Productos Sanitarios Anexo VIII Productos a medida)
      </span>
    </div>
    <div class="col-sm-6">
      Poner el logo aquí<br>
      Nº de Fabricante: XXXXXXX
    </div>
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-6">
      CLINICA - Dr/Dra:
      {{conformityDeclaration.NombreDentista}}<br>
      Nº ALBARÁN:
      {{conformityDeclaration.IdTrabajo}}<br>
      Nº DECLARACIÓN DE CONFORMIDAD:
      {{conformityDeclaration.IdDeclaracion}}<br>
      FECHA:
      {{format(conformityDeclaration.Fecha)}}<br>
      PACIENTE:
      {{conformityDeclaration.Paciente}}<br>
      FINALIDAD TERAPEUTICA: Compensación de una deficiencia<br><br>
    </div>
    <div class="col-sm-6">
      PRODUCTO Y LOTE:
      <ul>
        <li v-for="product in conformityDeclarationDetails" v-bind:key="product.IdProductoLote">{{product.Descripcion}} Hola</li>
      </ul>
      <br>
    </div>
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-12">
      <span>
        DECLARA: que el producto sanitario descrito a continuación, cumple los requisitos esenciales establecidos en el Anexo I del R.D. que le son de aplicación, por lo que queda garantizada la ausencia de compromiso para la salud y la seguridad de la persona indicada a continuación, para la cual se ha fabricado a medida, según prescripción del profesional que se indica también a continuación, siempre que el producto se utilice conforme a su finalidad prevista, así como que ofrece las prestaciones asignadas.Se compromete: a mantener a dispociones de las autoridades sanitarias competentes la documentación relativa al diseño y fabricación del producto a medida fabricado durante 5 años.
      </span><br><br>
    </div> <!-- col-sm-12 -->
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-6">
      Fdo: Antonio Aguilar Gómez / Jose Antonio Carrizosa Monterrubio
    </div>
    <div class="col-sm-6">
      Titular responsable de la empresa: LABORATORIO ORMA<br><br>
    </div>
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-12">
      Este trabajo se garantiza durante {{conformityDeclaration.Meses}} meses contra deformación o rotura por uso normal en boca.
      <br>
    </div>
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-12 text-right">
      Ejemplar para el clínico
    </div>
    <div class="col-sm-12" style="border: 1px dashed black;">
    </div>
    <div class="col-sm-12 text-right">
      Ejemplar para el paciente<br>
    </div>
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-6">
      <h4>Producto sanitario a medida</h4>
      Nº DECLARACIÓN DE CONFORMIDAD:
      {{conformityDeclaration.IdDeclaracion}}<br>
      FECHA:
      {{format(conformityDeclaration.Fecha)}}<br>
      <br>
      Nota: para cualquier duda sobre el mismo, consulte con el profesional. (Para cualquier reparación o modificación debe adjuntar el presente resguardo).
    </div>
    <div class="col-sm-6">
      Instrucciones de uso:
      <ul>
        <li>No la lave con productos corrosivos (lejía, amoníaco, alcohol, etc)</li>
        <li>Este producto no debe ser limpiado nunca ni frotado en la zona de contacto con la encía.</li>
        <li>No puede ser retocado, ni manipulado porque pierde su finalidad prevista.</li>
        <li>No debe ser pegado con ningún tipo de pegamento, ya que altera el producto.</li>
      </ul>
    </div>
  </div> <!-- row -->
</div>
</template>

<script>
import moment from 'moment'
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')

export default {
  name: 'conformity',
  data () {
    return {
      cssText: ''
    }
  },
  props: {
    conformityDeclaration: {
      type: Object,
      required: true
    },
    conformityDeclarationDetails: {
      type: Array,
      required: true
    }
  },
  methods: {
    print () {
      this.$forceUpdate()
      const d = new Printd()
      d.print(this.$el, this.cssText)
    },
    format(date) {
      return moment(date).format('DD/MM/YYYY')
    }
  },
  mounted () {
    this.cssText = fs.readFileSync(path.resolve(__dirname, '../../assets/css/printed.css'), 'UTF-8')
    this.cssText += fs.readFileSync(path.resolve(__dirname, '../../assets/css/bootstrap/css/bootstrap.min.css'), 'UTF-8')

    // Check the required parameters (props)
    if (this.conformityDeclaration === undefined || this.conformityDeclaration === null)
      throw 'Missing prop conformityDeclaration in Conformity.vue'
    if (this.conformityDeclarationDetails === undefined || this.conformityDeclarationDetails === null)
      throw 'Missing prop conformityDeclarationDetails in Conformity.vue'
  }
}
</script>

<style>
  @import url('~@/assets/css/printed.css');
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
