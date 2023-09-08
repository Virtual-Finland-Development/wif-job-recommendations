import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { JiFJobsRequest } from "../models/JiFJobsRequest";
import { JiFRecommendationsRequest } from "../models/JiFRecommendationsRequest";
import { getCityNameWithMonicipalityCode } from "../repositories/municipalities";

async function mapPreferredMunicipalitiesInputToCityInput(preferredMunicipalities?: string[]) {
  if (!preferredMunicipalities) return "";

  const preferredMunicipalitiesInput = [];
  for (const preferredMunicipality of preferredMunicipalities) {
    const cityName = await getCityNameWithMonicipalityCode(preferredMunicipality);
    if (cityName) preferredMunicipalitiesInput.push(cityName);
  }
  return preferredMunicipalitiesInput.join(",");
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
    query: foreignerJobRecommendationsRequest.freeText,
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
    //id: "foreigner", // @TODO: what is the profile identifier, is it required? Apparently not.
    escoOccupations: foreignerJobRecommendationsRequest.escoCodes,
    isEEACitizen: foreignerJobRecommendationsRequest.citizenshipArea === "EEA",
    city: await mapPreferredMunicipalitiesInputToCityInput(foreignerJobRecommendationsRequest.preferredMunicipalities),
    // offset: foreignerJobRecommendationsRequest.offset, // Undocumented but works?, but as there's filtering on the produtizer side: its disabled
    // limit: foreignerJobRecommendationsRequest.limit, // Undocumented but works..
  });
}
