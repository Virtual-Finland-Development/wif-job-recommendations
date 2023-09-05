import { parse } from "valibot";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { mapForeignerJobRecommendationsRequestToJobsInFinlandRequest } from "../productizer/inputs";
import { mapJiFResponseToForeignerResponse } from "../productizer/outputs";
import { getJobsInFinland } from "../services/JobsInFinland";

export async function handleForeignerJobRecommendationsAction(requestInputData: any) {
  // Map the request input data to jobs in Finland request
  const foreignerJobRecommendationsRequest = parse(ForeignerJobRecommendationsRequest, requestInputData);
  const jobsInFinlandRequest = await mapForeignerJobRecommendationsRequestToJobsInFinlandRequest(foreignerJobRecommendationsRequest);
  console.log(jobsInFinlandRequest);

  // Call jobs in Finland API
  const jobsInFinlandResponse = await getJobsInFinland(jobsInFinlandRequest);

  // Map the response from jobs in Finland to the foreigner job recommendations response
  const foreignerJobRecommendationsResponse = await mapJiFResponseToForeignerResponse(jobsInFinlandResponse);

  return foreignerJobRecommendationsResponse;
}
