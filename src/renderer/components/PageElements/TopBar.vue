<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark static-top fixed-top">
    <!-- Navbar -->
    <ul class="navbar-nav ml-auto ml-md-0">
      <li class="nav-item no-arrow mx-1">
        <router-link to="/" class="nav-link" role="button">
          <i class="fas fa-fw fa-tooth"></i>
          Inicio
        </router-link>
      </li>
      <li class="nav-item no-arrow mx-1">
        <a href="#" class="nav-link" role="button" v-on:click="goBack()">
          <i class="fas fa-fw fa-caret-square-left"></i>
          Atrás
        </a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item no-arrow mx-1">
        <router-link to="/works/new" class="nav-link" role="button">
          <i class="fas fa-fw fa-teeth"></i>
          Nuevo Trabajo
        </router-link>
      </li>
      <li class="nav-item no-arrow mr-1">
        <router-link to="/works/list" class="nav-link" role="button">
          <i class="fa fa-fw fa-list"></i>
          Listado Trabajos
        </router-link>
      </li>
      <li class="nav-item no-arrow">
        <router-link to="/dentists/list" class="nav-link" role="button">
          <i class="fas fa-fw fa-id-badge"></i>
          Listado Dentistas
        </router-link>
      </li>
      <!-- <li class="nav-item no-arrow">
        <router-link to="/finances" class="nav-link" role="button">
          <i class="fas fa-fw fa-money-bill-alt"></i>
          Gestión Económica
        </router-link>
      </li> -->
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
import VueRouter from 'vue-router'

export default {
  name: 'topBar',
  methods: {
    goBack() {
      var condition1 = (this.from.fullPath === '/finances' && this.to.fullPath.indexOf('/works/list') !== -1)
      var condition2 = (this.from.fullPath.indexOf('/works/list') !== -1 && this.to.fullPath.indexOf('/works/details/') !== -1 && this.from.query.filter !== undefined)
      if (condition1 || condition2) {
        this.$router.go(-2)
      } else {
        this.$router.back()
      }
    }
  },
  data() {
    return {
      to: '',
      from: ''
    }
  },
  watch: {
    $route(to, from) {
      this.to = to
      this.from = from
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
