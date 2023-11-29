import { parse } from "valibot";
import DataProduct from "../models/DataProduct";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { mapForeignerJobRecommendationsRequestToJiFRecommendationsRequest } from "../productizer/inputs";
import { mapJiFRecommendationsResponseToForeignerResponse } from "../productizer/outputs";
import { getAndParseJobRecommendationsFromFinland } from "../services/JobsInFinland";

export async function handleForeignerJobRecommendationsAction(dataProduct: DataProduct, requestInputData: any) {
  // Map the request input data to jobs in Finland request
  const foreignerJobRecommendationsRequest = parse(ForeignerJobRecommendationsRequest, requestInputData);
  const jobsInFinlandRequest = await mapForeignerJobRecommendationsRequestToJiFRecommendationsRequest(foreignerJobRecommendationsRequest);

  // Call jobs in Finland API
  const jobsInFinlandResponse = await getAndParseJobRecommendationsFromFinland(jobsInFinlandRequest);

  // Map the response from jobs in Finland to the foreigner job recommendations response
  const foreignerJobRecommendationsResponse = await mapJiFRecommendationsResponseToForeignerResponse(dataProduct, foreignerJobRecommendationsRequest, jobsInFinlandResponse);

  return foreignerJobRecommendationsResponse;
}
