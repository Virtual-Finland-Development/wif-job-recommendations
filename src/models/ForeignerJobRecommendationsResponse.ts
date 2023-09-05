import { array, number, object, string } from 'valibot';

export const ForeignerJobRecommendation = object({
    title: string(),
    score: number(),
    advertisementURL: string(),
    municipalityCode: string(),
    employer: object({
        name: string(),
        logoURL: string(),
    }),
});

export const ForeignerJobRecommendationsResponse = object({
    identifier: string(),
    totalCount: number(),
    jobs: array(ForeignerJobRecommendation)
});