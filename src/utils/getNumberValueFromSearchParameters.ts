export function getNumberValueFromSearchParameters(
  key: string,
  defaultValue: number
): number {
  const value = new URLSearchParams(window.location.search).get(key);
  if (value) {
    if (Object.is(Number.parseInt(value), isNaN)) return defaultValue;
    return Number.parseInt(value);
  }
  return defaultValue;
}
