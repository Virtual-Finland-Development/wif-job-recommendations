import { APIGatewayProxyEventV2 } from "aws-lambda";
import { DataProduct, DataProductName } from "../models/DataProduct";
import { BadRequestExcetion } from "./exceptions";
import { transformVersionToNumber } from "./versions";

/**
 *
 * @param event
 * @returns
 */
export function parseDataProductFromEvent(event: APIGatewayProxyEventV2): DataProduct {
  return parseDataProductFromPath(event.requestContext.http.path);
}

/**
 *
 * @param path
 * @returns
 */
export function parseDataProductFromPath(fullDataProduct: string): DataProduct {
  validateFullDataProductName(fullDataProduct);
  const dataProductVersionText = parseDataProductVersionText(fullDataProduct);
  if (!dataProductVersionText) {
    throw new BadRequestExcetion("Missing data product version from the URI path");
  }

  const dataProductVersion = transformVersionToNumber(dataProductVersionText);
  if (!fullDataProduct.endsWith(`_v${dataProductVersionText}`)) {
    throw new BadRequestExcetion("Invalid data product path format");
  }

  const dataProductName = fullDataProduct.replace(`_v${dataProductVersionText}`, "") as DataProductName;

  return {
    version: dataProductVersion,
    versionText: dataProductVersionText,
    dataProductName,
    fullDataProduct,
  };
}

/**
 *
 * @param path
 * @returns
 */
export function validateFullDataProductName(path: string) {
  if (path.indexOf("/") !== 0 || !path.includes("_v")) {
    throw new BadRequestExcetion("Invalid data product path");
  }
}

/**
 *
 * @param path
 * @returns
 */
export function parseDataProductVersionText(path: string) {
  return path.match(/[a-zA-Z0-9]_v([\d\.]+)$/)?.[1];
}
