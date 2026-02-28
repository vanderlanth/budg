<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import headerGif from '../media/header.gif';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let submitting = $state(false);

	const FAVORITES = ['Bonus (Allowance, Subside)', 'Nutrition', 'Shopping', 'Snack out'];

	const favorites = $derived(data.categories.filter((c) => FAVORITES.includes(c.name)));
	const others = $derived(data.categories.filter((c) => !FAVORITES.includes(c.name)));

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function barStyle(spent: number, max: number): string {
		const pct = max > 0 ? Math.min(100, (spent / max) * 100) : 0;
		const ratio = max > 0 ? spent / max : 0;
		const color = ratio >= 0.9 ? '#ef4444' : ratio >= 0.7 ? '#fbbf24' : '#10b981';
		return `width: ${pct}%; background-color: ${color};`;
	}
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

		<form method="POST" class="space-y-5" use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}>
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

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
					Description <span class="font-normal text-gray-400">(optional)</span>
				</label>
				<input
					id="description"
					name="description"
					type="text"
					placeholder="e.g. weekly groceries"
					class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				/>
			</div>

			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{#if submitting}
					<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Adding…
				{:else}
					Add to Sheet
				{/if}
			</button>
		</form>

		{#if data.budget}
			{@const { monthlyMax, monthlySpent, foodMax, foodSpent } = data.budget}
			<div class="mt-6 pt-6 border-t border-gray-100 space-y-4">
				<div>
					<div class="flex justify-between text-xs text-gray-500 mb-1.5">
						<span class="font-medium text-gray-600">Monthly budget</span>
						<span>{(monthlyMax - monthlySpent).toFixed(0)} left of {monthlyMax.toFixed(0)}</span>
					</div>
					<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
						<div class="h-full rounded-full transition-all" style={barStyle(monthlySpent, monthlyMax)}></div>
					</div>
				</div>
				<div>
					<div class="flex justify-between text-xs text-gray-500 mb-1.5">
						<span class="font-medium text-gray-600">Food budget</span>
						<span>{(foodMax - foodSpent).toFixed(0)} left of {foodMax.toFixed(0)}</span>
					</div>
					<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
						<div class="h-full rounded-full transition-all" style={barStyle(foodSpent, foodMax)}></div>
					</div>
				</div>
				<a
					href="https://docs.google.com/spreadsheets/d/10oXuvoWHkrh32Fplvd7JINNGhPeL7xkR3Uv2Fv1WrEA/edit?gid=1458035542#gid=1458035542"
					target="_blank"
					rel="noopener noreferrer"
					class="block text-center text-xs text-gray-400 hover:text-indigo-500 transition-colors"
				>
					Open spreadsheet ↗
				</a>
			</div>
		{/if}

		{#if data.history.length > 0}
			<div class="mt-6 pt-6 border-t border-gray-100">
				<h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent</h2>
				<ul class="space-y-2">
					{#each data.history as tx}
						<li class="flex items-start justify-between gap-3 text-sm">
							<div class="min-w-0">
								<span class="font-medium text-gray-800">{tx.category}</span>
								{#if tx.description}
									<span class="text-gray-400"> · {tx.description}</span>
								{/if}
								<div class="text-xs text-gray-400 mt-0.5">{formatDate(tx.date)}</div>
							</div>
							<span class="shrink-0 font-semibold text-gray-900">{tx.amount.toFixed(2)}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="mt-8 pt-6 border-t border-gray-100 text-center">
			<a href="/logout" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
				Sign out
			</a>
		</div>
	</div>
</main>
