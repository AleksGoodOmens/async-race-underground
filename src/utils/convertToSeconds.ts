const MS_IN_SECONDS = 1000;
const FORMAT_AS_TWO = 2;
export function convertToSeconds(ms: number) {
  return (ms / MS_IN_SECONDS).toFixed(FORMAT_AS_TWO);
}
