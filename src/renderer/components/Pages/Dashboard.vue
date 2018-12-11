<template>
  <div>
    <div class="row">
      <iconCard/>
      <iconCard/>
      <iconCard/>
      <iconCard/>
    </div>
    <areaChart/>
    <workList/>
  </div>
</template>

<script>
import topBar from '../PageElements/TopBar'
import lateralBar from '../PageElements/LateralBar'
import iconCard from '../PageElements/IconCard'
import areaChart from '../PageElements/AreaChart'
import workList from '../PageElements/workList'

export default {
  name: 'dashboard',
  components: { topBar, lateralBar, iconCard, areaChart, workList },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
#wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

#wrapper #content-wrapper {
  overflow-x: hidden;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 80px;
}

body.fixed-nav #content-wrapper {
  margin-top: 56px;
  padding-left: 90px;
}

body.fixed-nav.sidebar-toggled #content-wrapper {
  padding-left: 0;
}

@media (min-width: 768px) {
  body.fixed-nav #content-wrapper {
    padding-left: 225px;
  }
  body.fixed-nav.sidebar-toggled #content-wrapper {
    padding-left: 90px;
  }
}
</style>
