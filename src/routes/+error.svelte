<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let countdown = 10;

	onMount(() => {
		const timer = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(timer);
				goto(resolve('/'), { replaceState: true });
			}
		}, 1000);

		return () => clearInterval(timer);
	});
</script>

<div class="flex h-screen flex-col items-center justify-center p-8">
	<h1 class="mb-8 text-4xl">There has been an error in your registration</h1>
	<p class="mb-4">Please see a show staff member for assistance.</p>
	<p class="mb-8">Redirecting to registration in {countdown} seconds...</p>
	<button class="btn btn-outline btn-info" onclick={() => goto(resolve('/'))}> Go Back Now </button>
</div>
