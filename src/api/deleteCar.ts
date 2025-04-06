import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';

export async function deleteCar(id: number) {
  const url = buildUrl(endpoints.BASE, `${endpoints.GARAGE}/${id}`, {});

  try {
    const response = await fetch(url, { method: 'delete' });

    if (response.ok) return true;
  } catch (error: unknown) {
    console.log(error);
    return false;
  }
}
