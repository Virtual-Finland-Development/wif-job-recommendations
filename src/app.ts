import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
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
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
        type: error.type || "Internal Server Error",
      }),
    };
  }
}
