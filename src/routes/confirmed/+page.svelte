<svelte:head>
	<title>Done!</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8 text-center">
		<div class="mb-4 text-4xl">✓</div>
		<h1 class="text-2xl font-semibold text-gray-900 mb-2">Transaction Added</h1>
		<p class="text-gray-500 mb-8">The sheet has been updated successfully.</p>

		<div class="space-y-3">
			<a
				href="https://docs.google.com/spreadsheets/d/10oXuvoWHkrh32Fplvd7JINNGhPeL7xkR3Uv2Fv1WrEA/edit?gid=1458035542#gid=1458035542"
				target="_blank"
				rel="noopener noreferrer"
				class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
			>
				Open Spreadsheet ↗
			</a>
			<a
				href="/"
				class="block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
			>
				Add Another
			</a>
		</div>
	</div>
</main>
