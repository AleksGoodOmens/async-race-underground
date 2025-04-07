const DEFAULT_LENGTH = 25;
const START_INDEX = 0;

export function shortString(
  string: string,
  length: number = DEFAULT_LENGTH,
  ending: string = '...'
) {
  if (string.length >= length) {
    return string.slice(START_INDEX, length - ending.length) + ending;
  }
  return string;
}
