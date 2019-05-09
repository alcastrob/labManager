<template>
  <div class="input-group">
    <input
      class="form-control typeahead-input"
      type="text"
      placeholder="Buscar por nombre..."
      @keyup="search"
      v-model="query"
      autocomplete="off"
      v-on-clickaway="hidePopup"
      ref="clinica"
      :class="{'is-invalid': isInvalid}"
      :disabled="$attrs.disabled === true"
    >
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead">
      <span class="list-group-item clickable" v-on:click="createNew(query)" v-if="canCreate(query)">
        <i class="fas fa-plus-circle mr-1"></i>Crear nuevo/a dentista
      </span>
      <div v-for="dentist in candidateDentistsFromQuery" :key="dentist.IdDentista">
        <span
          class="list-group-item clickable"
          v-on:click="selectDentist(dentist.NombreDentista, dentist.IdDentista)"
        >{{dentist.NombreDentista}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DentistService from '../../../../services/DentistService'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'

export default {
	name: 'dentistSearch',
	mixins: [clickaway],
	data() {
		return {
			resultsVisible: false,
			query: '',
			selectedDentistId: undefined,
			candidateDentistsFromQuery: [],
			gotFocus: false
		}
	},
	props: ['value', 'isInvalid'],
	methods: {
		search: async function() {
			this.resultsVisible = true
			this.gotFocus = true
			if (this.query.length > 3) {
				this.candidateDentistsFromQuery = await this.dentistService.searchDentistsByName(this.query)
			} else {
				this.candidateDentistsFromQuery = []
			}
		},
		selectDentist: function(name, id) {
			this.query = name
			this.resultsVisible = false
			this.sendChangeEvents(id)
		},
		sendChangeEvents(newId) {
			if (this.selectedDentistId !== newId) {
				this.selectedDentistId = newId
				this.$emit('change', newId)
			}
			this.$emit('input', newId)
		},
		createNew: function(name) {
			this.$router.push({
				path: '/dentists/new',
				query: {
					name: name
				}
			})
		},
		canCreate: function(name) {
			return !_.some(this.candidateDentistsFromQuery, { NombreDentista: name })
		},
		canDisplayDropdown: function() {
			this.resultVisible = this.query !== '' && this.canCreate(this.query) && this.gotFocus
			return this.resultVisible
		},
		hidePopup: function() {
			this.gotFocus = false
		},
		focus: function() {
			this.$refs.clinica.focus()
		},
		getData: function() {
			this.$watch('value', async function(newVal, oldVal) {
				if (newVal <= 0) {
					this.selectedDentisId = undefined
					this.query = ''
				} else {
					var dentistDetail = await this.dentistService.getDentist(newVal)
					if (dentistDetail) {
						this.selectedDentistId = dentistDetail.IdDentista
						this.query = dentistDetail.NombreDentista
					}
					this.hidePopup()
				}
			})
		}
	},
	created() {
		this.dentistService = new DentistService()
	},
	mounted() {
		this.$refs.clinica.focus()
		this.getData()
	}
}
</script>

<style lang="scss">
@import url('~@/assets/css/typeaheadjs.css');
@import url('~@/assets/css/myTypeahead.css');
</style>
