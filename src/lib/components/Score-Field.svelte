<script lang="ts">
	let { title, description, remote, field, options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } = $props();
</script>

<fieldset class="fieldset pr-4 pl-4 sm:pr-0 sm:pl-0">
	<legend class="label pb-2 text-lg">{title}</legend>
	{#each description as line}
		<label class="label text-xs" for="originality">{line}</label>
	{/each}
	<div class="mt-2 flex w-2xs flex-wrap justify-center gap-3 md:w-md md:gap-6 lg:w-lg">
		{#each options as n (n)}
			<div class="flex flex-col items-center justify-center">
				<p class="mb-1">{n}</p>
				<input
					required
					class="radio radio-xs radio-info lg:radio-sm"
					{...remote.fields[field].as('radio', String(n))}
				/>
			</div>
		{/each}
	</div>
</fieldset>
