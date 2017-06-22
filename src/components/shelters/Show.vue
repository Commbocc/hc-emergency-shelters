<template>
	<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="shelterModalLabel">
		<div class="modal-dialog" role="document">

			<div v-if="shelter" class="modal-content">

				<header class="modal-header text-center">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="shelterModalLabel">
						{{ shelter.NAME }}
						<br>
						<small>
							{{ shelter.ADDRESS }}
						</small>
					</h4>
				</header>

				<div class="alert" :class="statusAlertClass(shelter)">
					<p class="status h3 text-center" :class="statusTextClass(shelter)">
						{{ shelter.STATUS1 }}
					</p>
				</div>

				<div class="modal-body">

					<p>
						<a :href="googleMapLink(shelter)" target="_blank" class="btn btn-default btn-sm">
							<i class="fa fa-fw fa-map-marker"></i> Map
						</a>
						<a :href="shelter.URL" target="_blank" class="btn btn-default btn-sm">
							<i class="fa fa-fw fa-globe"></i> Website
						</a>
						<span class="label label-info">
							<i class="fa fa-fw fa-wheelchair"></i>
						</span>
						<span v-if="adaPlus(shelter)" class="label label-info">
							<i class="fa fa-fw fa-plus"></i>
						</span>
						<span v-if="petsAllowed(shelter)" class="label label-info">
							<i class="fa fa-fw fa-paw"></i>
						</span>
					</p>

					<dl>
						<dt v-if="shelter.NUMBER">Number</dt>
						<dd v-if="shelter.NUMBER" v-text="shelter.NUMBER"></dd>
						<dt v-if="shelter.STATUS">Category</dt>
						<dd v-if="shelter.STATUS" v-text="shelter.STATUS"></dd>
						<dt v-if="shelter.BACKUP_1">Backup 1</dt>
						<dd v-if="shelter.BACKUP_1" v-text="shelter.BACKUP_1"></dd>
						<dt v-if="shelter.BACKUP_2">Backup 2</dt>
						<dd v-if="shelter.BACKUP_2" v-text="shelter.BACKUP_2"></dd>
						<dt v-if="shelter.NOTES">Notes</dt>
						<dd v-if="shelter.NOTES" v-text="shelter.NOTES"></dd>
					</dl>

					<p>
						<img :src="shelter.image" :alt="shelter.NAME" class="img-thumbnail center-block">
					</p>

					<!-- <details><pre>{{ shelter }}</pre></details> -->

				</div>

				<div class="well">
					<shelters-legend></shelters-legend>
				</div>

				<footer class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</footer>
			</div>
			<div v-else class="modal-content">
				<div class="modal-body">
					<p class="h4 text-center">
						{{ $store.state.shelters.selected_status }}
					</p>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Legend from '@/components/shelters/Legend'

export default {
	name: 'shelters-show',
	props: ['id'],
	components: {
		'shelters-legend': Legend
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.fetchShelter(to.params.id)
		})
	},
	watch: {
		'$route': function() {
			this.fetchShelter(this.id)
		}
	},
	computed: {
		shelter () {
			return this.$store.state.shelters.selected
		},
		...mapGetters([
			'isOpen',
			'statusAlertClass',
			'statusTextClass',
			'googleMapLink',
			'adaPlus',
			'petsAllowed'
		])
	},
	methods: {
		...mapActions([
			'fetchShelter'
		]),
		showModal () {
			$(this.$el).modal('show')
		},
		hideModalOnClose(redirect=false) {
			$(this.$el).on('hidden.bs.modal', (e) => {
				if (redirect) this.$router.push({ name: 'SheltersIndex' })
			})
		}
	},
	mounted () {
		this.showModal()
		this.hideModalOnClose(true)
	}
}
</script>

<style scoped>
.alert, .well {
	border-radius: 0;
	margin-bottom: 0;
}
.alert .status {
	margin-top: 0;
}
</style>
