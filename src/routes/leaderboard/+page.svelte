<script lang="ts">
	import { getLeaderboard } from './leaderboard.remote';
</script>

{#each await getLeaderboard() as slot (slot.id)}
	<div>
		{slot.firstName}, {slot.lastName}, {slot.total}
	</div>
{/each}
