import { buildUrl } from '../utils/buildUrl';
import { endpoints } from './endpoints';

interface IParameters {
  id: number;
  status: 'started' | 'stopped' | 'drive';
}

export interface IStartResponse {
  velocity: number;
  distance: number;
}

export interface IDriveResponse {
  success: boolean;
  error?: string;
}

type BaseResponse = { success: boolean; error?: string };

export async function carEngineControl(
  parameters: IParameters & { status: 'started' }
): Promise<IStartResponse & BaseResponse>;

export async function carEngineControl(
  parameters: IParameters & { status: 'drive' }
): Promise<IDriveResponse & BaseResponse>;

export async function carEngineControl(
  parameters: IParameters & { status: 'stopped' }
): Promise<BaseResponse>;

export async function carEngineControl(
  parameters: IParameters
): Promise<unknown> {
  const url = buildUrl(endpoints.BASE, endpoints.ENGINE, { ...parameters });

  try {
    const response = await fetch(url, {
      method: 'PATCH',
    });

    if (!response.ok) {
      return {
        success: false,
        error: response.statusText,
      };
    }

    const json = await response.json();

    if (parameters.status === 'drive') {
      return {
        ...json,
        success: json.success ?? true,
      };
    }

    if (parameters.status === 'started') {
      return {
        ...json,
        success: true,
      };
    }

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}
