<template>
<div>
  <hr>
  <h4>Aditamentos</h4>
    <div class="row">
      <div class="col-md-6">
        <label for="caja" class="pt-2">Caja</label>
        <textarea class="form-control" id="caja" rows="2" ref="caja" :value="value.Caja" @input="updateData()"></textarea>
        <label for="caja" class="pt-2">Cubeta</label>
        <textarea class="form-control" id="cubeta" rows="2" ref="cubeta" :value="value.Cubeta" @input="updateData()"></textarea>
        <label for="articulador" class="pt-2">Articulador</label>
        <textarea class="form-control" id="articulador" rows="2" ref="articulador" :value="value.Articulador" @input="updateData()"></textarea>
        <label for="pletinas" class="pt-2" >Pletinas</label>
        <textarea class="form-control" id="pletinas" rows="2" ref="pletinas" :value="value.Pletinas" @input="updateData()"></textarea>
      </div> <!-- col-md-6 -->
      <div class="col-md-6">
        <label for="tornillos" class="pt-2">Tornillos</label>
        <textarea class="form-control" id="tornillos" rows="2" ref="tornillos"  :value="value.Tornillos" @input="updateData()"></textarea>
        <label for="analogos" class="pt-2">Análogos</label>
        <textarea class="form-control" id="analogos" rows="2" ref="analogos" :value="value.Analogos" @input="updateData()"></textarea>
        <label for="posteImpresion" class="pt-2">Poste Impresión</label>
        <textarea class="form-control" id="posteImpresion" rows="2" ref="posteImpresion" :value="value.PosteImpresion" @input="updateData()"></textarea>
        <label for="interface" class="pt-2">Interface</label>
        <textarea class="form-control" id="interface" rows="2" ref="interface" :value="value.Interface" @input="updateData()"></textarea>
      </div> <!-- col-md-6 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12">
        <label for="otros" class="pt-2">Otros</label>
        <textarea class="form-control" id="otros" rows="2" ref="otros" :value="value.Otros" @input="updateData()"></textarea>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
  <!-- </div> -->
</div>
</template>

<script>
export default {
  name: 'workAdjuncts',
  props: ['value'],
  methods: {
    updateData: function() {
      debugger
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
