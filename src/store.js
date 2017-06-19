import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import router from './router'

import * as esriLoader from 'esri-loader'

const api = {
	state: {
		url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/Heat/HEAT/FeatureServer/0',
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
			return Vue.http.get(`${state.api.url}/query`, {
				params: Object.assign({}, state.api.params, params)
			}).then(response => {
				commit('setShelters', response.body.features.map(f => f.attributes))
			}, err => {
				console.error(err)
			})
		},
		fetchShelter ({state, commit}, id) {
			commit('setSelectedStatus', 'Loading')
			return Vue.http.get(`${state.api.url}/query`, {
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
		},
		initShelterMap ({state}, el) {
			console.log('initShelterMap')

			esriLoader.dojoRequire([
				"esri/WebMap",
				"esri/views/MapView",
				"esri/layers/FeatureLayer"
			], (WebMap, MapView, FeatureLayer) => {
				var webmap = new WebMap({
					portalItem: {
						id: "b51fb4e76e154e1b93b630eac3ea94ae"
					}
				})
				var mapview = new MapView({
					container: el,
					map: webmap
				})
				var fl = new FeatureLayer({
					url: state.api.url,
					outFields: ['LOCATIONID']
				})
				mapview.on('click', event => {
					var screenPoint = {
						x: event.x,
						y: event.y
					}
					mapview.hitTest(screenPoint).then(response => {
						if(response.results[0].graphic){
							router.push({ name: 'SheltersShow', params: {id: response.results[0].graphic.attributes.LOCATIONID} })
						}
					})
				})
				webmap.add(fl)
			});

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
