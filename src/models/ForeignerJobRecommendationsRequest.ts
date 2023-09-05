import { array, enumType, number, object, string } from "valibot";

export const ForeignerJobRecommendationsRequest = object({
  escoCodes: array(string()),
  citizenshipArea: enumType(["EEA", "non-EEA"]),
  preferredMunicipalities: array(string()),
  freeText: string(),
  limit: number(),
  offset: number(),
});
