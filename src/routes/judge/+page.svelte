<script lang="ts">
	import { getRegistrants } from '../data.remote';
	import { scoreTalent } from './judge.remote';
	const registrants = await getRegistrants();
	const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const judgesChoiceOptions = [0, 1, 2, 3, 4, 5];
</script>

<div class="flex min-h-dvh w-full flex-col items-center justify-center gap-5">
	<h1>Talent Show Judging</h1>
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
		<fieldset class="fieldset pr-4 pl-4 sm:pr-0 sm:pl-0">
			<legend class="label pb-2 text-lg">Originality/Creativity</legend>
			<label class="label text-xs" for="originality"
				>Have I encountered this sort of act before?</label
			>
			<label class="label pb-2 text-xs" for="originality">Is the content original?</label>
			<div class="flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
				{#each options as n (n)}
					<div class="flex flex-col items-center justify-center">
						<p class="mb-1">{n}</p>
						<input
							required
							class="radio radio-xs radio-info lg:radio-sm"
							{...scoreTalent.fields.originality.as('radio', String(n))}
						/>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset pr-4 pl-4">
			<legend class="label pb-2 text-lg">Entertainment Value</legend>
			<label class="label text-xs" for="entertainmentValue">Does this act interest me?</label>
			<label class="label pb-2 text-xs" for="entertainmentValue"
				>Does this act keep me entertained until the end?</label
			>
			<div class="flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
				{#each options as n (n)}
					<div class="flex flex-col items-center justify-center">
						<p class="mb-1">{n}</p>
						<input
							required
							class="radio radio-xs radio-info lg:radio-sm"
							{...scoreTalent.fields.entertainmentValue.as('radio', String(n))}
						/>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset pr-4 pl-4">
			<legend class="label pb-2 text-lg">Audience Appeal</legend>
			<label class="label pb-2 text-xs" for="audienceAppeal"
				>Did/will this act generate a positive response?</label
			>
			<div class="flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
				{#each options as n (n)}
					<div class="flex flex-col items-center justify-center">
						<p class="mb-1">{n}</p>
						<input
							required
							class="radio radio-xs radio-info lg:radio-sm"
							{...scoreTalent.fields.audienceAppeal.as('radio', String(n))}
						/>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset pr-4 pl-4">
			<legend class="label pb-2 text-lg">Skill Level</legend>
			<label class="label pb-2 text-xs" for="skillLevel"
				>Could the average scout/explorer perform this act?</label
			>
			<div class="flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
				{#each options as n (n)}
					<div class="flex flex-col items-center justify-center">
						<p class="mb-1">{n}</p>
						<input
							required
							class="radio radio-xs radio-info lg:radio-sm"
							{...scoreTalent.fields.skillLevel.as('radio', String(n))}
						/>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset pr-4 pl-4">
			<legend class="label pb-2 text-lg">Aesthetic Appeal</legend>
			<label class="label pb-2 text-xs" for="aestheticAppeal"
				>Did this act appeal visually in addition to aurally?</label
			>
			<div class="flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
				{#each options as n (n)}
					<div class="flex flex-col items-center justify-center">
						<p class="mb-1">{n}</p>
						<input
							required
							class="radio radio-xs radio-info lg:radio-sm"
							{...scoreTalent.fields.aestheticAppeal.as('radio', String(n))}
						/>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset pr-4 pl-4">
			<legend class="label pb-2 text-lg">Bonus-Judges Choice</legend>
			<label class="label pb-2 text-xs" for="judgesChoice"
				>Something about this act made it special</label
			>
			<div class="flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
				{#each judgesChoiceOptions as n (n)}
					<div class="flex flex-col items-center justify-center">
						<p class="mb-1">{n}</p>
						<input
							class="radio radio-xs radio-info lg:radio-sm"
							{...scoreTalent.fields.judgesChoice.as('radio', String(n))}
						/>
					</div>
				{/each}
			</div>
		</fieldset>
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
