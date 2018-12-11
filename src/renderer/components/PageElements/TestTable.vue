<template>
<div id="table" class="table-editable">
  <table class="table table-bordered table-responsive-md table-striped">
    <tr>
      <th class="">Prueba</th>
      <th class="">Fecha salida</th>
      <th class="">Fecha entrada</th>
      <th class="">Comentario</th>
    </tr>
    <tr>
      <td class="pt-3-half" contenteditable="true">Prueba 1</td>
      <td class="pt-3-half text-right" contenteditable="true">01/12/2018</td>
      <td class="pt-3-half text-right" contenteditable="true">04/12/2018</td>
      <td class="pt-3-half" contenteditable="true">Sin comentarios</td>
    </tr>
    <tr>
      <td class="pt-3-half" contenteditable="true">Prueba 2</td>
      <td class="pt-3-half text-right" contenteditable="true">02/12/2018</td>
      <td class="pt-3-half text-right" contenteditable="true">05/12/2018</td>
      <td class="pt-3-half" contenteditable="true">Sin comentarios</td>
    </tr>
    <tr>
      <td class="pt-3-half" contenteditable="true">Prueba 2</td>
      <td class="pt-3-half text-right" contenteditable="true">03/12/2018</td>
      <td class="pt-3-half text-right" contenteditable="true">06/12/2018</td>
      <td class="pt-3-half" contenteditable="true">Sin comentarios</td>
   </tr>
  </table>
</div>
</template>

<script>
export default {
  name: 'testTable',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
}
</style>
