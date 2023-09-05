import { parse } from "valibot";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { getJobsInFinland } from "../services/JobsInFinland";
import { mapForeignerJobRecommendationsRequestToJobsInFinlandRequest } from "../transformers/requests";
import { mapJiFResponseToForeignerResponse } from "../transformers/responses";

export async function handleForeignerJobRecommendationsAction(requestInputData: any) {
  // Map the request input data to jobs in Finland request
  const foreignerJobRecommendationsRequest = parse(ForeignerJobRecommendationsRequest, requestInputData);
  const jobsInFinlandRequest = mapForeignerJobRecommendationsRequestToJobsInFinlandRequest(foreignerJobRecommendationsRequest);

  // Call jobs in Finland API
  const jobsInFinlandResponse = await getJobsInFinland(jobsInFinlandRequest);

  // Map the response from jobs in Finland to the foreigner job recommendations response
  const foreignerJobRecommendationsResponse = mapJiFResponseToForeignerResponse(jobsInFinlandResponse);

  return foreignerJobRecommendationsResponse;
}
