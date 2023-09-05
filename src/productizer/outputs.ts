import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsResponse } from "../models/ForeignerJobRecommendationsResponse";
import { JiFJobsResponse } from "../models/JiFJobsResponse";
import { getMunicipalityCodeWithCityName } from "../repositories/municipalities";

/**
 * JiF Jobs -> Dataspace output
 *
 * @param jobs
 * @returns
 */
export async function mapJiFResponseToForeignerResponse(jobs: Input<typeof JiFJobsResponse>) {
  return parse(ForeignerJobRecommendationsResponse, {
    identifier: "--", // Would be retrieved from the recommendations endpoint
    totalCount: jobs.length,
    jobs: await Promise.all(
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
    ),
  });
}
