import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ValiError } from "valibot";
import { handleForeignerJobRecommendationsAction } from "./actions/ForeignerJobRecommendations";
import { logError } from "./app/logging";
import { parseDataProductVersion } from "./app/versions";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const dataProductVersion = parseDataProductVersion(event);
    const requestInputData = JSON.parse(event.body || "{}");
    const foreignerJobRecommendationsResponse = await handleForeignerJobRecommendationsAction(dataProductVersion, requestInputData);

    return {
      statusCode: 200,
      body: JSON.stringify(foreignerJobRecommendationsResponse),
    };
  } catch (error: any) {
    logError(error);

    let statusCode = error.code || 500;
    let errorType = error.type || "InternalServerError";
    let errorMessage = error.message;

    if (error instanceof ValiError) {
      statusCode = 422;
      errorType = "ValidationError";
    }

    return {
      statusCode,
      body: JSON.stringify({
        message: errorMessage,
        type: errorType,
      }),
    };
  }
}
