import DataProduct from "../models/DataProduct";

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

export function isGreaterThanVersion(dataProduct: DataProduct, versionToCompare: string | number, dataProductName?: string): boolean {
  return dataProduct.version > transformVersionToNumber(versionToCompare) && (!dataProductName || dataProduct.dataProduct === dataProductName);
}

export function isGreaterOrEqualThanVersion(dataProduct: DataProduct, versionToCompare: string | number, dataProductName?: string): boolean {
  return dataProduct.version >= transformVersionToNumber(versionToCompare) && (!dataProductName || dataProduct.dataProduct === dataProductName);
}

export function isLessThanVersion(dataProduct: DataProduct, versionToCompare: string | number, dataProductName?: string): boolean {
  return dataProduct.version < transformVersionToNumber(versionToCompare) && (!dataProductName || dataProduct.dataProduct === dataProductName);
}

export function isLessOrEqualThanVersion(dataProduct: DataProduct, versionToCompare: string | number, dataProductName?: string): boolean {
  return dataProduct.version <= transformVersionToNumber(versionToCompare) && (!dataProductName || dataProduct.dataProduct === dataProductName);
}

export function isEqualToVersion(dataProduct: DataProduct, versionToCompare: string | number, dataProductName?: string): boolean {
  return dataProduct.version === transformVersionToNumber(versionToCompare) && (!dataProductName || dataProduct.dataProduct === dataProductName);
}
