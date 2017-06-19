import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const api = {
	state: {
		url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/Heat/HEAT/FeatureServer/0/query',
		params: {
			f: 'json',
			returnGeometry: false,
			outFields: '*',
			where: "1=1",
			// where: "STATUS1 = 'OPEN'",
			orderByFields: 'STATUS1 DESC, NAME'
		}
	}
}

const shelters = {
	modules: {
		api
	},
	state: {
		index: [],
		selected: null,
		selected_status: 'Loading'
	},
	getters: {
		isOpen: (state, getters) => (shelter) => {
			return (shelter.STATUS1 === 'OPEN') ? true : false
		},
		petsAllowed: (state, getters) => (shelter) => {
			return (shelter.PETS === 'Yes') ? true : false
		},
		adaPlus: (state, getters) => (shelter) => {
			return (shelter.ADA === 'Yes') ? true : false
		},
		googleMapLink: (state, getters) => (shelter) => {
			var queryFields = [
				shelter.NAME,
				shelter.ADDRESS,
				shelter.ZIPCODE
			].join(',')
			return `http://maps.google.com/?q=${queryFields}`
		},
		statusLabelClass: (state, getters) => (shelter) => {
			return (getters.isOpen(shelter)) ? 'label-success' : 'label-danger'
		},
		statusAlertClass: (state, getters) => (shelter) => {
			return (getters.isOpen(shelter)) ? 'alert-success' : 'alert-danger'
		},
		statusTextClass: (state, getters) => (shelter) => {
			return (getters.isOpen(shelter)) ? 'text-success' : 'text-danger'
		}
	},
	actions: {
		fetchShelters ({state, commit}, params={}) {
			return Vue.http.get(state.api.url, {
				params: Object.assign({}, state.api.params, params)
			}).then(response => {
				commit('setShelters', response.body.features.map(f => f.attributes))
			}, err => {
				console.error(err)
			})
		},
		fetchShelter ({state, commit}, id) {
			commit('setSelectedStatus', 'Loading')
			return Vue.http.get(state.api.url, {
				params: Object.assign({}, state.api.params, {where: `LOCATIONID = '${id}'`})
			}).then(response => {
				if (response.body.features && response.body.features.length) {
					commit('setSelectedShelter', response.body.features.map(f => f.attributes)[0])
				} else {
					throw 'Shelter Not Found'
				}
			}).catch(err => {
				console.error(err)
				commit('setSelectedShelter', null)
				commit('setSelectedStatus', err)
			})
		}
	},
	mutations: {
		setShelters (state, data) {
			state.index = data
		},
		setSelectedShelter (state, data) {
			state.selected = data
		},
		setSelectedStatus (state, data) {
			state.selected_status = data
		}
	}
}

export const store = new Vuex.Store({
	modules: {
		shelters
	}
})
