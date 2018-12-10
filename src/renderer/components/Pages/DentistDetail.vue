<template>
  <div>
    <h1>Dentista</h1>
    <br>
    <div class="container">
      <div class="row">
        <h4>Nombre</h4>
      </div>
      <div class="row">
        <label for="clinica">Clínica</label>
        <input type="text" class="form-control" id="clinica" placeholder="Nombre de la clínica">
      </div>
      <div class="row mt-2">
        <label for="dentista">Dentista</label>
        <input
          type="text"
          class="form-control"
          id="dentista"
          placeholder="Nombre de el/la dentista"
        >
      </div>
      <div class="row mt-3">
        <h4>Dirección y contacto</h4>
      </div>
      <div class="row mt-2">
        <label for="calle">Calle</label>
        <textarea class="form-control" id="calle" placeholder="Calle, plaza, avenida..." rows="2"></textarea>
      </div>
      <div class="row mt-2">
        <div>
          <label for="codigoPostal">Código Postal</label>
          <input type="text" class="form-control col-lg-6" id="codigoPostal" placeholder="CP">
        </div>
        <div>
          <label for="ciudad">Localidad</label>
          <input type="text" class="form-control col-lg-12" id="ciudad" placeholder="Ciudad">
        </div>
      </div>
      <div class="row mt-2">
        <div>
          <label for="correoElectronico">Correo electrónico</label>
          <input
            type="text"
            class="form-control col-lg-12"
            id="correoElectronico"
            placeholder="xxx@yyy.zzz"
          >
        </div>
        <div>
          <label for="telefono1">Teléfono 1</label>
          <input
            type="text"
            class="form-control col-lg-12"
            id="telefono1"
            placeholder="123 456 789"
          >
        </div>
        <div>
          <label for="telefono2">Teléfono 2</label>
          <input
            type="text"
            class="form-control col-lg-12"
            id="telefono2"
            placeholder="123 456 789"
          >
        </div>
      </div>
      <div class="row mt-3">
        <h4>Fiscal</h4>
      </div>
      <div class="row mt-2">
        <label for="datosFiscales">CIF/NIF</label>
        <input type="text" class="form-control" id="datosFiscales" placeholder="CIF / NIF">
      </div>
      <div class="row mt-2">
        <label for="datosBancarios">Datos bancarios</label>
        <input type="text" class="form-control" id="datosBancarios" placeholder="Número de cuenta">
      </div>
      <div class="row mt-3">
        <h4>Otros datos de interés</h4>
        <textarea class="form-control" id="datosInteres" rows="2"></textarea>
        <br>
      </div>
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
