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
      <li class="nav-item no-arrow mx-1" v-if="isBackVisible">
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
      <li class="nav-item no-arrow" v-if="isAdmin">
        <router-link to="/finances" class="nav-link" role="button">
          <i class="fas fa-fw fa-money-bill-alt"></i>
          Gestión Económica
        </router-link>
      </li>
    </ul>

    <!-- Navbar Search -->
    <!-- <form class="d-none d-md-inline-block form-inline ml-1 mr-0 mr-md-3 my-2 my-md-0">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Buscar..." >
        <div class="input-group-append">
          <button class="btn btn-primary" type="button">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </form> -->
  </nav>
</template>

<script>
import VueRouter from 'vue-router'
import { configGet } from '../../../main/store'

export default {
  name: 'topBar',
  data() {
    return {
      to: '',
      from: '',
      isAdmin: false
    }
  },
  watch: {
    $route(to, from) {
      this.to = to
      this.from = from
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        path: this.from.fullPath
      })
    },
    getConfig: async function() {
      this.isAdmin = configGet('isAdmin')
    }
  },
  computed: {
    isBackVisible(){
      switch (this.to.path){
        case '/works/new':
        case '/':
        case '/about':
        case '/dentists/list':
        case '/finances':
        case undefined:
          return false
        case '/works/list':
          if (this.from.path !== '/finances' && ! this.from.path.includes('/dentist/details')){
            return false
          } else {
            return true
          }
        default:
          return true
      }
    }
  },
  created() {
    this.getConfig()
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
