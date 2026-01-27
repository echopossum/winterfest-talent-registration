<script lang="ts">
	import { onMount } from 'svelte';

	import { invalidateAll } from '$app/navigation';
	import { getStageView, markPerformed } from './stage.remote';

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
				class="flex w-screen items-center justify-between transition-opacity odd:bg-base-300 even:bg-base-100"
				class:opacity-60={slot.performed}
			>
				<div
					class="flex gap-10 pl-4 text-lg"
					class:line-through={slot.performed}
					class:text-gray-400={slot.performed}
				>
					<div>Number: {slot.id}</div>
					<div class="w-xs">{slot.firstName} {slot.lastName}</div>
					<div>{slot.unitType} {slot.unitNumber}</div>
				</div>
				<div
					class="text-xs"
					class:line-through={slot.performed}
					class:text-gray-400={slot.performed}
				>
					{slot.description}
				</div>
				<div class="flex justify-center gap-2 p-2">
					<button
						type="button"
						class="btn btn-soft btn-error"
						onclick={() => {
							markPerformed({ registrantId: slot.id, performed: true });
						}}>Performed</button
					>
					<button
						type="button"
						class="btn btn-soft btn-success"
						onclick={() => {
							markPerformed({ registrantId: slot.id, performed: false });
						}}>Ready</button
					>
				</div>
			</div>
		{/each}
	</div>
</svelte:boundary>
