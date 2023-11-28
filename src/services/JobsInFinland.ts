import { parse } from "valibot";
import { ExternalApiRequestException } from "../app/exceptions";
import { formUrlWithParams } from "../app/url-helpers";
import { JifApiRecommendationsRequestBody, JifApiRecommendationsRequestQueryParams } from "../models/JifApiRecommendationsRequest";
import { JifApiRecommendationsResponse } from "../models/JifApiRecommendationsResponse";

const jobsInFinlandEndpoint = process.env.JOBS_IN_FINLAND_ENDPOINT || "https://beta.jobs-in-finland.com/api";

export async function getAndParseJobRecommendationsFromFinland(jifRequestInput: any) {
  const data = await retrieveJobRecommendationsFromFinland(jifRequestInput);
  return parse(JifApiRecommendationsResponse, data);
}

async function retrieveJobRecommendationsFromFinland(jifRequestInput: any) {
  const jifJobsRequestQueryParams = parse(JifApiRecommendationsRequestQueryParams, jifRequestInput);
  const jifJobsRequestBody = parse(JifApiRecommendationsRequestBody, jifRequestInput);
  const requestUri = formUrlWithParams(`${jobsInFinlandEndpoint}/public/jobs/recommendations`, jifJobsRequestQueryParams);

  try {
    const response = await fetch(requestUri, {
      method: "POST",
      body: JSON.stringify(jifJobsRequestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    throw new ExternalApiRequestException(error);
  }
}
