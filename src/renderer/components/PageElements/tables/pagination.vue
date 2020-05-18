<template>
	<div>
		<div v-if="this.totalRecords !==0">
			<nav class="float-right">
				Mostrando registros de {{recordFrom}} a {{recordTo}} de un total de {{totalRecords}}
				<br />
				<div class="float-right">
					<ul class="pagination">
						<li class="page-item" :class="{'disabled': isOnFirstPage}">
							<a class="page-link" href="#" @click.prevent="loadPage('prev')">
								<span>&laquo;</span>
							</a>
						</li>
						<li
							class="page-item"
							v-for="n in pageSelectors"
							v-bind:key="n"
							:class="{'active': isCurrentPage(n)}"
						>
							<a class="page-link" href="#" @click.prevent="loadPage(n)">{{n}}</a>
						</li>
						<li class="page-item" :class="{'disabled': isOnLastPage}">
							<a class="page-link" href="#" @click.prevent="loadPage('next')">
								<span>&raquo;</span>
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div v-else class="text-center">
			<b>No hay registros para mostrar con los criterios de búsqueda actuales</b>
		</div>
	</div>
</template>

<script>
import log from 'loglevel'

export default {
	name: 'pagination',
	methods: {
		loadPage: function(page) {
			if (page === 'prev') {
				this.$parent.currentPage--
			} else if (page === 'next') {
				this.$parent.currentPage++
			} else {
				this.$parent.currentPage = page
			}
			log.debug(`Pagination used in table ${this.$parent.$vnode.componentOptions.tag} set to ${page}.`)
		},
		isCurrentPage(page) {
			return page === this.$parent.currentPage
		},
		lastPage() {
			return Math.ceil(this.$parent.filteredDataset.length / this.$parent.pageSize)
		}
	},
	computed: {
		pageSelectors() {
			const MAX_PAGES = 5
			var pages = [this.$parent.currentPage]
			for (let iteration = 1; iteration < MAX_PAGES; iteration++) {
				if (this.$parent.currentPage - iteration > 0 && pages.length < MAX_PAGES) {
					pages.unshift(this.$parent.currentPage - iteration)
				}
				if (this.$parent.currentPage + iteration <= this.lastPage() && pages.length < MAX_PAGES) {
					pages.push(this.$parent.currentPage + iteration)
				}
			}
			return pages
		},
		isOnFirstPage() {
			return this.$parent.currentPage === 1
		},
		isOnLastPage() {
			if (this.lastPage() === 0) {
				return false
			} else {
				return this.$parent.currentPage === this.lastPage()
			}
		},
		recordFrom() {
			return (this.$parent.currentPage - 1) * this.$parent.pageSize + 1
		},
		recordTo() {
			var to = this.$parent.currentPage * this.$parent.pageSize
			if (this.$parent.filteredDataset.length < to) {
				return this.$parent.filteredDataset.length
			} else {
				return to
			}
		},
		totalRecords() {
			return this.$parent.filteredDataset.length
		}
	}
}
</script>


