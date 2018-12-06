<template>
<div id="table" class="table-editable">    
    <table class="table table-bordered table-responsive-md table-striped">
    <tr>
        <th class="">Prueba</th>
        <th class="">Fecha salida</th>
        <th class="">Fecha entrada</th>
        <th class="">Comentario</th>
        <th class=""></th>
    </tr>
    <tr>
        <td class="pt-3-half" contenteditable="true">Prueba 1</td>
        <td class="pt-3-half text-right" contenteditable="true">01/12/2018</td>
        <td class="pt-3-half text-right" contenteditable="true">04/12/2018</td>
        <td class="pt-3-half" contenteditable="true">Sin comentarios</td>
        <td class="text-right">
            <span class="table-remove">
                <button type="button" class="btn btn-danger btn-rounded btn-sm my-0">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                    Eliminar</button>
            </span>
        </td>
    </tr>
    <tr>
        <td class="pt-3-half" contenteditable="true">Prueba 2</td>
        <td class="pt-3-half text-right" contenteditable="true">02/12/2018</td>
        <td class="pt-3-half text-right" contenteditable="true">05/12/2018</td>
        <td class="pt-3-half" contenteditable="true">Sin comentarios</td>
        <td class="text-right">
            <span class="table-remove">
                <button type="button" class="btn btn-danger btn-rounded btn-sm my-0">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                    Eliminar</button>
            </span>
        </td>
    </tr>
    <tr>
        <td class="pt-3-half" contenteditable="true">Prueba 2</td>
        <td class="pt-3-half text-right" contenteditable="true">03/12/2018</td>
        <td class="pt-3-half text-right" contenteditable="true">06/12/2018</td>
        <td class="pt-3-half" contenteditable="true">Sin comentarios</td>
        <td class="text-right">
            <span class="table-remove">
                <button type="button" class="btn btn-danger btn-rounded btn-sm my-0">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                    Eliminar</button>
            </span>
        </td>
    </tr>
    </table>
    <span class="table-add float-right mb-3 mr-2">
        <a href="#!" class="text-success">
            <i class="fa fa-plus fa-2x" aria-hidden="true"></i>
        </a>
    </span>
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
