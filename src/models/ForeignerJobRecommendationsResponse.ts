import { array, nullable, number, object, string } from "valibot";

export const ForeignerJobRecommendation = object({
  title: string(),
  score: number(),
  advertisementURL: string(),
  municipalityCode: nullable(string()),
  employer: object({
    name: string(),
    logoURL: nullable(string()),
  }),
});

export const ForeignerJobRecommendationsResponse = object({
  identifier: string(),
  totalCount: number(),
  jobs: array(ForeignerJobRecommendation),
});
