<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
		<h1 class="text-2xl font-semibold text-gray-900 mb-6">Sign in</h1>

		{#if form?.error}
			<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<input type="hidden" name="csrf_token" value={data.csrfToken} />
			<!-- Honeypot: hidden from real users, bots fill it in -->
			<div style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true">
				<label for="website">Website</label>
				<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
			>
				Sign in
			</button>
		</form>
	</div>
</main>
