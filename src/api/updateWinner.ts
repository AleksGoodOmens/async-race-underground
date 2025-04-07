import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';
import { IWinnerResponse } from './postWinner';

export async function updateWinner(
  data: IWinnerResponse
): Promise<IWinnerResponse | object> {
  const url = buildUrl(endpoints.BASE, `${endpoints.WINNERS}/${data.id}`, {});

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wins: data.wins, time: data.time }),
    });

    if (response.ok) {
      const result: IWinnerResponse = await response.json();
      return result;
    }
    return {};
  } catch {
    return {};
  }
}
