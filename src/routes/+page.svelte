<script lang="ts">
	import { registerTalent } from './data.remote';
</script>

<div class="flex min-h-dvh w-full flex-col items-center justify-center gap-5">
	<h1>Talent Show Reg</h1>
	<form
		class="fieldset flex w-xs flex-col items-center justify-center rounded-box bg-base-300 p-4 md:w-lg lg:w-xl"
		{...registerTalent}
	>
		<fieldset class="fieldset">
			<label class="label text-lg" for="firstName">*First Name:</label>
			<input
				class="validator input w-2xs md:w-md lg:w-lg"
				{...registerTalent.fields.firstName.as('text')}
				required
				id="firstName"
			/>
			<div class="validator-hint hidden">First Name is Required</div>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="lastName">*Last Name:</label>
			<input
				class="validator input w-2xs md:w-md lg:w-lg"
				{...registerTalent.fields.lastName.as('text')}
				required
				id="lastName"
			/>
			<div class="validator-hint hidden">Last Name is Required</div>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="email">*Email:</label>
			<input
				class="validator input w-2xs md:w-md lg:w-lg"
				{...registerTalent.fields.email.as('email')}
				required
				id="email"
			/>
			<div class="validator-hint hidden">Email is Required</div>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="phone">*Phone Number:</label>
			<input
				class="validator input w-2xs md:w-md lg:w-lg"
				{...registerTalent.fields.phoneNumber.as('tel')}
				required
				id="phone"
			/>
			<div class="validator-hint hidden">Phone number is Required</div>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="unitType">Unit Type:</label>
			<select
				class=" input w-2xs md:w-md lg:w-lg"
				id="unitType"
				{...registerTalent.fields.unitType.as('select')}
			>
				{#each ['Post', 'Crew', 'Ship', 'Troop', 'Other'] as unit (unit)}
					<option>{unit}</option>
				{/each}
			</select>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="unitNumber">Unit Number:</label>
			<input
				class=" input w-2xs md:w-md lg:w-lg"
				{...registerTalent.fields.unitNumber.as('number')}
				id="unitNumber"
			/>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="additionalMembers">Additional Members:</label>
			<textarea
				class="input h-30 w-2xs resize-none text-wrap md:w-md lg:min-w-lg"
				id="additionalMembers"
				maxlength="150"
				{...registerTalent.fields.additionalMembers.as('text')}
			></textarea>
		</fieldset>
		<fieldset class="fieldset">
			<label class="label text-lg" for="description">Act Description:</label>
			<textarea
				class="input h-30 w-2xs resize-none text-wrap md:w-md lg:w-lg"
				id="description"
				maxlength="150"
				{...registerTalent.fields.description.as('text')}
			></textarea>
		</fieldset>
		<button class="btn mt-4 w-2xs rounded-box btn-outline btn-info md:w-sm lg:w-md">Register</button
		>
	</form>
</div>
