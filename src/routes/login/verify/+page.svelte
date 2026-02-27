<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Two-factor authentication</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
		<h1 class="text-2xl font-semibold text-gray-900 mb-1">Two-factor auth</h1>
		<p class="text-gray-500 text-sm mb-6">Enter the 6-digit code from your authenticator app.</p>

		{#if form?.error}
			<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<input type="hidden" name="csrf_token" value={data.csrfToken} />
			<input
				name="code"
				type="text"
				inputmode="numeric"
				pattern={'[0-9]{6}'}
				maxlength="6"
				required
				placeholder="000000"
				class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-center text-2xl tracking-widest font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			/>
			<button
				type="submit"
				class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
			>
				Verify
			</button>
		</form>

		<div class="mt-4 text-center">
			<a href="/login" class="text-sm text-gray-400 hover:text-gray-600">← Back to login</a>
		</div>
	</div>
</main>
