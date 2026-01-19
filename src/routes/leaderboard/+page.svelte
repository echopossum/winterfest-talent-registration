<script lang="ts">
	import { getLeaderboard } from './leaderboard.remote';
</script>

<svelte:boundary>
	<div class="flex h-screen w-screen flex-col items-center justify-start bg-black">
		{#each await getLeaderboard() as slot (slot.id)}
			<div class="flex w-screen items-center justify-between odd:bg-base-300 even:bg-base-100">
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
		{/each}
	</div>
</svelte:boundary>
