import { array, boolean, merge, number, object, optional, string } from "valibot";

export const JifApiRecommendationsRequestQueryParams = object({
  city: optional(string()), // List of filtering cities separated by comma
  offset: optional(number()), // Undocumented but works
  limit: optional(number()), // Undocumented but works
});

export const JifApiRecommendationsRequestBody = object({
  id: optional(string()), // Profile identifier
  escoOccupations: array(string()),
  isEEACitizen: boolean(), // Is the applicant a citizen of an EU or EEA country?
});

export const JifApiRecommendationsRequest = merge([JifApiRecommendationsRequestQueryParams, JifApiRecommendationsRequestBody]);
