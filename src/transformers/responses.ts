import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsResponse } from "../models/ForeignerJobRecommendationsResponse";
import { JiFJobsResponse } from "../models/JiFJobsResponse";
import { getMunicipalityCodeWithCityName } from "../repositories/municipalities";

export function mapJiFResponseToForeignerResponse(jobs: Input<typeof JiFJobsResponse>) {
  return parse(ForeignerJobRecommendationsResponse, {
    identifier: "--", // Would be retrieved from the recommendations endpoint
    totalCount: jobs.length,
    jobs: jobs.map((job) => ({
      title: job.title,
      score: 0, // Would be retrieved from the recommendations endpoint
      advertisementURL: job.externalUrl,
      municipalityCode: getMunicipalityCodeWithCityName(job.location.city),
      employer: {
        name: job.employer.name,
        logoURL: job.employer.imageUrl,
      },
    })),
  });
}
