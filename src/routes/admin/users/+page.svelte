<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		getUsers,
		createUser,
		setUserPassword,
		setUserRole,
		setUserBanned,
		removeUser
	} from './users.remote';

	let passwordModal: HTMLDialogElement;
	let deleteModal: HTMLDialogElement;
	let selected = $state<{ id: string; name: string } | null>(null);
	let actionError = $state('');

	async function act(action: () => Promise<unknown>) {
		actionError = '';
		try {
			await action();
			await getUsers().refresh();
		} catch (err) {
			actionError = (err as { body?: { message?: string } }).body?.message ?? 'Action failed';
		}
	}
</script>

<div class="flex min-h-dvh w-full flex-col items-center gap-6 bg-base-100 p-4">
	<div class="flex w-full max-w-4xl items-center justify-between">
		<h1 class="text-2xl">Staff Accounts</h1>
		<a class="btn btn-outline btn-sm" href={resolve('/admin')}>Back to admin</a>
	</div>

	<form
		{...createUser}
		class="flex w-full max-w-4xl flex-wrap items-end gap-3 rounded-box bg-base-300 p-4"
	>
		<fieldset class="fieldset">
			<label class="label" for="new-name">Name</label>
			<input class="input" id="new-name" required {...createUser.fields.name.as('text')} />
		</fieldset>
		<fieldset class="fieldset">
			<label class="label" for="new-email">Email</label>
			<input class="input" id="new-email" required {...createUser.fields.email.as('email')} />
		</fieldset>
		<fieldset class="fieldset">
			<label class="label" for="new-password">Password (10+ characters)</label>
			<input
				class="input"
				id="new-password"
				autocomplete="new-password"
				required
				{...createUser.fields._password.as('password')}
			/>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label" for="new-role">Role</label>
			<select class="select" id="new-role" {...createUser.fields.role.as('select')}>
				<option value="judge">Judge</option>
				<option value="admin">Admin</option>
			</select>
		</fieldset>
		<button class="btn btn-info">Create account</button>
		{#each createUser.fields.allIssues() ?? [] as issue (issue.message)}
			<p class="w-full text-error">{issue.message}</p>
		{/each}
	</form>

	{#if actionError}
		<p class="text-error">{actionError}</p>
	{/if}

	<div class="w-full max-w-4xl overflow-x-auto rounded-box bg-base-300">
		<table class="table">
			<thead>
				<tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
			</thead>
			<tbody>
				{#each await getUsers() as u (u.id)}
					<tr>
						<td>{u.name}</td>
						<td>{u.email}</td>
						<td>
							<select
								class="select select-sm"
								value={u.role}
								onchange={(e) =>
									act(() =>
										setUserRole({
											userId: u.id,
											role: e.currentTarget.value as 'judge' | 'admin'
										})
									)}
							>
								<option value="judge">Judge</option>
								<option value="admin">Admin</option>
							</select>
						</td>
						<td>{u.banned ? 'Disabled' : 'Active'}</td>
						<td class="flex gap-2">
							<button
								class="btn btn-soft btn-info btn-xs"
								onclick={() => {
									selected = u;
									passwordModal.showModal();
								}}>Reset password</button
							>
							<button
								class="btn btn-soft btn-warning btn-xs"
								onclick={() => act(() => setUserBanned({ userId: u.id, banned: !u.banned }))}
								>{u.banned ? 'Enable' : 'Disable'}</button
							>
							<button
								class="btn btn-soft btn-error btn-xs"
								onclick={() => {
									selected = u;
									deleteModal.showModal();
								}}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<dialog bind:this={passwordModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Reset password</h3>
			<p>{selected?.name}</p>
			<form
				{...setUserPassword.enhance(async ({ submit }) => {
					await submit();
					if (!setUserPassword.fields.allIssues()?.length) passwordModal.close();
				})}
				class="flex flex-col gap-3"
			>
				<input {...setUserPassword.fields.userId.as('hidden', selected?.id ?? '')} />
				<input
					class="input w-full"
					autocomplete="new-password"
					required
					placeholder="New password (10+ characters)"
					{...setUserPassword.fields._password.as('password')}
				/>
				{#each setUserPassword.fields.allIssues() ?? [] as issue (issue.message)}
					<p class="text-error">{issue.message}</p>
				{/each}
				<button class="btn btn-primary">Set password</button>
			</form>
			<div class="modal-action">
				<form method="dialog"><button class="btn">Close</button></form>
			</div>
		</div>
	</dialog>

	<dialog bind:this={deleteModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Delete this account?</h3>
			<p class="p-4">{selected?.name}</p>
			<button
				class="btn w-full btn-soft btn-error"
				onclick={() => {
					const id = selected?.id;
					deleteModal.close();
					if (id) act(() => removeUser({ userId: id }));
				}}>DELETE</button
			>
			<div class="modal-action">
				<form method="dialog"><button class="btn">Close</button></form>
			</div>
		</div>
	</dialog>
</div>
