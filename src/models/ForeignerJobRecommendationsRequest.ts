import { array, enumType, number, object, optional, string } from "valibot";

export const ForeignerJobRecommendationsRequest = object({
  escoCodes: array(string()),
  citizenshipArea: enumType(["EEA", "non-EEA"]),
  preferredMunicipalities: optional(array(string())),
  freeText: optional(string()),
  limit: optional(number()),
  offset: optional(number()),
});
