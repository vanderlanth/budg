<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import headerGif from '../media/header.gif';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const FAVORITES = ['Bonus (Allowance, Subside)', 'Nutrition', 'Shopping', 'Snack out'];

	const favorites = $derived(data.categories.filter((c) => FAVORITES.includes(c.name)));
	const others = $derived(data.categories.filter((c) => !FAVORITES.includes(c.name)));
</script>

<svelte:head>
	<title>Budget Entry</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
		<div class="-mx-8 -mt-8 mb-6 overflow-hidden rounded-t-2xl">
			<img src={headerGif} alt="" class="w-full" />
		</div>
		<h1 class="text-2xl font-semibold text-gray-900 mb-6">Add Transaction</h1>

		{#if form?.error}
			<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-5">
			<input type="hidden" name="csrf_token" value={data.csrfToken} />
			<div>
				<label for="category" class="block text-sm font-medium text-gray-700 mb-1">
					Category
				</label>
				<select
					id="category"
					name="category"
					required
					class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<option value="" disabled selected>Select a category…</option>
					{#if favorites.length}
						<optgroup label="⭐ Favorites">
							{#each favorites as cat}
								<option value={cat.name}>{cat.name}</option>
							{/each}
						</optgroup>
					{/if}
					{#if others.length}
						<optgroup label="All categories">
							{#each others as cat}
								<option value={cat.name}>{cat.name}</option>
							{/each}
						</optgroup>
					{/if}
				</select>
			</div>

			<div>
				<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
					Amount
				</label>
				<input
					id="amount"
					name="amount"
					type="number"
					step="0.01"
					required
					placeholder="0.00"
					class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
			>
				Add to Sheet
			</button>
		</form>

		<div class="mt-8 pt-6 border-t border-gray-100 text-center">
			<a href="/logout" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
				Sign out
			</a>
		</div>
	</div>
</main>
