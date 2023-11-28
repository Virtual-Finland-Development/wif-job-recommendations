/**
 *
 * @param url
 * @param params
 * @returns
 */
export function formUrlWithParams(url: string, params: Record<string, string | number | boolean>): URL {
  const cleanedParams = Object.entries(params).filter(([, value]) => value !== undefined);
  const searchParams = new URLSearchParams(cleanedParams.map(([key, value]) => [key, value.toString()]));
  return new URL(`${url}?${searchParams.toString()}`);
}
