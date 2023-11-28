import { APIGatewayProxyEventV2 } from "aws-lambda";
import { BadRequestExcetion } from "./exceptions";

/**
 *
 * @param value
 * @param defaultValue
 * @returns
 */
function ensureInteger(value: number, defaultValue?: number): number {
  if (!Number.isInteger(value)) {
    if (typeof defaultValue === "number") {
      return defaultValue;
    }
    throw new Error(`Value ${value} is not an integer`);
  }
  return value;
}

/**
 *
 * @param event
 * @returns
 */
export function parseDataProductVersion(event: APIGatewayProxyEventV2): number {
  const dataProductVersionText = event.requestContext.http.path.match(/\/Employment\/ForeignerJobRecommendatations_v([\d\.]+)/)?.[1];

  if (!dataProductVersionText) {
    console.log(event);
    throw new BadRequestExcetion("Missing data product version from the URI path");
  }

  return transformVersionToNumber(dataProductVersionText);
}

/**
 *
 * @param versionString
 * @returns
 */
export function transformVersionToNumber(versionString: string | number): number {
  if (typeof versionString === "number") {
    return versionString;
  }

  const versionParts = versionString.split(".");
  const major = ensureInteger(parseInt(versionParts[0]), 0);
  const minor = ensureInteger(parseInt(versionParts[1]), 0);
  const patch = ensureInteger(parseInt(versionParts[2]), 0);
  const dataProductVersion = major * 10000 + minor * 100 + patch;

  return dataProductVersion;
}

export function isGreaterThanVersion(version: string | number, versionToCompare: string | number): boolean {
  return transformVersionToNumber(version) > transformVersionToNumber(versionToCompare);
}

export function isGreaterOrEqualThanVersion(version: string | number, versionToCompare: string | number): boolean {
  return transformVersionToNumber(version) >= transformVersionToNumber(versionToCompare);
}

export function isLessThanVersion(version: string | number, versionToCompare: string | number): boolean {
  return transformVersionToNumber(version) < transformVersionToNumber(versionToCompare);
}

export function isLessOrEqualThanVersion(version: string | number, versionToCompare: string | number): boolean {
  return transformVersionToNumber(version) <= transformVersionToNumber(versionToCompare);
}

export function isEqualToVersion(version: string | number, versionToCompare: string | number): boolean {
  return transformVersionToNumber(version) === transformVersionToNumber(versionToCompare);
}
