<template>
	<div id="shelters">

		<div class="panel panel-default">
			<header class="panel-heading">
				<h3 class="panel-title text-danger">
					{{ panel_title }}
				</h3>
			</header>

			<!-- map -->
			<div class="embed-responsive embed-responsive-16by9">
				<shelter-map></shelter-map>
			</div>

			<!-- table -->
			<div class="table-responsive">
				<table class="table table-striped table-condensed">
					<thead v-if="$store.state.shelters.index.length">
						<tr>
							<th colspan="2">Location</th>
							<th>Details</th>
							<!-- <th>Notes</th> -->
						</tr>
					</thead>
					<tbody v-if="$store.state.shelters.index.length">
						<tr v-for="shelter in $store.state.shelters.index" is="shelter-row" :shelter="shelter"></tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td class="text-center h4" colspan="3">
								No shelters are open at this time.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<footer class="panel-footer">
				<shelters-legend></shelters-legend>
			</footer>
		</div>

		<!-- Modal -->
		<router-view></router-view>

	</div>
</template>

<script>
import { mapActions } from 'vuex'
import IndexRow from '@/components/shelters/IndexRow'
import Legend from '@/components/shelters/Legend'
import ShelterMap from '@/components/shelters/Map'

export default {
	name: 'shelters',
	data () {
		return {
			panel_title: 'Emergency Evacuation Shelters'
		}
	},
	components: {
		'shelter-row': IndexRow,
		'shelters-legend': Legend,
		'shelter-map': ShelterMap
	},
	methods: mapActions([
		'fetchShelters'
	]),
	mounted () {
		this.fetchShelters({
			outFields: 'LOCATIONID,NAME,STATUS1,PETS,ADA',
			where: "1=1"
		})
	}
}
</script>

<style media="screen">
.panel-default {
	border-color: #ddd;
}
.panel-default > .panel-heading {
	background: #f5f5f5;
	border-color: #ddd;
}
</style>
