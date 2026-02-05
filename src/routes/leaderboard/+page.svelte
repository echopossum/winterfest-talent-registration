<script lang="ts">
	import { onMount } from 'svelte';
	import { getLeaderboard } from './leaderboard.remote';
	import { invalidateAll } from '$app/navigation';

	onMount(() => {
		const eventSource = new EventSource('/api/events');
		eventSource.addEventListener('refresh', () => {
			invalidateAll();
		});
	});
</script>

<svelte:boundary>
	<div class="flex min-h-dvh w-full flex-col items-center justify-start bg-black">
		{#each await getLeaderboard() as slot (slot.id)}
			{#if slot.total > 0}
				<div class="flex w-screen items-center justify-between odd:bg-base-100 even:bg-base-300">
					<div class="flex w-sm justify-start p-2 pl-8 text-2xl">
						Name:
						{slot.firstName}
						{slot.lastName}
					</div>
					<div class="flex w-sm justify-center p-2 text-2xl">
						Unit:
						{slot.unitType}
						{slot.unitNumber}
					</div>
					<div class="flex w-sm justify-end p-2 pr-8 text-2xl">
						Score:
						{slot.total}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</svelte:boundary>
