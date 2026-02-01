<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import logo from '$lib/assets/wf-50-white.png';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex h-14 w-full items-center justify-center bg-base-300 sm:justify-between">
	<h1 class="p-4 text-2xl">Winterfest Talent Show</h1>
	<img src={logo} alt="" class=" h-10 object-contain pr-4" />
</div>
{@render children()}
