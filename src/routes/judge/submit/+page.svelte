<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let countdown = 5;

	onMount(() => {
		const timer = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(timer);
				goto(resolve('/judge'));
			}
		}, 1000);

		return () => clearInterval(timer);
	});
</script>

<div class="flex h-screen flex-col items-center justify-center p-8">
	<h1 class="mb-8 text-4xl">Score Submitted</h1>
	<p class="mb-4">You have successfully submitted your scores.</p>
	<p class="mb-4">Redirecting to judging page in {countdown} seconds...</p>
	<button class="btn btn-primary" onclick={() => goto(resolve('/judge'))}> Go Back Now </button>
</div>
