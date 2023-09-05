import { array, number, object, string } from "valibot";

export const ForeignerJobRecommendationsRequest = object({
  escoCodes: array(string()),
  citizenshipArea: string(),
  preferredMunicipalities: array(string()),
  freeText: string(),
  limit: number(),
  offset: number(),
});
