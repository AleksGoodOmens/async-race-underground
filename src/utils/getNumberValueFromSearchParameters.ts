const noSearch = -1;
const zero = 0;
const REPLACED = ['?', '='];

export function getNumberValueFromSearchParameters(
  key: string,
  defaultValue: number
): number {
  let indexOfSearchStart = window.location.hash.indexOf('?');

  if (indexOfSearchStart === noSearch) indexOfSearchStart = zero;

  const searchparams = window.location.hash
    .slice(indexOfSearchStart)
    .split('&');

  const returnValue = defaultValue;
  let currentParameter = searchparams.find((parameter) => {
    return parameter.includes(key);
  });

  if (!currentParameter) return returnValue;

  REPLACED.forEach(
    (char) => (currentParameter = currentParameter?.replace(char, ''))
  );

  currentParameter = currentParameter.replace(key, '');

  if (Object.is(Number.parseInt(currentParameter), isNaN)) return defaultValue;
  return Number.parseInt(currentParameter);
}
