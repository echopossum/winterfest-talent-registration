<script lang="ts">
	import { getRegistrants, scoreTalent } from '../data.remote';
	const registrants = await getRegistrants();
	const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const judgesChoiceOptions = [1, 2, 3, 4, 5];
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-5">
	<h1>Talent Show Judging</h1>
	<form
		class="fieldset flex w-xl flex-col items-center justify-center rounded-box bg-base-300 p-4"
		{...scoreTalent}
	>
		<fieldset class="fieldset">
			<label class="label text-lg" for="participant">Participant:</label>
			<select class=" input w-md" id="participant" {...scoreTalent.fields.participant.as('select')}>
				{#each registrants as registrant (registrant.id)}
					<option value={String(registrant.id)}
						>{registrant.id} - {registrant.firstName} {registrant.lastName}</option
					>
				{/each}
			</select>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset">
			<legend class="label pb-2 text-lg">Originality/Creativity</legend>
			<label class="text-md label pb-2" for="originality"
				>Have I encountered this sort of act before? Is the content original?</label
			>
			<div class="flex w-md justify-center gap-3">
				{#each options as n (n)}
					<div>
						<input
							class="radio radio-sm radio-primary"
							{...scoreTalent.fields.originality.as('radio', String(n))}
						/>
						<span class="pl-0.5">{n}</span>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset">
			<legend class="label pb-2 text-lg">Entertainment Value</legend>
			<label class="text-md label pb-2" for="entertainmentValue"
				>Does this act interest me? Does this act keep me entertained until the end?</label
			>
			<div class="flex w-md justify-center gap-3">
				{#each options as n (n)}
					<div>
						<input
							class="radio radio-sm radio-primary"
							{...scoreTalent.fields.entertainmentValue.as('radio', String(n))}
						/>
						<span class="pl-0.5">{n}</span>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset">
			<legend class="label pb-2 text-lg">Audience Appeal</legend>
			<label class="text-md label pb-2" for="audienceAppeal"
				>Did/will this act generate a positive response?</label
			>
			<div class="flex w-md justify-center gap-3">
				{#each options as n (n)}
					<div>
						<input
							class="radio radio-sm radio-primary"
							{...scoreTalent.fields.audienceAppeal.as('radio', String(n))}
						/>
						<span class="pl-0.5">{n}</span>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset">
			<legend class="label pb-2 text-lg">Skill Level</legend>
			<label class="text-md label pb-2" for="skillLevel"
				>Could the average scout/explorer perform this act?</label
			>
			<div class="flex w-md justify-center gap-3">
				{#each options as n (n)}
					<div>
						<input
							class="radio radio-sm radio-primary"
							{...scoreTalent.fields.skillLevel.as('radio', String(n))}
						/>
						<span class="pl-0.5">{n}</span>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset">
			<legend class="label pb-2 text-lg">Aesthetic Appeal</legend>
			<label class="text-md label pb-2" for="aestheticAppeal"
				>Did this act appeal visually in addition to aurally?</label
			>
			<div class="flex w-md justify-center gap-3">
				{#each options as n (n)}
					<div>
						<input
							class="radio radio-sm radio-primary"
							{...scoreTalent.fields.aestheticAppeal.as('radio', String(n))}
						/>
						<span class="pl-0.5">{n}</span>
					</div>
				{/each}
			</div>
		</fieldset>
		<div class="divider"></div>
		<fieldset class="fieldset">
			<legend class="label pb-2 text-lg">Bonus-Judges Choice</legend>
			<label class="text-md label pb-2" for="judgesChoice"
				>Was there anything about this act that made it worth special consideration?
			</label>
			<div class="flex w-md justify-center gap-3">
				{#each judgesChoiceOptions as n (n)}
					<div>
						<input
							class="radio radio-sm radio-primary"
							{...scoreTalent.fields.judgesChoice.as('radio', String(n))}
						/>
						<span class="pl-0.5">{n}</span>
					</div>
				{/each}
			</div>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="description">Judges Notes:</label>
			<textarea
				class="input h-20 w-md resize-none"
				id="description"
				{...scoreTalent.fields.comment.as('text')}
			></textarea>
		</fieldset>
		<button class="btn mt-4 w-sm rounded-box btn-primary">Submit</button>
	</form>
</div>
