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

	onMount(() => {
		const eventSource = new EventSource('/api/events');
		eventSource.addEventListener('refresh', () => {
			invalidateAll();
		});
	});
</script>

<div class="flex h-screen w-screen flex-col bg-black">
	{#each await getAdminView() as talent (talent.id)}
		<div class="flex flex-col odd:bg-base-300 even:bg-base-100">
			<div>
				{talent.firstName}
				{talent.lastName}
				<button
					class="btn btn-soft btn-error"
					onclick={() => {
						deleteRegistrant({ registrantId: talent.id });
					}}>Delete</button
				>
			</div>
		</div>
	{/each}
</div>
