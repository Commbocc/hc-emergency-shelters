<template lang="html">
	<form @submit.prevent class="form-inline">
		<div class="form-group">
			<label>Pets</label>
			<select name="" v-model="pets">
				<option :value="false">No Preference</option>
				<option value="Yes">Yes</option>
				<option value="No">No</option>
			</select>
		</div>

		<div class="form-group">
			<label>ADA Restrooms</label>
			<select name="" v-model="ada">
				<option :value="false">No Preference</option>
				<option value="Yes">Yes</option>
				<option value="No">No</option>
			</select>
		</div>
	</form>
</template>

<script>
import _ from 'underscore'
export default {
	data () {
		return {
			msg: 'Shelters',
			pets: false,
			ada: false
		}
	},
	components: {
		'list-item': Show
	},
	computed: {
		whereStr () {
			return _.compact([
				((this.pets) ? `PETS='${this.pets}'` : null),
				((this.ada) ? `ADA='${this.ada}'` : null)
			]).join(' AND ')
		}
	},
	watch: {
		'whereStr': function() {
			this.$store.dispatch('fetchShelters', {where: this.whereStr})
		}
	},
}
</script>

<style lang="css">
</style>
