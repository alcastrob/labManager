<template>
<ul class="sidebar navbar-nav">
    <li class="nav-item active">
        <a class="nav-link" href="index.html">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Panel de indicadores</span>
        </a>
    </li>
    <li class="nav-item dropdown">
        <a class="nav-link" href="#" >
        <i class="fas fa-fw fa-teeth"></i>
        <span>Trabajos</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="#">
        <i class="fas fa-fw fa-id-badge"></i>
        <span>Dentistas</span></a>
    </li>
</ul>
</template>

<script>
export default {
  name: 'lateralBar',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
.sidebar {
  width: 90px !important;
  background-color: #212529;
  min-height: calc(100vh - 56px);
}

.sidebar .nav-item:last-child {
  margin-bottom: 1rem;
}

.sidebar .nav-item .nav-link {
  text-align: center;
  padding: 0.75rem 1rem;
  width: 90px;
}

.sidebar .nav-item .nav-link span {
  font-size: 0.65rem;
  display: block;
}

.sidebar .nav-item .dropdown-menu {
  position: absolute !important;
  -webkit-transform: none !important;
  transform: none !important;
  left: calc(90px + 0.5rem) !important;
  margin: 0;
}

.sidebar .nav-item .dropdown-menu.dropup {
  bottom: 0;
  top: auto !important;
}

.sidebar .nav-item.dropdown .dropdown-toggle::after {
  display: none;
}

.sidebar .nav-item .nav-link {
  color: rgba(255, 255, 255, 0.5);
}

.sidebar .nav-item .nav-link:active, .sidebar .nav-item .nav-link:focus, .sidebar .nav-item .nav-link:hover {
  color: rgba(255, 255, 255, 0.75);
}

.sidebar.toggled {
  width: 0 !important;
  overflow: hidden;
}

@media (min-width: 768px) {
  .sidebar {
    width: 225px !important;
  }
  .sidebar .nav-item .nav-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: 1rem;
    width: 225px;
  }
  .sidebar .nav-item .nav-link span {
    font-size: 1rem;
    display: inline;
  }
  .sidebar .nav-item .dropdown-menu {
    position: static !important;
    margin: 0 1rem;
    top: 0;
  }
  .sidebar .nav-item.dropdown .dropdown-toggle::after {
    display: block;
  }
  .sidebar.toggled {
    overflow: visible;
    width: 90px !important;
  }
  .sidebar.toggled .nav-item:last-child {
    margin-bottom: 1rem;
  }
  .sidebar.toggled .nav-item .nav-link {
    text-align: center;
    padding: 0.75rem 1rem;
    width: 90px;
  }
  .sidebar.toggled .nav-item .nav-link span {
    font-size: 0.65rem;
    display: block;
  }
  .sidebar.toggled .nav-item .dropdown-menu {
    position: absolute !important;
    -webkit-transform: none !important;
    transform: none !important;
    left: calc(90px + 0.5rem) !important;
    margin: 0;
  }
  .sidebar.toggled .nav-item .dropdown-menu.dropup {
    bottom: 0;
    top: auto !important;
  }
  .sidebar.toggled .nav-item.dropdown .dropdown-toggle::after {
    display: none;
  }
}

.sidebar.fixed-top {
  top: 56px;
  height: calc(100vh - 56px);
  overflow-y: auto;
}
</style>
