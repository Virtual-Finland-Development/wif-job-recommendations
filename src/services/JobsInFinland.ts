import { parse } from "valibot";
import { JiFJobsRequest } from "../models/JiFJobsRequest";
import { JiFJobsResponse } from "../models/JiFJobsResponse";
import { JiFRecommendationsRequestBody, JiFRecommendationsRequestQueryParams } from "../models/JiFRecommendationsRequest";
import { JiFRecommendationsResponse } from "../models/JiFRecommendationsResponse";
import { formUrlWithParams } from "../utils/url-helpers";

const jobsInFinlandEndpoint = process.env.JOBS_IN_FINLAND_ENDPOINT || "https://beta.jobs-in-finland.com/api";

export async function getJobsInFinland(jifRequestInput: any) {
  const jifJobsRequest = parse(JiFJobsRequest, jifRequestInput);
  const requestUri = formUrlWithParams(`${jobsInFinlandEndpoint}/public/jobs`, jifJobsRequest);

  const response = await fetch(requestUri);
  const data = await response.json();

  return parse(JiFJobsResponse, data);
}

export async function retrieveJobRecommendationsFromFinland(jifRequestInput: any) {
  const jifJobsRequestQueryParams = parse(JiFRecommendationsRequestQueryParams, jifRequestInput);
  const jifJobsRequestBody = parse(JiFRecommendationsRequestBody, jifRequestInput);
  const requestUri = formUrlWithParams(`${jobsInFinlandEndpoint}/public/jobs/recommendations`, jifJobsRequestQueryParams);

  const response = await fetch(requestUri, {
    method: "POST",
    body: JSON.stringify(jifJobsRequestBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return parse(JiFRecommendationsResponse, data);
}
