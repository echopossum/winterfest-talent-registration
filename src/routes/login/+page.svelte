<script lang="ts">
	import { page } from '$app/state';
	import { login } from './login.remote';
</script>

<div class="flex min-h-dvh w-full flex-col items-center justify-center gap-5 bg-base-100">
	<h1 class="text-2xl">Staff Login</h1>
	<form
		class="fieldset flex w-xs flex-col items-center justify-center rounded-box bg-base-300 p-4 sm:w-sm"
		{...login}
	>
		<input
			{...login.fields.redirectTo.as('hidden', page.url.searchParams.get('redirectTo') ?? '')}
		/>
		<fieldset class="fieldset">
			<label class="label text-lg" for="email">Email:</label>
			<input
				class="input w-2xs bg-base-100 sm:w-xs"
				id="email"
				autocomplete="username"
				required
				{...login.fields.email.as('email')}
			/>
			{#each login.fields.email.issues() ?? [] as issue (issue.message)}
				<p class="text-error">{issue.message}</p>
			{/each}
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="password">Password:</label>
			<input
				class="input w-2xs bg-base-100 sm:w-xs"
				id="password"
				autocomplete="current-password"
				required
				{...login.fields._password.as('password')}
			/>
			{#each login.fields._password.issues() ?? [] as issue (issue.message)}
				<p class="text-error">{issue.message}</p>
			{/each}
		</fieldset>
		<button class="btn mt-4 w-3xs rounded-box btn-outline btn-info sm:w-xs">Log in</button>
	</form>
</div>
