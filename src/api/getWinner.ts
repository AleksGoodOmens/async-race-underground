import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';
import { IWinnerResponse } from './postWinner';

export async function getWinner(id: string): Promise<IWinnerResponse | null> {
  const url = buildUrl(endpoints.BASE, `${endpoints.WINNERS}/${id}`, {});

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const json: IWinnerResponse = await response.json();

    return json;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return null;
    }
    return null;
  }
}
