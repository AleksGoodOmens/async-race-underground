import { ICar } from '../pages/garage/types';
import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';

export async function postCar(car: ICar) {
  const url = buildUrl(endpoints.BASE, endpoints.GARAGE, {});

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });

    if (!response.ok) return { error: response.statusText };

    const json: ICar = await response.json();
    return json;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return { error: 'something go wrong' };
  }
}
