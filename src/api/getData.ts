export async function getData<T>(
  url: string
): Promise<{ data: T; totalAmount?: string } | { error: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        error: response.statusText,
      };
    }
    const json: T = await response.json();
    const totalAmount = response.headers.get('X-Total-Count');

    return totalAmount ? { data: json, totalAmount } : { data: json };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return { error: 'something go wrong' };
  }
}
