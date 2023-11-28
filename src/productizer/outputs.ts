import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { ForeignerJobRecommendationsResponse } from "../models/ForeignerJobRecommendationsResponse";
import { JifApiRecommendationsResponse } from "../models/JifApiRecommendationsResponse";
import { getMunicipalityCodeWithCityName } from "../repositories/municipalities";

/**
 * JiF Recommendations -> Dataspace output
 *
 * @param jobs
 * @returns
 */
export async function mapJiFRecommendationsResponseToForeignerResponse(
  request: Input<typeof ForeignerJobRecommendationsRequest>,
  response: Input<typeof JifApiRecommendationsResponse>
) {
  let mappedJobs = await Promise.all(
    response.records.map(async (job) => ({
      title: job.title,
      score: job.score,
      advertisementURL: job.externalUrl,
      municipalityCode: await getMunicipalityCodeWithCityName(job.location.city || job.employer.location.city),
      employer: {
        name: job.employer.name,
        logoURL: job.employer.imageUrl || "https://no-employer-logo",
      },
    }))
  );

  let filteredJobs = mappedJobs.reduce((acc, job) => {
    let isVisible = true;

    // Filter out jobs without municipality code
    if (isVisible && !job.municipalityCode) {
      isVisible = false;
    }

    // Filter by free text phrase
    if (isVisible && request.freeText) {
      const searchPhrase = request.freeText.toLocaleLowerCase();
      isVisible = job.title.toLocaleLowerCase().includes(searchPhrase) || job.employer.name.toLocaleLowerCase().includes(searchPhrase);
    }

    if (isVisible) {
      if (!acc.find((accJob) => accJob.advertisementURL === job.advertisementURL)) {
        acc.push(job);
      }
    }
    return acc;
  }, [] as typeof mappedJobs);

  // Productizer-side pagination
  if (request.offset && request.limit) {
    filteredJobs = filteredJobs.slice(request.offset, request.offset + request.limit);
  } else if (request.limit) {
    filteredJobs = filteredJobs.slice(0, request.limit);
  }

  return parse(ForeignerJobRecommendationsResponse, {
    identifier: response.id,
    totalCount: response.total,
    jobs: filteredJobs,
  });
}
