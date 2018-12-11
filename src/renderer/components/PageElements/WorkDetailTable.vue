<template>
<div id="table" class="table-editable">
    <table class="table table-bordered table-responsive-md table-striped">
    <tr>
        <th class="">Descripción</th>
        <th class="text-right">Precio</th>
        <th class=""></th>
    </tr>
    <tr>
        <td class="pt-3-half" contenteditable="true">Puente Zirconio en 45 y 46 monolítico</td>
        <td class="pt-3-half text-right" contenteditable="true">30</td>
        <td class="text-right">
            <span class="table-remove">
                <button type="button" class="btn btn-danger btn-rounded btn-sm my-0">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                    Eliminar</button>
            </span>
        </td>
    </tr>
    <tr>
        <td class="pt-3-half" contenteditable="true">Puente Zirconio en 45 y 46 monolítico</td>
        <td class="pt-3-half text-right" contenteditable="true">30</td>
        <td class="text-right">
            <span class="table-remove">
                <button type="button" class="btn btn-danger btn-rounded btn-sm my-0">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                    Eliminar</button>
            </span>
        </td>
    </tr>
    <tr>
        <td class="pt-3-half" contenteditable="true">Puente Zirconio en 45 y 46 monolítico</td>
        <td class="pt-3-half text-right" contenteditable="true">30</td>
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
  name: 'workDetailTable',
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
