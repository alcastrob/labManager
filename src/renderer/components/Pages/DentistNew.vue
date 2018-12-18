<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h1>Dentista</h1>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica</label>
          <input type="text" class="form-control" id="clinica" placeholder="Nombre de la clínica">
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-3">
          <label for="dentista">Dentista</label>
          <input type="text" class="form-control" id="dentista" placeholder="Nombre de el/la dentista">
        </div> <!-- col-md-6 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-8">
          <h4>Dirección y contacto</h4>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6">
          <label for="calle">Calle</label>
          <textarea class="form-control" id="calle" placeholder="Calle, plaza, avenida..." rows="2"></textarea>
        </div> <!-- col-md-6 -->
        <div class="col-md-2">
          <label for="codigoPostal">Código Postal</label>
          <input type="text" class="form-control" id="codigoPostal" placeholder="CP">
        </div> <!-- col-md-2 -->
        <div class="col-md-4">
          <label for="ciudad">Localidad</label>
          <input type="text" class="form-control" id="ciudad" placeholder="Ciudad">
        </div> <!-- col-md-4 -->
        <div class="col-md-6 mt-3">
          <label for="correoElectronico">Correo electrónico</label>
          <input type="text" class="form-control" id="correoElectronico" placeholder="xxx@yyy.zzz">
        </div> <!-- col-md-6 -->
        <div class="col-md-3 mt-3">
          <label for="telefono1">Teléfono 1</label>
          <input type="text" class="form-control" id="telefono1" placeholder="123 456 789">
        </div> <!-- col-md-3 -->
        <div class="col-md-3 mt-3">
          <label for="telefono2">Teléfono 2</label>
          <input type="text" class="form-control" id="telefono2" placeholder="123 456 789">
        </div> <!-- col-md-3 -->
      </div> <!-- row -->

      <div class="row mt-3">
        <div class="col-md-8">
          <h4>Fiscal</h4>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-4">
          <label for="datosFiscales">CIF/NIF</label>
          <input type="text" class="form-control" id="datosFiscales" placeholder="CIF / NIF">
        </div> <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="datosBancarios">Datos bancarios</label>
          <input type="text" class="form-control" id="datosBancarios" placeholder="Número de cuenta">
        </div> <!-- col-md-4 -->
      </div>
      <div class="row mt-3">
        <div class="col-md-8">
          <h4>Otros datos de interés</h4>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12">
          <textarea class="form-control" id="datosInteres" rows="3"></textarea>
        </div>
      </div> <!-- row -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'dentistDetail',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
</style>
