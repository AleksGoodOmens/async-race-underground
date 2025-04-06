import { ICar } from '../pages/garage/types';
import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';

export async function updateCar(car: ICar): Promise<ICar | undefined> {
  const url = buildUrl(endpoints.BASE, `${endpoints.GARAGE}/${car.id}`, {});

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: car.name, color: car.color }),
    });

    if (response.ok) {
      const car = await response.json();
      return car;
    }
  } catch {
    return undefined;
  }
}
