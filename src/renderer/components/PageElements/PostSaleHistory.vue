<template>
  <div>
    <hr>
    <h4>Historial de Seguimiento</h4>
    <div class="row">
      <div class="col-md-4">
        <label for="caja" class="pt-2">Caja</label>
        <textarea
          class="form-control"
          id="caja"
          rows="1"
          ref="caja"
          :value="value.Caja"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
        <label for="caja" class="pt-2">Cubeta</label>
        <textarea
          class="form-control"
          id="cubeta"
          rows="1"
          ref="cubeta"
          :value="value.Cubeta"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
        <label for="articulador" class="pt-2">Articulador</label>
        <textarea
          class="form-control"
          id="articulador"
          rows="1"
          ref="articulador"
          :value="value.Articulador"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
      </div>
      <!-- col-md-4 -->
      <div class="col-md-4">
        <label for="pletinas" class="pt-2">Pletinas</label>
        <textarea
          class="form-control"
          id="pletinas"
          rows="1"
          ref="pletinas"
          :value="value.Pletinas"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
        <label for="tornillos" class="pt-2">Tornillos</label>
        <textarea
          class="form-control"
          id="tornillos"
          rows="1"
          ref="tornillos"
          :value="value.Tornillos"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
        <label for="analogos" class="pt-2">Análogos</label>
        <textarea
          class="form-control"
          id="analogos"
          rows="1"
          ref="analogos"
          :value="value.Analogos"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
      </div>
      <!-- col-md-4 -->
      <div class="col-md-4">
        <label for="posteImpresion" class="pt-2">Poste Impresión</label>
        <textarea
          class="form-control"
          id="posteImpresion"
          rows="1"
          ref="posteImpresion"
          :value="value.PosteImpresion"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
        <label for="interface" class="pt-2">Interface</label>
        <textarea
          class="form-control"
          id="interface"
          rows="1"
          ref="interface"
          :value="value.Interface"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
        <label for="otros" class="pt-2">Otros</label>
        <textarea
          class="form-control"
          id="otros"
          rows="1"
          ref="otros"
          :value="value.Otros"
          @input="updateData()"
          :disabled="$attrs.disabled === true"
        ></textarea>
      </div>
    </div>
    <!-- row -->
  </div>
</template>

<script>
export default {
	name: 'workAdjuncts',
	props: ['value'],
	methods: {
		updateData: function() {
			this.$emit('input', {
				Caja: this.$refs.caja.value,
				Cubeta: this.$refs.cubeta.value,
				Articulador: this.$refs.articulador.value,
				Pletinas: this.$refs.pletinas.value,
				Tornillos: this.$refs.tornillos.value,
				Analogos: this.$refs.analogos.value,
				PosteImpresion: this.$refs.posteImpresion.value,
				Interface: this.$refs.interface.value,
				Otros: this.$refs.otros.value
			})
		}
	}
}
</script>

<style>
</style>
