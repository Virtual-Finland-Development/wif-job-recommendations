import { Input, parse } from "valibot";
import { isGreaterOrEqualThanVersion, isLessOrEqualThanVersion } from "../app/versions";
import DataProduct from "../models/DataProduct";
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
  dataProduct: DataProduct,
  request: Input<typeof ForeignerJobRecommendationsRequest>,
  response: Input<typeof JifApiRecommendationsResponse>
) {
  let mappedJobs = await Promise.all(
    response.records.map(async (job) => {
      const city = isLessOrEqualThanVersion(dataProduct, "1.1", "/Employment/ForeignerJobRecommendatations") ? job.location.city || job.employer.location.city : job.location.city;
      const employerLogoUrlHasNoFallback =
        isGreaterOrEqualThanVersion(dataProduct, "0.2", "/Employment/ForeignerJobRecommendations") ||
        isGreaterOrEqualThanVersion(dataProduct, "1.3", "/Employment/ForeignerJobRecommendatations");
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
    if (isVisible && isLessOrEqualThanVersion(dataProduct, "1.1", "/Employment/ForeignerJobRecommendatations") && !job.municipalityCode) {
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
