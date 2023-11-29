import { Input, parse } from "valibot";
import { isEqualToVersion, isGreaterOrEqualThanVersion, isLessOrEqualThanVersion } from "../app/versions";
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
  dataProductVersion: number,
  request: Input<typeof ForeignerJobRecommendationsRequest>,
  response: Input<typeof JifApiRecommendationsResponse>
) {
  let mappedJobs = await Promise.all(
    response.records.map(async (job) => {
      const city = isLessOrEqualThanVersion(dataProductVersion, "1.1") ? job.location.city || job.employer.location.city : job.location.city;
      const employerLogoUrlHasNoFallback = isEqualToVersion(dataProductVersion, "0.2") || isGreaterOrEqualThanVersion(dataProductVersion, "1.3");
      return {
        title: job.title,
        score: job.score,
        advertisementURL: job.externalUrl,
        municipalityCode: await getMunicipalityCodeWithCityName(city),
        employer: {
          name: job.employer.name,
          logoURL: job.employer.imageUrl || (employerLogoUrlHasNoFallback ? null : "https://no-employer-logo"),
        },
      };
    })
  );

  let filteredJobs = mappedJobs.reduce((acc, job) => {
    let isVisible = true;

    // Filter out jobs without municipality code (<= v1.1)
    if (isVisible && isLessOrEqualThanVersion(dataProductVersion, "1.1") && !job.municipalityCode) {
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
