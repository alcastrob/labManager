<template>
  <div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white o-hidden h-100" :class="cssClass">
      <div class="card-body" @click="showDetails">
        <div class="card-body-icon">
          <i :class="icon"></i>
        </div>
        <div class="mr-5 main-text">{{message}}</div>
        <div class="mr-5 font-italic text-gray secondary-text">{{secondMessage}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import log from 'loglevel'

export default {
	name: 'myIconCard',
	props: {
		icon: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: true
		},
		secondMessage: {
			type: String,
			required: false
		},
		listHeading: {
			type: String,
			required: true
		},
		filter: {
			type: String,
			required: true
		},
		cssClass: {
			type: String,
			required: true
		}
	},
	methods: {
		showDetails() {
			log.info(`>> navigate: /works/list?title=${this.listHeading}:filter=${this.filter}`)
			this.$router.push({
				path: '/works/list',
				query: {
					title: this.listHeading,
					filter: this.filter
				}
			})
			this.$root.$emit('workList:ReloadRequest')
		}
	}
}
</script>

<style>
.card-body-icon {
	position: absolute;
	z-index: 0;
	top: -0.75rem;
	right: -0.1rem;
	opacity: 0.4;
	font-size: 5rem;
	-webkit-transform: rotate(15deg);
	transform: rotate(15deg);
}

@media (min-width: 576px) {
	.card-columns {
		-webkit-column-count: 1;
		column-count: 1;
	}
}

@media (min-width: 768px) {
	.card-columns {
		-webkit-column-count: 2;
		column-count: 2;
	}
}

@media (min-width: 1200px) {
	.card-columns {
		-webkit-column-count: 2;
		column-count: 2;
	}
}

.text-gray {
	color: #e4dfda;
}

.main-text {
	font-size: 15px;
}

.secondary-text {
	font-size: 13px;
}
</style>
