import { APPS_SCRIPT_URL, APPS_SCRIPT_TOKEN } from '$env/static/private';

interface ScriptResponse {
	categories?: Category[];
	success?: boolean;
	error?: string;
}

export interface Category {
	name: string;
	row: number;
}

async function callScript(action: string, params: Record<string, unknown> = {}): Promise<ScriptResponse> {
	const response = await fetch(APPS_SCRIPT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token: APPS_SCRIPT_TOKEN, action, ...params }),
		redirect: 'follow'
	});

	if (!response.ok) {
		throw new Error(`Script request failed: ${response.status}`);
	}

	const text = await response.text();

	try {
		const data: ScriptResponse = JSON.parse(text);
		if (data.error) throw new Error(data.error);
		return data;
	} catch {
		throw new Error(`Invalid response from script: ${text.slice(0, 200)}`);
	}
}

export async function getCategories(): Promise<Category[]> {
	const data = await callScript('getCategories');
	return data.categories ?? [];
}

export async function addAmountToCategory(categoryName: string, amount: number): Promise<void> {
	await callScript('addAmount', { categoryName, amount });
}
