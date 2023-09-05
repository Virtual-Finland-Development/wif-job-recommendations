import { parse } from "valibot";
import { JiFJobsRequest } from "../models/JiFJobsRequest";
import { JiFJobsResponse } from "../models/JiFJobsResponse";
import { JiFRecommendationsRequest } from "../models/JiFRecommendationsRequest";
import { JiFRecommendationsResponse } from "../models/JiFRecommendationsResponse";

const jobsInFinlandEndpoint = process.env.JOBS_IN_FINLAND_ENDPOINT || "https://jobsinfinland.fi/api/public";

export async function getJobsInFinland(jifRequestInput: any) {
  const jifJobsRequest = parse(JiFJobsRequest, jifRequestInput);
  const searchParams = new URLSearchParams(Object.entries(jifJobsRequest).map(([key, value]) => [key, value.toString()]));
  const requestUri = new URL(`${jobsInFinlandEndpoint}/jobs?${searchParams.toString()}`);

  const response = await fetch(requestUri);
  const data = await response.json();

  return parse(JiFJobsResponse, data);
}

export async function retrieveJobRecommendationsFromFinland(jifRequestInput: any) {
  const jifJobsRequest = parse(JiFRecommendationsRequest, jifRequestInput);
  const requestUri = new URL(`${jobsInFinlandEndpoint}/recommendations`);

  const response = await fetch(requestUri, {
    method: "POST",
    body: JSON.stringify(jifJobsRequest),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return parse(JiFRecommendationsResponse, data);
}
