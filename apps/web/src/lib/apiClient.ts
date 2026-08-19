import type { ApiErrorBody, ErrorCode } from '@health-portal/shared-types';

const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

export interface ApiErrorOptions {
  code: ErrorCode;
  message: string;
  status: number;
}

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor({ code, message, status }: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

function buildUrl(path: string, params?: Record<string, string | undefined>): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${cleanPath}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    }
  }
  return url.toString();
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      // non-JSON error body
    }
    throw new ApiError({
      code: body?.error?.code ?? 'UNKNOWN_ERROR',
      message: body?.error?.message ?? `Request failed with status ${res.status}`,
      status: res.status,
    });
  }
  return (await res.json()) as T;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
  signal?: AbortSignal
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: 'Could not reach the server.',
      status: 0,
    });
  }
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: 'Could not reach the server.',
      status: 0,
    });
  }
  return handleResponse<T>(res);
}