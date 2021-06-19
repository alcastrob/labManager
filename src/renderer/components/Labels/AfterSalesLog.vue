<template>
    <div class="container printed">
        <div class="row">
            <div class="col-sm-6">
                <h1 class="text-uppercase">Historia de seguimiento postcomercialización</h1>
            </div>
            <div class="col-sm-6">
                <img @load="logoLoaded" :src="logo" />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                Licencia de fabricante de productos sanitarios nº: {{ makerNumber }}
                <br />
                Número de colegiado:
                <br />
                Paciente:
                {{ conformityDeclaration.Paciente }}
                <br />
                Identificación del producto:
            </div>
        </div>
        <!-- row -->
        <div class="row">
            <div class="col-sm-12">
                <span
                    >Este documento recoge las actuaciones llevadas a cabo por el técnico responsable sobre el producto sanitario,
                    dando cumplimiento a su obligación como fabricante al seguimiento poscomercialización, recogido en el
                    Reglamento UE 2017/745 del Parlamento Europeo y del Consejo, de 5 de abril de 2017, sobre los productos
                    sanitarios.</span
                >
            </div>
            <!-- col-sm-12 -->
        </div>
        <!-- row -->
    </div>
</template>

<script>
import labelMixin from './LabelMixin'
import moment from 'moment'
import { Printd } from 'printd'
import PersistenceService from '../../../services/PersistenceService'
var path = require('path')
var fs = require('fs')

export default {
    name: 'afterSalesLog',
    mixins: [labelMixin],
    data() {
        return {
            cssText: '',
            imgLoaded: false
        }
    },
    props: {
        makerNumber: {
            type: String,
            required: true
        },
        personInCharge: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        }
    },
    methods: {
        logoLoaded() {
            this.imgLoaded = true
        },
        print() {
            const d = new Printd()
            d.print(this.$el, this.cssText)
        },
        format(date) {
            return moment(date).format('DD/MM/YYYY')
        },
        loadData: async function () {
            var logoData = await this.persistenceService.getConfigValue('logo')
            this.logo = 'data:image/png;base64,' + logoData
        }
    },
    mounted() {
        this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
        this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')
    },
    created() {
        this.persistenceService = new PersistenceService()
        this.loadData()
    }
}
</script>

<style>
@import url('~@/assets/css/printed.css');
@import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>