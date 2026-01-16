<script lang="ts">
	import { registerTalent } from './data.remote';
</script>

<form {...registerTalent}>
	<label class="floating-label">
		<input class="input" placeholder="First Name" {...registerTalent.fields.firstName.as('text')} />
		<span>First Name</span>
		{#each registerTalent.fields.issues() as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</label>
	<label class="floating-label">
		<input class="input" placeholder="Last Name" {...registerTalent.fields.lastName.as('text')} />
		<span>Last Name</span>
		{#each registerTalent.fields.issues() as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</label>
	<label class="floating-label">
		<input class="input" placeholder="Email" {...registerTalent.fields.email.as('email')} />
		<span>Email</span>
		{#each registerTalent.fields.issues() as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</label>
	<label class="floating-label">
		<input
			class="input"
			placeholder="Phone Number"
			{...registerTalent.fields.phoneNumber.as('tel')}
		/>
		<span>Phone Number</span>
		{#each registerTalent.fields.issues() as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</label>
	<label class="floating-label">
		<input class="input" placeholder="Unit Type" {...registerTalent.fields.unitType.as('text')} />
		<span>Phone Number</span>
		{#each registerTalent.fields.issues() as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</label>
	<label class="floating-label">
		<input
			class="input"
			placeholder="Unit Number"
			{...registerTalent.fields.unitNumber.as('text')}
		/>
		<span>Unit Number</span>
		{#each registerTalent.fields.issues() as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</label>
	<button type="submit" class="btn btn-primary">Submit</button>
</form>
