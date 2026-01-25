<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getAdminView,
		deleteRegistrant,
		editRegistrant,
		deleteScore,
		editScore
	} from './admin.remote';
	import { invalidateAll } from '$app/navigation';
	import type { Registrant, Score } from '$lib/server/db/schema';

	let editRegistrantModal: HTMLDialogElement;
	let scoreEditModal: HTMLDialogElement;
	let deleteRegistrantModal: HTMLDialogElement;
	let deleteScoreModal: HTMLDialogElement;

	onMount(() => {
		const eventSource = new EventSource('/api/events');
		eventSource.addEventListener('refresh', () => {
			invalidateAll();
		});
	});

	let talentHolding = $state<Registrant | null>();
	let scoreHolding = $state<Score | null>();
</script>

<div class="flex h-screen w-screen flex-col bg-black">
	{#each await getAdminView() as talent (talent.id)}
		<div class="flex flex-col odd:bg-blue-950 even:bg-sky-800">
			<div class="flex items-center justify-between">
				<div class="flex items-center justify-center gap-6 p-2">
					<p>Number: {talent.id}</p>
					<p>Name: {talent.firstName} {talent.lastName}</p>
					<p>{talent.unitType}: {talent.unitNumber}</p>
					<p>Email: {talent.email}</p>
					<p>Phone: {talent.phoneNumber}</p>
				</div>
				<div class="flex gap-2 p-2">
					<button
						class="btn btn-soft btn-info"
						onclick={() => {
							talentHolding = talent;
							editRegistrantModal.showModal();
						}}>Edit</button
					>
					<button
						class="btn btn-soft btn-error"
						onclick={() => {
							talentHolding = talent;
							deleteRegistrantModal.showModal();
						}}>Delete</button
					>
				</div>
			</div>
		</div>
		{#each talent.score as score (score.id)}
			<div
				class="flex items-center justify-start gap-4 p-0.5 pr-2 odd:bg-base-300 even:bg-base-100"
			>
				<div class="w-8"></div>
				<p>Originality: {score.originality}</p>
				<p>Entertainment: {score.entertainmentValue}</p>
				<p>Audience Appeal: {score.audienceAppeal}</p>
				<p>Skill Level: {score.skillLevel}</p>
				<p>Aesthetic Appeal: {score.aestheticAppeal}</p>
				<p class="w-32 grow">Judges Choice: {score.judgesChoice}</p>
				<div class="flex justify-center gap-2 p-0.5">
					<button
						class="btn btn-soft btn-xs btn-info"
						onclick={() => {
							scoreHolding = score;
							talentHolding = talent;
							scoreEditModal.showModal();
						}}>Edit</button
					>
					<button
						class="btn btn-soft btn-xs btn-error"
						onclick={() => {
							scoreHolding = score;
							deleteScoreModal.showModal();
						}}>Delete</button
					>
				</div>
			</div>
		{/each}
	{/each}

	<dialog bind:this={editRegistrantModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Registrant Edit</h3>
			<p>{talentHolding?.firstName}</p>
			<p class="py-4">Press ESC key or click the button below to close</p>
			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>

	<dialog bind:this={scoreEditModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Score Edit</h3>
			<p>{talentHolding?.firstName}</p>
			<form {...editScore} class="flex flex-col items-center justify-center">
				<input {...editScore.fields.id.as('number')} value={scoreHolding?.id} hidden />
				<fieldset class="fieldset">
					<label class="label text-lg" for="originality">Originality:</label>
					<input
						class="validator input w-md"
						{...editScore.fields.originality.as('number')}
						required
						id="originality"
					/>
					<div class="validator-hint hidden">Originality is required</div>
				</fieldset>
				<fieldset class="fieldset">
					<label class="label text-lg" for="entertainment">Enterainment Value:</label>
					<input
						class="validator input w-md"
						{...editScore.fields.entertainmentValue.as('number')}
						required
						id="entertainment"
					/>
					<div class="validator-hint hidden">Entertainment is required</div>
				</fieldset>
				<fieldset class="fieldset">
					<label class="label text-lg" for="audience">Audience Appeal:</label>
					<input
						class="validator input w-md"
						{...editScore.fields.audienceAppeal.as('number')}
						required
						id="audience"
					/>
					<div class="validator-hint hidden">Audience Appeal is required</div>
				</fieldset>
				<fieldset class="fieldset">
					<label class="label text-lg" for="skill">Skill Level:</label>
					<input
						class="validator input w-md"
						{...editScore.fields.skillLevel.as('number')}
						required
						id="skill"
					/>
					<div class="validator-hint hidden">Skill level is required</div>
				</fieldset>
				<fieldset class="fieldset">
					<label class="label text-lg" for="aesthetic">Aesthetic Appeal:</label>
					<input
						class="validator input w-md"
						{...editScore.fields.aestheticAppeal.as('number')}
						required
						id="aesthetic"
					/>
					<div class="validator-hint hidden">Aesthetic Appeal is required</div>
				</fieldset>
				<fieldset class="fieldset">
					<label class="label text-lg" for="judgesChoice">Judges Choice:</label>
					<input
						class="validator input w-md"
						{...editScore.fields.judgesChoice.as('number')}
						id="judgesChoice"
					/>
				</fieldset>
				<button class="btn mt-4 w-sm rounded-box btn-primary">Submit</button>
			</form>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>

	<dialog bind:this={deleteRegistrantModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Are you sure you want to delete?</h3>
			<p>{talentHolding?.firstName}</p>
			<p>{talentHolding?.lastName}</p>
			<button
				class="btn btn-soft btn-error"
				onclick={() => {
					if (!talentHolding) return;
					deleteRegistrant({ registrantId: talentHolding.id });
					scoreHolding = null;
					talentHolding = null;
					deleteRegistrantModal.close();
				}}>DELETE</button
			>
			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>
	<dialog bind:this={deleteScoreModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Are you sure you want to delete?</h3>
			<p>{talentHolding?.firstName}</p>
			<p class="py-4">Press ESC key or click the button below to close</p>
			<button
				class="btn btn-soft btn-error"
				onclick={() => {
					if (!scoreHolding) return;
					deleteScore({ scoreId: scoreHolding.id });
					scoreHolding = null;
					talentHolding = null;
					deleteScoreModal.close();
				}}>DELETE</button
			>
			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>
</div>
