<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="mb-4 flex h-14 w-full items-center justify-center bg-base-300 sm:justify-start">
	<h1 class="p-4 text-2xl">Winterfest Talent Show</h1>
</div>
{@render children()}
