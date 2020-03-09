<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-6">
				<h1>Listado de dentistas</h1>
			</div>
			<div class="col-md-6 mt-3">
				<div class="float-right">
					<collapsible-link-button
						iconCss="fas fa-plus-circle"
						text="Nuevo dentista"
						pathTo="/dentists/new"
						v-if="!dbReadOnly"
					></collapsible-link-button>
					<collapsibleExcelButton
						fileName="dentistas"
						:isCollapsible="true"
						:collapsed="false"
						:isDark="false"
						ref="excelButton"
						:class="{'displayNone': !isAdmin}"
						@click="beginExporting"
					></collapsibleExcelButton>
				</div>
			</div>
			<!-- col-md-6 -->
		</div>
		<!-- row -->
		<div>
			<dentistTable
				:headers="headers"
				:searchFields="searchFields"
				ref="dentistTable"
				urlBase="/dentists/details/"
				masterKey="IdDentista"
			/>
		</div>
		<!-- row -->
	</div>
</template>

<script>
import DentistService from '../../../services/DentistService'
import ConfigFileService from '../../../services/ConfigFileService'
import dentistTable from '../PageElements/tables/dentistExtendedTable'
import collapsibleLinkButton from '../PageElements/CollapsibleButtons/collapsibleLinkButton'
import collapsibleExcelButton from '../PageElements/CollapsibleButtons/collapsibleExcelButton'

export default {
	name: 'dentistslist',
	components: {
		dentistTable,
		collapsibleLinkButton,
		collapsibleExcelButton
	},
	data() {
		return {
			headers: [
				{
					title: 'Nombre',
					dataField: 'NombreDentista',
					titleClass: 'text-left',
					rowClass: ''
				},
				{
					title: 'Clínica',
					dataField: 'NombreClinica',
					titleClass: 'text-left',
					rowClass: ''
				},
				{
					title: 'Dirección',
					dataField: 'Direccion',
					titleClass: 'text-left',
					rowClass: ''
				},
				{
					title: 'Poblacion',
					dataField: 'Poblacion',
					titleClass: 'text-left',
					rowClass: ''
				},
				{
					title: 'Email',
					dataField: 'CorreoElectronico',
					titleClass: 'text-left',
					rowClass: 'emailColumn'
				},
				{
					title: 'Tlf.',
					dataField: 'Telefono',
					titleClass: 'text-left',
					rowClass: ''
				},
				{
					title: 'Tlf. 2',
					dataField: 'Telefono2',
					titleClass: 'text-left tableexport-string target',
					rowClass: ''
				},
				{
					title: 'Primer trabajo',
					dataField: 'FechaPrimerTrabajo',
					titleClass: 'text-left',
					rowClass: '',
					formatter: 'date'
				},
				{
					title: 'Último trabajo',
					dataField: 'FechaUltimoTrabajo',
					titleClass: 'text-left',
					rowClass: '',
					formatter: 'date'
				}
			],
			searchFields: [
				'NombreDentista',
				'NombreClinica',
				'Direccion',
				'Poblacion',
				'CorreoElectronico',
				'Telefono',
				'Telefono2'
			],
			isAdmin: false,
			dbReadOnly: undefined
		}
	},
	methods: {
		beginExporting() {
			this.$refs.dentistTable.beginExporting()
		},
		getData: async function() {
			this.$refs.dentistTable.setDataset(await this.dentistService.getDentistList())
		}
	},
	created() {
		this.dentistService = new DentistService()
		this.configFileService = new ConfigFileService()
	},
	mounted() {
		this.isAdmin = this.configFileService.configGet('isAdmin')
		this.dbReadOnly = this.configFileService.configGetReadOnly()
		this.$refs.excelButton.setTable(this.$refs.dentistTable)
	},
	activated() {
		// The data will be loaded even if the rest of the page is in the cache
		this.getData()
	}
}
</script>

<style>
.emailColumn {
	max-width: 300px;
	word-break: break-all;
}
</style>
