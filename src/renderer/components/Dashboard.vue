<template>
  <div id="page-top">
    <top-bar />
    <div id="wrapper">
      <div id="content-wrapper">
        <div class="container-fluid">
          <breadcrumb/>
          <div class="row">
            <iconCard/>
            <iconCard/>
            <iconCard/>
            <iconCard/>
          </div>
          <areaChart/>
          <dataTable/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topBar from './TopBar'
import lateralBar from './LateralBar'
import breadcrumb from './Breadcrumb'
import iconCard from './IconCard'
import areaChart from './AreaChart'
import dataTable from './DataTable'

export default {
  name: 'dashboard',
  components: { topBar, lateralBar, breadcrumb, iconCard, areaChart, dataTable },
  data () {
    return {}
  },
  methods () {}
}
</script>

<style>
</style>
