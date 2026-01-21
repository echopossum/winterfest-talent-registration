<script lang="ts">
	import { getRegistrants } from '../data.remote';
</script>

<svelte:boundary>
	{#each await getRegistrants() as registrant (registrant.id)}{/each}
</svelte:boundary>
