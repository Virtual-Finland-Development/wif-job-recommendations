/**
 *
 * @param url
 * @param params
 * @returns
 */
export function formUrlWithParams(url: string, params: Record<string, string | number | boolean>): URL {
  const searchParams = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, value.toString()]));
  return new URL(`${url}?${searchParams.toString()}`);
}
