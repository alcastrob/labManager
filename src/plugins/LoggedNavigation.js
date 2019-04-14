import log from 'loglevel'

// This exports the plugin object.
export default {
	// The install method will be called with the Vue constructor as
	// the first argument, along with possible options
	install(Vue, options) {
		Vue.prototype.$loggedPush = function(url, queryParams) {
			log.info(`Navigate: ${this.$route.fullPath} >> ${url}`)
			// log.info(`Navigate: ${this._routerRoot._route.fullPath} >> ${url}`)
			this.$router.push({
				path: url,
				query: queryParams
			})
		}

		Vue.prototype.$loggedGo = function(steps) {
			log.info(`Navigate: ${this._routerRoot._route.fullPath} >> `)
			console.log('loggedGo', this)
			// this.$router.go(steps)
		}
	}
}
