<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	const number = page.params.id;
	let countdown = 10;

	onMount(() => {
		const timer = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(timer);
				goto(resolve('/'));
			}
		}, 1000);

		return () => clearInterval(timer);
	});
</script>

<div class="success-container">
	<h1>Your number is {number}!</h1>
	<p>You have successfully registered for the talent show.</p>
	<p>Redirecting to registration in {countdown} seconds...</p>
	<button class="btn btn-primary" onclick={() => goto(resolve('/'))}> Go Back Now </button>
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
