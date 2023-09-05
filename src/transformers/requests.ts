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

async function mapEscoCodesToCategoriesInput(escoCodes: string[]) {
  const categoriesInput: string[] = [];
  for (const escoCode of escoCodes) {
    const categories = await getJobCategoriesByEscoCode(escoCode);
    for (const category of categories) {
      if (categoriesInput.includes(category)) continue;
      categoriesInput.push(category);
    }
  }
  return categoriesInput.join(",");
}

export async function mapForeignerJobRecommendationsRequestToJobsInFinlandRequest(foreignerJobRecommendationsRequest: Input<typeof ForeignerJobRecommendationsRequest>) {
  return parse(JiFJobsRequest, {
    offset: foreignerJobRecommendationsRequest.offset,
    limit: foreignerJobRecommendationsRequest.limit,
    freeText: foreignerJobRecommendationsRequest.freeText,
    sort: "title",
    category: await mapEscoCodesToCategoriesInput(foreignerJobRecommendationsRequest.escoCodes),
    city: await mapPreferredMunicipalitiesInputToCityInput(foreignerJobRecommendationsRequest.preferredMunicipalities),
    query: "",
    meta: false,
  });
}

export async function mapForeignerJobRecommendationsRequestToJiFRecommendationsRequest(foreignerJobRecommendationsRequest: Input<typeof ForeignerJobRecommendationsRequest>) {
  return parse(JiFRecommendationsRequest, {
    escoCodes: foreignerJobRecommendationsRequest.escoCodes,
    isEuCitizen: true, // @TODO
  });
}
