// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			authenticated: boolean;
			csrfToken: string;
		}
		interface PageData {
			csrfToken: string;
		}
	}
}

export {};
