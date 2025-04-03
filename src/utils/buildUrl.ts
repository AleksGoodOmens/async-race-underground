export function buildUrl(
  base: string,
  path: string,
  parameters: Record<string, string | number>
) {
  const url = new URL(path, base);
  Object.entries(parameters).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}
