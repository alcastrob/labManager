<template>
  <div class="box invisible">
    <p class="labelTitle" :class="labelCss">
      {{labelName}}
      <span class="float-right no-background">
        <span class="labelSubtitle">Trabajo nº </span>
        <span class="labelTitle">{{workData.IdTrabajo}}</span>
      </span>
    </p>
    <div style="padding-top: 0px; position: relative; top: -10px;">
      <table style="width: 350px;">
        <tr>
          <td class="noBorder textSmall" valign="top" style="width: 30%;">Clínica o Dr/a: </td>
          <td class="noBorder textSmall" valign="top" style="width: 70%;">{{workData.NombreDentista}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Paciente: </td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Paciente}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Trabajos a realizar:</td>
          <td class="noBorder pt-2 textSmall" valign="top">Color: {{workData.Color}}</td>
        </tr>
        <tr v-for="detail in workIndications" :key="detail.IdTrabajoDetalle">
          <td colspan="2" class="noBorder">&bull; {{detail.Descripcion}}</td>
        </tr>
      </table>
    </div>

    <br>
    <br>

    <table style="width: 340px;">
      <tr>
        <th style="width: 25%;"></th>
        <th style="width: 25%;">Entrada</th>
        <th style="width: 25%;">Salida</th>
        <th style="width: 25%;">Hora</th>
      </tr>
      <tr>
        <td>P. METAL</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>BIZCOCHO</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>TERMINAR</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <br>
    <span class="textSmall">Nota:</span>
    <br>
    <br>
    &nbsp;
  </div>
</template>

<script>
import labelMixin from './LabelMixin'

export default {
  name: 'labelComposite',
  mixins: [labelMixin]
}
</script>