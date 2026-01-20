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

<div class="success-container">
	<h1>Score submitted</h1>
	<p>You have successfully submitted your scores.</p>
	<p>Redirecting to judging page in {countdown} seconds...</p>
	<button class="btn btn-primary" onclick={() => goto(resolve('/judge'))}> Go Back Now </button>
</div>

<style>
	.success-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		text-align: center;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	button {
		margin-top: 2rem;
	}
</style>
