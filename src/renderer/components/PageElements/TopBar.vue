<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark static-top fixed-top">
    <!-- Navbar -->
    <ul class="navbar-nav ml-auto ml-md-0">
      <li class="nav-item no-arrow mx-1">
        <a class="nav-link" href="#" id="dashboardButton" role="button" v-on:click="navigateTo('dashboard')">
          <i class="fas fa-fw fa-tooth"></i>
          Inicio
        </a>
      </li>
      <li class="nav-item no-arrow mx-1">
        <a class="nav-link" href="#" id="dashboardButton" role="button" v-on:click="navigateTo('back')">
          <i class="fas fa-fw fa-caret-square-left"></i>
          Atrás
        </a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item no-arrow mx-1">
        <a class="nav-link" href="#" id="worksListButton" role="button" v-on:click="navigateTo('newWork')">
          <i class="fas fa-fw fa-teeth"></i>
          Nuevo Trabajo
        </a>
      </li>
      <li class="nav-item no-arrow mr-1">
        <a class="nav-link" href="#" id="worksListButton" role="button" v-on:click="navigateTo('worksList')">
          <i class="fa fa-fw fa-list"></i>
          Listado Trabajos
        </a>
      </li>
      <li class="nav-item no-arrow">
        <a class="nav-link" href="#" id="dentistListButton" role="button" v-on:click="navigateTo('dentistsList')">
          <i class="fas fa-fw fa-id-badge"></i>
          Listado Dentistas
        </a>
      </li>
      <li class="nav-item no-arrow">
        <a class="nav-link" href="#" id="dentistListButton" role="button" v-on:click="navigateTo('invoices')">
          <i class="fas fa-fw fa-money-bill-alt"></i>
          Gestión Económica
        </a>
      </li>
    </ul>

    <!-- Navbar Search -->
    <form class="d-none d-md-inline-block form-inline ml-1 mr-0 mr-md-3 my-2 my-md-0">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Buscar..." >
        <div class="input-group-append">
          <button class="btn btn-primary" type="button">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </form>
  </nav>
</template>

<script>
export default {
  name: 'topBar',
  data () {
    return {}
  },
  methods: {
    navigateTo (pageName) {
      this.$parent.navigateTo(pageName)
    }
  }
}
</script>

<style>

.navbar-nav .form-inline .input-group {
  width: 100%;
}

.navbar-nav .nav-item.active .nav-link {
  color: #fff;
}

.navbar-nav .nav-item.dropdown .dropdown-toggle::after {
  width: 1rem;
  text-align: center;
  float: right;
  vertical-align: 0;
  border: 0;
  font-weight: 900;
  content: '\f105';
  font-family: 'Font Awesome 5 Free';
}

.navbar-nav .nav-item.dropdown.show .dropdown-toggle::after {
  content: '\f107';
}

.navbar-nav .nav-item.dropdown.no-arrow .dropdown-toggle::after {
  display: none;
}

.navbar-nav .nav-item .nav-link:focus {
  outline: none;
}

.navbar-nav .nav-item .nav-link .badge {
  position: absolute;
  margin-left: 0.75rem;
  top: 0.3rem;
  font-weight: 400;
  font-size: 0.5rem;
}

@media (min-width: 768px) {
  .navbar-nav .form-inline .input-group {
    width: auto;
  }
}
</style>
