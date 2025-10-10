/**
 * Extracts error message from various error shapes
 * Handles API errors with response.data.message or standard Error.message
 */
export function getErrorMessage(
	error: unknown,
	fallback = 'An error occurred',
): string {
	if (typeof error === 'object' && error !== null) {
		const errorObj = error as Record<string, unknown>;
		const response = errorObj.response as Record<string, unknown> | undefined;
		const data = response?.data as Record<string, unknown> | undefined;
		const message = data?.message || errorObj.message;
		if (typeof message === 'string') return message;
	}
	return fallback;
}
