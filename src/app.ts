import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleForeignerJobRecommendationsAction } from "./actions/ForeignerJobRecommendations";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const requestInputData = JSON.parse(event.body || "{}");

  try {
    const foreignerJobRecommendationsResponse = await handleForeignerJobRecommendationsAction(requestInputData);
    return {
      statusCode: 200,
      body: JSON.stringify(foreignerJobRecommendationsResponse),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
        type: error.type,
      }),
    };
  }
}
