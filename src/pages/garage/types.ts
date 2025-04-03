export interface ICar {
  name: string;
  color: string;
  id?: number;
}

const BACKWARD = -1;
const FORWARD = 1;

export enum directions {
  back = BACKWARD,
  next = FORWARD,
}
