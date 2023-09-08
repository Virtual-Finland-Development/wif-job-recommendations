import { array, merge, number, object, string } from "valibot";
import { JiFJob } from "./JiFJobsResponse";

export const JiFRecommendationsResponseRecord = merge([
  JiFJob,
  object({
    score: number(),
  }),
]);

export const JiFRecommendationsResponse = object({
  id: string(),
  total: number(),
  records: array(JiFRecommendationsResponseRecord),
});
