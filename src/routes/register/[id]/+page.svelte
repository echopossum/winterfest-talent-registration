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

<div class="flex h-screen flex-col items-center justify-center p-8">
	<h1 class="mb-8 text-4xl">Your contestant number is {number}</h1>
	<p class="mb-4">You have successfully registered for the talent show.</p>
	<p class="mb-4">
		Please remain in the area and proceed behind the stage when your number is called
	</p>
	<p class="mb-8">Redirecting to registration in {countdown} seconds...</p>
	<button class="btn btn-outline btn-info" onclick={() => goto(resolve('/'))}> Go Back Now </button>
</div>
