<template>
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<h1 v-if="!editing">Ver Factura</h1>
				<h1 v-else>Editar Factura</h1>
			</div>
			<!-- col-md-6 -->
			<div class="col-md-6 mt-2">
				<div class="float-right">
					<collapsible-action-button
						iconCss="fas fa-print"
						text="Imprimir factura"
						:callback="printInvoice"
					></collapsible-action-button>
					<collapsible-action-button
						iconCss="fas fa-edit"
						text="Editar factura"
						:callback="editInvoice"
						v-if="!editing && !dbReadOnly"
					></collapsible-action-button>
				</div>
			</div>
			<!-- col-md-6 -->
		</div>
		<!-- row -->
		<div class="row">
			<div class="col-md-12">
				<invoicePrint ref="invoiceShow" :class="{'visuallyhidden': editing}"></invoicePrint>
				<invoicePrint ref="invoiceEdit" :class="{'visuallyhidden': !editing}"></invoicePrint>
				<invoicePrint ref="invoicePrint"></invoicePrint>
			</div>
			<!-- col-md-12 -->
		</div>
		<!-- row -->
	</div>
</template>

<script>
import invoicePrint from '../Labels/InvoicePrint'
import collapsibleActionButton from '../PageElements/CollapsibleButtons/collapsibleActionButton'
import ConfigFileService from '../../../services/ConfigFileService'
import log from 'loglevel'

export default {
	name: 'invoice',
	components: {
		collapsibleActionButton,
		invoicePrint
	},
	data() {
		return {
			editing: false,
			dbReadOnly: false
		}
	},
	methods: {
		printInvoice: async function() {
			log.info(`Printing invoice ${this.$route.params.id}`)
			this.$refs.invoicePrint.print(this.$route.params.id)
		},
		editInvoice: async function() {
			log.info(`Editing invoice ${this.$route.params.id}`)
			this.editing = true
			this.$refs.invoiceEdit.show(this.$route.params.id, true)
		}
	},
	mounted() {
		this.$refs.invoiceShow.show(this.$route.params.id)
		this.configFileService = new ConfigFileService()
		this.dbReadOnly = this.configFileService.configGetReadOnly()
	}
}
</script>
