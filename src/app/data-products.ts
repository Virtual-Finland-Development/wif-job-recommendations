import { APIGatewayProxyEventV2 } from "aws-lambda";
import DataProduct from "../models/DataProduct";
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
export function parseDataProductFromPath(path: string): DataProduct {
  const fullDataProduct = parseFullDataProductName(path);
  const dataProductVersionText = parseDataProductVersionText(fullDataProduct);
  const dataProductVersion = transformVersionToNumber(dataProductVersionText);
  if (!fullDataProduct.endsWith(`_v${dataProductVersionText}`)) {
    throw new BadRequestExcetion("Invalid data product path format");
  }

  const dataProduct = fullDataProduct.replace(`_v${dataProductVersionText}`, "");

  return {
    version: dataProductVersion,
    versionText: dataProductVersionText,
    dataProduct,
    fullDataProduct,
  };
}

/**
 *
 * @param path
 * @returns
 */
export function parseFullDataProductName(path: string): string {
  if (path.indexOf("/") !== 0 || !path.includes("_v")) {
    throw new BadRequestExcetion("Invalid data product path");
  }
  return path;
}

/**
 *
 * @param path
 * @returns
 */
export function parseDataProductVersionText(path: string) {
  const versionText = path.match(/_v([\d\.]+)/)?.[1];
  if (!versionText) {
    throw new BadRequestExcetion("Missing data product version from the URI path");
  }
  return versionText;
}
