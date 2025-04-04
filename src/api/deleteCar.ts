import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';

export async function deleteCar(id: number) {
  const url = buildUrl(endpoints.BASE, `${endpoints.GARAGE}/${id}`, {});
  await fetch(url, { method: 'delete' });
}
