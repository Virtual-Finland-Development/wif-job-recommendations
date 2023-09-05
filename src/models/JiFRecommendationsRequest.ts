import { array, boolean, object, string } from "valibot";
export const JiFRecommendationsRequest = object({
  escoOccupations: array(string()),
  isEuCitizen: boolean(),
});
