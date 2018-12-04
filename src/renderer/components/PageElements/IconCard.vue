<template>
<div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white bg-primary o-hidden h-100">
    <div class="card-body">
        <div class="card-body-icon">
        <i class="fas fa-fw fa-list"></i>
        </div>
        <div class="mr-5">26 Mensajes nuevos</div>
    </div>
    <a class="card-footer text-white clearfix small z-1" href="#">
        <span class="float-left">Ver detalles</span>
        <span class="float-right">
        <i class="fas fa-angle-right"></i>
        </span>
    </a>
    </div>
</div>
<!-- <div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white bg-warning o-hidden h-100">
    <div class="card-body">
        <div class="card-body-icon">
        <i class="fas fa-fw fa-list"></i>
        </div>
        <div class="mr-5">11 New Tasks!</div>
    </div>
    <a class="card-footer text-white clearfix small z-1" href="#">
        <span class="float-left">View Details</span>
        <span class="float-right">
        <i class="fas fa-angle-right"></i>
        </span>
    </a>
    </div>
</div>
<div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white bg-success o-hidden h-100">
    <div class="card-body">
        <div class="card-body-icon">
        <i class="fas fa-fw fa-shopping-cart"></i>
        </div>
        <div class="mr-5">123 New Orders!</div>
    </div>
    <a class="card-footer text-white clearfix small z-1" href="#">
        <span class="float-left">View Details</span>
        <span class="float-right">
        <i class="fas fa-angle-right"></i>
        </span>
    </a>
    </div>
</div>
<div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white bg-danger o-hidden h-100">
    <div class="card-body">
        <div class="card-body-icon">
        <i class="fas fa-fw fa-life-ring"></i>
        </div>
        <div class="mr-5">13 New Tickets!</div>
    </div>
    <a class="card-footer text-white clearfix small z-1" href="#">
        <span class="float-left">View Details</span>
        <span class="float-right">
        <i class="fas fa-angle-right"></i>
        </span>
    </a>
    </div>
</div> -->
</template>

<script>
export default {
  name: 'iconCard',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
.card-body-icon {
  position: absolute;
  z-index: 0;
  top: -1.25rem;
  right: -1rem;
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
</style>
