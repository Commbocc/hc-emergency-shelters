<template>
	<div id="shelter-map" class="embed-responsive-item"></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'shelter-map',
	methods: mapActions([
		'initShelterMap'
	]),
	mounted () {
		this.initShelterMap(this.$el)
	}
}
</script>
