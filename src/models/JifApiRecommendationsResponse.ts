import { array, merge, number, object, string } from "valibot";
import { JifJob } from "./JifJob";

export const JifApiRecommendationsResponseRecord = merge([
  JifJob,
  object({
    score: number(),
  }),
]);

export const JifApiRecommendationsResponse = object({
  id: string(),
  total: number(),
  records: array(JifApiRecommendationsResponseRecord),
});
