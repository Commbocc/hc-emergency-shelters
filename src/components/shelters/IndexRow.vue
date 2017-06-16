<template lang="html">
	<tr>
		<td width="1">
			<router-link :to="{ name: 'SheltersShow', params: { id: shelter.LOCATIONID } }" class="btn btn-xs btn-default">
				<i class="fa fa-1x fa-fw fa-info-circle"></i>
			</router-link>
		</td>
		<td>
			<strong>
				{{ shelter.NAME }}
			</strong>
			<!-- <details><pre>{{ shelter }}</pre></details> -->
		</td>
		<td>
			<span class="label" :class="statusLabelClass(shelter)">{{ shelter.STATUS1 }}</span>

			<span v-if="adaPlus(shelter)" class="label label-info">
				<i class="fa fa-1x fa-wheelchair"></i>
			</span>
			<span v-if="petsAllowed(shelter)" class="label label-info">
				<i class="fa fa-1x fa-paw"></i>
			</span>
		</td>

		<!-- <td v-if="shelter.NOTES" v-text="shelter.NOTES"></td> -->
		<!-- <td v-else>-</td> -->

	</tr>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'shelter-row',
	props: ['shelter'],
	computed: {
		...mapGetters([
			'petsAllowed',
			'adaPlus',
			'statusLabelClass'
		])
	}
}
</script>
