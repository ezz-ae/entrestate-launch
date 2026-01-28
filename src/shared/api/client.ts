export type ApiResult<T> = {
  ok: boolean;
  status: number;
  requestId?: string;
  scope?: string;
  data?: T;
  error?: unknown;
};

const REQUEST_ID_HEADER = 'x-request-id';

function buildUrl(baseUrl: string | undefined, path: string) {
  if (!baseUrl) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { baseUrl?: string } = {}
): Promise<ApiResult<T>> {
  const { baseUrl, ...init } = options;
  const url = buildUrl(baseUrl, path);
  const response = await fetch(url, init);
  const requestId = response.headers.get(REQUEST_ID_HEADER) ?? undefined;
  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  const result: ApiResult<T> = {
    ok: response.ok,
    status: response.status,
    requestId,
    scope: payload?.scope ?? payload?.error?.scope,
    data: payload?.data ?? undefined,
    error: payload?.error ?? (!response.ok ? payload ?? 'Request failed' : undefined),
  };
  return result;
}
