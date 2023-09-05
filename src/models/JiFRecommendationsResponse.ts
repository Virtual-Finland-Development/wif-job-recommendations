import { merge, object, string } from "valibot";
import { JiFJob } from "./JiFJobsResponse";

export const JiFRecommendationsResponse = merge([
  JiFJob,
  object({
    score: string(),
  }),
]);
