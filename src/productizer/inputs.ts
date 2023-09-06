import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { JiFJobsRequest } from "../models/JiFJobsRequest";
import { JiFRecommendationsRequest } from "../models/JiFRecommendationsRequest";
import { getCityNameWithMonicipalityCode } from "../repositories/municipalities";
import { getJobCategoriesByEscoCode } from "../repositories/occupations";

async function mapPreferredMunicipalitiesInputToCityInput(preferredMunicipalities: string[]) {
  const preferredMunicipalitiesInput = [];
  for (const preferredMunicipality of preferredMunicipalities) {
    const cityName = await getCityNameWithMonicipalityCode(preferredMunicipality);
    if (cityName) preferredMunicipalitiesInput.push(cityName);
  }
  return preferredMunicipalitiesInput.join(",");
}

async function pickFirstEscoTitle(escoCodes: string[]) {
  for (const escoCode of escoCodes) {
    const categories = await getJobCategoriesByEscoCode(escoCode);
    if (categories.length > 0) {
      return categories[0];
    }
  }
  return "";
}

/**
 * Dataspace -> JiF jobs input
 *
 * @param foreignerJobRecommendationsRequest
 * @returns
 */
export async function mapForeignerJobRecommendationsRequestToJobsInFinlandRequest(foreignerJobRecommendationsRequest: Input<typeof ForeignerJobRecommendationsRequest>) {
  return parse(JiFJobsRequest, {
    offset: foreignerJobRecommendationsRequest.offset,
    limit: foreignerJobRecommendationsRequest.limit,
    sort: "schedule.publish",
    order: -1, // Newest first
    category: "",
    city: await mapPreferredMunicipalitiesInputToCityInput(foreignerJobRecommendationsRequest.preferredMunicipalities),
    query: foreignerJobRecommendationsRequest.freeText, // || (await pickFirstEscoTitle(foreignerJobRecommendationsRequest.escoCodes)),
    meta: false,
  });
}

/**
 * Dataspace -> JiF recommendations input
 *
 * @param foreignerJobRecommendationsRequest
 * @returns
 */
export async function mapForeignerJobRecommendationsRequestToJiFRecommendationsRequest(foreignerJobRecommendationsRequest: Input<typeof ForeignerJobRecommendationsRequest>) {
  return parse(JiFRecommendationsRequest, {
    escoCodes: foreignerJobRecommendationsRequest.escoCodes,
    isEuCitizen: true, // @TODO
  });
}
