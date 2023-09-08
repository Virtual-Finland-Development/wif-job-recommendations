import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsResponse } from "../models/ForeignerJobRecommendationsResponse";
import { JiFJobsResponse } from "../models/JiFJobsResponse";
import { JiFRecommendationsResponse } from "../models/JiFRecommendationsResponse";
import { getMunicipalityCodeWithCityName } from "../repositories/municipalities";

/**
 * JiF Jobs -> Dataspace output
 *
 * @param jobs
 * @returns
 */
export async function mapJiFResponseToForeignerResponse(jobs: Input<typeof JiFJobsResponse>) {
  const jobsWithMunicipalityCodes = (
    await Promise.all(
      jobs.map(async (job) => ({
        title: job.title,
        score: 0, // Would be retrieved from the recommendations endpoint
        advertisementURL: job.externalUrl,
        municipalityCode: await getMunicipalityCodeWithCityName(job.location.city),
        employer: {
          name: job.employer.name,
          logoURL: job.employer.imageUrl || "https://no-logo",
        },
      }))
    )
  ).filter((job) => job.municipalityCode !== "");

  return parse(ForeignerJobRecommendationsResponse, {
    identifier: "-", // Would be retrieved from the recommendations endpoint
    totalCount: jobsWithMunicipalityCodes.length,
    jobs: jobsWithMunicipalityCodes,
  });
}

/**
 * JiF Recommendations -> Dataspace output
 *
 * @param jobs
 * @returns
 */
export async function mapJiFRecommendationsResponseToForeignerResponse(response: Input<typeof JiFRecommendationsResponse>) {
  const jobsWithMunicipalityCodes = (
    await Promise.all(
      response.records.map(async (job) => ({
        title: job.title,
        score: job.score,
        advertisementURL: job.externalUrl,
        municipalityCode: await getMunicipalityCodeWithCityName(job.location.city),
        employer: {
          name: job.employer.name,
          logoURL: job.employer.imageUrl || "https://no-employer-logo",
        },
      }))
    )
  ).filter((job) => job.municipalityCode !== "");

  return parse(ForeignerJobRecommendationsResponse, {
    identifier: response.id,
    totalCount: jobsWithMunicipalityCodes.length,
    jobs: jobsWithMunicipalityCodes,
  });
}
