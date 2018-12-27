<template>
<div id="page-top">
    <topbar />
    <div class="mt-3">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <!-- <dashboard v-if="currentPage === 'dashboard'" />
            <workNew v-if="currentPage === 'workNew'" />
            <worksList v-if="currentPage === 'worksList'" :listHeading="childrenComponentData" :filter="childrenSecondaryComponentData" />
            <workDetail v-if="currentPage === 'workDetail'" :workId="childrenComponentData" />
            <dentistsList v-if="currentPage === 'dentistsList'"/>
            <dentistDetail v-if="currentPage === 'dentistDetail'" :dentistId="childrenComponentData" />
            <dentistNew v-if="currentPage === 'dentistNew'" :dentistName="childrenComponentData" />
            <finances v-if="currentPage === 'finances'" />
            <about v-if="currentPage === 'about'"/> -->
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import topbar from '../PageElements/TopBar'
// import dashboard from './dashboard'
// import about from './About'
// import workDetail from './WorkDetail'
// import workNew from './WorkNew'
// import dentistDetail from './DentistDetail'
// import dentistsList from './DentistsList'
// import dentistNew from './DentistNew'
// import worksList from './WorksList'
// import finances from './Finances'
import { EventEmitter } from 'electron'
import VueRouter from 'vue-router'

var {ipcRenderer} = require('electron')

export default {
  name: 'mainPage',
  components: {
    topbar
    // dashboard,
    // about,
    // workDetail,
    // workNew,
    // worksList,
    // dentistDetail,
    // dentistsList,
    // dentistNew,
    // finances
  },
  data () {
    return {
      currentPage: 'dashboard',
      childrenComponentData: null,
      childrenSecondaryComponentData: null,
      previousPage: null,
      canNavigateBack: false,
      backStates: []
    }
  },
  methods: {
    // Navigation methods---------
    navigateTo: function (pageName, eventData) {
      if (pageName === 'back') {
        var tmp = this.currentPage
        this.currentPage = this.previousPage
        this.previousPage = tmp
        this.canNavigateBack = false
        this.childrenComponentData = null,
        this.childrenSecondaryComponentData = null
        var state = this.backStates.pop()
        this.$root.$emit('table:setState:' + state.component, state)

      } else if(pageName !== this.currentPage) {
        this.previousPage = this.currentPage
        this.currentPage = pageName
        this.canNavigateBack = this.evaluateCanNavigateBack()
        this.childrenComponentData = null
        this.childrenSecondaryComponentData = null
        if (eventData !== undefined && eventData.eventData !== undefined){
          if (eventData.eventData.index !== undefined) {
            // For navigation from lists to detail components
            this.childrenComponentData = eventData.eventData.index

            this.backStates.push(eventData.eventData)

          } else if (eventData.eventData.name !== undefined) {
            // Create a new dentist from the new work component, passing the name for completeness.
            this.childrenComponentData = eventData.eventData.name
          } else if (eventData.eventData.filter !== undefined) {
            // From the cards. Passing the event name and the works list heading and the filter to apply
            this.childrenComponentData = eventData.eventData.title
            this.childrenSecondaryComponentData = eventData.eventData.filter
          }
        }
      }
    },
    evaluateCanNavigateBack: function () {
      switch (this.currentPage) {
        case 'workDetail': return true
        case 'dentistDetail': return true
        case 'dentistNew': return true
        default: return false
      }
    }
  },
  mounted () {
    // ipcRenderer.on('navigation:navigateTo', (sender, eventData) => {
    //   this.navigateTo(eventData.page)
    // })
    // this.$root.$on('navigation:navigateTo', (data) => {
    //   this.navigateTo(data.page, data)
    // })
  }
}
</script>

<style>
</style>
