<template>
  <div id="page-top">
    <top-bar />

    <div id="wrapper">

      <!-- Sidebar -->
      <lateralBar/>

      <div id="content-wrapper">

        <div class="container-fluid">

          <!-- Breadcrumbs-->
          <breadcrumb/>

          <!-- Icon Cards-->
          <div class="row">
            <iconCard/>
            <iconCard/>
            <iconCard/>
            <iconCard/>
          </div>

          <!-- Area Chart Example-->
          <areaChart/>

          <!-- DataTables Example -->
          <dataTable/>

        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-wrapper -->

    </div>
    <!-- /#wrapper -->
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
