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
          <td class="noBorder pt-2 textSmall" valign="top">Caja:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Cubeta:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Articulador:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Calcinable:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Tornillos:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Análogos:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Poste impresión:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Interface:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top">Otros:</td>
          <td class="noBorder pt-2 textSmall" valign="top">{{workData.Color}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import labelMixin from './LabelMixin'

export default {
  name: 'labelAditamentos',
  mixins: [labelMixin]
}
</script>
