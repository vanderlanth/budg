import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getCategories, addAmountToCategory } from '$lib/sheets';
import { verifyCsrf } from '$lib/csrf';

export const load: PageServerLoad = async () => {
	const categories = await getCategories();
	return { categories };
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();

		if (!verifyCsrf(data.get('csrf_token'), event.cookies.get('csrf'))) {
			return fail(403, { error: 'Invalid request.' });
		}

		const category = data.get('category');
		const amountRaw = data.get('amount');

		if (!category || typeof category !== 'string' || !category.trim()) {
			return fail(400, { error: 'Please select a category.' });
		}

		if (!amountRaw || typeof amountRaw !== 'string') {
			return fail(400, { error: 'Please enter an amount.' });
		}

		const amount = parseFloat(amountRaw);
		if (isNaN(amount) || amount === 0) {
			return fail(400, { error: 'Please enter a valid non-zero amount.' });
		}

		try {
			await addAmountToCategory(category, amount);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			return fail(500, { error: `Failed to update sheet: ${message}` });
		}

		throw redirect(303, '/confirmed');
	}
};
