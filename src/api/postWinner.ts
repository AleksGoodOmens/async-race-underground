import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';

export interface IWinnerResponse {
  id: number;
  wins: number;
  time: number;
}

export async function postWinner(winner: IWinnerResponse) {
  const url = buildUrl(endpoints.BASE, endpoints.WINNERS, {});

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });

    if (!response.ok) return {};

    const json: IWinnerResponse = await response.json();
    return json;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {};
    }
    return {};
  }
}
