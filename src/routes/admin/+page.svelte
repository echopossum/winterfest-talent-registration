<script lang="ts">
	import { getRegistrants } from '../data.remote';
</script>

<svelte:boundary>
	{#each await getRegistrants() as registrant (registrant.id)}
		<h1>{registrant.firstName}</h1>
		<h1>{registrant.lastName}</h1>
	{/each}
</svelte:boundary>
