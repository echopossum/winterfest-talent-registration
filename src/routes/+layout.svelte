<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import logo from '$lib/assets/wf-50-white.png';
	import { logout } from './login/login.remote';
	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex h-14 w-full items-center justify-center bg-base-300 sm:justify-between">
	<h1 class="p-4 text-xl sm:text-2xl">Winterfest Talent Show</h1>
	<div class="flex items-center gap-3">
		{#if data.user}
			<form {...logout} class="flex items-center gap-2">
				<span class="hidden text-sm sm:inline">{data.user.name}</span>
				<button class="btn btn-outline btn-xs">Log out</button>
			</form>
		{/if}
		<img src={logo} alt="" class=" h-10 object-contain pr-4" />
	</div>
</div>
{@render children()}
