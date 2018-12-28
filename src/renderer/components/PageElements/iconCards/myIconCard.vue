<template>
<div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white o-hidden h-100" :class="cssClass">
    <div class="card-body">
        <div class="card-body-icon">
          <i :class="icon" ></i>
        </div>
        <div class="mr-5"><h5>{{message}}</h5></div>
        <div class="mr-5 font-italic text-gray">{{secondMessage}}</div>
    </div>
    <a class="card-footer text-white clearfix small z-1" href="#" v-on:click="showDetails()">
        <span class="float-left">Ver detalles</span>
        <span class="float-right">
        <i class="fas fa-angle-right"></i>
        </span>
    </a>
    </div>
</div>
</template>

<script>
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
      this.$router.push({
        path: '/works/list',
        query: {
          title: this.listHeading,
          filter: this.filter
        }
      })
      this.$root.$emit('workList:ReloadRequest')
    }
  },
  beforeRouteEnter(to, from, next){
    debugger
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
  color: #E4DFDA;
}
</style>
