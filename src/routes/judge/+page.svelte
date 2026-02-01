<script lang="ts">
	import { getRegistrants } from '../data.remote';
	import { scoreTalent } from './judge.remote';
	import ScoreField from '$lib/components/Score-Field.svelte';
	const registrants = await getRegistrants();
	const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const judgesChoiceOptions = [0, 1, 2, 3, 4, 5];
</script>

<div class="flex min-h-dvh w-full flex-col items-center justify-center gap-5">
	<h1 class="mt-4 text-2xl">Talent Show Judging</h1>
	<form
		class="fieldset flex w-xs flex-col items-center justify-center rounded-box bg-base-300 p-4 sm:w-sm md:w-lg lg:w-xl"
		{...scoreTalent}
	>
		<fieldset class="fieldset">
			<label class="label text-lg" for="participant">Participant:</label>
			<select
				class=" input w-2xs md:w-md lg:w-lg"
				id="participant"
				{...scoreTalent.fields.participant.as('select')}
			>
				{#each registrants as registrant (registrant.id)}
					<option value={String(registrant.id)}
						>{registrant.id} - {registrant.firstName} {registrant.lastName}</option
					>
				{/each}
			</select>
		</fieldset>
		<div class="divider"></div>

		<ScoreField
			title="Originality/Creativity"
			description={['Have I encountered this kind of act before?', 'Is the content original?']}
			remote={scoreTalent}
			field="originality"
			{options}
		/>
		<div class="divider"></div>

		<ScoreField
			title="Entertainment Value"
			description={[
				'Does this act interest me?',
				'Does this act keep me entertained until the end?'
			]}
			remote={scoreTalent}
			field="entertainmentValue"
			{options}
		/>

		<div class="divider"></div>

		<ScoreField
			title="Audience Appeal"
			description={['Did/will this act generate a positive response?']}
			remote={scoreTalent}
			field="audienceAppeal"
			{options}
		/>

		<div class="divider"></div>

		<ScoreField
			title="Skill Level"
			description={['Could the average scout/explorer perform this act?']}
			remote={scoreTalent}
			field="skillLevel"
			{options}
		/>

		<div class="divider"></div>

		<ScoreField
			title="Aesthetic Appeal"
			description={['Did this act appeal visually in addition to aurally?']}
			remote={scoreTalent}
			field="aestheticAppeal"
			{options}
		/>

		<div class="divider"></div>

		<ScoreField
			title="Bonus-Judges Choice"
			description={['Something about this act made it special']}
			remote={scoreTalent}
			field="judgesChoice"
			options={judgesChoiceOptions}
			required={false}
		/>

		<fieldset class="fieldset pr-4 pl-4">
			<label class="label text-lg" for="description">Judges Notes:</label>
			<textarea
				class="input h-20 w-2xs resize-none md:w-md lg:w-lg"
				id="description"
				maxlength="150"
				{...scoreTalent.fields.comment.as('text')}
			></textarea>
		</fieldset>
		<button class="btn mt-4 w-3xs rounded-box btn-outline btn-info md:w-sm lg:w-md">Submit</button>
	</form>
</div>
