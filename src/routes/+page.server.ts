import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getCategories, addAmountToCategory, getBudgetStatus } from '$lib/sheets';
import { verifyCsrf } from '$lib/csrf';
import { dev } from '$app/environment';

interface Transaction {
	category: string;
	amount: number;
	description: string;
	date: string;
}

const HISTORY_COOKIE = 'tx_history';
const MAX_HISTORY = 5;

function readHistory(raw: string | undefined): Transaction[] {
	if (!raw) return [];
	try {
		return JSON.parse(raw) as Transaction[];
	} catch {
		return [];
	}
}

export const load: PageServerLoad = async ({ cookies }) => {
	const [categories, budget] = await Promise.all([getCategories(), getBudgetStatus()]);
	const history = readHistory(cookies.get(HISTORY_COOKIE));
	return { categories, history, budget };
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();

		if (!verifyCsrf(data.get('csrf_token'), event.cookies.get('csrf'))) {
			return fail(403, { error: 'Invalid request.' });
		}

		const category = data.get('category');
		const amountRaw = data.get('amount');
		const description = ((data.get('description') as string | null) ?? '').trim();

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

		const history = readHistory(event.cookies.get(HISTORY_COOKIE));
		history.unshift({ category, amount, description, date: new Date().toISOString() });
		event.cookies.set(HISTORY_COOKIE, JSON.stringify(history.slice(0, MAX_HISTORY)), {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, '/confirmed');
	}
};
