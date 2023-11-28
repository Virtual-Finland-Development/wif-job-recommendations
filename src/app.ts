import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ValiError } from "valibot";
import { handleForeignerJobRecommendationsAction } from "./actions/ForeignerJobRecommendations";
import { logError } from "./utils/logging";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const requestInputData = JSON.parse(event.body || "{}");
    const foreignerJobRecommendationsResponse = await handleForeignerJobRecommendationsAction(requestInputData);

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
