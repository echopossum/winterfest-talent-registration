<script lang="ts">
	import { onMount } from 'svelte';

	import { invalidateAll } from '$app/navigation';
	import { getStageView } from '../stage/stage.remote';

	onMount(() => {
		const eventSource = new EventSource('/api/events');
		eventSource.addEventListener('stageRefresh', () => {
			invalidateAll();
		});
	});
</script>

<svelte:boundary>
	<div class="flex min-h-dvh w-full flex-col items-center justify-start bg-black">
		{#each await getStageView() as slot (slot.id)}
			<div
				class="flex w-screen items-center justify-center p-4 transition-opacity odd:bg-base-100 even:bg-base-300"
				class:opacity-20={slot.performed}
			>
				<div
					class="flex gap-50 pl-4 text-4xl"
					class:line-through={slot.performed}
					class:text-gray-400={slot.performed}
				>
					<div>Number: {slot.id}</div>
					<div class="w-xs">{slot.firstName} {slot.lastName}</div>
					<div>{slot.unitType} {slot.unitNumber}</div>
				</div>
			</div>
		{/each}
	</div>
</svelte:boundary>
