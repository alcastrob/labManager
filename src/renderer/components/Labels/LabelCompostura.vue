<template>
  <div class="box invisible">
    {{labelCss}}
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
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top" colspan="2">
            <template v-for="line in workIndicationsText.split('\n')">
              <span>{{line}}</span><br>
            </template>
          </td>
        </tr>
      </table>
    </div>

    <br>
    <br>

    <table style="width: 340px;">
      <tr>
        <th class="textSmall" style="width: 25%;"></th>
        <th class="textSmall" style="width: 25%;">Entrada</th>
        <th class="textSmall" style="width: 25%;">Salida</th>
        <th class="textSmall" style="width: 25%;">Hora</th>
      </tr>
      <tr>
        <td class="noBorder"></td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
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
  name: 'labelCompostura',
  mixins: [labelMixin]
}
</script>