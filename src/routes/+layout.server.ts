import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		csrfToken: event.locals.csrfToken
	};
};
