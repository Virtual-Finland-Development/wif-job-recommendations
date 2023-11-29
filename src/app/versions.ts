import { DataProductName } from "../models/DataProduct";

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

/**
 * Comparison argument can be either a string or a number, or an object with version and data product name
 */
type ComparisonArgument =
  | {
      version: number | string;
      dataProductName: DataProductName;
    }
  | string
  | number;

function resolveCompareArgument(dataProduct: ComparisonArgument, dataProductName: DataProductName = DataProductName.Default) {
  if (typeof dataProduct === "string" || typeof dataProduct === "number") {
    return {
      dataProduct: dataProductName,
      version: transformVersionToNumber(dataProduct),
    };
  }
  return {
    dataProduct: dataProduct.dataProductName,
    version: transformVersionToNumber(dataProduct.version),
  };
}

function resolveComparisonArguments(dataProduct: ComparisonArgument, comparison: ComparisonArgument, comparisonDataProductName?: DataProductName) {
  const { dataProduct: dataProduct1, version: version1 } = resolveCompareArgument(dataProduct);
  const { dataProduct: dataProduct2, version: version2 } = resolveCompareArgument(comparison, comparisonDataProductName);
  return {
    dataProduct1,
    version1,
    dataProduct2,
    version2,
  };
}

/**
 *
 * @param dataProduct argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparison argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparisonDataProductName optional data product name to use for comparison if comparison is a string or number
 * @returns
 */
export function isGreaterThanVersion(dataProduct: ComparisonArgument, comparison: ComparisonArgument, comparisonDataProductName?: DataProductName): boolean {
  const { dataProduct1, version1, dataProduct2, version2 } = resolveComparisonArguments(dataProduct, comparison, comparisonDataProductName);
  return version1 > version2 && dataProduct1 === dataProduct2;
}

/**
 *
 * @param dataProduct argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparison argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparisonDataProductName optional data product name to use for comparison if comparison is a string or number
 * @returns
 */
export function isGreaterOrEqualThanVersion(dataProduct: ComparisonArgument, comparison: ComparisonArgument, comparisonDataProductName?: DataProductName): boolean {
  const { dataProduct1, version1, dataProduct2, version2 } = resolveComparisonArguments(dataProduct, comparison, comparisonDataProductName);
  return version1 >= version2 && dataProduct1 === dataProduct2;
}

/**
 *
 * @param dataProduct argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparison argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparisonDataProductName optional data product name to use for comparison if comparison is a string or number
 * @returns
 */
export function isLessThanVersion(dataProduct: ComparisonArgument, comparison: ComparisonArgument, comparisonDataProductName?: DataProductName): boolean {
  const { dataProduct1, version1, dataProduct2, version2 } = resolveComparisonArguments(dataProduct, comparison, comparisonDataProductName);
  return version1 < version2 && dataProduct1 === dataProduct2;
}

/**
 *
 * @param dataProduct argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparison argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparisonDataProductName optional data product name to use for comparison if comparison is a string or number
 * @returns
 */
export function isLessOrEqualThanVersion(dataProduct: ComparisonArgument, comparison: ComparisonArgument, comparisonDataProductName?: DataProductName): boolean {
  const { dataProduct1, version1, dataProduct2, version2 } = resolveComparisonArguments(dataProduct, comparison, comparisonDataProductName);
  return version1 <= version2 && dataProduct1 === dataProduct2;
}

/**
 *
 * @param dataProduct argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparison argument can be a string representing the version, number as calculated version value or an object with version and data product name
 * @param comparisonDataProductName optional data product name to use for comparison if comparison is a string or number
 * @returns
 */
export function isEqualToVersion(dataProduct: ComparisonArgument, comparison: ComparisonArgument, comparisonDataProductName?: DataProductName): boolean {
  const { dataProduct1, version1, dataProduct2, version2 } = resolveComparisonArguments(dataProduct, comparison, comparisonDataProductName);
  return version1 === version2 && dataProduct1 === dataProduct2;
}
