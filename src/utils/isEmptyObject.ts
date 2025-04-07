const ZERO = 0;

export const isEmptyObject = (object: object): boolean => {
  return Object.keys(object).length === ZERO && object.constructor === Object;
};
