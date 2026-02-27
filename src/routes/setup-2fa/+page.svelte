<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type SuccessResult = { verified: true; secret: string };
	const success = $derived(
		form && 'verified' in form && form.verified ? (form as SuccessResult) : null
	);
</script>

<svelte:head>
	<title>Set up 2FA</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
		{#if success}
			<div class="mb-3 text-3xl text-center">✓</div>
			<h1 class="text-xl font-semibold text-gray-900 mb-2 text-center">2FA verified!</h1>
			<p class="text-gray-500 text-sm mb-4">
				Add this line to your <code class="bg-gray-100 px-1 rounded">.env</code> file (and to Vercel
				environment variables), then redeploy:
			</p>
			<pre
				class="bg-gray-100 rounded-lg p-3 text-sm font-mono break-all select-all border border-gray-200">TOTP_SECRET={success.secret}</pre>
			<p class="text-gray-400 text-xs mt-3">
				After adding it, every login will require your authenticator app.
			</p>
			<a href="/" class="mt-6 block text-center text-sm text-indigo-600 hover:text-indigo-700">
				← Back to app
			</a>
		{:else}
			<h1 class="text-xl font-semibold text-gray-900 mb-1">Set up two-factor auth</h1>
			<p class="text-gray-500 text-sm mb-5">
				Scan this QR code with <strong>Google Authenticator</strong> or <strong>Authy</strong>, then
				enter the 6-digit code to confirm.
			</p>

			<div class="flex justify-center mb-6">
				<img
					src={data.qrDataUrl}
					alt="2FA QR code"
					class="rounded-lg border border-gray-200"
					width="200"
					height="200"
				/>
			</div>

			{#if form?.error}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
					{form.error}
				</div>
			{/if}

			<form method="POST" class="space-y-4">
				<input type="hidden" name="csrf_token" value={data.csrfToken} />
				<div>
					<label for="code" class="block text-sm font-medium text-gray-700 mb-1">
						Verification code
					</label>
					<input
						id="code"
						name="code"
						type="text"
						inputmode="numeric"
						pattern={'[0-9]{6}'}
						maxlength="6"
						required
						placeholder="000000"
						class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-center text-xl tracking-widest font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
				>
					Verify & get secret
				</button>
			</form>
		{/if}
	</div>
</main>
