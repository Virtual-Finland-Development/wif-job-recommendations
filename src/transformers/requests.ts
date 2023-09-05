import { Input, parse } from "valibot";
import { ForeignerJobRecommendationsRequest } from "../models/ForeignerJobRecommendationsRequest";
import { JiFJobsRequest } from "../models/JiFJobsRequest";
import { JiFRecommendationsRequest } from "../models/JiFRecommendationsRequest";
import { getCityNameWithMonicipalityCode } from "../repositories/municipalities";
import { getJobCategoriesByEscoCode } from "../repositories/occupations";

function mapPreferredMunicipalitiesInputToCityInput(preferredMunicipalities: string[]) {
  const preferredMunicipalitiesInput = preferredMunicipalities.reduce((cities, preferredMunicipality) => {
    const cityName = getCityNameWithMonicipalityCode(preferredMunicipality);
    if (cityName) cities.push(cityName);
    return cities;
  }, [] as string[]);

  return preferredMunicipalitiesInput.join(",");
}

function mapEscoCodesToCategoriesInput(escoCodes: string[]) {
  const categoriesInput = escoCodes.reduce((acc, escoCode) => {
    const categories = getJobCategoriesByEscoCode(escoCode);
    for (const category of categories) {
      if (acc.includes(category)) continue;
      acc.push(category);
    }
    return categories;
  }, [] as string[]);
  return categoriesInput.join(",");
}

export function mapForeignerJobRecommendationsRequestToJobsInFinlandRequest(foreignerJobRecommendationsRequest: Input<typeof ForeignerJobRecommendationsRequest>) {
  return parse(JiFJobsRequest, {
    offset: foreignerJobRecommendationsRequest.offset,
    limit: foreignerJobRecommendationsRequest.limit,
    freeText: foreignerJobRecommendationsRequest.freeText,
    sort: "title",
    category: mapEscoCodesToCategoriesInput(foreignerJobRecommendationsRequest.escoCodes),
    city: mapPreferredMunicipalitiesInputToCityInput(foreignerJobRecommendationsRequest.preferredMunicipalities),
    query: "",
    meta: false,
  });
}

export function mapForeignerJobRecommendationsRequestToJiFRecommendationsRequest(foreignerJobRecommendationsRequest: Input<typeof ForeignerJobRecommendationsRequest>) {
  return parse(JiFRecommendationsRequest, {
    escoCodes: foreignerJobRecommendationsRequest.escoCodes,
    isEuCitizen: true, // @TODO
  });
}
