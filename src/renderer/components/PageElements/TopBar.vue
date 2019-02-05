<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark static-top fixed-top">
    <!-- Navbar -->
    <ul class="navbar-nav ml-auto ml-md-0">
      <li class="nav-item no-arrow mx-1">
        <a href="#" class="nav-link" role="button" @click="go('/')">
        <!-- <router-link to="/" class="nav-link" role="button" @click="isPageDirty"> -->
          <i class="fas fa-fw fa-tooth"></i>
          Inicio
        <!-- </router-link> -->
        </a>
      </li>
      <li class="nav-item no-arrow mx-1" v-if="isBackButtonVisible">
        <a href="#" class="nav-link" role="button" @click="goBack()">
          <i class="fas fa-fw fa-caret-square-left"></i>
          Atrás
        </a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item no-arrow mx-1">
        <a href="#" class="nav-link" role="button" @click="go('/works/new')">
        <!-- <router-link to="/works/new" class="nav-link" role="button"> -->
          <i class="fas fa-fw fa-teeth"></i>
          Nuevo Trabajo
        <!-- </router-link> -->
        </a>
      </li>
      <li class="nav-item no-arrow mr-1">
        <a href="#" class="nav-link" role="button" @click="go('/works/list')">
        <!-- <router-link to="/works/list" class="nav-link" role="button"> -->
          <i class="fa fa-fw fa-list"></i>
          Listado Trabajos
        <!-- </router-link> -->
        </a>
      </li>
      <li class="nav-item no-arrow">
        <a href="#" class="nav-link" role="button" @click="go('/dentists/list')">
        <!-- <router-link to="/dentists/list" class="nav-link" role="button"> -->
          <i class="fas fa-fw fa-id-badge"></i>
          Listado Dentistas
        <!-- </router-link> -->
        </a>
      </li>
      <li class="nav-item no-arrow" v-if="isAdmin">
        <a href="#" class="nav-link" role="button" @click="go('/finances')">
        <!-- <router-link to="/finances" class="nav-link" role="button"> -->
          <i class="fas fa-fw fa-money-bill-alt"></i>
          Gestión Económica
        <!-- </router-link> -->
        </a>
      </li>
    </ul>
    <b-modal ref="leavePageModal" title="Cambios no guardados" hide-footer>
      <div class="modal-body">
        <span>
        En esta página hay cambios que serán descartados si continua navegando a otra página. ¿Desea guardarlos antes?
        </span>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="discardButtonClick">Descartar los cambios</button>
        <button class="btn btn-secondary" @click="saveAndLeaveButtonClick"><i class="fas fa-save mr-2 position-relative" style="top: 1px;"></i>Guardar y continuar</button>
      </div>
    </b-modal>
  </nav>
</template>

<script>
import VueRouter from 'vue-router'
import { configGet } from '../../../main/store'
import _ from 'lodash'
import bModal from 'bootstrap-vue'

export default {
  name: 'topBar',
  data() {
    return {
      to: '',
      from: '',
      isAdmin: false,
      leavingToUrl: '',
      lastComponentFound: undefined,
    }
  },
  watch: {
    $route(to, from) {
      this.to = to
      this.from = from
    }
  },
  methods: {
    go(url) {
      if (!this.isPageDirty()){
        if (this.to.fullPath === url) {
          this.cleanPage()
        } else {
          this.$router.push({
            path: url
          })
        }
      } else {
        this.$refs.leavePageModal.show()
        this.leavingToUrl = url
      }
    },
    goBack() {
      if (!this.isPageDirty()) {
        this.cleanPage()
        this.$router.push({
          path: this.from.fullPath
        })
      } else {
        this.$refs.leavePageModal.show()
        this.leavingToUrl = this.from.fullPath
      }
    },
    discardButtonClick(){
      this.lastComponentFound = undefined
      this.$refs.leavePageModal.hide()
      this.cleanPage()
      this.$router.push({
        path: this.leavingToUrl
      })
    },
    saveAndLeaveButtonClick(){
      this.$refs.leavePageModal.hide()
      this.$root.$emit('topbar:save', this.leavingToUrl)
      // this.cleanPage()
    },
    isPageDirty(){
      //In order to say if the current page is dirty, first we have to find a component that have 'isError' and 'isDirty' computed values (not bare functions)
      var page = _.find(this.$parent.$children, (e) => {
        var isError = e.isError !== undefined && {}.toString.call(e.isError) !== '[object Function]'
        var isDirty = e.isDirty !== undefined && {}.toString.call(e.isDirty) !== '[object Function]'
        return isError && isDirty
      })
      //If exists, get the isDirty computed value. If not, just return false and continue navigating
      if (page !== undefined){
        return page.isDirty || page.isError
      } else {
        return false
      }
    },
    cleanPage(){
      var x = _.find(this.$parent.$children, (e) => {
        return e.cleanComponent !== undefined
      })
      if (x !== undefined){
        return x.cleanComponent()
      }
    },
    cleanURL(url){
      if (url !== undefined) {
        return url.replace(/\/\d+$/gm, '')
      } else {
        return url
      }
    },
    getConfig: async function() {
      this.isAdmin = configGet('isAdmin')
    }
  },
  computed: {
    isBackButtonVisible(){
      switch (this.cleanURL(this.to.path)){
        case '/works/new':
        case '/':
        case '/about':
        case '/dentists/list':
        case '/finances':
        case undefined:
          return false
        case '/works/list':
          if (this.from.path !== '/finances' && this.cleanURL(this.from.path) !== '/dentist/details'){
            return false
          } else {
            return true
          }
        case '/works/details':
          if (this.from.path === '/works/new'){
            return false
          } else{
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
